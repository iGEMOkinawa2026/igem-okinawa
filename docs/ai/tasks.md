# Recommended Tasks & Checklists

This document provides checklists for common tasks, debugging processes, content additions, and deployment.

---

## Git Workflow & Branching Rules

To prevent conflicts with direct Pages CMS edits, all AI coding work must follow this branching strategy.

### Rules
1. **CMS Edits Bypass**: Pages CMS edits may directly update `main`.
2. **No Direct Main Edits**: AI coding work must never be done directly on the `main` branch.
3. **PR Strategy**: Use Pull Requests for review and merge. Never force-push to `main`.

### Feature Branch Setup Checklist
Before starting any coding work, run the following:
- [ ] `git fetch origin`
- [ ] `git checkout main`
- [ ] `git pull --rebase origin main`
- [ ] `git checkout -b <type>/<short-task-name>`

#### Branch Naming Guidelines
- `docs/<task>`
- `fix/<task>`
- `feat/<task>`
- `chore/<task>`

### Pre-PR Checklist
Before opening a Pull Request, run:
- [ ] `npm run build`
- [ ] `git status`

---

## Recommended Next Tasks

- **[ ] Fix Schema Inconsistency**:
  - **Issue**: `.pages.yml` defines a collection for `human-practice`, but `src/content/config.ts` does not have a schema definition for it.
  - **Action**: Add `human-practice` definition in `src/content/config.ts` and export it in the `collections` object.
- **[ ] Localization Audit**:
  - **Issue**: Need to verify that all subpages under `src/pages/` have matching `.astro` files under `src/pages/ja/`.
  - **Action**: Perform a structural comparison to find any missing translations.
- **[ ] Color Contrast Review**:
  - **Issue**: Text contrast ratios must meet accessibility (WCAG AA) standards.
  - **Action**: Verify readability of text on `--color-primary` (Turquoise) and `--color-secondary` (Blue).

---

## Bug Fix Checklist

- [ ] Run `npm run build` to verify there are no Astro compilation or TypeScript validation errors.
- [ ] Check if the issue occurs in both English (`/`) and Japanese (`/ja/`) layouts.
- [ ] Confirm that no inline style overrides have been introduced.
- [ ] Check that CMS configurations in `.pages.yml` have not been altered or corrupted.

---

## Content Update Checklist

- [ ] Create or update files in `src/content/{collection_name}/` (do not hardcode in components).
- [ ] Provide Japanese translations (e.g. `title_ja`, `description_ja`) where applicable.
- [ ] Save media files in `public/media/` and reference them in markdown files as `/media/{filename}`.
- [ ] Verify `order` key is set properly to position items in listings.

---

## Release & Deploy Checklist

- [ ] Run `npm run build` locally to ensure a green build.
- [ ] Check console warnings or TypeScript errors and resolve them before push.
- [ ] Commit and push to the `main` branch.
- [ ] Monitor the GitHub Action execution (`.github/workflows/astro.yml`).
- [ ] Manually check the live website:
  - [ ] Header navigation links function.
  - [ ] Language switching (EN <-> JA) functions on all pages.
  - [ ] Images load correctly on mobile devices.
