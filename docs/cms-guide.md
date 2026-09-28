# CMS 運用ガイド（iGEM Okinawa Homepage）


「CMS とは何か」から「実際に記事を公開するまで」を、このリポジトリの実装に即して説明します。

> - 簡易版の手順は [README.md](../README.md) にあります。このドキュメントはその詳細版です。
> - サイトが技術的にどう動いているかは [site-structure.md](site-structure.md) にまとめてあります。
>   「CMS に該当する項目が見当たらない」ときは、そちらの4章を確認してください。

---

## 目次

1. [CMS とは何か](#1-cms-とは何か)
2. [用語集](#2-用語集)
3. [どのコンテンツがどのページに出るか](#3-どのコンテンツがどのページに出るか)
4. [CMS へのログイン](#4-cms-へのログイン)
5. [共通の操作フロー](#5-共通の操作フロー)
6. [コレクション別ガイド](#6-コレクション別ガイド)
7. [画像の扱い](#7-画像の扱い)
8. [日本語・英語の対応方法](#8-日本語英語の対応方法)
9. [Markdown 記法早見表](#9-markdown-記法早見表)
10. [md ファイルを手で書く方法](#10-md-ファイルを手で書く方法)
11. [公開・デプロイの仕組み](#11-公開デプロイの仕組み)
12. [落とし穴と既知の問題](#12-落とし穴と既知の問題)
13. [トラブルシューティング](#13-トラブルシューティング)
14. [開発者向け：フィールドを追加するとき](#14-開発者向けフィールドを追加するとき)

---

## 1. CMS とは何か

**CMS（Content Management System）** は、エンジニアがコードを触らなくても、ブラウザ上のフォームからサイトの文章や画像を編集できる仕組みです。

CMS には大きく3種類あります。

| 種類 | 代表例 | データの保存先 | 特徴 |
|---|---|---|---|
| 結合型 | WordPress | 専用データベース | 編集も表示も1つのシステム。サーバー管理が必要 |
| ヘッドレス型 | microCMS, Contentful | クラウド上のDB | データだけ提供し、表示は別のサイトが担当 |
| **Git ベース** | **Pages CMS**, Decap CMS | **Git リポジトリ内のファイル** | **DBを持たない。編集＝コミット** |

このサイトが使っているのは3番目の **[Pages CMS](https://pagescms.org/)** です。

**Git ベース CMS の利点**

- データベース・サーバーが不要（費用ゼロ、障害点が少ない）
- すべての変更が Git の履歴に残る → 誰がいつ何を変えたか追える／いつでも巻き戻せる
- CMS が使えなくなっても、コンテンツは普通のテキストファイルとして手元に残る

**注意点**

- 保存すると即座に本番へ反映される（下書きプレビュー環境がない → [12章](#12-落とし穴と既知の問題)参照）
- 編集には GitHub アカウントが必要

### ディレクトリ

| パス | 中身 | 誰が触ってよいか |
|---|---|---|
| `src/content/` | 各コレクションの `.md` ファイル | 編集者OK（CMS経由が安全） |
| `src/data/settings.yaml` | 年度・寄付などの全体設定 | 編集者OK |
| `public/media/` | CMS からアップロードした画像 | CMS が自動管理 |
| `.pages.yml` | **CMS の画面定義**（入力欄はすべてここで決まる） | 開発者のみ |
| `src/content/config.ts` | コンテンツのスキーマ（型チェック） | 開発者のみ |
| `src/pages/` `src/components/` `src/layouts/` `src/styles/` | 表示側のコード | 開発者のみ |

---

## 2. 用語集

| 用語 | 意味 |
|---|---|
| **リポジトリ** | プロジェクトのファイル一式と全履歴。ここでは `iGEMOkinawa2026/igem-okinawa` |
| **コミット** | 変更を1つの記録として履歴に刻む操作。「セーブポイント」 |
| **ブランチ** | 作業の枝。`main` が本番に公開されるブランチ |
| **コレクション** | 同じ形をしたコンテンツの集まり（例: News, Team Members） |
| **エントリ** | コレクション内の1件（= `.md` ファイル1つ） |
| **frontmatter** | `.md` ファイル冒頭の `---` で挟まれた設定部分。YAML形式 |
| **Markdown (md)** | 記号で見出しや太字を表す軽量な書式。`.md` はその拡張子 |
| **YAML** | `キー: 値` の形で設定を書く書式。`.yaml` / frontmatter で使用 |
| **スラッグ (slug)** | URL の末尾に使う英数字の識別子（例: `science-week-guide`） |
| **ビルド** | md やコードから、公開用の HTML を生成する処理 |
| **デプロイ** | 生成した HTML をサーバーに配置して公開すること |

---

## 3. どのコンテンツがどのページに出るか

`.pages.yml` に定義された CMS のメニューと、その表示先の対応です。

| CMS メニュー | ファイルの場所 | 表示されるページ |
|---|---|---|
| Activities / Highlights | `src/content/activities/` | `/activities`, `/ja/activities` |
| Sponsors | `src/content/sponsors/` | `/support`, `/ja/support` |
| Archive entries | `src/content/archive/` | `/project/2026`, `/ja/project/2026` |
| News Articles (English) | `src/content/news/en/` | `/news`, `/news/{slug}` |
| News Articles (Japanese) | `src/content/news/ja/` | `/ja/news`, `/ja/news/{slug}` |
| Projects | `src/content/project/` | `/`（トップ）, `/project`, `/archive`, `/archive/{year}` と各日本語版 |
| Team Members | `src/content/members/` | `/team`, `/ja/team` |
| Global Settings | `src/data/settings.yaml` | トップ, `/project`, `/support` など全体 |
| ~~Human Practice Sections~~ | （存在しない） | **⚠️ 現在どこにも表示されません**（[12章](#12-落とし穴と既知の問題)参照） |

---

## 4. CMS へのログイン

1. <https://app.pagescms.org> を開く
2. **Sign in with GitHub** をクリック
3. GitHub アカウントでログイン
4. 初回は組織 `iGEMOkinawa2026` へのアクセス許可を求められる → 許可
   （組織オーナーの承認が必要な場合があります）
5. リポジトリ一覧から **`iGEMOkinawa2026/igem-okinawa`** を選択
6. ブランチは **`main`** を選択（＝本番。保存すると公開されます）

左サイドバーに [3章](#3-どのコンテンツがどのページに出るか)の表のメニューが並びます。

### 編集できる人を増やしたい場合

これは CMS 側ではなく **GitHub 側**の操作です。

1. GitHub で `iGEMOkinawa2026` organization にそのアカウントを招待
2. `igem-okinawa` リポジトリへの **Write 権限**を付与
3. 本人が app.pagescms.org に GitHub ログインすれば編集可能になります

> 「Team Members にメンバーを追加」は**サイトのチーム紹介ページに人物カードを増やす**ことであり、
> 編集権限とは無関係です。混同しないよう注意してください。

---

## 5. 共通の操作フロー

どのコレクションでも流れは同じです。

```
① 左サイドバーからコレクションを選ぶ
② 新規なら「+ Add」／既存を直すなら一覧から選択
③ フォームに入力
④ 「Save」をクリック   ← この瞬間に main へコミットされる
⑤ 数分待つ            ← GitHub Actions がビルド＆デプロイ
⑥ サイトを再読み込みして確認
```

**Save = 本番公開**です。押す前に内容を確認してください。
（間違えても Git 履歴から復旧できます。慌てず開発者に連絡を。）

**削除**は、一覧でエントリを選び「Delete」。これも即座に反映されます。

---

## 6. コレクション別ガイド

### 6-1. News Articles（ニュース記事）

**英語版と日本語版は別々の記事**として作ります。1つの記事に両言語を入れる形式ではありません（他のコレクションとはここが違います）。

- 英語 → `News Articles (English)` → `/news/{slug}` に公開
- 日本語 → `News Articles (Japanese)` → `/ja/news/{slug}` に公開

#### 実際のファイルの中身

`src/content/news/en/science-week-fundraising-guide.md`：

```markdown
---
title: Science Week Fundraising Guide
date: 2026-04-04
description: iGEM Okinawa has published a fundraising guide for supporters.
language: en
published: true
category: Support
tags:
  - Donation
  - Support
---

The fundraising guide is available on the Support page.
```

`---` で挟まれた上半分が **frontmatter**（メタデータ）、下が **本文**（Markdown）です。
CMS のフォーム項目は1つ残らず、この frontmatter のキーに対応しています。

#### 入力項目

| CMS の項目 | frontmatter キー | 必須 | 説明 |
|---|---|:---:|---|
| 記事タイトル | `title` | ✅ | 記事の見出し |
| 公開日 | `date` | ✅ | **並び順にのみ使用**（新しい順）。予約投稿ではない |
| 短い説明 | `description` | ✅ | 一覧カードと詳細ページ冒頭に表示 |
| 言語 | `language` | ✅ | `en` / `ja`。省略時はフォルダから自動判定 |
| 公開する | `published` | ✅ | `false` にするとページごと生成されない |
| URLスラッグ | `slug` | – | ファイル名になり、それがそのまま URL になる（下記参照） |
| カテゴリー | `category` | – | 詳細ページ上部にラベル表示 |
| アイキャッチ画像 | `image` | – | 本文冒頭の大きな画像 |
| タグ | `tags` | – | 複数指定可 |
| 本文 | （frontmatter外） | – | Markdown で記述 |

#### URL がどう決まるか（重要）

**`URLスラッグ` 欄でファイル名が決まり、そのファイル名がそのまま URL のスラッグになります。**

```
 CMS の「URLスラッグ」欄          ファイル名                        URL
 science-week-guide      →   news/ja/science-week-guide.md   →   /ja/news/science-week-guide
                         ↑                                   ↑
          .pages.yml の filename: "{fields.slug}.md"   src/lib/news.ts の getNewsSlug()
```

1段目 — `.pages.yml`（`filename: "{fields.slug}.md"`）
CMS で保存するとき、`URLスラッグ` に入れた文字列を**ファイル名**にして `.md` を作ります。

2段目 — `src/lib/news.ts`
表示側は**ファイルパスだけ**を見てスラッグを作ります（frontmatter の `slug` は読んでいません）。

```js
// 例: "en/science-week-fundraising-guide.md" -> "science-week-fundraising-guide"
export function getNewsSlug(post) {
  return post.id.replace(/^(en|ja)\//, '').replace(/\.md$/, '');
}
```

```
src/content/news/en/science-week-fundraising-guide.md  →  /news/science-week-fundraising-guide
src/content/news/ja/science-week-fundraising-guide.md  →  /ja/news/science-week-fundraising-guide
```

CMS から作る限り、入力した `URLスラッグ` がそのまま URL になると考えて問題ありません。

> ⚠️ **エディタで直接編集する場合の注意**
> 効いているのはファイル名だけなので、frontmatter の `slug:` を書き換えても URL は変わりません。
> URL を変えたいときは**ファイル名をリネーム**してください。

**スラッグのルール**

- 使える文字は半角小文字英数字とハイフンのみ（`^[a-z0-9]+(?:-[a-z0-9]+)*$`）
- ✅ 英語版と日本語版で**同じスラッグを使ってOK**（別フォルダなので衝突しません）
- ⚠️ **同じ言語の中では重複禁止**（同じフォルダ内で同名ファイルは作れず、片方が消えます）
- 公開後にスラッグを変えると URL が変わり、既存のリンクが切れます。原則変えないこと

#### カテゴリー・タグ一覧

`category`（1記事に1つ）と `tags`（複数可）は**どちらも自由入力**で、選択肢は定義されていません
（`src/content/config.ts:56,58` — `z.string()` / `z.array(z.string())`）。
現在の記事で実際に使われているのは以下だけです。

| 種別 | 値 | 使用箇所 |
|---|---|---|
| `category` | `Support` | science-week-fundraising-guide（EN / JA 両方） |
| `tags` | `Donation` | 同上 |
| `tags` | `Support` | 同上 |

**運用上の注意**

- **表記ゆれに注意。** チェック機能がないため `Support` / `support` / `サポート` はすべて別のタグとして扱われます。新しいタグを増やす前に、この表と既存記事を確認してください
- 日本語記事でも**英語表記で統一**されています（現状の慣例）
- タグ・カテゴリーは**ラベルとして表示されるだけ**です。クリックできず、タグ別の一覧ページもありません（`src/pages/news/[slug].astro:43`）。絞り込み機能はありません
- `category` は詳細ページ上部に強調色の大文字で表示され、`tags` は本文下にピル型で並びます

#### 記事を書く手順（日本語記事の例）

1. `News Articles (Japanese)` を開く → **+ Add**
2. `記事タイトル`、`公開日`、`短い説明` を入力（必須）
3. `URLスラッグ` に半角英字で識別子を入力（例: `science-week-guide`）
4. `言語` は `ja` のまま、`公開する` はオン
5. 必要なら `カテゴリー`、`アイキャッチ画像`、`タグ`
6. `本文` を Markdown で記述（[9章](#9-markdown-記法早見表)参照）
7. **Save**
8. 数分後に `/ja/news/science-week-guide` で公開される
9. 英語版も同様に `News Articles (English)` で作成

---

### 6-2. Team Members（チームメンバー）

`/team` と `/ja/team` に並ぶ**人物カード**の情報です。1人につき1ファイル。

#### 実際のファイル

`src/content/members/hina-shima.md`：

```yaml
---
name: Hina Shima
role: Frontend
team: dry
is_leader: false
image: /media/1778656966554.jpg
order: 1
---
```

#### 表示ロジック（`src/pages/team/index.astro`）

```js
const members = (await getCollection('members')).sort((a, b) => a.data.order - b.data.order);
const leaders = members.filter(m => m.data.is_leader);
const others  = members.filter(m => !m.data.is_leader);
```

`src/content/members/` の中身を**全部読んで並べているだけ**です。したがって：

- ファイルを1つ増やす → カードが1枚増える
- `is_leader: true` → 上部の **Leadership** セクションに入る
- `is_leader: false` → 下部の **Members** セクションに入る
- `order` の数値が**小さい順**に並ぶ
- `roles` に入れた役割がカード内のタグとして表示される

#### 入力項目

| CMS の項目 | キー | 必須 | 説明 |
|---|---|:---:|---|
| Name | `name` | ✅ | 氏名（英語表記） |
| Name (Japanese) | `name_ja` | – | 日本語ページで使う氏名 |
| Role | `role` | – | 役職名（自由記述） |
| Role (Japanese) | `role_ja` | – | 同上の日本語 |
| Team (Legacy) | `team` | – | 旧方式の所属。単一選択。今は `roles` を推奨 |
| **Roles (Multiple)** | `roles` | – | 役割を複数選択。カードにタグ表示 |
| Is Leader? | `is_leader` | – | オンで Leadership セクションへ |
| Institution | `institution` | – | 所属機関 |
| Institution (Japanese) | `institution_ja` | – | 同上の日本語 |
| Image | `image` | – | 顔写真。丸くトリミング表示 |
| Sort Order | `order` | – | 表示順（小さいほど先） |

#### 役割タグ一覧

ニュースのタグと違い、こちらは `.pages.yml` に**選択肢が定義済み**なので、CMS ではチェックボックスから選ぶだけです（自由入力できません）。全7種すべてに表示色が付いています。

| CMS の選択肢 | 保存される値 | カードでの表示色 | `roles` での使用数 |
|---|---|---|:---:|
| Wet Lab | `wet` | 青 `#dbeafe` | 1 |
| Dry Lab | `dry` | 緑 `#dcfce7` | 2 |
| Human Practice | `human practice` | 黄 `#fef9c3` | 1 |
| Funding | `funding` | ピンク `#fce7f3` | 0 |
| Wiki & Video | `wiki-video` | 紫 `#ede9fe` | 4 |
| Leader | `leader` | 赤 `#fee2e2` | 4 |
| Advisor | `advisor` | 藍 `#e0e7ff` | 1 |

（色の定義は `src/pages/team/index.astro:91-97` と `src/pages/ja/team/index.astro:91-97`。両方に同じ内容が書かれているため、変更するときは2ファイルとも直す必要があります）

**`Team (Legacy)` について**

旧方式の単一選択フィールドで、選択肢は Wet Lab / Dry Lab / Human Practice / Funding / Wiki & Video の5つ（Leader と Advisor はありません）。
**`roles` が入っていればそちらが優先**され、`roles` が空のときだけ `team` の値が1つタグとして表示されます（`team/index.astro:18-22`）。

現在の23人の内訳：

| 状態 | 人数 | 表示されるタグ |
|---|:---:|---|
| `roles` のみ | 2 | `roles` の値 |
| `team` のみ | 7 | `team` の値1つ |
| 両方入力 | 10 | `roles` の値（`team` は無視される） |
| どちらも未入力 | 4 | **タグなし** |

新しく追加するメンバーには `Roles (Multiple)` を使ってください。

**`Role`（役職名）との違い**

`role` は自由入力のテキストで、タグではなく肩書きとしてカードに表示されます。
現在は `Team Leader` / `Wiki team leader` / `Funding team leader` / `Human Practice team leader` / `Frontend`（2人）/ `Researcher` / `Presentation` / `Mentor` / `Corder` が使われています。
（※ `Corder` は `Coder` の誤記と思われます）

#### よくある作業

- **新メンバーが入った** → 新規作成
- **写真や役割が変わった** → 既存エントリを編集（新規作成ではない）
- **年度が変わってメンバー総入れ替え** → 旧メンバーを削除、新メンバーを追加
- **並び順を直したい** → `Sort Order` の数値を振り直す（10, 20, 30… と間隔を空けておくと後で挿入しやすい）

---

### 6-3. Projects と年度切り替え

`Projects` は年度ごとのプロジェクト情報です。ファイル名は `{year}.md`（例: `2026.md`）。

#### 入力項目

| 項目 | キー | 必須 |
|---|---|:---:|
| Year | `year` | ✅ |
| Title / Title (Japanese) | `title` / `title_ja` | `title` のみ✅ |
| Summary / Summary (Japanese) | `summary` / `summary_ja` | `summary` のみ✅ |
| Description / Description (Japanese) | `description` / `description_ja` | – |
| Wiki URL | `wiki_url` | – |
| Image | `image` | – |

- `summary` … 短い紹介文（トップページなどに出る）
- `description` … 長い本文（プロジェクト詳細ページ）

#### 年度を切り替える手順

トップページと `/project` は `src/data/settings.yaml` の `current_year` を見て、
対応する年度のプロジェクトを読み込みます。

```js
const currentYear = settings.current_year;
const currentProject = await getEntry('project', currentYear.toString());
```

**必ずこの順番で行ってください（例: 2027年に切り替える場合）**

1. **先に** `Projects` で `Year: 2027` のエントリを作成し、タイトル・概要を入力して Save
2. **その後** `Global Settings` の `Current Project Year` を `2027` に変更して Save

> ⚠️ 順番を逆にすると、`current_year` に対応するプロジェクトが存在しない状態になり、
> `/project` はアーカイブページへリダイレクトされます（`src/pages/project/index.astro`）。

これで自動的に：
- トップページと `/project` が2027年の内容になる
- 2026年は `/archive` 側に移動する（`year !== currentYear` のものがアーカイブ扱い）

現在の設定は `current_year: 2026` です。

---

### 6-4. Activities / Highlights（活動報告）

`/activities`, `/ja/activities` に表示されます。

| 項目 | キー | 必須 | 説明 |
|---|---|:---:|---|
| Title | `title` | ✅ | 活動名 |
| Description | `description` | ✅ | 説明文 |
| Title (Japanese) | `title_ja` | – | |
| Description (Japanese) | `description_ja` | – | |
| Image | `image` | – | 画像 |
| Image placeholder (no image) | `imagePlaceholder` | – | 画像がないときに代わりに出す文字 |
| Image placeholder (Japanese) | `imagePlaceholder_ja` | – | 同上の日本語 |
| Sort order | `order` | – | 表示順（小さいほど先） |

---

### 6-5. Sponsors（協賛）

`/support`, `/ja/support` に表示されます。

| 項目 | キー | 必須 | 説明 |
|---|---|:---:|---|
| Name | `name` | ✅ | 企業・団体名 |
| Name (Japanese) | `name_ja` | – | |
| Logo | `logo` | – | ロゴ画像 |
| Tier | `tier` | ✅ | `gold` / `silver` / `bronze` / `partner` から選択 |
| Sort order | `order` | – | 表示順 |

> Tier は上記4種類のみです。勝手な値を入れるとビルドが失敗します。

---

### 6-6. Archive entries（アーカイブ項目）

`/project/2026`, `/ja/project/2026` の下部に、過去の実績として表示されます。
（※ `Projects` の過去年度とは別物です。こちらは年度内の個別トピック向け）

| 項目 | キー | 必須 |
|---|---|:---:|
| Year | `year` | ✅ |
| Title / Title (Japanese) | `title` / `title_ja` | `title` のみ✅ |
| Summary / Summary (Japanese) | `summary` / `summary_ja` | `summary` のみ✅ |
| Wiki URL | `wiki_url` | – |
| Universities | `universities` | – |
| Sort order (within year) | `order` | – |

並び順は 年度の新しい順 → 同一年度内は `order` の小さい順。

---

### 6-7. Global Settings（全体設定・寄付）

`src/data/settings.yaml` を編集する画面です。コレクションではなく**単一ファイル**なので、
新規作成はなく、常に既存の内容を上書きします。

#### Current Project Year

サイト全体の「今年度」。[6-3](#6-3-projects-と年度切り替え)を参照。

#### Donation Settings（寄付設定）

| 項目 | 説明 |
|---|---|
| Donation Goal Amount | 目標金額 |
| Current Amount | 現在の寄付額（進捗バーに反映） |
| Currency | 通貨（JPY のみ） |
| Last Updated | 金額の更新日 |
| Japanese Donation Content | 日本語の文面・各種URL |
| English Donation Content | 英語の文面・各種URL |

言語別ブロックの中身：

- `Title` / `Description` … 支援ページの見出しと説明文
- `Funding Plan URL` … 資金計画の資料リンク
- `Supporter Returns URL` … 支援者リターンの資料リンク
- `Activity Updates URL` … 活動報告のリンク
- `Bank Transfer`（**日本語側のみ**）… `Enabled` をオンにすると振込先が表示される
  （銀行名・支店名・口座種別・口座番号・名義・備考）
- `OIST Donation` … `Enabled` をオンにすると OIST 経由の寄付リンクが表示される

> **現状**：`settings.yaml` の寄付項目は金額 0・文面すべて空欄の初期状態です。
> 公開運用の前に埋める必要があります。

---

## 7. 画像の扱い

- **必ず CMS のアップローダーから追加してください。** 自動的に `public/media/` に保存されます
- frontmatter に入るパスは `/media/ファイル名.png` の形式です（`public/` は付けません）
- 手でファイルを置く場合も `public/media/` に入れ、パスは `/media/...` と書きます
- ファイル名は半角英数字とハイフン推奨（日本語名は避ける）
- **アップロード前に圧縮してください。** 1枚あたり数百KB以内が目安です


---

## 8. 日本語・英語の対応方法

**2つの方式が混在しています。**

### 方式A：1つのエントリに両言語のフィールド（ニュース以外すべて）

Activities / Sponsors / Projects / Team Members / Archive が該当。

```yaml
title: AI x Biology
title_ja: AI × 生物学
```

- 両方入力 → 言語切り替えで適切に表示される
- 英語のみ入力 → 日本語ページでも英語が表示される（フォールバック）
- **英語フィールドが必須**、日本語フィールドは任意

### 方式B：言語ごとに別記事（ニュースのみ）

`News Articles (English)` と `News Articles (Japanese)` で別々に作成します。
片方だけ作ることも可能です（その言語のページにだけ出ます）。

---


## 10. md ファイルを手で書く方法

CMS を使わず、エディタと Git で直接編集する方法です。結果は CMS と完全に同一です。

### 事前準備（初回のみ）

```bash
git clone https://github.com/iGEMOkinawa2026/igem-okinawa.git
cd igem-okinawa
npm install
```

### 記事を書く

```bash
# 1. 作業用ブランチを作る
git checkout -b news/my-article

# 2. src/content/news/ja/my-article.md を作成して編集

# 3. ローカルで確認（← CMS にはないこの工程が最大の利点）
npm run dev
#    http://localhost:4321/igem-okinawa/ja/news/ を開く

# 4. コミットして push
git add src/content/news/ja/my-article.md
git commit -m "feat: add news article about ..."
git push -u origin news/my-article

# 5. GitHub で Pull Request を作成 → レビュー → main にマージ
#    マージされた時点で自動デプロイが走る
```

急ぎでなければ、この **PR 経由の方法が最も安全**です。
公開前に他のメンバーが内容を確認できます。

### ビルドが通るか確認する

```bash
npm run build
```

frontmatter の必須項目が抜けていたり、`tier` に不正な値が入っていたりすると、
ここでエラーになります（`src/content/config.ts` のスキーマで検証されるため）。

---

## 11. 公開・デプロイの仕組み

`.github/workflows/astro.yml` が担当しています。

| 項目 | 内容 |
|---|---|
| トリガー | `main` ブランチへの push（＋手動実行 `workflow_dispatch`） |
| 実行環境 | ubuntu-latest / Node.js 22 |
| 手順 | `npm ci` → `npm run build` → `dist/` を GitHub Pages にデプロイ |
| 所要時間 | おおむね2〜5分 |
| 公開先 | <https://igemokinawa2026.github.io/igem-okinawa/> |

**進捗の確認方法**
GitHub リポジトリの **Actions** タブを開くと、実行中／成功／失敗が見られます。
🟡 が実行中、✅ が成功、❌ が失敗です。失敗した場合はサイトは更新されません（古い内容のまま残ります）。

---

## 12. 落とし穴と既知の問題

### ⚠️ 運用上の落とし穴

**1. `date` を未来にしても予約投稿にはならない**

日付によるフィルタは実装されていません。`published: true` なら未来日付でも即座に公開され、
一覧の先頭に来るだけです。

```js
// src/lib/news.ts
return posts
  .filter((post) => getNewsLanguage(post) === language && post.data.published)
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
```

下書きにしたい場合は `published: false` を使ってください。

**2. `published: false` は「限定公開」ではない**

詳細ページの `getStaticPaths()` が `published` で絞ってからページを生成するため、
HTML ファイル自体が作られません。URL を知っていてもアクセスできない、完全な非公開です。

**3. `language` とフォルダを食い違わせない**

`ja/` フォルダに置いたのに `language: en` と書くと、その記事は `/ja/news/` の一覧から消え、
`/news/` 側に現れます。省略すればフォルダから自動判定されるので、**迷ったら空欄が安全**です。

**4. Save = 即公開**

CMS にステージング環境はありません。確認してから保存してください。

**5. 同じ言語フォルダ内でスラッグを重複させない**

同名ファイルは作れないため、片方が失われます。EN/JA 間の重複は問題ありません。

### 🐛 既知の不具合・要修正事項

**A. PR プレビューが動作しない**

README には PR ごとのプレビューURL（`/igem-okinawa/pr-preview/pr-<番号>/`）の記載がありますが、
これを実現していた `.github/workflows/preview.yml` は **2026-08-10 のコミット `51bf028`
（"fix: restore GitHub Pages Actions deployment"）で削除済み**です。
現在 PR を作ってもプレビューURLは生成されません。README の記述が古いままです。

→ 対応候補：README の記述を削除するか、`preview.yml` を復活させる。

**B. Human Practice が機能していない**

`.pages.yml` に `human-practice` コレクションが定義されており（284〜322行目）、
README にも編集可能と書かれていますが、実際には：

- `src/content/config.ts` の `collections` に登録されていない
- `src/content/human-practice/` ディレクトリが存在しない
- これを読み込んでいるページが1つもない
- `astro.config.mjs` のリダイレクト先 `/activities/human-practice` に対応するページも存在しない

つまり **CMS で編集しても、サイトには何も反映されません。**

→ 対応候補：ページを実装するか、`.pages.yml` と README から該当箇所を削除する。

**C. `/project/2026/` は年度切り替えに追随しない**

`src/pages/project/2026/index.astro` は年度がパスに直書きされた固定ページで、
`current_year` を参照していません（Archive entries を表示しています）。
`current_year` を 2027 に変えても、このページは 2026 のまま残ります。

→ 対応候補：`[year].astro` 形式の動的ルートに置き換える。

**D. CMS から編集できない項目がある**

`src/content/config.ts` にはあるが `.pages.yml` に無いため、CMS のフォームに出ない項目：

| コレクション | 編集できない項目 |
|---|---|
| Team Members | `bio`, `bio_ja` |
| Activities | `date`, `date_ja`, `detail`, `detail_ja` |

→ 対応候補：使う予定があれば `.pages.yml` に追加、なければスキーマから削除。

---

## 13. トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| 保存したのにサイトが変わらない | ①2〜5分待つ ②ブラウザをスーパーリロード（Ctrl+F5） ③GitHub の **Actions** タブで ❌ が出ていないか確認 |
| Actions が ❌ で失敗した | 必須項目の未入力、`tier` などの不正な値、YAML の書式崩れが典型。Actions のログを開き、開発者に相談 |
| 記事が一覧に出ない | `published` がオフ／`language` とフォルダの不一致／同じフォルダ内でスラッグが重複 |
| 画像が表示されない | パスが `/media/xxx.png` の形式になっているか確認（`public/media/xxx.png` は誤り） |
| メンバーの並び順がおかしい | `Sort Order` 未入力のエントリは `0` 扱い。全員に数値を振る |
| `/project` がアーカイブに飛ばされる | `current_year` に対応する `Projects` エントリが無い。先にその年度を作成する |
| 間違えて保存・削除した | GitHub のコミット履歴から復元可能。自分で戻さず開発者に連絡を |
| CMS にリポジトリが出てこない | GitHub 側の権限不足。organization への招待と Write 権限を確認 |

---

## 14. 開発者向け：フィールドを追加するとき

コンテンツの構造を変えるときは、**必ず3か所をセットで更新**してください。

```
① src/content/config.ts   … Zod スキーマ（型と必須/任意の定義）
② .pages.yml              … CMS のフォーム定義
③ src/pages/, src/components/ … 表示側の実装
```

- ①だけ → CMS のフォームに出ないので編集者が入力できない（→ [12章D](#-既知の不具合要修正事項)の状態）
- ②だけ → 保存された値がスキーマ検証で弾かれ、**ビルドが失敗**する
- ①②だけ → データは入るがどこにも表示されない

変更後は必ず `npm run build` を実行し、既存コンテンツがスキーマ違反にならないか確認してください。
必須項目を追加する場合は、既存の全ファイルにその項目を追記する必要があります
（既存データを壊さないため、原則 `.optional()` か `.default()` を付けるのが安全です）。

その他の開発方針は以下を参照：

- [`docs/site-structure.md`](site-structure.md) … サイト構成の解説（日本語）
- [`docs/ai/architecture.md`](ai/architecture.md)
- [`docs/ai/coding-rules.md`](ai/coding-rules.md)
- [`docs/ai/content-rules.md`](ai/content-rules.md)
- [`AGENTS.md`](../AGENTS.md)

---

*このガイドは 2026-08-14 時点の実装に基づいています。*
*`.pages.yml` や `src/content/config.ts` を変更した際は、このドキュメントも更新してください。*
