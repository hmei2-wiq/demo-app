// Stand-in for the OpenSpec traceability gate (the OpenSpec CLI could not be installed).
// Checks: every requirement has a priority line; every Must requirement has a tagged test; no tag names a missing ID.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    if (f === 'node_modules' || f === '.git') return [];
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const reqs = new Map();
// Main specs plus the specs of any active (non-archived) change.
const specDirs = [join(root, 'openspec/specs')];
const changesDir = join(root, 'openspec/changes');
for (const c of readdirSync(changesDir)) {
  if (c !== 'archive' && statSync(join(changesDir, c)).isDirectory()) specDirs.push(join(changesDir, c, 'specs'));
}
const specFiles = specDirs.flatMap((d) => walk(d)).filter((f) => f.endsWith('spec.md'));
for (const f of specFiles) {
  const text = readFileSync(f, 'utf8');
  const blocks = text.split(/^### Requirement: /m).slice(1);
  for (const b of blocks) {
    const id = b.match(/^((?:N?FR)-[A-Z0-9]+-\d+)/)?.[1];
    const prio = b.match(/^Priority: ([MSC])/m)?.[1];
    const scenarios = (b.match(/^#### Scenario:/gm) ?? []).length;
    reqs.set(id, { prio, scenarios, tests: [] });
  }
}

const testFiles = walk(root).filter((f) => /(\.test\.(mjs|ts|tsx))$/.test(f));
const tagRe = /@((?:N?FR)-[A-Z0-9]+-\d+)/g;
const unknown = [];
for (const f of testFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/(?:test|it)\(\s*['"`]([^'"`]+)['"`]/g)) {
    for (const t of m[1].matchAll(tagRe)) {
      if (reqs.has(t[1])) reqs.get(t[1]).tests.push(f.replace(root, ''));
      else unknown.push(`${t[1]} in ${f.replace(root, '')}`);
    }
  }
}

let failed = false;
const rows = [];
for (const [id, r] of reqs) {
  const problems = [];
  if (!r.prio) problems.push('no priority');
  if (r.scenarios === 0) problems.push('no scenario');
  if (r.prio === 'M' && r.tests.length === 0) problems.push('Must requirement with no tagged test');
  if (problems.length) failed = true;
  rows.push(`${id.padEnd(12)} ${r.prio ?? '?'}  tests:${String(new Set(r.tests).size).padStart(2)}  ${problems.join('; ') || 'ok'}`);
}
console.log(rows.join('\n'));
if (unknown.length) {
  failed = true;
  console.log('\nTags naming unknown requirements:\n' + unknown.join('\n'));
}
const must = [...reqs.values()].filter((r) => r.prio === 'M');
console.log(`\nRequirements: ${reqs.size} (Must ${must.length}, covered ${must.filter((r) => r.tests.length).length}/${must.length})`);
console.log(failed ? 'TRACEABILITY: FAIL' : 'TRACEABILITY: PASS (static scan; does not prove the tests ran)');
process.exit(failed ? 1 : 0);
