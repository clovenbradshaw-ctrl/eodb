# Handoff: the Fold iteration (branch `ccr-fed9252c-jlvpq1`)

Written 2026-11-25. A new session reads this file, then continues. Update the "State" and "Log" sections and commit on this branch as work goes on.

## Why this branch carries khora's work
The cloud session can read `scores-patch-points/*` but cannot push there (push to `scores-patch-points/khora` was refused: "you need push access"). `clovenbradshaw-ctrl/khora` and `penelope` exist but were not writable either. So khora's commits are carried here as a patch, `handoff/khora-fold-iterate.patch`, to be applied to khora later and promoted into the nexus. This is a carrier only: EODB imports nothing from khora (AGENTS.md rule 1).

## State
- **eodb**: `fold-write-model.md` is merged (PR #1). Facade tests: 109, with 4 failing on the plain store and 2 on the lazy store against current pharos `main` (`P.migrate is not a function` in tests 22, 102, 107; "a binary pharos is detected as plain" in test 18). Not fixed.
- **khora patch** (`handoff/khora-fold-iterate.patch`, 3 commits, `git format-patch`), based on `scores-patch-points/khora` `chat-engine` f024a55:
  1. `exemplar-pool`: PR #114's fix (already on khora `main`; `chat-engine` lacks it)
  2. `formicary`: the user-bound pattern layer (khora branch `formicary` e000ad1; not in `chat-engine`)
  3. `trail-rules`: `native/kernel/trail-rules.js` and its test: M4 promotion past a seeded null on a held-out third, `ruleEntry`, `META_RULES`. 10 tests pass, 0 of 600 chance-label route-tests promoted. Power on synthetic labels: about 60 to 120 deposits for a 0.9 v 0.1 gap, 240 for 0.8 v 0.3, none for 0.6 v 0.5. The kernel keeps 128 deposits per head.
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
- 2026-11-25: branch restarted from `main` after PR #1 merged; handoff added.
