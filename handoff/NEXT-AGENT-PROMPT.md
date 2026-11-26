# Prompt for the next agent: land the khora fold work in the scores-patch-points repos

Written 2026-11-26. Paste everything under the line into a NEW session that has the `scores-patch-points` repos selected (this session could not write to them). It is self-contained; the facts below were rehearsed on a scratch clone.

---

You are continuing work whose full record is in `clovenbradshaw-ctrl/eodb` on `main`: read `handoff/HANDOFF.md` (start with the section "The reading is stored in the pharos" and the Log, newest first) and use `handoff/khora-fold-iterate.patch`. Read each repo's `CLAUDE.md` before you touch it, and follow it. Standing rules: do not push to `main`, merge, or change user-level configuration without the owner's explicit yes; commit only paths you can name; keys and secrets stay out of the log, replies and commits; every number you quote carries its split and what was NOT measured; a negative result is a finding, record it with its falsifier; language is read by the reader, never by a pattern (the text-regex ratchet may not grow); repos never import each other, only the pharos by cell and kind.

## What this is
A khora branch of 20 commits on top of scores `chat-engine` (`f024a55`): the reading standard (round trip R1 to R6, layer rules L1 to L10), codec choice by surprise (`the-fold/codec-fold.mjs`), the quote table as part of a codec (`codecQuotes`, `inferQuoteTable`), the frames layer, the whole reading written into a pharos (`the-fold/pharos-framed.mjs`: text-codec, text-layers, text-quotes, text-frames, text-gap) and read back by cell and kind with causal order (`the-fold/pharos-verdicts.mjs`). Scores `main` was `d7b6410` when this was written and merges with it without conflicts.

## Phase A: land it (do this first, and only this, unless told otherwise)
1. Attach `scores-patch-points/khora` with push access. Clone it BESIDE its sibling repos (`pharos`, `janus`, `Zenodotus`, `penelope`, in one parent directory): the tests find priors by that layout, and a clone in `/tmp` fails 4 more tests for that reason alone.
2. `git fetch`. Check `origin/chat-engine` is `f024a55` and `origin/main` is `d7b6410`; if either moved, say so and merge the newer one in.
3. `git checkout -b fold-iterate origin/chat-engine`, then `git am <path to khora-fold-iterate.patch>` (expect 20 commits), then `git merge origin/main` (expect no conflicts).
4. Verify with `PHAROS_HOME=<pharos checkout> ACT_PRIOR=<Zenodotus>/derived-priors/act-priors/act-prior-en.json` from `native/`: `node --test adapters/text/*.test.mjs adapters/text/*.test.js the-fold/*.test.mjs tests/read-framed.test.mjs tests/reading-standard.test.mjs`. Rehearsed result: 1003 tests, 943 pass, 12 fail, 16 skipped, 32 todo. The 12 failures are PRE-EXISTING on scores `main` alone (exemplar pool x4, kernelCell x2, smellStatus, KarakaSniffer Sanskrit, grc register, same-for-text, material-doorway, notation-codec); none is from this branch and none is fixed by it. `node ../pharos/text-regex-ratchet.mjs` from `native/` must say `101 carried, 0 NEW`. If your numbers differ, find out why before pushing and report it.
5. Push the BRANCH `fold-iterate` only (not `main`, not `chat-engine`). Open a DRAFT pull request with base `chat-engine`, whose description says what the branch is, the verification above, and what was not measured (below). Do not merge it.

## Phase B: only if the owner says so, each on its own branch and draft PR, each repo under its own CLAUDE.md
- JANUS: carry the quote table in the codec file (`UDGrammar@1`: `quotes: { pairs, toggle, end, dash }`) so `text-codec.quotes` has a source other than khora's default; write the EOT of a text by reading `text`, `text-codec` and `text-reading` BY KIND (a kind and cell for it are not declared: propose one, SYN or INS at Pattern, Janus's call); turn `handoff/janus-roundtrip-baseline.mjs` (in the cloven eodb) into janus tests for R4 and R5 (baseline: surface identical to the original 16% of 25 English sentences; EOT fixed point 24%).
- PENELOPE: declare and write `frame-verdict` and `quote-verdict` at an Interpretation cell (DEF, EVA or REC) over khora's `text-frames` and `text-quotes` nominations; the kinds, addresses (`frames:<sha16>#<index>`) and body shapes are in the contract section of `HANDOFF.md` and are PROPOSALS. Khora reads them back already (`readVerdicts`, 8 tests).
- CLOVEN MIRRORS: if the owner has created `clovenbradshaw-ctrl/khora` (it did not exist), push `main` (a copy of scores `main`), `chat-engine` and `fold-iterate` there so the branch can be flipped to scores without a rewrite. Do not create repositories yourself.

## Known, unfixed, recorded (do not "fix" them silently)
- The codec fold picks `pcm` (Nigerian Pidgin) for English novel prose. Two causes measured: known words are priced by table size, and the table size is the treebank's; and on a short passage pcm covers more words. A language-independent price fixes one passage and loses Tagalog on Genesis (92 of 97 against 93), so it was NOT adopted. A todo test carries the falsifier.
- Traditional Chinese is picked as Japanese at p = 1.00 (unspaced scripts have no calibrated open-world term).
- `shapeAt` in `adapters/text/quote-frames.js` reads whitespace and punctuation character classes around quotation marks: script-level, not words, and the ratchet cannot see it; flagged for the owner.
- NOT MEASURED: the quote layer with an inferred table against gold labels; Genesis editions are mostly one translator-style per language, 33 of the 78 held-grammar languages have any eBible file, and the eBible texts must never be committed (licences).
- Pharos: two entries written in the same millisecond have no defined order under `current` (timestamp); khora avoids it by using causal heads. A pharos question, not fixed here.
- The cloven eodb is caught up to scores `eodb@7ca2169` except `.github/workflows/deploy.yml`, which is held back on purpose (it deploys a Cloudflare worker with a secret on a push to `main`). Do not add it without the owner's explicit yes.

## Report back
Say which commit of each repo you read, what you pushed and where (branch, PR number), the test numbers with their split, and everything you did not do or could not measure.
