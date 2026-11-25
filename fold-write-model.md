# One door, one log: how every system of the Fold writes to the pharos

Status: a design note, 2026-11-25. Nothing here is decided; the owner's yes is needed for anything marked **Owner**. It was written from a read of the cloned repos (pharos, khora, janus, penelope, heimdall, Zenodotus, holodeck, the-fold, proteus, EODB and the nexus map), not from a running system. Counts below come from `grep` over source files, so they show where code mentions the pharos, not what runs.

## 1. The rule, as the repos already state it
- Pharos `SPEC.md`: every repo can **weave**, **watch** and **fold**, and knows no sibling. `by` is provenance, never dispatch. Entries are read by cell and kind. Unweaving is a retraction entry.
- Nexus map: the pharos is the one shared medium of khora (Differentiate), janus (Relate) and penelope (Generate). "No wrong door": from any repo you can learn the whole.
- Owner, 2026-11-24 (quoted in `khora/native/organs/trail-store.mjs`): "be sure everything writes to the pharos".
- EODB `AGENTS.md`: the log is the database; everything derived is a cache that can be deleted without changing an answer. Retract by weaving; permanent delete is only for the owner of sealed entries.

## 2. What is true today (read from source)
| system | mentions pharos in code | calls weave | declares what it reads and writes (`holon.json`) |
|---|---|---|---|
| khora | 43 files | 15 | file exists; `ground`, `figure`, `pattern`, `out` are all **empty** |
| janus | 35 | 3 | file exists; all four lists **empty** |
| penelope | 17 | 13 | **no `holon.json`** |
| heimdall | 3 | 2 | none found |
| Zenodotus | 2 | 1 | none found |
| holodeck, the-fold | 0 | 0 | none (they may vendor khora, which would hide their writes; not checked) |
| Alhazen, hyphae, foldcode, scholia, mnemosyne, holodeck-proxy | 0 | 0 | none |

Kinds the code declares (found by pattern, so incomplete): khora `contest`, `cut`, `void`, `assignment`, `polarity`, `prompted-turn`, and the trail kinds; penelope `equivalence-judgement`, `equivalence-ladder`, `equivalence-rejudgement`, `seam-bound`, `seam-rejudgement`, `thought`, `utterance`; heimdall `public-note`, `pulled`, `watch`; Zenodotus `usage`.

So the door is real and several systems use it, but **what each system promises to write is not declared**. The pharos SPEC defines the holon entry for exactly this: `body = {name, ground: [kinds read], figure: [kinds sensed], pattern: [kinds written], out: [kinds handed on]}`. Today the contract exists and is empty where it matters.

## 3. The write model
Four classes of write, and one rule for each. Every system (khora, janus, penelope, the surfaces, EODB, Proteus) uses the same four.

| class | what it is | cell family | rule |
|---|---|---|---|
| **Ground** | what was read or observed, byte-addressed | `*·Ground` | written once; a correction is a new entry that reads the old (`of`), never an edit |
| **Figure** | a reading or judgement of ground | `*·Figure` | carries `basis` (the priors and instrument version), so a verdict can be re-derived |
| **Pattern** | attention and standing: trails, alarms, promotions | `SIG·Pattern`, `EVA·Pattern` | a pointer, never an answer; fades; may change read order, never an answer |
| **Declaration** | kinds, holons, the rules about rules | `DEF·*` | written first; a kind is valid only once declared |

