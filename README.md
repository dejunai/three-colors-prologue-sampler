# Three Colors of Madness — Prologue Sampler

A polished browser **civic reel** for the game prologue: Widow's Bight presents its own official history the way the town would — bare facts, no confession.

Silent-film / 1920s municipal booster aesthetic (HPLHS-adjacent): intertitle cards, illustrated period stills, iris, film grain, and optional flicker.

## Run (port 8000)

From this directory:

```bash
cd /workspace/three-colors-prologue-sampler
python3 -m http.server 8000
```

Then open **http://localhost:8000/** in a browser.

Desktop-first (~1280×800). Zero runtime dependencies beyond the static files (Google Fonts load for period typography when online).

## Controls

| Input | Action |
|--------|--------|
| Click reel / Space / → | Next |
| ← | Previous |
| Progress dots | Jump |
| **Restart** | Iris back to title |
| **Motion / Still** | Toggle film flicker & grain animation (`prefers-reduced-motion` starts Still) |

Audio is omitted (silent reel).

## Contents

**11 beats** (6 intertitles + 4 illustrated panels + 1 blackout):

1. Title — *A Brief History of Widow's Bight* (Municipal Board, 1923)
2. Panel — Harbor silhouette
3. Intertitle — Whaling fleet disappearance (~1820s)
4. Panel — Empty berths
5. Intertitle — Contradictory survivor accounts
6. Panel — Municipal ledgers
7. Intertitle — Insurance settlements & ruling households
8. Panel — Residences of standing
9. Intertitle — Same-season tidal surge (civic, vague)
10. Closing — *Widow's Bight, 1923*
11. Blackout — Chapter One readiness

Files: `index.html`, `styles.css`, `app.js`, `README.md`.
