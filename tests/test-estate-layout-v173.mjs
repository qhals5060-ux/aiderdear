import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync(new URL('../estate-v171.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../estate-v171.css', import.meta.url), 'utf8');

test('v173 removes the redundant ESTATE title/header DOM and its unused CSS', () => {
  const shell = controller.split(/\r?\n/).find(line => line.trimStart().startsWith('root.innerHTML='));
  assert(shell, 'production shell renderer exists');
  assert(!/class="estate-(?:header|brand)"|AIDERLOG \/ REAL ESTATE/.test(shell));
  assert(!/#estateStage\s+\.estate-(?:header|brand)\b/.test(css), 'old header height/padding rules removed');
  assert(shell.includes('class="estate-shell"'));
  assert(shell.includes('class="estate-main"'));
  assert(shell.includes('class="estate-panel"'));
});

test('header removal retains shared search, three creation actions, notices and source navigation', () => {
  const shell = controller.split(/\r?\n/).find(line => line.trimStart().startsWith('root.innerHTML='));
  for (const marker of ['class="estate-nav"','class="estate-nav-tools"','class="estate-nav-links"','class="estate-search"','class="estate-search-results"','class="estate-notice"']) assert(shell.includes(marker), marker);
  assert.deepEqual([...shell.matchAll(/data-add="([^"]+)"/g)].map(match => match[1]), ['properties','customers','tasks']);
  assert(controller.includes("root.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>app.open(b.dataset.add))"));
  assert(controller.includes("root.querySelectorAll('[data-estate-view]').forEach(b=>b.onclick=()=>app.navigate(b.dataset.estateView))"));
  assert(controller.includes("const search=root.querySelector('.estate-search'),results=search.querySelector('.estate-search-results')"));
});
