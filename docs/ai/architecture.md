# Project Architecture & Data Flow

This document details the system structure, data flow, deployment pipeline, and known fragile areas of the iGEM Okinawa homepage.

## Current Directory Structure

```text
├── .github/
│   └── workflows/
│       └── astro.yml            # GitHub Pages deployment pipeline
├── .pages.yml                   # Pages CMS configuration for editors
├── astro.config.mjs             # Astro configuration
├── package.json                 # Node dependencies and build scripts
├── public/
│   └── media/                   # User-uploaded images via CMS
├── src/
│   ├── assets/                  # Core static images and branding
│   ├── components/              # Reusable UI components
│   ├── content/                 # CMS-driven Markdown content collections
│   │   ├── activities/          # Highlights/Activities
│   │   ├── archive/             # Past year summaries
│   │   ├── members/             # Team members and leadership
│   │   ├── news/                # News articles
│   │   ├── project/             # Main project details indexed by year
│   │   └── sponsors/            # Sponsors details
│   ├── data/                    # Settings and static yaml/ts datasets
│   │   ├── settings.yaml        # Global settings (current_year)
│   │   └── navigation.ts        # Navigation menu structure
│   ├── layouts/                 # Page templates (Base, Page, HumanPractice)
│   ├── lib/                     # Custom utilities and settings loader
│   ├── pages/                   # File-based routing (EN: / , JA: /ja/)
│   └── styles/                  # Styling system (global.css)
```

---

## Main Pages and Components

### Main Routing Pages (`src/pages/`)
- **Root Page**: `index.astro` (EN) and `ja/index.astro` (JA)
- **Static & Dynamic Pages**: `/about`, `/activities`, `/archive`, `/contact`, `/news`, `/project`, `/support`, `/team` (each mirrored under `/ja/`)

### Key Components (`src/components/`)
- **Header.astro (`src/components/Header.astro`)**: Implements navigation and the English/Japanese language switcher.
- **MemberCard.astro (`src/components/MemberCard.astro`)**: Renders individual member details, handling multiple roles and leader tags.
- **Activities.astro (`src/components/Activities.astro`)**: Lists highlights with modal detail overlays.

---

## Data and Content Flow

1. **Global Configuration**:
   - `src/data/settings.yaml` manages the singleton setting `current_year` (e.g., `2026`).
   - `src/lib/settings.ts` exports `getSettings()` which parses this YAML file dynamically.
2. **Current Project Retrieval**:
   - Pages like `index.astro` query the `project` collection using `current_year` to fetch active year data.
   - Project files are named like `src/content/project/{year}.md` (e.g., `2026.md`).
3. **Archive Auto-migration**:
   - Any project record in `src/content/project/` with a year strictly less than `current_year` is automatically categorized under the "Archive" on pages.

---

## Deployment Flow

The site uses GitHub Actions to automate deployments:
1. **Trigger**: Every push to the `main` branch or manual trigger via `workflow_dispatch`.
2. **Process** (`.github/workflows/astro.yml`):
   - Sets up Node.js 22.
   - Runs `npm ci` to install exact dependencies.
   - Executes `npm run build` to compile the static site into `dist/`.
   - Uploads `dist/` to GitHub Pages.
3. **Destination**: Hosted on GitHub Pages.

---

## Known Fragile Areas

> [!WARNING]
> **Localization (EN/JA) Desync**
> - The routing files in `src/pages/ja/` must correspond precisely to those in `src/pages/`. Adding a page or directory in one without copying it to the other will break language switcher paths or cause 404 errors.

> [!WARNING]
> **Pages CMS Configuration Drift**
> - The fields in `.pages.yml` must match the TypeScript types in `src/content/config.ts`. If they drift:
>   - Editors might save content with missing fields, breaking the frontend.
>   - Astro build might fail during CI due to strict validation in `config.ts`.

> [!NOTE]
> **Missing Schema Definition (human-practice)**
> - `src/content/human-practice` is defined as a collection in `.pages.yml` to allow CMS editing. However, it is currently omitted in `src/content/config.ts` schemas. Ensure this is resolved when implementing Human Practice features.
