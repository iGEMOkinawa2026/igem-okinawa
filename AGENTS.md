# AI Agent Instructions - iGEM Okinawa Homepage

Welcome! This document serves as the entry point for AI development assistants (Codex, Claude Code, Antigravity) working on the iGEM Okinawa homepage.

## Project Overview
This repository hosts the public website for iGEM Okinawa. It is designed to be easily manageable for non-engineers using **Pages CMS**. Developers must separate content structure from presentation layer.

## Tech Stack
- **Framework**: [Astro v5](https://astro.build/)
- **Language**: TypeScript / JavaScript
- **Styling**: Vanilla CSS (Variables configured in `src/styles/global.css`)
- **Content Management**: Pages CMS (`.pages.yml`)

## Core Commands
- `npm install` - Install dependencies
- `npm run dev` - Start local development server
- `npm run build` - Build production bundle (outputs to `dist/`)
- `npm run preview` - Preview production build locally

## Non-Negotiable Rules
1. **Dynamic Content Loading**: NEVER hardcode current year's project data or team members. Retrieve current year from `src/data/settings.yaml` and load the project/members dynamically.
2. **CSS Variables Only**: Do not use ad-hoc colors or custom utility frameworks. Use approved CSS variables in `global.css`.
3. **Pages CMS Sync**: Any schema change in `src/content/config.ts` must be reflected in `.pages.yml`.
4. **Localization Parity**: Maintain folder/file parity between English pages (`src/pages/*`) and Japanese pages (`src/pages/ja/*`).
5. **Git Workflow & Branching**: Never commit directly to `main` for AI coding work. Always branch from the latest `origin/main` and use Pull Requests, following the instructions in `docs/ai/tasks.md`.

## Required Reading by Task Type
Depending on the task type, you must read the corresponding instructions before proceeding:
- **Architecture or refactor tasks**: Read `docs/ai/architecture.md`
- **Styling or component tasks**: Read `docs/ai/coding-rules.md`
- **Text, media, sponsor, member, or project content tasks**: Read `docs/ai/content-rules.md`
- **Bug fix, release, deploy, or checklist tasks**: Read `docs/ai/tasks.md`

## Detailed Instructions
- [Architecture & Flow Guide](docs/ai/architecture.md)
- [Coding & Styling Rules](docs/ai/coding-rules.md)
- [Content & Tone Guidelines](docs/ai/content-rules.md)
- [Tasks & Checklists](docs/ai/tasks.md)

## Task Completion Done Criteria
- [ ] Code builds successfully with `npm run build` without warnings or errors.
- [ ] TypeScript checks pass (no type mismatches).
- [ ] Pages CMS schema compatibility is checked and verified in `.pages.yml`.
- [ ] Dynamic data fetches fall back gracefully if content is missing.
- [ ] No regression in mobile responsiveness and localization (EN/JA links function).
