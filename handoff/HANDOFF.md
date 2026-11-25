# Handoff: the Fold iteration (branch `ccr-fed9252c-jlvpq1`)

Written 2026-11-25. A new session reads this file, then continues. Update the "State" and "Log" sections and commit on this branch as work goes on.

## Why this branch carries khora's work
The cloud session can read `scores-patch-points/*` but cannot push there (push to `scores-patch-points/khora` was refused: "you need push access"). `clovenbradshaw-ctrl/khora` and `penelope` exist but were not writable either. So khora's commits are carried here as a patch, `handoff/khora-fold-iterate.patch`, to be applied to khora later and promoted into the nexus. This is a carrier only: EODB imports nothing from khora (AGENTS.md rule 1).

## State
- **eodb**: `fold-write-model.md` is merged (PR #1). Facade tests: 109, with 4 failing on the plain store and 2 on the lazy store against current pharos `main` (`P.migrate is not a function` in tests 22, 102, 107; "a binary pharos is detected as plain" in test 18). Not fixed.
- **khora patch** (`handoff/khora-fold-iterate.patch`, 5 commits, `git format-patch`), based on `scores-patch-points/khora` `chat-engine` f024a55:
  1. `exemplar-pool`: PR #114's fix (already on khora `main`; `chat-engine` lacks it)
  2. `formicary`: the user-bound pattern layer (khora branch `formicary` e000ad1; not in `chat-engine`)
  3. `trail-rules`: `native/kernel/trail-rules.js` and its test: M4 promotion past a seeded null on a held-out third, `ruleEntry`, `META_RULES`. 10 tests pass, 0 of 600 chance-label route-tests promoted. Power on synthetic labels: about 60 to 120 deposits for a 0.9 v 0.1 gap, 240 for 0.8 v 0.3, none for 0.6 v 0.5. The kernel keeps 128 deposits per head.
  4. `chat/ingest.mjs` + `ingest.test.mjs`: the document door. A text is read into the fold paragraph by paragraph through `say()`, never routed through `turn()` (which sent paragraphs with a quoted question to answering: 3 of 8 read in the test text, 9 of the first 14 of pg1342 ch. I; `say()` reads 27 of 27). 6 tests with a control that fails if `turn()` is fixed. Against the canonical read on 88 lines of pg1342 ch. I: 13 of 14 cast names (misses George Allen, from a bracketed caption it sets aside; adds "Mr." as a separate name), 43 v 45 sentences, 66 of 71 canonical VERB clauses (93%). Not matched: `acknowledge`, `consider` (an imperative inside dialogue is set aside as a request), `delight`, `ought`. Not wired into `server.mjs`; it does not bind I/you inside a quotation to the quoted speaker (the canonical read does, `adapters/text/speakers.js`).
  5. `chat/quote-frames.js` + `quote-frames.test.mjs` + `ingest.mjs` frames: a quotation is a frame (words held by someone, not the narrator's assertion). Boundaries come from per-language declared tables (a language with none is a typed gap, never English); a continuing or continued quotation is typed, not an error; a leading-dash dialogue paragraph is flagged `dash_dialogue_not_read` and its facts are framed `null` (unknown), never narration; the holder is the name in the tag outside the quotation (a name inside it is the addressee), else anonymous; `askFramed` prefixes "According to X:". Falsified on real text: old `quotesOf` found 0 quotations in ru/fr/zh/ja; held-out pg1342 ch. II: 27 of the 27 scorable hand-labelled verbs correct, 0 false framings, 0 wrong holders (2 of 29 gold verbs had no chat frame, so unscored). KNOWN MISSES, not fixed: dash dialogue is flagged, not read (43% of the ru and 58% of the fr War and Peace lines); a second quotation by the same speaker gets holder null (pg1342 ch. II p9 "When is your next ball to be, Lizzy?" is Kitty's); reported speech inside a quotation ("Mrs. Long says that...") is a second frame, not read; a speaker named only by a pronoun is anonymous; the chat's own parse takes a vocative name inside the quotation as the subject of the speech verb and the quotation as agent (not fixed; the holder does not depend on it). Chat suite with all five commits: 130 tests, 90 pass, 2 fail (27 and the persona test, both pre-existing), 38 skipped.
- **khora chat tests** (`node --test native/chat/*.test.mjs`, with the patch applied): 106 tests, 66 pass, 2 fail (27, 86; undiagnosed), 38 neither passed nor failed (not looked at).
- **Not in any remote, only on the owner's Mac** (`~/Downloads/workspace/khora-chat`, `~/Documents/janus/priors`): `outcomes.mjs`, `outcomes.test.mjs`, `discourse.test.mjs`, the ants M1 to M6 panel section, the "interrogative word anywhere" mark, the Ýlir-One door. Ask the owner to attach the folder; do not rewrite it.
- **Not run**: the full khora suite; any system's real behaviour.

## Apply the patch
```
git clone https://github.com/scores-patch-points/khora && cd khora
git checkout -b fold-iterate f024a55        # chat-engine at the time of the patch
git am /path/to/handoff/khora-fold-iterate.patch
node --test native/kernel/trail-rules.test.mjs native/organs/formicary.test.mjs native/organs/trail-store.test.mjs
```
If `git am` reports conflicts because `chat-engine` moved, `git am --abort`, then apply onto `f024a55`.

## Open decisions (owner's)
1. `holon.json` for khora and janus (all four lists empty) and a new one for penelope.
2. Where per-user trails go: their own pharos, sealed, or aggregates only.
3. Whether trail promotion registers against pharos `lib/sig.mjs` or stays a pure kernel module.
4. Which account is canonical for khora and penelope (`scores-patch-points`: 144 and 24 branches; `clovenbradshaw-ctrl`: 1 and 7; contents not compared).
5. The cell for a promotion entry (`EVA·Pattern` is a proposal).
6. Push access to `scores-patch-points`, or an iteration repo to push khora's branch to.

## Order of work
1. Run the khora chat tests with the patch applied and diagnose tests 27 and 86.
2. Rewrite two parser defects with a failing test first: "I want to know who X is" is stored as a fact ("who" tagged a relative pronoun), and a bare "howard shore" gets "I'm not sure what you mean".
3. Wire `ruleEntry` to a pharos weave through `pharosMarkWriter`, behind the typed-gap rule.
4. Add a lint comparing the kinds each repo weaves with its `holon.json` `pattern` list.
5. Fix the EODB facade drift against pharos `main` (`P.migrate`, binary-core detection) so 109 pass again.

## Rules in force
Repos never call each other; the log is the database and everything derived is a cache; retract by weaving; no push, merge or user-level config change without the owner's yes; keys and secrets stay out of the log, replies and commits; say what was not measured.

## Prompt for a new session
> Continue the Fold project. Read `AGENTS.md`, `fold-write-model.md` and `handoff/HANDOFF.md` in clovenbradshaw-ctrl/eodb, branch `ccr-fed9252c-jlvpq1`. Clone the nexus read-only from scores-patch-points (pharos, khora, janus, penelope, the map repo). Apply `handoff/khora-fold-iterate.patch` to khora per the HANDOFF, then follow "Order of work". Update the State and Log sections here and commit on this branch as you go. Ask me to attach `~/Downloads/workspace/khora-chat` from my Mac before touching anything it holds.

## Log
- 2026-11-25 (later still): quote frames (khora commit after 16b778d); patch refreshed to 5 commits. Open: reported speech as a second frame; dash dialogue; speaker continuation; wire `ingestDocument`/`askFramed` into `server.mjs`/the thread.
- 2026-11-25 (later): document door added (khora commit 16b778d); patch refreshed to 4 commits. Open: wire it into `server.mjs`/the thread; read a quoted imperative as speech, not a request (needs a `say()` option in `thread.mjs`, which has uncommitted edits on the owner's Mac); bind I/you in quotes to the speaker.
- 2026-11-25: branch restarted from `main` after PR #1 merged; handoff added.
