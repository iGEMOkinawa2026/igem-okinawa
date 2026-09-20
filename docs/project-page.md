# プロジェクトページの構造と変更方法

`/project/`（英語）と `/ja/project/`（日本語）を作っているファイルの解説です。
「ここの文章を変えたい」「画像を入れ替えたい」ときの地図として使ってください。

> [!IMPORTANT]
> 本文は `src/content/project/{current_year}.md` の `story`（英語）/ `story_ja`（日本語）から読みます。
> **文章の変更は CMS の Projects → 該当年度から行えます。** コードを触る必要はありません。

---

## 目次

1. [対象ファイル](#1-対象ファイル)
2. [データの流れ](#2-データの流れ)
3. [文章を変える](#3-文章を変える)
4. [座標の仕組み](#4-座標の仕組み)
5. [幾何学模様](#5-幾何学模様)
6. [イラストを差し替える](#6-イラストを差し替える)
7. [スマホ表示](#7-スマホ表示)
8. [ハマりどころ](#8-ハマりどころ)
9. [目的別：どこを触るか](#9-目的別どこを触るか)

---

## 1. 対象ファイル

| 役割 | パス |
|---|---|
| 本文の文章（EN / JA） | `src/content/project/{current_year}.md` の `story` / `story_ja` |
| 本文の型（スキーマ） | `src/content/config.ts` の `projectStory` |
| CMS の入力欄 | `.pages.yml` の `project` コレクション（`story` / `story_ja`） |
| レイアウトと見た目（EN / JA 共通） | `src/components/ProjectStory.astro` |
| 英語ページ `/project/` | `src/pages/project/index.astro` |
| 日本語ページ `/ja/project/` | `src/pages/ja/project/index.astro` |
| バッジ・簡易表示の文言 | `src/data/siteCopy.ts` の `projectPage` |
| イラスト | `public/media/project/art/*.png`（12点） |
| 幾何学模様 | `public/media/project/*.svg`（8点） |
| 年度 | `src/data/settings.yaml` の `current_year` |

> [!NOTE]
> 紛らわしいページが別にあります。`src/pages/project/2026/index.astro` と
> `src/pages/ja/project/2026/index.astro`（URL: `/project/2026/`, `/ja/project/2026/`）は
> プロジェクトの内容を表示しない別物で、ナビからもフッターからもリンクされていません。
> この文書の対象外です。

---

## 2. データの流れ

```
settings.yaml の current_year
        ↓
src/content/project/{current_year}.md  （story / story_ja）
        ↓
src/pages/(ja/)project/index.astro     … データを読み、ヘッダー・フッターを組み立てるだけ
        ↓
src/components/ProjectStory.astro      … 本文のレイアウトと CSS はすべてここ
```

`ProjectStory.astro` は `locale` を受け取り、英語なら `story`、日本語なら `story_ja` を表示します。

### 本文が無いときは簡易表示になる

`story`（日本語は `story_ja`）が未入力、またはその年度の md が無い場合は、
タイトル・画像・`summary`・`description`・iGEM Wiki ボタンを並べた**簡易表示**に切り替わります。
日本語の `*_ja` 項目が空なら英語の値を使います（`docs/ai/coding-rules.md` のローカライズ規約）。

---

## 3. 文章を変える

CMS の **Projects → 該当年度 → Story (English) / Story (Japanese)**、
または `src/content/project/{current_year}.md` を直接編集してください。

| キー | 画面に出る文字（日本語版の例） |
|---|---|
| `intent` | 沖縄の豚を細菌感染症から守る |
| `problem_heading` / `problem_body` | 豚が細菌感染症でピンチ ＋ 本文 |
| `but_lead` / `resistance_heading` / `resistance_body` | しかし、／薬が効かなくなってきた ＋ 本文 |
| `reveal_before` / `reveal_word` / `reveal_after` | そこで、薬に代わるウイルス ／「ファージ」／ を開発しています。 |
| `phage_heading` / `phage_body` | ファージとは？ ＋ 本文 |
| `weakness_heading` / `weakness_body` | しかし、ファージには弱点がある ＋ 本文 |
| `goal` | だから、私たちは「酸に強いファージ」の開発を目指しています |
| `how_heading` / `how_body` | どうやって開発するの？ ＋ 本文 |
| `ai_heading` / `ai_body` | 優れたものを探しています ＋ 本文 |
| `impact_heading` | この開発手法は、豚だけでなく… |
| `cards` | 地域課題のカード（ピロリ菌／赤土／サトウキビ）。**表示は先頭3枚まで** |
| `closing` | この開発手法で沖縄社会の… |

バッジの「2026年の活動」/「Project 2026」は `siteCopy.ts` の `projectPage.badgeLabel` で、
年号は `current_year` から自動で入ります。

### 入力した改行がそのまま画面の改行になる

複数行の項目は、YAML の `|-` で書いた改行位置がそのまま `<br>` になります。

```yaml
phage_body: |-
  細菌を攻撃するウイルスです。
  狙った細菌だけをやっつける
  ことができます。
```

> [!WARNING]
> 行数や1行の文字数を大きく増やすと、PC 表示で**イラストや図形と重なります**。
> 各ブロックの位置と幅はデザインの座標で固定されているためです（例：`width: calc(452 * var(--u))`）。
> 既存の行数・文字数を目安にし、長くする場合は `ProjectStory.astro` の `<style>` の `width` / `top` も調整してください。

---

## 4. 座標の仕組み

デザインは幅 1280px の絶対配置です。これを崩さずに可変にするため、
**`--u` という単位**を定義しています。

```css
.pj-stage { --u: calc(100cqw / 1280); }   /* デザイン上の 1px = var(--u) */
```

デザイン上で `x=135, y=744` にある見出しは、そのまま次のように書きます。

```css
.pj-problem-h {
  left: calc(135 * var(--u));
  top:  calc(744 * var(--u));
  width: calc(347 * var(--u));
}
```

- **幅1280px でデザインと1px単位で一致**します
- それ以外の幅でも比率が保たれます（文字サイズも一緒に縮む）
- 固定 px を使っていないので `coding-rules.md`（固定幅の禁止）にも反しません

### 上端の詰め（`--y0`）

デザインの上部にはヘッダーの見本が含まれていたため、その分の空白を `--y0`（150 デザインpx）で
全体ごと上へ詰めています。ヘッダーとの間隔を変えたいときはこの値を調整してください。

位置を微調整したいときは、`calc(N * var(--u))` の `N` を直接いじってください。

---

## 5. 幾何学模様

デザインから書き出した SVG を `public/media/project/` に置いています。

| ファイル | 中身 | 色 | z-index |
|---|---|---|:---:|
| `blob-hero.svg` | 冒頭の大きな塊 | `#EBE9E9` | 6 |
| `blob-purple.svg` | 右上の塊（回転 -150.25°） | `#EBE9E9` | 4 |
| `blob-white.svg` | 中央の白い弧 | 放射グラデーション | 2 |
| `blob-mint.svg` | 左下の塊（回転 172.17°） | 白 | 5 |
| `blob-mint2.svg` | 下部の塊（回転 -179.09°） | 白 | 8 |
| `phage-army.svg` | ファージが並ぶ帯 | `#65FFF4` | 7 |
| `badge.svg` | 「2026年の活動」の下地 | `#3FD1C7` | — |
| `circle.svg` | 丸の下地（現在は未使用） | `#D9D9D9` | — |

グラデーション3枚は SVG ではなく CSS で描いています（`.pj-grad-purple` / `.pj-grad-mint` / `.pj-grad-bottom`）。

重ね順はデザインのレイヤー順をそのまま z-index にしています。
**図形が 1〜9、文章が 10** です。文字が図形の裏に隠れたら z-index を疑ってください。

### 回転した図形の座標の出し方

回転図形は「外接ボックスの中央に置いてから回す」構造です。
そのため `left` / `top` に**外接ボックスの座標をそのまま使うとズレます**。

```
内側の left = 外接ボックスの left + (外接ボックスの幅 - 内側の幅) / 2
内側の top  = 外接ボックスの top  + (外接ボックスの高さ - 内側の高さ) / 2
```

---

## 6. イラストを差し替える

イラストは `public/media/project/art/` にあり、`ProjectStory.astro` の `art('ファイル名')` で読み込んでいます。
**同じファイル名で上書きすれば、コードを触らずに差し替えられます。**

| クラス | ファイル | 隣接する文章 |
|---|---|---|
| `pj-img-hero` | `hero-pig.png` | intent（冒頭） |
| `pj-img-sick` | `pig-sick.png` | 豚が細菌感染症でピンチ |
| `pj-img-resist` | `drug-resistant.png` | 薬が効かなくなってきた |
| `pj-img-reveal` | `phage-reveal.png` | 「ファージ」 |
| `pj-img-what` | `phage-attack.png` | ファージとは？ |
| `pj-img-weak` | `stomach-acid.png` | ファージには弱点がある |
| `pj-img-goal` | `phage-strong.png` | だから、私たちは |
| `pj-img-how` | `gene-variants.png` | どうやって開発するの？ |
| `pj-img-ai` | `ai-search.png` | 優れたものを探しています |
| `pj-circle-1〜3` | `card-pylori.png` / `card-redsoil.png` / `card-sugarcane.png` | 地域課題カード（`cards` の並び順に対応） |

位置とサイズは `<style>` の `.pj-img-*` に入っています。
縦横比の違う絵に替える場合は、PC 用の `width` / `height` と、
スマホ用（`@media (max-width: 767px)` 内）の `aspect-ratio` を合わせて直してください。

イラストは装飾扱い（`alt=""` と `aria-hidden="true"`）です。内容は隣の文章で伝えています。

---

## 7. スマホ表示

**768px 未満で絶対配置を解除し、縦積みに切り替わります。**

| | PC（768px以上） | SP（768px未満） |
|---|---|---|
| 配置 | デザインの絶対座標 | markup の順に縦積み |
| 幅 | 画面幅に比例 | 最大 335px |
| 図形 | デザインの位置 | 画面全体の背景として敷く |
| 地域課題の丸 | 文字の**上**に配置 | 文字の**背面**に配置 |

markup の並び順がそのまま SP の表示順になります。
**要素を追加するときは、読む順番どおりの位置に書いてください。**

---

## 8. ハマりどころ

### ⚠️ 図形には必ず `max-width: none` を当てる

`global.css` に `img { max-width: 100% }` があります。これが効くと、
キャンバス幅 1280px を超える図形が**幅だけ潰れて歪みます**。

- `blob-white` … 1772px
- `phage-army` … 1284px

`.pj-stage img { max-width: none; }` で打ち消しています。**消さないでください。**

### ⚠️ SP 用の指定には `.pj-stage` を前に付ける

Astro のスコープ CSS では `.pj-stage > *` の詳細度が (0,3,0) になるため、
単一クラス (0,2,0) で上書きしようとしても**無言で効きません**。

### ⚠️ `.pj-card` は `display: contents`

カードの子要素は `.pj-stage` の直接の子ではないため、`--y0` の詰めや SP の配置解除を
`.pj-card > *` にも別途指定しています。片方だけ直すとカード3枚だけがずれます。

### ⚠️ フォントはサイト共通のトークン

見出しは `var(--font-heading)`、本文は `var(--font-body)` を使っています。
このページだけ別のフォントを足すと他ページと見た目が変わるので避けてください。

### ⚠️ `container-type` が必要

`--u` は `100cqw`（コンテナ幅）を使っています。2023年以降のブラウザが必要です。
古いブラウザでは座標が効かず、要素が積み重なって表示されます。

---

## 9. 目的別：どこを触るか

| やりたいこと | 触る場所 |
|---|---|
| 文章を変える | CMS の Projects → 該当年度、または `src/content/project/{year}.md` の `story` / `story_ja` |
| 改行位置を変える | 同上（入力した改行がそのまま反映される） |
| 項目を増やす・名前を変える | `src/content/config.ts` の `projectStory` ＋ `.pages.yml` ＋ `ProjectStory.astro` |
| 位置を微調整する | `ProjectStory.astro` の `<style>` の `calc(N * var(--u))` の `N` |
| イラストを差し替える | `public/media/project/art/` の同名ファイルを上書き |
| 図形を差し替える | `public/media/project/*.svg` |
| 重なりを直す | `z-index`（図形1〜9、文章10） |
| バッジの文言を変える | `src/data/siteCopy.ts` の `projectPage.badgeLabel` |
| 年度を変える | `src/data/settings.yaml` の `current_year` |
| スマホの見え方 | `ProjectStory.astro` の `<style>` 末尾の `@media (max-width: 767px)` |

### 確認方法

```bash
npm run dev
```

- 英語：`http://localhost:4321/igem-okinawa/project/`
- 日本語：`http://localhost:4321/igem-okinawa/ja/project/`

`/igem-okinawa/` は必須です（省くと 404）。

---

## 残っている作業

- [ ] `/project/2026/` と `/ja/project/2026/` の扱い（放置するか削除するか）を決める
