# サイト構成ガイド（iGEM Okinawa Homepage）

このサイトが技術的にどう動いているかの解説です。
「表示されている文字を変えたいが、どこを触ればいいか分からない」ときの地図として使ってください。

> - コンテンツ編集の手順は [cms-guide.md](cms-guide.md) にあります
> - AI エージェント向けの要約版は [ai/architecture.md](ai/architecture.md) にあります

---

## 目次

1. [大前提：これは静的サイト](#1-大前提これは静的サイト)
2. [4つの層](#2-4つの層)
3. [1ページが組み上がる流れ](#3-1ページが組み上がる流れ)
4. [文章の置き場所は3系統ある](#4-文章の置き場所は3系統ある)
5. [多言語の仕組み](#5-多言語の仕組み)
6. [パスの罠：withBase()](#6-パスの罠withbase)
7. [スタイル](#7-スタイル)
8. [公開までの経路](#8-公開までの経路)
9. [壊れやすいポイント](#9-壊れやすいポイント)

---

## 1. 大前提：これは静的サイト

[Astro v5](https://astro.build/) を使った**静的サイトジェネレータ**構成です（`package.json:13`）。
一番大事な性質はこれです。

```
［ビルド時］1回だけ実行される
.md / .yaml / .astro  ──→  npm run build  ──→  dist/ に完成した .html を大量生成

［アクセス時］サーバーは何もしない
ブラウザ  ──→  出来上がった .html をそのまま返すだけ
```

データベースもサーバー側の処理もありません。
`/ja/news/science-week-fundraising-guide` は、ビルド時に作られた
`dist/ja/news/science-week-fundraising-guide/index.html` という**実在するファイル**です。

だから **CMS で保存しただけでは反映されず、再ビルドが必要**になります
（→ [cms-guide.md 11章](cms-guide.md#11-公開デプロイの仕組み)）。

---

## 2. 4つの層

```
┌─ src/pages/        ルーティング（URL ＝ ファイルの場所）
│    ↓ 使う
├─ src/layouts/      ページの外枠（head, ヘッダー, フッター）
│    ↓ 使う
├─ src/components/   部品（Hero, MemberCard, Footer …）
│    ↑ データを受け取る
└─ src/content/, src/data/, src/lib/   中身のデータ
```

| ディレクトリ | 役割 | 規模 |
|---|---|---|
| `src/pages/` | **URL を決める**。ファイル配置がそのまま URL になる | 28ファイル |
| `src/layouts/` | ページの外枠。3種類 | 3ファイル |
| `src/components/` | 再利用される UI 部品 | 12ファイル |
| `src/content/` | **CMS が編集する Markdown** | 6コレクション |
| `src/data/` | 設定と UI 文言 | yaml 3 / ts 3 |
| `src/lib/` | 共通ロジック | 4ファイル |
| `src/styles/global.css` | 色・フォント・共通クラス | 1588行 / 113クラス |
| `public/` | そのままコピーされる静的ファイル | 画像, robots.txt など |

### レイアウト3種

| ファイル | 担当範囲 |
|---|---|
| `BaseLayout.astro` | `<!DOCTYPE>` 〜 `<head>`。メタタグ、OGP、canonical、構造化データ、Google Fonts |
| `PageLayout.astro` | `BaseLayout` ＋ ヘッダー ＋ フッター。**通常のページはこれを使う** |
| `HumanPracticeLayout.astro` | サイドバー付きの特殊レイアウト |

---

## 3. 1ページが組み上がる流れ

`/ja/news/` を例に追いかけます。
`.astro` ファイルの上半分（`---` で囲まれた部分）は、**ビルド時にサーバー側で動く JavaScript** です。

```js
// src/pages/ja/news/index.astro:2-8
import { getCollection } from 'astro:content';
const newsEntries = getPublishedNewsByLanguage(await getCollection('news'), 'ja');
```

1. `getCollection('news')` が `src/content/news/` 配下の `.md` を**全部**読み込む
2. その際 `src/content/config.ts` の Zod スキーマで検証される
   → **必須項目が抜けているとここでビルドが失敗する**
3. `getPublishedNewsByLanguage()` が `language === 'ja'` かつ `published: true` のものだけに絞り、
   日付の降順にソート（`src/lib/news.ts:20-24`）
4. 下半分の HTML テンプレートで `.map()` してカードを並べる
5. 全体を `<PageLayout locale="ja">` で包む → ヘッダー・フッター・`<head>` が付く

### 記事詳細ページはもう一段特殊

`[slug].astro` というファイル**1つ**から、記事の数だけ HTML が生成されます。
何ページ作るかを宣言するのが `getStaticPaths()` です。

```js
// src/pages/ja/news/[slug].astro:8-14
export async function getStaticPaths() {
  return getPublishedNewsByLanguage(await getCollection('news'), 'ja')
    .map((post) => ({ params: { slug: getNewsSlug(post) }, props: { post } }));
}
```

**この配列に入らなかった記事は HTML 自体が存在しません。**
これが「`published: false` は限定公開ではなく完全な非公開」の理由です。

同じ仕組みが `archive/[year].astro` でも使われています。

---

## 4. 文章の置き場所は3系統ある

サイト上に見えている文字は、必ずこの3つのどれかから来ています。
**どこにあるかで、編集できる人が変わります。**

| 系統 | 場所 | CMS から編集 | 主な内容 |
|---|---|:---:|---|
| ① コンテンツ | `src/content/**/*.md` | ✅ できる | ニュース記事、メンバー、協賛、活動、プロジェクト |
| ② 設定 | `src/data/settings.yaml` | ✅ できる | 年度、寄付の目標額・文面・振込先 |
| ③ **UI 文言** | `src/data/siteCopy.ts`, `homeCopy.ts`, `navigation.ts` | ❌ **できない** | ナビゲーション、フッター、トップページの見出し・キャッチコピー |

③は TypeScript のソースコードにベタ書きされています。

- `src/data/siteCopy.ts`（162行）… ヘッダー・フッター・共通の見出し。`en` / `ja` のオブジェクト2本立て
- `src/data/homeCopy.ts`（192行）… トップページ専用の文言
- `src/data/navigation.ts:37-59` … メニュー項目とリンク先

したがって次のような依頼は、**CMS では対応できずコード修正が必要**です。

- 「トップページのキャッチコピーを変えたい」
- 「メニューの『Highlight』を『活動報告』に変えたい」
- 「フッターの並びを変えたい」

> ⚠️ この区別はどのドキュメントにも書かれておらず、
> 「CMS を探したが該当項目が見つからない」という迷子が起きやすい箇所です。

その他のデータファイル：

- `src/data/social.yaml` … SNS リンク。フッターと構造化データ（`BaseLayout.astro:23-36`）の両方で使われる

---

## 5. 多言語の仕組み

i18n ライブラリは使っていません。**ディレクトリを丸ごと2つ持っているだけ**です。

```
src/pages/team/index.astro      →  /team/       （英語）
src/pages/ja/team/index.astro   →  /ja/team/    （日本語）
```

両方が同じ `PageLayout` を `locale="en"` / `locale="ja"` で呼び分け、
`siteCopy[locale]` で文言を切り替えます（`PageLayout.astro:29-31`）。

コンテンツ側は2方式が混在します（→ [cms-guide.md 8章](cms-guide.md#8-日本語英語の対応方法)）。

| 方式 | 対象 | やり方 |
|---|---|---|
| A | ニュース以外すべて | 1ファイルに `title` と `title_ja` を併記 |
| B | ニュースのみ | `news/en/` と `news/ja/` に別ファイルを作る |

---

## 6. パスの罠：`withBase()`

GitHub Pages の**プロジェクトサイト**として公開しているため、
すべての URL に `/igem-okinawa/` が前置されます（`astro.config.mjs:6`）。

```js
// src/lib/paths.ts:4-10
export function withBase(path) {
  const base = import.meta.env.BASE_URL;   // '/igem-okinawa/'
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}
```

**リンク・画像のパスは必ず `withBase()` を通してください。**

```astro
❌ <a href="/team/">          → 404 になる
✅ <a href={withBase('team/')}>
```

外部 URL、`#` アンカー、`mailto:` はそのまま素通しされるので、区別せず全部通して構いません。

---

## 7. スタイル

2層構造です。

**① `src/styles/global.css`（全ページ共通）**

`BaseLayout.astro:3` で1回だけ読み込まれ、全ページに効きます。

- `:root` に CSS 変数を定義。色を変えるならここ

  ```css
  --color-primary: #3FD1C7;    /* ターコイズ（メイン） */
  --color-accent: #B8F13A;     /* ライムグリーン（アクセント） */
  --color-highlight: #F58A3C;  /* オレンジ（強調） */
  --font-heading: 'Outfit', sans-serif;
  --container-max-width: 1200px;
  ```

- `.container` `.section` `.card` `.btn` などの共通クラス113個

**② 各 `.astro` ファイル内の `<style>`**

Astro が自動でスコープを付けるため、そのファイル内だけに効きます。
ページ固有の見た目はここに書かれています。

> 個別の色を直接書かず、`var(--color-primary)` のように CSS 変数を使うのが本リポジトリのルールです（`AGENTS.md:22`）。

---

## 8. 公開までの経路

```
CMS で Save（= GitHub へ commit）
        or
エディタで編集 → git push
        ↓
GitHub Actions (.github/workflows/astro.yml)
  Node 22 → npm ci → npm run build → dist/
        ↓
GitHub Pages（2〜5分）
https://igemokinawa2026.github.io/igem-okinawa/
```

ローカルで `npm run dev` を実行すると、このビルドをリアルタイムに行う開発サーバーが
`http://localhost:4321/igem-okinawa/` で立ち上がります。
`.md` を保存すると即座にブラウザへ反映されるので、**公開前の確認に使ってください**。

---

## 9. 壊れやすいポイント

**1. EN / JA のディレクトリ同期**

片方にページを追加してもう片方を忘れると、言語切り替えで 404 になります。
`src/pages/` に何かを足したら、必ず `src/pages/ja/` にも対応するものを置いてください。

**2. スタイルの重複**

`src/pages/team/index.astro:91-97` と `src/pages/ja/team/index.astro:91-97` には
役割タグの色定義が**まったく同じ内容で2箇所**書かれています。
片方だけ変更すると EN と JA で見た目がずれます。同種の重複は他のページにもあります。

**3. `.pages.yml` と `config.ts` のずれ**

CMS のフォーム定義（`.pages.yml`）とスキーマ（`src/content/config.ts`）は別ファイルです。
片方だけ変更すると、フォームに項目が出ない／保存した値が検証で弾かれてビルドが落ちる、
のどちらかが起きます（→ [cms-guide.md 14章](cms-guide.md#14-開発者向けフィールドを追加するとき)）。

**4. `withBase()` の付け忘れ**

パスを直書きすると本番で 404 になります（[6章](#6-パスの罠withbase)）。

**5. `/project/2026/` の年度直書き**

`src/pages/project/2026/index.astro` はパスに年度がハードコードされており、
`settings.yaml` の `current_year` を変えても追随しません
（→ [cms-guide.md 12章C](cms-guide.md#-既知の不具合要修正事項)）。

---

*このガイドは 2026-08-14 時点の実装（Astro v5.18.1）に基づいています。*
