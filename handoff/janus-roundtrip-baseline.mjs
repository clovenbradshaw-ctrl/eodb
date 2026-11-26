// handoff/janus-roundtrip-baseline.mjs — SPEC FOR A JANUS TEST (R4 and R5 of the reading standard). It measures the existing nl-eot.mjs round trip on English sentences. khora may not import janus, so this lives here as a spec: move it beside nl-eot.mjs.
// Baseline measured 2026-11-26 on 25 sentences of Pride and Prejudice ch. I: EOT fixed point 6 of 25 (24%); surface identical 4 of 25 (16%); form_unattested 31 of 225 content nodes (13.8%). The invariant to enforce: for sentences with NO gaps the EOT is a fixed point (100%).
import fs from "node:fs";
const nl = await import("/home/user/scores-patch-points/janus/native/organs/nl-eot.mjs");
const pp = fs.readFileSync("/home/user/scores-patch-points/Zenodotus/01-literature-books/gutenberg/pg1342_Pride_and_Prejudice.txt", "utf8").split("\n").slice(672, 760).join(" ").replace(/\s+/g, " ").replace(/[“”]/g, '"');
const sents = pp.split(/(?<=[.!?]["]?)\s+(?=[A-Z"])/).map((s) => s.trim()).filter((s) => s.split(" ").length >= 5 && s.split(" ").length <= 30).slice(0, 25);
const G = nl.loadGrammar("eng"); if (G.gap) { console.log("GAP", JSON.stringify(G).slice(0, 200)); process.exit(0); }
const lem = (rec) => (rec.meaning?.nodes ?? []).map((n) => n.lemma.toLowerCase()).sort().join(" ");
let n = 0, fixed = 0, exact = 0, tauSum = 0, tauN = 0, unattested = 0, nodes = 0; const diffs = [];
for (const s of sents) {
  const r = nl.read(G, s); if (r.gap || !r.records?.length) continue;
  const written = r.records.map((rec) => nl.write(rec, G)), text = written.map((w) => w.text).join(" "); n++;
  const r2 = nl.read(G, text), same = !r2.gap && r2.records && r.records.map(lem).join("|") === r2.records.map(lem).join("|");
  if (same) fixed++; else if (diffs.length < 4) diffs.push([s.slice(0, 90), text.slice(0, 90)]);
  if (text.toLowerCase().replace(/[^a-z ]/g, "").trim() === s.toLowerCase().replace(/[^a-z ]/g, "").trim()) exact++;
  for (const w of written) { unattested += (w.gaps ?? []).filter((g) => g.gap === "form_unattested").length; }
  nodes += r.records.reduce((a, rec) => a + (rec.meaning?.nodes?.length ?? 0), 0);
}
console.log(`English sentences round-tripped: ${n}`);
console.log(`EOT fixed point (decode(encode(decode(x))) has the same content lemmas as decode(x)): ${fixed} of ${n} (${(100 * fixed / n).toFixed(0)}%)`);
console.log(`surface identical to the original (letters and spaces only): ${exact} of ${n} (${(100 * exact / n).toFixed(0)}%)`);
console.log(`form_unattested gaps: ${unattested} over ${nodes} content nodes (${(100 * unattested / nodes).toFixed(1)}%)`);
console.log("grammar's recorded held-out order fidelity (Kendall tau):", G.scores?.orderKendallTau ?? JSON.stringify(G.scores));
for (const [a, b] of diffs) console.log(`  IN : ${a}\n  OUT: ${b}`);
