// PopMed — iPhone Widget
// Paste this into Scriptable (free App Store app)
// Tap Run to test, then add as home screen widget

// ── CONFIG ──────────────────────────────────────────
const TOPIC = "artificial intelligence clinical decision support"; // change anytime
const CUSTOM_KEYWORDS = []; // e.g. ["atrial fibrillation", "NLP"]
const ARTICLES_TO_SHOW = 3; // 3 fits medium widget best

// ── COLORS ──────────────────────────────────────────
const C = {
  bg:     new Color("#000957"),
  card1:  new Color("#476EAE"),
  card2:  new Color("#48B3AF"),
  card3:  new Color("#A7E399"),
  accent: new Color("#F6FF99"),
  white:  new Color("#ffffff"),
  dim:    new Color("#ffffff", 0.45),
  dimmer: new Color("#ffffff", 0.28),
};

// ── FETCH PUBMED ─────────────────────────────────────
async function fetchArticles() {
  try {
    const kwExtra = CUSTOM_KEYWORDS.length
      ? " AND (" + CUSTOM_KEYWORDS.join(" OR ") + ")"
      : "";
    const q = TOPIC + kwExtra;
    const retstart = Math.floor(Math.random() * 30);
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
      + "?db=pubmed&term=" + encodeURIComponent(q)
      + "&retmax=20&retstart=" + retstart + "&sort=date&retmode=json";

    const req1 = new Request(url);
    const data1 = await req1.loadJSON();
    const ids = data1.esearchresult?.idlist || [];
    if (!ids.length) return getFallback();

    const shuffled = ids.sort(() => Math.random() - 0.5).slice(0, ARTICLES_TO_SHOW);
    const url2 = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
      + "?db=pubmed&id=" + shuffled.join(",") + "&retmode=json";
    const req2 = new Request(url2);
    const data2 = await req2.loadJSON();
    const result = data2.result || {};

    return shuffled.map(id => {
      const a = result[id];
      if (!a) return null;
      const authors = (a.authors || []).slice(0, 1).map(x => x.name).join("")
        + ((a.authors || []).length > 1 ? " et al." : "");
      return {
        title: (a.title || "").replace(/\.$/, "").replace(/<[^>]+>/g, ""),
        authors,
        journal: a.source || "PubMed",
        time: (a.pubdate || "").split(" ").slice(0, 2).join(" "),
        url: "https://pubmed.ncbi.nlm.nih.gov/" + id + "/",
      };
    }).filter(Boolean);
  } catch (e) {
    return getFallback();
  }
}

function getFallback() {
  return [
    {title:"Zero-shot NLP outperforms few-shot in AF cohort extraction",authors:"Turchioe MR et al.",journal:"npj Digital Med",time:"2024 Dec",url:"https://pubmed.ncbi.nlm.nih.gov/39614089/"},
    {title:"LLMs for clinical decision support: systematic review",authors:"Johnson KW et al.",journal:"JAMIA",time:"2024 Nov",url:"https://pubmed.ncbi.nlm.nih.gov/"},
    {title:"Deep learning for radiology report generation",authors:"Dalla Serra F et al.",journal:"Medical Image Analysis",time:"2024 Oct",url:"https://pubmed.ncbi.nlm.nih.gov/"},
  ];
}

// ── BUILD WIDGET ──────────────────────────────────────
const articles = await fetchArticles();
const CARD_COLORS = [C.card1, C.card2, C.card3];

const widget = new ListWidget();
widget.backgroundColor = C.bg;
widget.setPadding(14, 16, 14, 16);
widget.url = "https://pubmed.ncbi.nlm.nih.gov/";

// Header
const hdr = widget.addStack();
hdr.layoutHorizontally();
hdr.centerAlignContent();

const dot = hdr.addText("● ");
dot.textColor = C.accent;
dot.font = Font.boldSystemFont(9);

const title = hdr.addText("POPMED");
title.textColor = C.dim;
title.font = Font.boldSystemFont(10);

hdr.addSpacer();

const updated = hdr.addText(new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}));
updated.textColor = C.dimmer;
updated.font = Font.systemFont(9);

widget.addSpacer(10);

// Articles
for (let i = 0; i < Math.min(articles.length, ARTICLES_TO_SHOW); i++) {
  const a = articles[i];
  const cardColor = CARD_COLORS[i % CARD_COLORS.length];

  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  row.url = a.url;
  row.cornerRadius = 10;
  row.backgroundColor = new Color(cardColor.hex, 0.18);
  row.setPadding(8, 10, 8, 10);

  const numText = row.addText(String(i + 1).padStart(2, "0") + " ");
  numText.textColor = cardColor;
  numText.font = Font.boldSystemFont(11);

  const col = row.addStack();
  col.layoutVertically();

  const titleEl = col.addText(a.title.length > 72 ? a.title.slice(0, 71) + "…" : a.title);
  titleEl.textColor = C.white;
  titleEl.font = Font.semiboldSystemFont(11);
  titleEl.lineLimit = 2;

  col.addSpacer(3);

  const metaRow = col.addStack();
  metaRow.layoutHorizontally();
  const srcEl = metaRow.addText(a.journal.toUpperCase());
  srcEl.textColor = cardColor;
  srcEl.font = Font.boldSystemFont(8);
  metaRow.addText("  ·  ").textColor = C.dimmer, Font.systemFont(8);
  const timeEl = metaRow.addText(a.time);
  timeEl.textColor = C.dimmer;
  timeEl.font = Font.systemFont(8);

  if (i < articles.length - 1) {
    widget.addSpacer(6);
  }
}

widget.addSpacer();

const footer = widget.addText("Tap to explore on PubMed · Updates every hour");
footer.textColor = C.dimmer;
footer.font = Font.systemFont(8);
footer.textOpacity = 0.6;

// Present
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
