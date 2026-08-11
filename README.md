# Rahul Dubey — Backend Developer Portfolio

A single-page developer portfolio styled like a code editor / terminal (file
explorer sidebar, tab bar, gutter line-rules, JSON-style skills block,
git-log-style experience timeline). All content is loaded at runtime from
**`data.json`** — no HTML editing needed to update your resume info.

## Files

```
index.html   — page structure only (no hardcoded content)
style.css    — IDE/terminal theme
script.js    — fetches data.json and renders every section
data.json    — ALL resume content lives here
```

## Editing your content

Open `data.json` and edit the fields — `profile`, `summary`, `skills`,
`experience`, `projects`, `education`, `certifications`. The page re-renders
automatically from whatever is in this file. No need to touch HTML/CSS/JS
for routine resume updates.

## Running locally

Because the page uses `fetch('data.json')`, opening `index.html` directly
via `file://` will fail in some browsers (CORS on local fetch). Serve it
with any static server, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying to GitHub Pages

1. Create a new GitHub repo, e.g. `rahul-portfolio` (or use
   `<your-username>.github.io` for a root domain site).
2. Push these four files (`index.html`, `style.css`, `script.js`,
   `data.json`) to the repo root (`main` branch).
3. In the repo: **Settings → Pages → Build and deployment → Source** → select
   **Deploy from a branch** → Branch: `main`, folder: `/ (root)` → Save.
4. Your site will be live at:
   `https://<your-username>.github.io/rahul-portfolio/`
   (or `https://<your-username>.github.io/` if you used the special repo
   name above).
5. Add that link to your resume / LinkedIn / GitHub profile.

## Notes

- No build step, no dependencies — pure HTML/CSS/JS, works on GitHub Pages
  as-is.
- Fully responsive: sidebar collapses into a slide-in drawer under 860px.
- Respects `prefers-reduced-motion`.
