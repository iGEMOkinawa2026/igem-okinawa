# バグ調査レポート

- **初回調査**: 2026-08-14 / `main`（`c6ca209` 時点）
- **最終更新**: 2026-09-01 / `feat/project-page-story`（`c6ca209` + 未コミットの作業ツリー）
- **方法**: 全ソース読解 + `npx astro build` による実ビルド、生成された `dist/` の HTML / CSS との突き合わせ。
  §B はさらに Chrome 上で実 DOM の座標を計測して確認
- **注記**: §A は未着手。§B は 2026-09-01 に修正済み（`src/pages/ja/project/index.astro`）

---

## 全体サマリ

| 区分 | 件数 | 状態 |
|---|---|---|
| §A サイト全体（初回調査の18件） | 18 | **すべて未対応**（2026-09-01 再確認時点で再現） |
| §B 日本語プロジェクトページ | 4 | **修正済み**（2026-09-01） |
| §C §B の作業で生じた要判断事項 | 3 | 2件 **修正済み**（C-1 / C-2）／ 1件は未対応（C-3） |

---

# §A サイト全体（未対応）

2026-08-14 の調査結果。2026-09-01 に全件を再確認し、**18件すべてが未修正のまま再現する**ことを確認した。

| # | 重要度 | 概要 | 主なファイル |
|---|--------|------|--------------|
| 1 | 重大 | Human Practice ページが存在しないのにリンクだけある | `src/data/siteCopy.ts`, `src/data/navigation.ts` |
| 2 | 重大 | リダイレクトが base path を落とし確実に 404 | `astro.config.mjs` |
| 3 | 重大 | CMS に未定義コレクションが登録されている | `.pages.yml` |
| 4 | 高 | チームページのロールタグが完全に無スタイル + 未エスケープ | `src/pages/team/index.astro` |
| 5 | 中 | パンくずの区切り「/」が欠落 | `src/components/PageHero.astro` |
| 6 | 中 | ニュース詳細ページに `h1` が2つ | `src/pages/news/[slug].astro` |
| 7 | 高 | アーカイブ一覧にヘッダー・フッターがない | `src/pages/archive/index.astro` |
| 8 | 中 | 言語切替が常にトップページへ飛ぶ | `src/layouts/PageLayout.astro` |
| 9 | 中 | 寄付の進捗バーが「¥0 / ¥0・0%」を公開表示 | `src/pages/support/index.astro` |
| 10 | 中 | トップの「続きを読む」が現行プロジェクトをアーカイブ URL へ | `src/pages/index.astro` |
| 11 | 低 | 「チーム全員のご紹介」が `about/` へ（名簿は `team/`） | `src/pages/index.astro` |
| 12 | 中 | `sitemap.xml` が手書きのまま陳腐化 | `public/sitemap.xml` |
| 13 | 低 | members / activities のメタデータ不整合 | `src/content/` |
| 14 | 低 | 参加機関数の記載ゆれ（3校 / 4校） | `src/pages/index.astro`, `support` |
| 15 | 潜在 | static 出力での `Astro.redirect()` | `src/pages/project/index.astro` |
| 16 | 潜在 | origin のハードコードによる二重管理 | `src/layouts/BaseLayout.astro` |
| 17 | 潜在 | 年号が全サイトにハードコードされ `current_year` に連動しない | `src/data/siteCopy.ts`, `src/pages/index.astro` ほか |
| 18 | 低 | `src/data/homeCopy.ts` が実質デッドコード | `src/data/homeCopy.ts` |

---

## 重大（リンク切れ・機能不全）

### 1. Human Practice ページが存在しないのにリンクだけある

- `src/data/siteCopy.ts:55`（EN）/ `:129`（JA）のナビカードが `human-practice/` へリンク。`/project/2026/` と `/ja/project/2026/` 上に表示されている
- `src/data/navigation.ts:67` の `getHpNav()` は `activities/human-practice/<slug>/` を生成
- `src/layouts/HumanPracticeLayout.astro` と `src/components/SectionNav.astro` も実装済み

しかし `src/pages/` 配下に Human Practice のページが **1つも存在しない**。レイアウトとナビだけが先行して実装され、ページが未作成の状態。

### 2. リダイレクトが base path を落としていて確実に 404

`astro.config.mjs:8-9`:

```js
redirects: {
  '/human-practice': '/activities/human-practice',
  '/ja/human-practice': '/ja/activities/human-practice'
}
```

