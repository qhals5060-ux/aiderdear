'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('site search uses a full-size vector instead of the undersized font glyph',()=>{
  const button=source.match(/<button id="searchBtn"[\s\S]*?<\/button>/)?.[0];
  assert(button);
  assert.match(button,/aria-label="검색 열기"/);
  assert.match(button,/<svg[^>]*width="22"[^>]*height="22"[^>]*viewBox="0 0 24 24"/);
  assert.match(button,/stroke="currentColor"/);
  assert.match(button,/aria-hidden="true" focusable="false"/);
  assert(!button.includes('⌕'));
});
test('site search retains its existing accessible click and Enter handlers',()=>{
  assert(source.includes("$('#searchBtn').addEventListener('click',openSearchFromQuick)"));
  assert(source.includes("if(e.key==='Enter'){e.preventDefault();openSearchFromQuick()}"));
  assert.match(source,/html:not\(\.aiderlog-android\) #app #searchBtn \.site-search-icon-v176\{[^}]*width:22px!important;height:22px!important/);
});
