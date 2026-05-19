# PopMed

PopMed is a tool for researchers who want to stay up to date with AI in healthcare scholarly articles. Swipe left to read, right to skip, up to queue for later. Save PubMed articles to your library with notes. Filter by topic and add custom keywords. Available as a Chrome extension, no login, no API key.

---

## Screenshots

> <img width="379" height="596" alt="Screenshot 2026-05-19 at 4 10 15 PM" src="https://github.com/user-attachments/assets/55ac8c87-0d8f-4ef3-a73f-f4e5b771c6ee" /> <img width="380" height="582" alt="Screenshot 2026-05-19 at 4 10 29 PM" src="https://github.com/user-attachments/assets/67fc98c1-3d8f-42c8-b0c0-c1a88719a398" /> 
<img width="380" height="552" alt="Screenshot 2026-05-19 at 4 10 38 PM" src="https://github.com/user-attachments/assets/f3307ec3-919d-4d6f-8dfb-8ef9afcf3cb2" /> 
<img width="379" height="579" alt="Screenshot 2026-05-19 at 4 12 13 PM" src="https://github.com/user-attachments/assets/9678315e-01c5-4d31-b4cc-bea3e3e233c3" /> <img width="360" height="558" alt="Screenshot 2026-05-19 at 4 13 13 PM" src="https://github.com/user-attachments/assets/0120562f-4e98-45d8-ab2d-a33f13fab729" />


---

## Features

- **Live PubMed feed** — pulls real peer-reviewed papers every session via NCBI's free public API. No API key needed, ever.
- **Swipeable cards** — left to open the article, right to skip, up to save to your reading queue
- **Reading queue** — save articles mid-session and come back to them at the end
- **Personal library** — save any article with a written note, edit notes anytime, remove when done
- **Topic filters** — AI + Health, Clinical NLP, Imaging AI
- **Custom keywords** — add up to 8 terms (e.g. `atrial fibrillation`, `OMOP`, `RAG`) to narrow your PubMed search
- **Session length** — choose 5 (Quick), 10 (Standard), or 15+ (Deep dive) articles per session
- **Randomised feeds** — each session pulls a fresh shuffled set so you never see the same papers twice
- **iPhone widget** — Scriptable home screen widget showing today's top 3 papers
- **Web app** — full browser version, works on desktop and iPhone Safari, installable as a home screen app

---

## Installation

### Chrome Extension

1. Download and unzip the latest release
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** ON (top right corner)
4. Click **Load unpacked** and select the unzipped folder
5. Pin the extension to your toolbar and click to open

> No account, no API key, no sign-up required.

### Share with colleagues

Send them the zip file. Same four steps above — installs in under a minute.

### Web App (browser / iPhone)

1. Push this repo to GitHub (see Hosting section below)
2. Enable GitHub Pages
3. Open `https://yourusername.github.io/popmed/web-app.html` in any browser
4. On iPhone: open in **Safari** → tap **Share** → **Add to Home Screen** — it installs like a native app

### iPhone Widget

1. Download **Scriptable** (free) from the App Store
2. Open Scriptable → tap **+** → paste the contents of `iphone-widget.js`
3. Tap **Run** to preview
4. Long-press your home screen → **+** → search **Scriptable** → choose Medium widget → configure → select the script


---

## How It Works

### Data source
All papers are fetched live from [PubMed](https://pubmed.ncbi.nlm.nih.gov/) via NCBI's free eUtils API — the same database used by researchers worldwide. Every session runs two API calls: one to search for matching paper IDs, one to fetch their metadata (title, authors, journal, date).

### Randomisation
Each session fetches up to 5× your chosen article count from a random offset in the results, then shuffles and picks from that pool — so the same query returns different papers every time.

### Storage
- **Chrome extension** — library and notes saved to `chrome.storage.local` (persists across sessions, private to your browser)
- **Web app** — library and notes saved to `localStorage` (persists in your browser, no server involved)

---

## Built With

- Vanilla JavaScript — no frameworks, no dependencies
- PubMed eUtils API (free, no key)
- Chrome Extensions Manifest v3
- Scriptable (iPhone widget)

---

## Topics

`pubmed` `healthcare-ai` `research-tools` `chrome-extension` `clinical-nlp` `swipe-ui` `literature-review` `health-informatics`

---

## Author

Built by [Afra Shamnath](https://github.com/afrashamnath) · Research Coordinator, Columbia University School of Nursing · Incoming PhD Candidate, NYU Langone Health

---

## License

MIT — free to use, share, and modify.