生成された `dist/human-practice/index.html`:

```html
<meta http-equiv="refresh" content="0;url=/activities/human-practice">
<link rel="canonical" href="https://igemokinawa2026.github.io/activities/human-practice">
```

`/igem-okinawa/` が付いていない。GitHub Pages のプロジェクトサイトなので、仮に転送先ページを作成しても 404 になる。canonical も誤った URL を指している。

### 3. CMS に存在しないコレクションが登録されている

`.pages.yml:284` が `src/content/human-practice` を編集対象として定義しているが、

- `src/content/config.ts` に該当コレクションの定義がない
- 表示するページも存在しない

編集者が Pages CMS から投稿しても画面に一切反映されず、さらに Astro が未定義コレクションディレクトリを警告する。

---

## 表示崩れ・マークアップ

### 4. チームページのロールタグが完全に無スタイル（+ 未エスケープ）

`src/pages/team/index.astro:70`（`src/pages/ja/team/index.astro:70` も同一）:

```astro
<div style="..." set:html={renderTags(member)}></div>
```

`set:html` で注入された要素には Astro の scoped 属性が付かない。実際の出力を確認済み:

```html
<!-- dist/team/index.html -->
<span class="team-tag leader">leader</span>          <!-- data-astro-cid-* なし -->
```

```css
/* 同ページの inline <style> */
.team-tag[data-astro-cid-zgstinyo]{ ... }            /* 絶対にマッチしない */
```

`/team/` `/ja/team/` の全ロールタグが、丸バッジではなくただの黒文字として表示される。

併せて `renderTags`（`:23`）は文字列をエスケープせずに HTML へ埋め込んでいる:

```js
return tags.map((t) => `<span class="team-tag ${t.replace(' ', '-')}">${t}</span>`).join(' ');
```

- CMS で編集可能な `roles` の値がそのまま HTML として解釈される（HTML インジェクション）
- `replace(' ', '-')` は最初の空白しか置換しない

### 5. パンくずの区切り「/」が現在ページの手前で欠落

`src/components/PageHero.astro:29`:

```astro
{idx < breadcrumbs.length - 1 && <span class="breadcrumb-sep">/</span>}
```

ループの後に現在ページ用の `<li>` が必ず追加されるが、この条件はそれを数えていない。結果、最後のリンクと現在ページの間に区切りが入らず `Home News & Updates` のように連結して表示される。

### 6. ニュース詳細ページに `h1` が2つ

`src/pages/news/[slug].astro`（JA も同様）は PageHero に固定文字列 `title="News"` を渡し、その下に記事タイトルの `<h1>` を別途出力している。

- `<h1>News</h1>` + `<h1>記事タイトル</h1>` の二重見出し（SEO / アクセシビリティ上の問題）
- パンくずも `Home / News` → 現在ページ `News` と重複表示

### 7. アーカイブ一覧にヘッダー・フッターがない

`src/pages/archive/index.astro` と `src/pages/ja/archive/index.astro` は `PageLayout` ではなく `BaseLayout` を直接使い、`Header` / `Footer` を描画していない。

```
$ grep -c "site-header" dist/archive/index.html      → 0
$ grep -c "site-header" dist/ja/archive/index.html   → 0
$ grep -c "site-header" dist/index.html              → 1
```

グローバルナビからアクセスできるページなのに、そこから他ページへ移動する手段がない。

### 8. 言語切替が常にトップページへ飛ぶ

`src/layouts/PageLayout.astro:34-35`:

```ts
const enHref = withBase('');
const jaHref = withBase('ja/');
```

現在ページに関係なくホームで固定されている。`/support/` で JP を押すと `/igem-okinawa/ja/`（`/ja/support/` ではない）へ遷移する。

対象: PageLayout を使う about / news / activities / support / privacy / site-policy の全ページ。
一方 `team` `contact` `archive/[year]` など BaseLayout を直接使うページは対応する URL を正しく渡しており、**実装が不統一**。

---

## データ・コンテンツ

### 9. 寄付の進捗バーが「¥0 of ¥0 goal / 0% reached」を公開表示

`src/pages/support/index.astro:73`（JA は `:82`）。`goal_amount` が 0 のときの表示分岐がなく、進捗率の計算だけがガードされている。`src/data/settings.yaml` は `goal_amount: 0` のままなので、実ビルド出力は次の通り:

