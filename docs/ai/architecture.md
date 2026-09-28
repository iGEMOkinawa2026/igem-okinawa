# アーキテクチャとデータフロー

iGEM Okinawa ホームページのシステム構成、データの流れ、デプロイの経路、
および壊れやすい箇所をまとめたドキュメントです。

## 現在のディレクトリ構成

```text
├── .github/workflows/astro.yml  # GitHub Pages へのデプロイ設定
├── .pages.yml                   # Pages CMS（編集者向け）の設定
├── AGENTS.md                    # AI エージェント向けの入口
├── README.md
├── astro.config.mjs             # Astro の設定（base: /igem-okinawa/）
├── package.json                 # 依存パッケージとビルドスクリプト
├── tsconfig.json
├── docs/                        # 人間向けドキュメント（現在すべて未コミット）
│   ├── cms-guide.md             # CMS 運用ガイド（日本語）
│   ├── CMS 運用ガイド（iGEM Okinawa Homepage）.md   # 上記の別バージョン
│   ├── site-structure.md        # サイト構成ガイド（日本語）
│   ├── bug-report.md
│   └── ai/                      # AI エージェント向け
│       ├── architecture.md      # このファイル
│       ├── coding-rules.md
│       ├── content-rules.md
│       └── tasks.md
├── public/                      # そのまま配信される静的ファイル
│   ├── assets/donation/         # 寄付ガイド PDF（en / ja）
│   ├── media/                   # CMS からアップロードされた画像
│   ├── logo.png / og-image.png
│   ├── shisa_left.PNG / shisa_right.PNG
│   ├── robots.txt / sitemap.xml
│   └── google*.html             # Search Console の所有確認
└── src/
    ├── env.d.ts
    ├── assets/                  # ビルド時に最適化される画像
    │   ├── icon-wet / dry / hp / funding / wiki .png
    │   └── shisa_left.PNG / shisa_right.PNG
    ├── components/              # 再利用される UI 部品（13点）
    │   ├── Header.astro / Footer.astro / PageHero.astro
    │   ├── Hero.astro / About.astro / Mission.astro
    │   ├── Activities.astro / Support.astro
    │   ├── MemberCard.astro / SiteNavCards.astro
    │   ├── ArchivePreview.astro / SectionNav.astro
    │   └── ProjectStory.astro   # ★ /project/ と /ja/project/ の本文（EN/JA 共通）
    ├── content/
    │   ├── config.ts            # ★ Zod スキーマ。ここで検証に落ちるとビルドが失敗する
    │   ├── activities/          # ハイライト / 活動
    │   ├── archive/             # 過去年度のまとめ
    │   ├── members/             # チームメンバー・リーダー
    │   ├── news/{en,ja}/        # ニュース記事（EN / JA で別ファイル）
    │   ├── project/             # 年度別のプロジェクト詳細（2025.md, 2026.md）
    │   └── sponsors/            # 協賛企業・団体
    ├── data/
    │   ├── settings.yaml        # 全体設定（current_year, donation）※CMS から編集可
    │   ├── navigation.ts        # メインナビの項目とリンク先
    │   ├── siteCopy.ts          # ヘッダー・フッター・ヒーロー・navCards の文言
    │   ├── homeCopy.ts          # ※ 型 SiteLocale 以外は現在どこからも使われていない
    │   └── social.yaml          # SNS リンク（フッターと構造化データで使用）
    ├── layouts/
    │   ├── BaseLayout.astro     # <head>, OGP, canonical, 構造化データ, Google Fonts
    │   ├── PageLayout.astro     # BaseLayout ＋ ヘッダー ＋ フッター（通常はこれ）
    │   └── HumanPracticeLayout.astro  # サイドバー付き（※ 使用ページは未実装）
    ├── lib/
    │   ├── paths.ts             # withBase()。リンク・画像は必ずこれを通す
    │   ├── settings.ts          # getSettings()
    │   ├── news.ts              # 言語での絞り込みと slug 生成
    │   └── truncate.ts
    ├── pages/                   # ファイルベースのルーティング
    │   ├── index.astro                  # EN トップ
    │   ├── about|activities|contact|news|privacy|site-policy|support|team/
    │   ├── archive/{index,[year]}.astro
    │   ├── project/{index.astro, 2026/index.astro}
    │   └── ja/                          # 上記と完全に対応する日本語版
    └── styles/global.css        # CSS 変数（色・フォント）と共通クラス
```

