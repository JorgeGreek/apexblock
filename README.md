# Apex Block — apexblock.tech (main site)

Production design for apexblock.tech: deep-void background, holographic
cyan → violet → magenta palette, animated decentralized mesh (canvas), orbital
hero visual, bento services grid with 3D tilt + spotlight cards, rotating
headline, scroll-driven reveals. Static site, no build step.

Compared with `~/Desktop/apexblock-native-v1` (the earlier mobile-native version, kept for reference), this one presents the
full blockchain service catalogue (contracts & audits, DeFi, native mobile,
wallets & custody, tokenization/RWA, infrastructure, ZK/L2, advisory) with
"Decentralized Protocol Engineering" as the flagship specialty.

## Deploy (GitHub Pages)

The site is served by GitHub Pages from the `main` branch of
`github.com/JorgeGreek/apexblock` (root folder, `CNAME` = apexblock.tech).
Every push to `main` republishes within a minute:

```bash
git add -A && git commit -m "Update site" && git push
```

DNS lives in Papaki: four `A` records on `apexblock.tech` to GitHub Pages
(185.199.108-111.153) and `www` as a CNAME to `jorgegreek.github.io`.
The `docs/` folder (internal PDFs and plans) is git-ignored and never published.

## Local preview

```bash
python3 -m http.server 8934 --directory /Users/jorge/AndroidStudioProjects/ApexBlock/web
```

## Languages (EN / ES / EL)

`index.html` is written in English. `i18n.js` holds the Spanish and Greek
dictionaries and swaps every element marked with `data-i18n="key"` (inner HTML)
or `data-i18n-attr="attr:key"` (attributes). The choice is stored in
`localStorage` (`apx-lang`), `<html lang>` follows it, and the `apx:langchange`
event tells script.js (rotating headline words) and the accessibility widget.
To add or fix a translation, edit the `ES` / `EL` objects in `i18n.js`; to make
a new element translatable, add a `data-i18n` key to it and the two entries.

## Lead form

Same contract as the main version: paste the endpoint URL into `LEADS_ENDPOINT`
in `script.js`. Until then the form opens the visitor's mail client pre-filled.
POST body: `name, email, company, service, service_label, chain, chain_label,
budget, budget_label, message, website_hp (honeypot), page`.

## Motion

All heavy effects (mesh canvas, auroras, custom cursor, tilt) are disabled
automatically under `prefers-reduced-motion` and the accessibility widget's
"Stop animations" option; the custom cursor is desktop-only.