```html
<strong>¥0</strong> <span>of ¥0 goal</span>
<div role="progressbar" aria-valuenow="0" aria-label="0% of donation goal reached">
```

金額が未確定のうちは進捗ブロックごと非表示にするのが妥当。

### 10. トップの「Read More / 続きを読む」が現行プロジェクトをアーカイブ URL へ

- `src/pages/index.astro:124` → `archive/2026/`
- `src/pages/ja/index.astro:121` → `ja/archive/2026/`

一方でアーカイブ一覧は `current_year` を除外する仕様（`src/pages/archive/index.astro:12-14`）なので、一覧からは辿れない孤立 URL に「過去プロジェクト」として着地する。`/project/` が正しい行き先。

### 11. 「Meet the Full Team / チーム全員のご紹介」が `about/` へ

`src/pages/index.astro:205`、`src/pages/ja/index.astro:202`。About ページにメンバー一覧はなく、名簿は `/team/` にある。

### 12. `public/sitemap.xml` が手書きのまま陳腐化

- 存在しない `news/2025-06-01-example/` を掲載（EN / JA 両方）
- 実在する `news/science-week-fundraising-guide/` が未掲載
- `privacy/` `site-policy/` が欠落

`@astrojs/sitemap` の導入で自動生成に切り替えるのが望ましい。

### 13. members / activities のメタデータ不整合

- `src/content/members/taro-yamada.md`: ファイル名と中身（`name: Agata Koshkina`）が不一致。`team: funding` なのに `roles: [wet]` のため画面には「wet」タグが出る
- `src/content/members/xy.md`: `name: XY` というプレースホルダーが実写真付きで公開中。こちらも `team: wet` / `roles: [wiki-video]` が矛盾
- 全メンバーの `order` が 0 か 1 のみで、グループ内の並び順が実質不定
- `src/content/activities/` の FamilyMart / 国際通りの2件だけ `order` 未指定 → 既定値 0 となり、`order: 1〜4` の疾患カードより前に表示される
- `src/content/sponsors/` の2件が両方 `order: 1`

### 14. 参加機関数の記載ゆれ

- トップページ: 「3 Participating Institutions / 3つの参加機関」で KOSEN・OIST・琉球大学の3校
- support ページ: Okinawa Christian School International を含む4校を列挙

---

## 潜在リスク

### 15. static 出力での `Astro.redirect()`

> [!NOTE]
> 2026-09-01 更新: `src/pages/ja/project/index.astro` は §B の作業で作り直され、
> `getEntry()` も `Astro.redirect()` も使わなくなった。この項目は現在 **EN 側のみ**該当する。

`src/pages/project/index.astro:22-24`:

```ts
if (!currentProject) {
  return Astro.redirect(withBase('archive/'));
}
```

static 出力では通常の SSR リダイレクトとしては機能しない（2026-09-01 実測: ビルドは落ちず、
meta refresh のページが生成される。ただし #2 と同じく base path が付かない）。現状は `src/content/project/2026.md` が存在するため未到達だが、`current_year` を年跨ぎで更新して該当 md を作り忘れると、ここでビルドが落ちるか無言で壊れる。

### 16. origin のハードコードによる二重管理

`src/layouts/BaseLayout.astro:14` が `https://igemokinawa2026.github.io` をハードコードしており、`astro.config.mjs` の `site`（`https://iGEMOkinawa2026.github.io`）と二重管理になっている。`Astro.site` を使うべき。

### 17. 年号が全サイトにハードコードされ `current_year` に連動しない

`src/data/settings.yaml` の `current_year`（CMS の「Global Settings → Current Project Year」）は、実際にはサイト全体のごく一部しか制御していない。トップページで `current_year` に連動するのは Project Preview セクション1つだけ（`src/pages/index.astro:116-140` / `src/pages/ja/index.astro`）で、それ以外の年号はすべてソースへの直書き。

`current_year` を 2027 に更新した場合に **2026 のまま残る** 箇所:

| ファイル:行 | 内容 | 影響範囲 |
|---|---|---|
| `src/data/siteCopy.ts:15` | `title: 'iGEM Okinawa \| 2026 Team'` | EN 全ページの `<title>`（下記参照） |
| `src/data/siteCopy.ts:17` | `description`（`... the 2026 Team.`） | メタディスクリプション |
| `src/data/siteCopy.ts:81` | `copyrightLine: '© 2026 iGEM Okinawa...'` | EN 全ページのフッター |
| `src/data/siteCopy.ts:90` | `title: 'iGEM Okinawa \| 2026team'` | JA 全ページの `<title>` |
| `src/data/siteCopy.ts:92` | `description`（`...2026年チームを紹介しています。`） | メタディスクリプション |
| `src/data/siteCopy.ts:155` | `copyrightLine: '© 2026 iGEM Okinawa'` | JA 全ページのフッター |
| `src/pages/index.astro:46-47` | `title="iGEM Okinawa 2026 \| ..."` / `description` | トップページ（`copy.page.title` を使わず独自に直書き） |
| `src/pages/index.astro:215` | `Help Us Reach Paris 2026` | トップページ Support CTA |
| `src/pages/ja/index.astro:212` | `Paris 2026への挑戦をサポートしてください` | トップページ Support CTA |
| `src/data/siteCopy.ts:27,31,35` / `:102,106,110` | `headingStrong: '2026'`, `primaryCtaLabel: '2026 project'`, 画像プレースホルダ | `/project/2026/` の Hero |

`copy.page.title` は `archive/[year]`, `contact`, `team`, `project`, `ja/index` など**11 ページ**の `<BaseLayout title>` に埋め込まれており、年を跨ぐとブラウザのタブ・検索結果・SNS カードが一斉に古い年を表示し続ける。

さらに `src/pages/project/2026/` と `src/pages/ja/project/2026/` はディレクトリ名に年を含む固定ページで、`current_year` を一切参照しない（タイトルも `2026 Project` 直書き、`src/pages/project/2026/index.astro:39`）。年を更新しても旧年の URL が残り続ける。

**あるべき対応**:

1. `siteCopy.ts` の年入り文言を関数化するか、`getSettings().current_year` を参照する形に変更してテンプレート化する
2. `src/pages/index.astro:46-47` は `copy.page.title` を使うよう統一する（現状トップだけ独自定義で二重管理）
3. `Paris 2026` のような開催地＋年の文言は `settings.yaml` 側で編集可能にする（コード修正なしで運用できるように）
4. `src/pages/project/2026/` は `[year].astro` 化するか、`/project/` に一本化して削除を検討

※ #15（`current_year` 更新時に該当 md がないとビルドが壊れる）と同じ「年跨ぎ運用」の問題。セットで対応するのが望ましい。

### 18. `src/data/homeCopy.ts` が実質デッドコード

`src/data/homeCopy.ts` は 190 行超のコピー定義（`2026` を含む年号も 10 箇所以上）を持つが、`homeCopy` オブジェクト自体をインポートしているファイルが 1 つもない。

```
$ grep -rn "homeCopy" src/
src/components/Activities.astro:3:import type { SiteLocale } from '../data/homeCopy';
src/components/ArchivePreview.astro:3:import type { SiteLocale } from '../data/homeCopy';
src/components/Support.astro:3:import type { SiteLocale } from '../data/homeCopy';
src/data/homeCopy.ts:3:export const homeCopy = {
```

参照されているのは型 `SiteLocale` のみ。実際の文言は `siteCopy.ts` 側が使われている。編集者やAIが `homeCopy.ts` の年号や文言を修正しても画面に一切反映されないため、#17 の対応時に混乱の元になる。型定義だけ `siteCopy.ts`（同名の `SiteLocale` を定義済み）へ寄せて削除するのが妥当。

---

## §A で確認済み・問題なかった点

- 内部リンクの全件突合: `dist/` 内の `href="/igem-okinawa..."` 38 件を実ファイルと照合し、上記 #1 / #2 の Human Practice 経路以外に 404 なし
- 画像パスの全件突合: `src="/igem-okinawa..."` の参照先はすべて実在
- ビルド自体は成功（30 ページ生成、エラー・警告なし）
- モバイルメニュー / ドロップダウンの CSS クラス（`.nav-open`, `.dropdown-open`）は `global.css` に定義済みで整合

---

# §B 日本語プロジェクトページ（2026-09-01 修正済み）

- **対象**: `src/pages/ja/project/index.astro`（`feat/project-page-story` の未コミット分）
- **確認方法**: `astro dev` を起動し、Chrome で実 DOM の座標を計測。
  PC は幅 1280 相当、SP は 390px 幅の iframe で `@media (max-width: 767px)` を実際に発火させて検証

