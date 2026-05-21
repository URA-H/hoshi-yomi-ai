# Fortune AI — Project Docs

This folder is the canonical reference for product decisions, design rules,
and safety constraints. It is a snapshot from the virtual organisation at
`../.company/` taken on 2026-05-21.

## Map

| File | Source dept | Purpose |
|------|-------------|---------|
| `design-system.md` | creative | Tokens, components, decoration recipes, WCAG audit |
| `copy-guide.md` | note-writer | LP / in-product copy, vocabulary, what to avoid |
| `ai-safety-spec.md` | secretary | Three-tier output validation, system prompt |
| `terms-draft.md` | secretary | Terms of service / disclaimer draft (NOT legal advice) |
| `philosophy-review.md` | philosopher | Ethics review and constraints |
| `history-review.md` | historian | Competitive history and divination market |
| `regulations.md` | historian | Japanese regulations (景表法 / 霊感商法救済新法 / 特商法) |

## How code maps to docs

| Code path | Spec |
|-----------|------|
| `src/app/globals.css` | design-system §1, §2 (tokens + decorations) |
| `src/components/*` | design-system §4 (core components) |
| `src/lib/motion.ts` | design-system §5 (静の motion principles) |
| `src/lib/ai/forbidden-terms.ts` | ai-safety-spec §1 (3-tier lexicon) |
| `src/lib/ai/validate-output.ts` | ai-safety-spec §4 (validation pipeline) |
| `src/lib/ai/system-prompts.ts` | ai-safety-spec §2 (Claude system prompt) |
| `src/lib/ai/generate-with-guardrails.ts` | ai-safety-spec §4.2 (regeneration loop) |
| `src/app/legal/*` | terms-draft, disclaimer / privacy stubs |

## Updating the spec

The docs are mirrored from the virtual org. When you change something here,
also update the matching file under `../.company/`, or those notes will drift.
The reverse direction is also fine — edit `.company/`, then re-copy on a stable
boundary.
