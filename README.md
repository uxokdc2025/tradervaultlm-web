# seamless.ai — homepage

> ai without the noise.

An interactive, conversational homepage for Seamless.ai. The hero plays a
scripted "conversation" of animated beats, offers reply pills that branch into
responses, slides in capability/about content panels, reveals a gradient card
rail, and opens a full case-study overlay. Light/dark themes, plus tablet and
mobile pager layouts, are all supported.

Implemented from the Claude Design handoff bundle (`seamless-homepage.html`) as
a Vite + React app. All visual styling (design tokens + component CSS) is kept
verbatim from the prototype for pixel fidelity.

## Tech

- **React 18** — component logic / the conversation state machine
- **Vite 5** — dev server and build
- Design-system CSS tokens (`src/styles/colors.css`, `typography.css`) +
  the homepage stylesheet (`src/styles/app.css`)
- Fonts: Outfit + Lexend Deca (Google Fonts) and Calluna (Adobe Typekit),
  loaded via `<link>` tags in `index.html`

## Run locally

```bash
npm install
npm run dev
```

Then open the printed URL (defaults to http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
index.html               # entry document + font links
src/
  main.jsx               # React root + global CSS imports
  App.jsx                # App state machine (beats, pills, panels, themes)
  components.jsx         # data + presentational components
  CaseStudyOverlay.jsx   # full case-study document overlay
  styles/
    colors.css           # brand color tokens (+ dark mode)
    typography.css       # type scale + font tokens
    app.css              # homepage layout / animation styles
public/
  uploads/noise-bg.jpg   # light-mode background texture
  assets/cs-hero.png     # case-study hero image
```