| # | 重要度 | 概要 | 状態 |
|---|--------|------|------|
| B-1 | 重大 | SP 表示（768px 未満）が Astro のスコープ CSS の詳細度で丸ごと崩壊 | 修正済み |
| B-2 | 高 | 地域課題の3枚だけ 150px 下にずれる | 修正済み |
| B-3 | 中 | 「ファージには弱点がある」の見出しと本文が 8px 重なる | 修正済み |
| B-4 | 低 | `.pj-circle` が SP で二重定義（240px → 120px の後勝ち） | 統合済み・**要判断** |

---

## B-1. SP 表示が丸ごと崩壊していた（重大）

### 原因

Astro のスコープ付き `<style>` は、セレクタに `[data-astro-cid-*]` 属性を付与する。
このとき `.pj-stage > *` は **`.pj-stage[cid] > [cid]`** になり、詳細度が **(0,3,0)** に上がる。

```css
/* 書いたもの */              /* Astro が出力するもの         詳細度 */
.pj-stage > * { ... }        /* .pj-stage[cid] > [cid]        0,3,0 */
.pj-deco     { ... }         /* .pj-deco[cid]                 0,2,0 */
```

後ろに書いた単一クラスの上書きが**すべて負ける**。SP 用の指定はほぼ全滅していた。

### 実際に起きていたこと（実測値）

| 症状 | 実測 |
|---|---|
| 図形9枚が絶対配置に戻らずフローに残る | 本文の手前に約 1,500px の空白ブロックが積まれる |
| バッジ背景 SVG の包含ブロックが `.pj-stage` になる | `.pj-badge-bg` が **370 × 6939px** に伸び、画面全体を水色で覆う |
| `.pj-card` が `position: relative` にならない | カード内の見出し・本文が PC の絶対座標（`top: 6054px` 等）を `relative` のずれとして引きずり、カードの外へ飛ぶ |
| PC 側の `margin: 0`（同じく 0,3,0）が勝つ | SP の `margin-top: 20px / 48px / 72px` がすべて無効 |

### 修正

1. `@media (max-width: 767px)` 内の上書きを、すべて `.pj-stage .pj-xxx`（= 0,4,0）へ前置きして詳細度を揃えた
2. `.pj-card` の子には PC の `left` / `top` / `translate` が残るため、SP でリセットする指定を追加した

```css
@media (max-width: 767px) {
  .pj-card > * {
    left: auto;
    top: auto;
    translate: none;
  }

  .pj-stage .pj-deco { position: absolute; ... }   /* ← .pj-deco から変更 */
  .pj-stage .pj-card { position: relative; ... }   /* ← .pj-card から変更 */
  /* 以下すべて同様 */
}
```

> [!IMPORTANT]
> このページの `<style>` に SP 用の指定を足すときは、必ず `.pj-stage` を前に付けること。
> 付け忘れると `.pj-stage > *` に負けて**無言で効かなくなる**（ビルドも通り、警告も出ない）。

---

## B-2. 地域課題の3枚だけ 150px 下にずれていた（高）

`.pj-card` は PC で `display: contents` にしてラッパーを透過させているため、
その子（丸・見出し・本文）は **`.pj-stage` の直接の子ではない**。
結果、`.pj-stage > *` に書かれた `--y0`（ヘッダーのモック分 150px を繰り上げる translate）が
カードの3要素にだけ適用されていなかった。

ソース中のコメントは「丸（top 5872）との間隔がちょうど 20px」と書かれているが、実測は **170px** だった。

**修正**: 基準ルールのセレクタに `.pj-card > *` を追加。

```css
.pj-stage > *,
.pj-card > * {
  position: absolute;
  margin: 0;
  translate: 0 calc(-1 * var(--y0));
}
```

修正後の実測: 導入文の下端 5701 / 丸の上端 5721 → **20px**（意図どおり）。

---

## B-3. 見出しと本文が 8px 重なっていた（中）

`.pj-weakness-h`（「しかし、／ファージには弱点がある」）は Figma 上 2行で 111px を想定しているが、
日本語グリフの行送りで実際は **119px** になり、`top: 3258` の本文に 8px 食い込んでいた。

**修正**: `.pj-weakness-b` の `top` を `3258` → `3272`（他セクションと同じ 8px の間隔）。

