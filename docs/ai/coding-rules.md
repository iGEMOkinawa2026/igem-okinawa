# Coding & Styling Rules

To maintain codebase health, consistency, and compatibility with **Pages CMS**, all automated modifications must adhere to the following rules.

---

## Component Rules

- **Astro Components**: Code logic (TypeScript) goes into the Astro frontmatter (between `---`), and visual markup goes below.
- **Component Scope**: Scoped CSS within `<style>` block inside `.astro` files is preferred over writing global selectors.
- **Localization Handling**:
  - Check for Japanese version using the page path or `ja` flag.
  - Dynamically fallback to English if Japanese content is missing (e.g., `{member.data.name_ja || member.data.name}`).

---

## Styling & Theme Rules

- **Vanilla CSS**: Do not introduce utility frameworks like TailwindCSS unless requested. Use native CSS.
- **Design Tokens**: You MUST use the design tokens defined in `src/styles/global.css`.
  
### Approved Palette Variables
- `--color-primary`: `#3FD1C7` (Turquoise / Main Brand Color)
- `--color-primary-light`: `#5CCFE6` (Light Cyan / Secondary Color)
- `--color-secondary`: `#6A9BD6` (Blue / Sub2 Color)
- `--color-accent`: `#B8F13A` (Lime Green / Accent)
- `--color-highlight`: `#F58A3C` (Orange / Highlight)

---

## Naming Conventions

- **Astro Files / Layouts**: PascalCase (e.g., `MemberCard.astro`, `BaseLayout.astro`).
- **CSS Class Names**: kebab-case (e.g., `btn-primary`, `member-grid`).
- **Variables & Functions**: camelCase (e.g., `getSettings()`, `currentYear`).
- **Content schemas & YAML keys**: snake_case (e.g., `is_leader`, `wiki_url`, `name_ja`).

---

## Responsive Design Rules

- **Mobile First**: Design components to fit mobile screens by default.
- **Breakpoints**: Use standard media queries aligned with `global.css`:
  - Tablet/Desktop: `@media (min-width: 768px)`
  - Large Desktop: `@media (min-width: 1280px)`
- **Flexibility**: Never use fixed widths (e.g., `width: 500px`) for major layout blocks. Use relative percentages, `clamp()`, `max-width: 100%`, or flexbox/grid.

---

## Guardrails (Do Not Change Without Approval)

> [!CAUTION]
> **Prohibited Actions**
> - Do not change the core color hex codes in `global.css` as it breaks the brand identity.
> - Do not alter `.pages.yml` fields without changing `src/content/config.ts` simultaneously.
> - Do not hardcode content into Astro pages. All content must go through `src/content/` or `src/data/settings.yaml`.
