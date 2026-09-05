# Construction Simulator (Browser)

This repository contains a browser-playable construction / city-simulation prototype.

Features:
- Citizens, companies, construction sites, jobs, hiring, salaries
- Tile-based map (simple grid), visual rendering on canvas
- Material and funds, site progress, events
- Save/load using localStorage

How to run:
- Recommended: run a local static server (serves files over http):
  - Python 3: `python3 -m http.server 8000`
  - Then open http://localhost:8000 in your browser.
- Alternatively: open `index.html` directly, but some browsers block certain features when opened as `file://`.

Repository structure:
- index.html
- css/style.css
- js/main.js
- assets/ (icons)

License: MIT