> [!NOTE]
> 同種の「Figma の想定行高より実測が高い」ずれは、`.pj-but` と `.pj-resistance-h` の間にも
> 5px 分ある。ただしこちらは箱が重なるだけでグリフは衝突しないため、実害なしと判断して据え置いた。
> 文言を増やすとここも崩れる。

---

## B-4. `.pj-circle` が SP で二重定義されていた（低・要判断）

`@media` 内に `.pj-circle` の指定が2か所あり、後勝ちで 120px になっていた。

| 記述 | 値 |
|---|---|
| 1つ目（コメント「丸の上に文字」の直後） | `240px` |
| 2つ目（`.pj-badge-label` の後） | `120px` ← これが効いていた |

**修正**: 描画結果を変えずに 1 ルールへ統合した（現状は 120px のまま）。

> [!WARNING]
> **240px が本来の意図であれば `width` / `height` を戻すこと。**
> `.pj-card` の `min-height: 240px` と、コメントの「丸の上に文字」という記述は
> 240px 前提に読める。判断できなかったため描画は変えていない。

---

## §B で確認済み・問題なかった点

- 横スクロールの発生なし（PC 実測 1690px / SP 実測 370px、いずれもビューポート内）
- テキスト同士の実質的な衝突なし。
  残る箱の重なり（`phage-h` × `img-what`、`how-b` × `img-how`）は Figma 由来の余白で、
  日本語の文字数ではグリフが届かないため実害なし。**文言を長くすると画像に潜る**点は注意
- `npx astro build` 成功（30ページ、エラー・警告なし）
- `public/media/project/*.svg` 8点はすべて実在し、参照切れなし

---

# §C §B の作業で生じた要判断事項（未対応）

## C-1. EN と JA の `/project/` が別物になった → **修正済み（2026-09-01）**

### 修正前

| | 表示内容 | データ元 |
|---|---|---|
| `/project/` (EN) | 従来のプロジェクト詳細 | `src/content/project/{year}.md` |
| `/ja/project/` (JA) | Figma 由来のストーリーページ | ページ内に直書き |

言語切り替えボタンは正しく相互リンクしているが、押すと**内容がまったく違うページ**に着地していた。

### 対応

英語版を日本語版と同じデザインに統一し、レイアウトを共通コンポーネントへ切り出した。

| ファイル | 変更 |
|---|---|
| `src/components/ProjectStory.astro` | **新規**。本文のマークアップと CSS を集約（EN / JA 共通） |
| `src/pages/project/index.astro` | 従来の独自レイアウトを廃止し、`ProjectStory` を使う 67 行へ |
| `src/pages/ja/project/index.astro` | 同上。EN と完全に同じ構造 |
| `src/content/config.ts` | `story_ja` に加えて `story`（英語）を追加。中身は同じスキーマ |
| `.pages.yml` | `story`（英語ラベル）を追加。`story_ja` と対で並ぶ |
| `src/content/project/2026.md` | 日本語ストーリーの英訳を `story` に追加 |
| `src/data/siteCopy.ts` | `projectPage`（バッジ・フォールバック文言）を EN / JA に追加 |

### 英訳で調整した点

英語は日本語より1文字あたりの幅が狭い一方、同じ意味に必要な文字数が多い。
Figma の座標は日本語の文字数に合わせて決まっているため、**実ブラウザで折り返しを計測しながら**
1行の長さを詰めた。

| 箇所 | 調整 |
|---|---|
| `resistance_body` | 3行に折り返していたため短縮し、日本語版と同じ2行に |
| `cards[0].body` | 1行目が枠幅（289px）を超えて5行になっていたため、4行に収まる区切りへ |

最終的に、**描画された文字と画像枠の衝突は0件**、想定外の折り返しも0件。

### 言語による差分

- `.pj-goal` のフォントは日本語版のみ Sawarabi Gothic（Figma の指定）。
  英語版は他の見出しと同じ Outfit。`.pj-ja` クラスで切り替えている
- バッジは EN が `Project 2026`、JA が `2026年の活動`（`siteCopy.ts` の `projectPage.badgeLabel`）

### 検証

| 項目 | EN | JA |
|---|---|---|
| 本文がビルド後 HTML と md で一致 | 68ブロック一致 | 68ブロック一致 |
| PC 全体高 | 6889 | 6889 |
| 文字と画像枠の衝突 | 0件 | 0件 |
| 想定外の折り返し | 0件 | 0件 |
| SP（390px）縦積み要素 / 重なり | 33 / 0 | 33 / 0 |
| 横スクロール | なし | なし |