> [!NOTE]
> `src/pages/` と `src/pages/ja/` は現在**完全に対応しています**。
> `news/[slug].astro` と `archive/[year].astro` は 1 ファイルから複数ページを生成します。

---

## 主なページと部品

### ルーティングを担うページ（`src/pages/`）

- **トップページ**: `index.astro`（英語）と `ja/index.astro`（日本語）
- **その他のページ**: `/about`、`/activities`、`/archive`、`/contact`、`/news`、
  `/project`、`/support`、`/team`（いずれも `/ja/` 配下に対応するものがある）

### 主要コンポーネント（`src/components/`）

- **`Header.astro`** … ナビゲーションと英語 / 日本語の言語切り替えを実装
- **`Footer.astro`** … フッター。`siteCopy.ts` と `social.yaml` から文言とリンクを受け取る
- **`PageHero.astro`** … 各ページ上部の見出し帯。`PageLayout` 系のページで使用
- **`MemberCard.astro`** … メンバー1人分の表示。複数ロールとリーダータグに対応
- **`Activities.astro`** … ハイライトの一覧表示と、詳細を出すモーダル
- **`Support.astro`** … 協賛一覧と寄付情報（`settings.yaml` の `donation`）を表示
- **`Hero.astro` / `SiteNavCards.astro` / `ArchivePreview.astro`**
  … `project/2026/` でのみ使用。文言は `siteCopy.ts` の `hero` / `navCards` から来る
- **`About.astro` / `Mission.astro`** … 現在どこからも読み込まれていない
- **`ProjectStory.astro`** … プロジェクトページの本文。`/project/` と `/ja/project/` の
  両方から使われ、マークアップと CSS（デザイン座標の絶対配置）をここに集約している。
  表示するデータは `src/content/project/{年}.md` の `story` / `story_ja`
- **`SectionNav.astro`** … `HumanPracticeLayout.astro` からのみ読み込まれるが、
  そのレイアウトを使うページが存在しないため、実質未使用

---

## データとコンテンツの流れ

1. **全体設定**
   - `src/data/settings.yaml` が `current_year`（例: `2026`）と `donation`（寄付の目標額・
     文面・振込先を `ja` / `en` 別に保持）を管理する
   - `src/lib/settings.ts` の `getSettings()` がこの YAML を読んで返す
   - このファイルは CMS の「Global Settings」から編集できる

2. **今年度プロジェクトの取得**
   - `pages/index.astro` と `pages/project/index.astro` が `current_year` をキーに
     `getEntry('project', ...)` で現在の年度のデータを取り出す
   - プロジェクトのファイル名は `src/content/project/{年}.md`（例: `2026.md`）
   - ページ本文は同じ md の `story`（英語）/ `story_ja`（日本語）から読む。
     `ProjectStory.astro` が両言語で共通のレイアウトを描画する
   - `story` が未入力、またはその年度の md が無い場合は、
     `summary` / `description` を使った簡易表示にフォールバックする
     （`ProjectStory.astro` 内で分岐。`Astro.redirect()` は使っていない）

3. **アーカイブへの自動移動**
   - `pages/archive/index.astro` は `project` コレクションのうち
     **`year !== current_year`**（＝今年度以外）を一覧表示する
   - つまり過去年度だけでなく、**未来の年度のファイルもアーカイブに出ます**
   - `current_year` を上げれば、前年度は自動的にアーカイブへ移る（ファイル移動は不要）

