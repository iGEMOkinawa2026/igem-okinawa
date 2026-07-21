# iGEM Okinawa Homepage

Welcome to the iGEM Okinawa normal homepage repository. This website is built with [Astro](https://astro.build/) and is designed to be easily updatable by non-engineers via **Pages CMS**.

---

## 👨‍💻 非エンジニア向け更新手順 (For Content Editors)

このサイトは、エンジニアでなくてもブラウザ上の [Pages CMS](https://pagescms.org/) を使って簡単に更新できるようになっています。

### 1. 更新できる内容
以下の内容は CMS から直接編集・追加が可能です：
- **Global Settings**: 今年の年度（Current Year）の切り替え
- **Projects**: 今年のプロジェクト情報、過去のアーカイブ情報
- **Team Members**: メンバーの追加・削除、写真や役割の変更
- **Activities**: 活動報告やハイライトの追加
- **Human Practice**: ヒューマンプラクティス各セクションの文章更新
- **Sponsors**: 協賛企業の追加、ロゴの更新
- **News**: ニュース記事の追加・更新（英語版・日本語版をそれぞれ作成）

### 2. 今年のプロジェクト（年度更新）の手順
2026年など、新しい年度のプロジェクトを開始する際は以下の手順を行います：
1. CMS で **Projects** を開き、「新規作成」から `2026` 年のプロジェクトを作成します。（タイトル、概要、画像などを入力）
2. CMS で **Global Settings** を開き、`current_year` の数値を `2026` に変更して保存します。
> **Note:** これだけで、トップページとプロジェクトページが 2026年の内容に切り替わり、昨年の 2025年の内容は自動的に「Archive」へ移動します。

### 3. メンバーの追加と更新
CMS で **Team Members** を開きます。
- **新規追加**: 新しいメンバーを作成し、名前などの情報を入力します。
- **リーダー設定**: `Is Leader?` のトグルをオンにすると、チームページの「Leadership」セクションに優先して表示されます。
- **複数役割の兼任**: `Roles (Multiple)` で複数の役割（Wet Lab, Dry Lab, Leaderなど）にチェックを入れると、メンバーカードに複数のタグが表示されます。
- **任意入力**: 役職名（Role）や旧Team（Team (Legacy)）の入力は任意（オプショナル）になりました。
- **並び順**: `Sort Order` に数値を入力することで、表示順を調整できます（数値が小さい方が先）。

### 4. 日英の言語対応
CMS の入力画面には、英語用（例: `Title`）と日本語用（例: `Title (Japanese)`）のフィールドが用意されています。
- 日本語と英語の両方を入力すると、サイトの言語切り替えで適切に表示されます。
- 片方のみ入力した場合は、デフォルトで英語（または入力されている方）が表示されます。

### 5. ニュース記事の追加
ニュースは**英語版と日本語版が別々の記事**になっています（多くのコンテンツのように1つの記事に両言語を入れる形ではありません）。
- **英語記事**: CMS で **News Articles (English)** を開いて作成します（`/news/` に表示）。
- **日本語記事**: CMS で **News Articles (Japanese)** を開いて作成します（`/ja/news/` に表示）。
- **URL スラッグ**: 記事の URL 末尾になる英字の識別子です。同じ内容の英語版・日本語版で**同じスラッグを使って構いません**（例: 両方 `science-week-guide`）。英語版と日本語版は別々のフォルダに保存されるため、スラッグが同じでも問題は起きません。
  - ⚠️ ただし、**同じ言語の中では**スラッグを重複させないでください（英語記事どうし、または日本語記事どうしで同じスラッグにすると、片方が表示されなくなります）。

---

## 🛠 開発者向け保守手順 (For Developers)

The site structure separates content (CMS-driven) from presentation (Astro components).

### Directory Structure
- `src/content/`: All CMS content collections (activities, members, project, sponsors, human-practice). **Safe for editors.**
- `src/data/`: Static data and global settings (`settings.yaml`). **Safe for editors.**
- `src/pages/`: Astro routing pages. Includes `/` (EN) and `/ja/` (JP). **Developers only.**
- `src/components/` & `src/layouts/`: UI components and layouts. **Developers only.**
- `src/styles/`: Global CSS variables and styles. Color palette is defined here. **Developers only.**
- `public/media/`: Images and media files uploaded via CMS.

### Do's and Don'ts
- **DO NOT** hardcode the current year's project data in `src/pages/index.astro`. It dynamically loads from `src/content/project/{current_year}.md` via `src/data/settings.yaml`.
- **DO NOT** hardcode team members. Always map over the `members` content collection.
- **DO** use the designated CSS variables (`var(--color-primary)`, etc.) for styling to maintain the design system. The approved palette is:
  - Main: `#3FD1C7`
  - Sub: `#5CCFE6`
  - Sub2: `#6A9BD6`
  - Accent: `#B8F13A`
  - Emphasis: `#F58A3C`

### Local Development
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

### Pages CMS Config
The `.pages.yml` file configures the CMS. If you add new fields to Astro content schemas (`src/content/config.ts`), you MUST update `.pages.yml` so that content editors can access those fields.