- `story` / `story_ja` を両方削除したビルドで、EN / JA とも簡易表示に切り替わることを確認
- `.pages.yml` の `story` / `story_ja` と `src/content/config.ts` の21項目が過不足なく一致
- キャッシュを消した `npx astro build` が警告ゼロ（30ページ）

> [!NOTE]
> 見出しの `○○`（「We want to help pigs with ○○」）は日本語版から引き継いだ**意図的な伏せ字**。
> 公開前に実際の言葉へ置き換えるか、伏せたまま出すかを確認してください。

## C-2. 日本語プロジェクトページが CMS から編集できない → **修正済み（2026-09-01）**

### 修正前

JA 側は `getEntry('project', ...)` を呼ばず、本文をページ内の `story` オブジェクトに直書きしていた。
CMS で `src/content/project/2026.md` を編集しても**日本語ページには一切反映されない**状態で、
`docs/ai/coding-rules.md` の「Do not hardcode content into Astro pages」に違反していた。

### 対応

本文を丸ごとコンテンツコレクションへ移し、ページは表示だけを担当するようにした。

| ファイル | 変更 |
|---|---|
| `src/content/config.ts` | `project` スキーマに `story_ja`（任意）を追加 |
| `.pages.yml` | 同じ構造の `story_ja` フィールドを追加（21項目・日本語ラベル付き） |
| `src/content/project/2026.md` | 表示中の本文をそのまま `story_ja` へ移設 |
| `src/pages/ja/project/index.astro` | `getEntry('project', current_year)` から読む形に変更。`story` の直書きを削除 |

### `story_ja` の入力ルール

- 複数行の項目は、**改行した位置がそのまま画面上の改行になる**
  （ページ側で `
` 区切りを `<br>` に変換）
- レイアウトが Figma 座標の絶対配置のため、**行数を増やしすぎると図形や画像に重なる**。
  この注意は `.pages.yml` の `description` として CMS の入力画面にも表示される
- `cards`（地域課題）は**先頭3件まで**表示される。座標が3枚ぶんしかないため、
  4件目以降はページ側で切り捨てている

### フォールバック（`AGENTS.md` の Done Criteria「fall back gracefully」対応）

| 状況 | 表示 |
|---|---|
| `story_ja` あり | Figma のストーリーページ |
| `story_ja` なし | `title_ja` / `summary_ja` / `description_ja` による簡易表示（`.pj-plain`） |
| その年度の md 自体がない | 「準備中」の案内 + アーカイブへのリンク |

日本語が未入力の項目は英語へ落とす（`title_ja || title` 等）。
`docs/ai/coding-rules.md` のローカライズ規約どおり。

### 検証

- ビルド後の HTML から本文を抽出し、`2026.md` の `story_ja` と**全68ブロックが完全一致**することを確認
- PC / SP の実 DOM 座標が §B 修正後と**変化なし**（PC: 全体高 6889 / 導入文と丸の間隔 20px、
  SP: 全体高 6132 / 縦積み33要素・重なり0）
- フォールバック2種を `story_ja` の削除と `current_year: 2099` で実際にビルドして確認
- `.pages.yml` と `src/content/config.ts` のフィールドを突き合わせ、**過不足なし**を確認
- キャッシュを消した状態で `npx astro build` が警告ゼロ（30ページ）

> [!NOTE]
> `npx astro check` は `@astrojs/check` が devDependencies に無いため未実行。
> 依存の追加は今回のスコープ外と判断した。導入する場合は
> `npm i -D @astrojs/check typescript` を別途 PR にするのが望ましい。

> [!NOTE]
> 2026-09-01 に C-1 の対応として EN 側も同じ構成に統一した。詳細は C-1 を参照。

## C-3. リポジトリ直下に用途不明の PNG

`2Q.png`（2.2MB）/ `9k.png`（2.5MB）が未追跡のまま置かれている。
作業用の一時ファイルであればコミット前に削除すること。

---

# 補足: 年跨ぎ運用について

§A の #15 と #17 は「`current_year` を更新したときに何が壊れるか」という同じ問題の別側面。
§B のページは `getSettings().current_year` を参照しているため年に追随するが、
`src/pages/project/2026/` と `src/pages/ja/project/2026/` は依然としてパスに年が直書きされている。
セットで対応するのが望ましい。
