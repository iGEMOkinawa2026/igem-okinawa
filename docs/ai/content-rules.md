# Content & Writing Rules

This document governs text, localization, and media assets added to the website to ensure brand alignment and information accuracy.

---

## Placeholder Content Policy

- **No Dummy Text**: Never commit generic placeholder text (e.g., "Lorem Ipsum", "text here") to the main repository.
- **Missing Content Fallbacks**: If copy is unavailable, use `[TODO: Insert Description]` or draft a context-appropriate description with a TODO comment.
- **Image Fallbacks**: When an image is missing, the code should fallback to CSS placeholder wrappers (e.g., `.card-img-placeholder` or `.hero-image-placeholder`) instead of breaking the layout.

---

## AI-Generated Content Policy

- **Fact Verification**: AI can be used to draft project descriptions and activity summaries, but **all facts, scientific claims, and historical dates must be verified**.
- **No Hallucinated Data**: Never generate fake team members, sponsor companies, or fake academic achievements.

---

## Team, Sponsor, and Project Accuracy

- **Sponsor Tiers**: Match sponsor tier definitions exactly as defined: `gold`, `silver`, `bronze`, `partner`. Check files under `src/content/sponsors/`.
- **Member Details**: Ensure names (EN & JA), institutions, and roles match registration records.
- **Project Alignment**: Ensure project summaries reflect actual research goals submitted to iGEM HQ.

---

## Writing Style & Tone

- **English**: Academic yet inspiring and accessible. Avoid overly casual slang. Use American English spelling (e.g., *color*, *organization*).
- **Japanese**: Standard polite form (敬体: です・ます調). Keep sentences clear, clean, and optimized for scientific communication.

---

## Design Contributor Credits

- If assets, illustrations, or graphics are designed by team members or external contributors, include credit attributes under `/about` or within the footer.
- Respect open-source asset licenses if using icons (e.g. Lucide, FontAwesome) or stock photos.
