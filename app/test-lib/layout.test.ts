import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { widthClass, navPosition, gridColumns, contentWidth } from '../src/lib/layout.ts';

test('@FR-DSK-01 › Boundaries', () => {
  assert.deepEqual([767, 768, 1099, 1100].map(widthClass), ['compact', 'regular', 'regular', 'wide']);
});

test('@FR-DSK-02 › Navigation position', () => {
  assert.deepEqual([390, 900, 1400].map(navPosition), ['bottom', 'left', 'left']);
});

test('@FR-DSK-03 › Columns per class', () => {
  assert.deepEqual([390, 900, 1400].map(gridColumns), [1, 2, 3]);
});

test('@FR-DSK-04 › Width cap', () => {
  assert.equal(contentWidth(1920), 1200);
});

test('@FR-DSK-04 › Narrow window unchanged', () => {
  assert.equal(contentWidth(900), 900);
});

test('@FR-DSK-06 › Web script present', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.ok(pkg.scripts.web, 'scripts.web');
  for (const dep of ['react-dom', 'react-native-web', '@expo/metro-runtime']) {
    assert.ok(pkg.dependencies[dep], dep);
  }
});
