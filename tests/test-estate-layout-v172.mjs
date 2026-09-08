import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const controller = fs.readFileSync(new URL('../estate-v171.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../estate-v171.css', import.meta.url), 'utf8');
const camel = value => value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

// A bounded light-DOM parser for the actual shell template, not a replacement
// template fixture. Browser layout/scroll measurements remain a separate gate.
class Element {
  constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.attrs = {}; this.dataset = {}; this.nodes = []; this.parentElement = null; this.hidden = false; this.value = ''; }
  get children() { return this.nodes.filter(node => node.tagName !== '#TEXT'); }
  get textContent() { return this.tagName === '#TEXT' ? this.text : this.nodes.map(node => node.textContent).join(''); }
  set textContent(value) { const node = new Element('#text'); node.text = String(value); this.replaceChildren(node); }
  set innerHTML(value) {
    this.replaceChildren(); const stack = [this];
    for (const token of String(value).match(/<\/?[\w-]+\b[^>]*>|[^<]+/g) || []) {
      if (token.startsWith('</')) { stack.pop(); continue; }
      if (!token.startsWith('<')) { const text = new Element('#text'); text.text = token; stack.at(-1).append(text); continue; }
      const tag = token.match(/^<([\w-]+)/)[1], node = new Element(tag);
      const attributes = token.slice(tag.length + 1, -1);
      for (const attr of attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) node.setAttribute(attr[1], attr[2] ?? '');
      stack.at(-1).append(node);
      if (!['input','img','br','hr','meta','link'].includes(tag)) stack.push(node);
    }
  }
  setAttribute(name, value) { this.attrs[name] = String(value); if (name.startsWith('data-')) this.dataset[camel(name.slice(5))] = String(value); if (name === 'hidden') this.hidden = true; if (name === 'value') this.value = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  append(...nodes) { for (const node of nodes) { node.parentElement = this; this.nodes.push(node); } }
  replaceChildren(...nodes) { this.nodes.forEach(node => node.parentElement = null); this.nodes = []; this.append(...nodes); }
  remove() { if (this.parentElement) this.parentElement.nodes = this.parentElement.nodes.filter(node => node !== this); this.parentElement = null; }
  descendants() { return this.children.flatMap(node => [node, ...node.descendants()]); }
  contains(node) { return node === this || this.descendants().includes(node); }
  matches(selector) {
    if (selector.startsWith('.')) return (this.attrs.class || '').split(/\s+/).includes(selector.slice(1));
    const attribute = selector.match(/^\[([\w-]+)(?:="?([^"\]]+)"?)?\]$/);
    if (attribute) return Object.hasOwn(this.attrs, attribute[1]) || (attribute[1].startsWith('data-') && Object.hasOwn(this.dataset, camel(attribute[1].slice(5)))) ? attribute[2] === undefined || this.getAttribute(attribute[1]) === attribute[2] : false;
    return this.tagName === selector.toUpperCase();
  }
  querySelectorAll(selector) { return this.descendants().filter(node => node.matches(selector)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  get elements() { return Object.fromEntries(this.descendants().filter(node => node.attrs.name).map(node => [node.attrs.name, node])); }
}

function fixture() {
  const root = new Element('section'), opened = [], navigated = [], requests = [], events = new Map();
  let response = {results:[]};
  const app = {open:(...args) => opened.push(args), navigate:view => navigated.push(view)};
  const api = {call:async(action,payload) => { requests.push({action,payload}); return response; }};
  const document = {createElement:tag => new Element(tag),addEventListener:(name,fn) => events.set(name,fn)};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const context = vm.createContext({root,app,api,document,esc});
  const names = controller.match(/const names=\{[^\n]+\};/)[0];
  const template = controller.split(/\r?\n/).find(line => line.trimStart().startsWith('root.innerHTML='));
  vm.runInContext(names + '\n' + template, context);
  const buttons = controller.split(/\r?\n/).find(line => line.includes("root.querySelectorAll('[data-add]')"));
  vm.runInContext(buttons, context);
  const start = controller.indexOf("  const search=root.querySelector('.estate-search')"), end = controller.indexOf('  installDirectory(app)', start);
  assert(start >= 0 && end > start);
  vm.runInContext(controller.slice(start, end), context);
  return {root,opened,navigated,requests,events,context,setResponse:value => response = value,search:root.querySelector('.estate-search'),results:root.querySelector('.estate-search-results'),run:code => vm.runInContext(code, context)};
}

test('actual shell puts one search and all three original creation controls inside left nav', () => {
  const f = fixture(), nav = f.root.querySelector('.estate-nav'), header = f.root.querySelector('.estate-header');
  assert(nav.contains(f.search));
  assert(nav.contains(f.results));
  assert.equal(header.querySelector('.estate-search'), null);
  assert.equal(header.querySelector('.estate-actions'), null);
  assert.equal(f.root.querySelectorAll('.estate-search').length, 1);
  assert.equal(f.root.querySelectorAll('.estate-search-results').length, 1);
  assert.deepEqual(nav.querySelectorAll('[data-add]').map(node => node.dataset.add), ['properties','customers','tasks']);
  assert.equal(f.search.getAttribute('role'), 'search');
  assert.equal(f.search.elements.q.getAttribute('aria-label'), '매물·고객 공통 검색');
  assert(f.results.hidden);
});
test('creation controls retain original handlers and collection targets', () => {
  const f = fixture();
  for (const button of f.root.querySelectorAll('[data-add]')) button.onclick();
  assert.deepEqual(f.opened, [['properties'],['customers'],['tasks']]);
});
test('all current navigation entries retain their handlers inside the mobile-capable link rail', () => {
  const f = fixture(), links = f.root.querySelector('.estate-nav-links');
  const buttons = links.querySelectorAll('[data-estate-view]');
  assert(buttons.length >= 6);
  assert.deepEqual(buttons.map(node => node.dataset.estateView).filter(name => name !== 'calendar'), ['today','properties','customers','matching','deals','settlement']);
  for (const button of buttons) button.onclick();
  assert.deepEqual(f.navigated, buttons.map(node => node.dataset.estateView));
  assert.equal(buttons[0].getAttribute('aria-current'), 'page');
});
test('actual shared search reads the same input and renders result buttons inside its form', async () => {
  const f = fixture(), form = f.search, input = form.elements.q;
  input.value = '  서울 <매물>  ';
  f.setResponse({results:[{collection:'properties',id:'real-property',label:'서울 <매물>',subtitle:'등록된 주소·매물번호'}]});
  let prevented = false;
  form.onsubmit({preventDefault:() => prevented = true});
  await f.run('Promise.resolve()');
  assert(prevented);
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].action, 'search');
  assert.equal(f.requests[0].payload.q, '서울 <매물>');
  assert.equal(f.search, form);
  assert.equal(f.search.elements.q, input);
  assert(!f.results.hidden);
  const result = f.results.querySelector('button');
  assert(result);
  assert(form.contains(result));
  assert(!result.querySelector('매물'), 'label is escaped, not interpreted as a tag');
  result.onclick();
  assert.deepEqual(f.opened, [['properties','real-property']]);
  assert(f.results.hidden);
});
test('search continuation appends genuine records and keeps one more-results control', async () => {
  const f = fixture(); f.search.elements.q.value = '고객';
  f.setResponse({results:[{collection:'customers',id:'c1',label:'김 고객',subtitle:'첫 번째'}],cursor:'cursor-2'});
  await f.run('runSearch()');
  const more = f.results.querySelector('[data-search-more]');
  assert(more);
  f.setResponse({results:[{collection:'customers',id:'c2',label:'이 고객',subtitle:'두 번째'}]});
  await more.onclick();
  assert.equal(f.requests[1].payload.cursor, 'cursor-2');
  assert.equal(f.results.querySelectorAll('[data-search-more]').length, 0);
  assert.equal(f.results.querySelectorAll('button').length, 2);
  f.results.querySelectorAll('button')[1].onclick();
  assert.deepEqual(f.opened, [['customers','c2']]);
});
test('empty search and outside click keep original result-close behavior after relocation', async () => {
  const f = fixture(); f.search.elements.q.value = '  '; f.results.hidden = false;
  await f.run('runSearch()');
  assert(f.results.hidden); assert.equal(f.requests.length, 0);
  f.results.hidden = false;
  f.events.get('click')({target:f.search.elements.q}); assert(!f.results.hidden);
  f.events.get('click')({target:f.root.querySelector('.estate-main')}); assert(f.results.hidden);
});
test('CSS keeps search results in normal flow with independently scrollable wrapping content', () => {
  assert.match(css, /#estateStage \.estate-nav \.estate-search-results\{position:static;grid-column:1\/-1;[^}]*max-height:min\(38dvh,320px\);overflow:auto/);
  assert.match(css, /#estateStage \.estate-nav \.estate-search-results button\{[^}]*white-space:normal;overflow-wrap:anywhere/);
  assert.match(css, /#estateStage \.estate-nav\{[^}]*min-height:0;[^}]*overflow-x:hidden;overflow-y:auto/);
  assert.match(css, /#estateStage\[hidden\],#estateStage \[hidden\]\{display:none!important\}/);
});
test('mobile retains horizontal view navigation and all three visible creation controls', () => {
  const mobile = css.slice(css.lastIndexOf('@media(max-width:700px)'));
  assert.match(mobile, /\.estate-nav-links\{flex-direction:row;overflow-x:auto/);
  assert.match(mobile, /\.estate-nav-links>\[data-estate-view\]\{flex:0 0 auto/);
  assert.match(mobile, /\.estate-nav \.estate-actions\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(mobile, /\.estate-main\{flex:1;min-height:0\}/);
  assert(!/\.estate-(?:search|actions|nav-links)[^{]*\{[^}]*display:none/.test(mobile));
});
test('larger typography is limited to ESTATE with 15 body, 14 controls and clear 28/22/18 headings', () => {
  const scope = 'html:not(.aiderlog-android) body #app#app #estateStage';
  assert(css.includes(scope + '{--site-type-body:15px;--site-type-control:14px;--site-type-meta:13px;--site-type-section:22px;--site-type-subhead:18px;--site-type-page:28px;'));
  assert(css.includes(scope + ' :is(button,input,select,textarea){font-size:14px!important'));
  assert(css.includes(scope + ' h1{font-size:28px!important'));
  assert(css.includes(scope + ' h2{font-size:22px!important'));
  assert(css.includes(scope + ' :is(h3,h4){font-size:18px!important'));
  assert(!/\b(?:zoom|scale)\s*:/.test(css));
});
test('table min-content cannot widen main section, directory grid or filter toolbar', () => {
  assert(css.includes('#estateStage .estate-shell,#estateStage .estate-main,#estateStage .estate-main>section{min-width:0;max-width:100%}'));
  assert(css.includes('.estate-main .estate-directory{grid-template-columns:minmax(0,1fr);width:100%;min-width:0;max-width:100%}'));
  assert(css.includes('.estate-main .estate-directory>*{min-width:0;max-width:100%}'));
  assert(css.includes('.estate-main .estate-directory-toolbar{grid-template-columns:minmax(0,1fr);min-width:0;max-width:100%;width:100%}'));
  assert(css.includes('.estate-main .estate-directory-table-wrap{min-width:0;max-width:100%;width:100%;overflow-x:auto;'));
  const directoryCSS = fs.readFileSync(new URL('../estate-directory-v171.css', import.meta.url), 'utf8');
  assert.match(directoryCSS, /\.estate-directory-table\{[^}]*min-width:650px/);
  assert(!/\.estate-main\{[^}]*overflow(?:-x)?:hidden/.test(css), 'do not hide whole-page overflowing controls');
});
test('all mobile filter fields fit one bounded column while only the table scrolls horizontally', () => {
  const mobile = css.slice(css.lastIndexOf('@media(max-width:700px)'));
  assert(mobile.includes('.estate-main .estate-directory .estate-directory-filter-grid{grid-template-columns:minmax(0,1fr)!important}'));
  assert(mobile.includes('.estate-main .estate-directory-filter-grid :is(input,select){width:100%;min-width:0;max-width:100%}'));
  assert(mobile.includes('.estate-main .estate-directory-heading{flex-wrap:wrap}'));
  assert(mobile.includes('.estate-main .estate-directory-heading>div{min-width:0;max-width:100%}'));
});