Rules that apply to all four:
1. **One door.** A system weaves through the pinned pharos pointer. It imports no sibling. (EODB already tests this for `vfiles.mjs` and `vfmanage.mjs`.)
2. **Declared before written.** A system's `holon.json` lists every kind it writes under `pattern` and every kind it reads under `ground`. A test fails if code weaves a kind the holon does not list, or lists one it never writes.
3. **Derived state is not an entry.** Indexes, memo files, marks and key stores sit beside the log and can be deleted (`*.sig/`, `*.marks/`, `*.derived/`, `*.keys/`).
4. **A failed write is said.** The pharos `chatter` file records it; a store that cannot reach the pharos reports `{on:false, why}`, never silently drops (khora's `trail-store` already does this).
5. **No question text in a pattern.** A head is marks, not words (the formicary already refuses whitespace).
6. **A rule change is an entry.** A promotion, a demotion and an alarm each leave an entry; no state flips silently.

## 4. Where the rules about rules fit
The ants rules M1 to M6 are the Pattern class's own law. They are now data in `khora/native/kernel/trail-rules.js` (`META_RULES`), each with a falsifier and the file and test that enforce it. M4 (promotion past a seeded shuffle, confirmed on a held-out third) is built and tested; M6's last part, weaving promotions into the log, is **not wired**. `ruleEntry` only shapes the entry (kind `trail-rule`, cell `EVA·Pattern`, a proposal).

Pharos already has the generic mechanism: `lib/sig.mjs` registers a fold with a reference, an optional shortcut, a probe and a held-out promotion (`PROPOSAL-SIG-FOLD.md`). EODB's `marks.mjs` has its own held-out promote for read shortcuts. A trail promotion is a third copy of the same shape. That argues for the proposal's own conclusion: one registry in pharos, with khora and EODB registering folds against it, rather than a third private copy. This note does not change that decision; it is open item 1 of the proposal. **Owner.**

## 5. A conflict to settle before trails go to the shared log
`trail-store.mjs` mirrors deposits, alarms and marks into the shared log by default, but only for the machine-wide store (no `file` given); a store with its own file, which is what `openFormicary` makes, writes nothing outside that file unless the caller passes `onMark`. So the conflict is latent, not live: the formicary's header expects to be given a pharos writer ("`onMark` ... e.g. trail-store's pharosMarkWriter"), and the owner's "everything writes to the pharos" will push someone to pass it. The formicary is **user-bound** and promises `forgetAll()`. An append-only shared log cannot honour that: a retraction hides an entry but the bytes stay. Per EODB's rules only sealed entries can be permanently deleted. So a per-user trail has three honest options:
1. write it to the user's **own** pharos (a log only that user holds), not the shared one;
2. write it **sealed** (body encrypted under a key kept outside the log), so forgetting is destroying the key;
3. write only aggregates (counts and strengths) to the shared log and keep per-user detail local.

I recommend 1 for the formicary and 3 for what the nexus shares. **Owner.**

## 6. Checks that would make "no wrong door" falsifiable
- **Declared equals written.** A lint over each repo: kinds woven in code against the holon's `pattern` list. Fails on a difference either way. (Extends `tools/ignorance.mjs`; the roster stays caller-supplied.)
- **Cache deletion.** Delete every `*.sig`, `*.marks`, `*.derived`, formicary file; every answer in a fixed question set is unchanged. (EODB already tests this for its own caches.)
- **Surface coverage.** For each surface (holodeck, the-fold, scholia, mnemosyne), either it weaves, or its `holon.json` states it only reads. A surface with neither is the wrong door.
- **Replay.** Re-derive every `trail-rule` verdict from the log and its seed; any difference falsifies M4's determinism claim.

## 7. Not measured
- No system was run. Weave counts are grep counts over source files.
- Whether holodeck and the-fold vendor khora's pharos writes is unchecked.
- janus's three `weave` calls were not read; its declared kinds are unknown.
- The power of the M4 rule, measured on synthetic labels: it needs roughly 60 to 120 deposits for a 0.9-versus-0.1 gap and 240 for 0.8 versus 0.3, and did not promote a 0.6-versus-0.5 gap at 240. The kernel keeps at most 128 deposits per head, so promotion is reachable only for strong gaps. Whether real trails have such gaps is unmeasured.

## 8. Next steps, in order
1. Fill `holon.json` for khora and janus from what their code writes, and add `penelope/holon.json` (changes in other repos: **Owner**).
2. Add the declared-equals-written lint to pharos tools.
3. Decide the user-bound trail store (section 5).
4. Wire `ruleEntry` to a weave through the existing `pharosMarkWriter`, behind the same typed-gap rule.
5. Decide whether the trail promotion registers against pharos `sig.mjs` or stays a pure kernel module.