> [!IMPORTANT]
> `/archive/` ページが読むのは `src/content/project/` であって、
> `src/content/archive/` ではありません。
> `src/content/archive/` の方は `ArchivePreview.astro`（`project/2026/` でのみ使用）が
> 読む別のコレクションです。名前が紛らわしいので混同しないでください。

4. **ニュースの言語振り分け**
   - ニュースだけは EN / JA で別ファイル（`src/content/news/en/`, `.../ja/`）
   - `src/lib/news.ts` の `getPublishedNewsByLanguage()` が `language` と
     `published: true` で絞り、日付の降順に並べる
   - `published: false` の記事は **HTML 自体が生成されない**（限定公開ではなく完全な非公開）
   - ニュース以外のコレクションは 1 ファイルに `title` と `title_ja` を併記する方式

---

## 公開までの経路

デプロイは GitHub Actions が自動で行います。

1. **きっかけ** … `main` ブランチへの push、または `workflow_dispatch` による手動実行
2. **処理**（`.github/workflows/astro.yml`）
   - Node.js 22 を用意する
   - `npm ci` で依存パッケージをインストールする
   - `npm run build` で静的サイトを `dist/` に生成する
   - `dist/` を GitHub Pages にアップロードする
3. **公開先** … GitHub Pages

---

## 壊れやすい箇所

> [!WARNING]
> **EN / JA のディレクトリのずれ**
> - `src/pages/ja/` の中身は `src/pages/` と正確に対応している必要があります。
>   片方だけにページやディレクトリを追加すると、言語切り替えのリンクが壊れるか、
>   404 になります。
>
> 2026-09-01 時点で `/project/` と `/ja/project/` は `ProjectStory.astro` を共有し、
> 同じデザイン・同じ構造になっています。片方だけレイアウトを変えないでください。

> [!WARNING]
> **CMS 設定とスキーマのずれ**
> - `.pages.yml` のフィールドは `src/content/config.ts` の型定義と一致している必要があります。
>   ずれると次のどちらかが起きます。
>   - 編集者が必須項目の欠けたコンテンツを保存してしまい、表示が崩れる
>   - `config.ts` の検証に引っかかり、CI でのビルドが失敗する

> [!NOTE]
> **Human Practice が三重に未完成**
> - `.pages.yml` にはコレクション `human-practice`（`path: src/content/human-practice`）が
>   定義されている
> - しかし **`src/content/human-practice/` は存在せず**、`src/content/config.ts` の
>   スキーマにも含まれていない
> - `src/data/navigation.ts` の `getHpNav()` は
>   `activities/human-practice/{overview,background,...}/` へのリンクを生成するが、
>   **対応するページが `src/pages/` に存在しない**（表示されれば 404 になる。現状は
>   `getHpNav()` を呼ぶページがないため露出していない）
> - `src/layouts/HumanPracticeLayout.astro` は用意済みだが、使うページがない
>
> 実装するときは、この4点をまとめて揃える必要があります。

> [!NOTE]
> **年度が追随しない箇所**
> - `src/pages/project/2026/` と `src/pages/ja/project/2026/` はパスに年度が直書きされており、
>   `settings.yaml` の `current_year` を変えても追随しません。
> - このページはプロジェクトの内容を表示せず（`Hero` ＋ `SiteNavCards` ＋ `ArchivePreview`）、
>   ナビからもフッターからもリンクされていません。実際のプロジェクト詳細は
>   `src/pages/project/index.astro` が `current_year` 経由で表示します。

> [!NOTE]
> **`siteCopy.ts` の navCards に古い情報**
> - 英語版 `navCards` の Project 説明が「マンゴー農園のアザミウマ被害」のままで、
>   実際の 2026 年プロジェクト（ファージによる消化器系病原体対策）と食い違っています。
> - また `href: 'human-practice/'` は存在しないページを指しています。
