import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeYoutubeURL, organizeText, organizeSegments, decodeCaptionEntities } from '../youtube-text-v189.js';
import { importVideo, extractPlayerResponse, parseCaptionJSON, parseCaptionXML } from '../server/youtube-source-v189.mjs';

const ID = 'M7lc1UVf-VE', URL = `https://www.youtube.com/watch?v=${ID}`;
const track = { baseUrl: `https://www.youtube.com/api/timedtext?v=${ID}&lang=en&sig=public`, languageCode: 'en' };
const player = (tracks = [track], extra = {}) => ({ videoDetails: { videoId: ID, title: 'Public video', author: 'Public author' }, playabilityStatus: { status: 'OK' }, captions: { playerCaptionsTracklistRenderer: { captionTracks: tracks } }, ...extra });
const watch = value => `<html><script>var ytInitialPlayerResponse = ${JSON.stringify(value)};</script></html>`;
const json = events => JSON.stringify({ events });
const event = (start, text, duration = 1000) => ({ tStartMs: start, dDurationMs: duration, segs: [{ utf8: text }] });
function mockFetch(responses) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options }); const row = responses.shift();
    if (row instanceof Error) throw row;
    if (typeof row === 'function') return row(url, options);
    if (!row) throw new Error('Unexpected fetch');
    return new Response(row.body ?? '', { status: row.status ?? 200, headers: row.headers });
  };
  return { calls, fetchImpl };
}

test('normalizes only supported exact public YouTube hosts and video paths', () => {
  for (const input of [URL, `http://youtube.com/watch?v=${ID}&t=5`, `youtu.be/${ID}?si=abc`, `https://m.youtube.com/shorts/${ID}`, `https://www.youtube.com/embed/${ID}/`])
    assert.deepEqual(normalizeYoutubeURL(input), { videoId: ID, url: URL });
  for (const input of ['https://evil.test/watch?v='+ID, 'https://youtube.com.evil.test/watch?v='+ID, 'https://www.youtube.com@127.0.0.1/watch?v='+ID, 'https://u:p@youtube.com/watch?v='+ID, 'https://www.youtube.com:444/watch?v='+ID, 'file:///etc/passwd', 'javascript:alert(1)', '//youtube.com/watch?v='+ID, 'https://youtube.com/redirect?q='+ID, 'https://youtu.be/'+ID+'/other', URL+'&v=aaaaaaaaaaa', 'https://youtube.com/watch?v=bad', 'https://youtube.com/watch?v='+ID+'%0a', 'https://localhost/watch?v='+ID])
    assert.throws(() => normalizeYoutubeURL(input), { code: 'invalid_url' }, input);
});

test('plain text sentence organization retains source text and bilingual lines', () => {
  assert.deepEqual(organizeText('Hello world. How are you?\n안녕하세요. 반가워요!').sentences, [
    {start:null,text:'Hello world.'},{start:null,text:'How are you?'},{start:null,text:'안녕하세요.'},{start:null,text:'반가워요!'},
  ]);
  assert.equal(organizeText('<script>alert(1)</script>').sentences[0].text, '<script>alert(1)</script>');
  assert.equal(organizeText('Yes.\nYes.').sentences.length, 2);
  assert.equal(organizeText('Dr. Kim reads 3.14 as a number.').segments[0].text, 'Dr. Kim reads 3.14 as a number.');
});

test('SRT and VTT use real cue times and retain bilingual lines', () => {
  const srt = '1\n00:00:01,500 --> 00:00:03,000\nHello &amp; welcome.\n안녕하세요.\n\n2\n00:00:04,000 --> 00:00:05,000\nNext sentence.';
  assert.deepEqual(organizeText(srt).sentences, [{start:1.5,text:'Hello & welcome.'},{start:1.5,text:'안녕하세요.'},{start:4,text:'Next sentence.'}]);
  const vtt = 'WEBVTT\n\nNOTE ignored\nnot a caption\n\ncue1\n00:01.000 --> 00:03.000 align:start\n<v Teacher><c.green>Hello.</c></v>\n\n00:04.000 --> 00:05.000\n<00:04.010>Goodbye.';
  assert.deepEqual(organizeText(vtt).sentences, [{start:1,text:'Hello.'},{start:4,text:'Goodbye.'}]);
  assert.deepEqual(organizeText('00:01 --> 00:02\nKeep this sentence.\n00:03 --> 00:04\nKeep this too.').sentences, [{start:1,text:'Keep this sentence.'},{start:3,text:'Keep this too.'}]);
});

test('timestamp text and subtitle continuation preserve times', () => {
  assert.deepEqual(organizeText('[00:01] First sentence.\n00:03 Second sentence.').sentences, [{start:1,text:'First sentence.'},{start:3,text:'Second sentence.'}]);
  assert.deepEqual(organizeSegments([{start:1,text:'This is'},{start:2,text:'one sentence. Next sentence.'}]).sentences, [{start:1,text:'This is one sentence.'},{start:2,text:'Next sentence.'}]);
});

test('rolling overlap deduplicates only overlapping, timed source', () => {
  const rows = [{start:0,end:3,text:'Hello world'},{start:1,end:4,text:'Hello world and friends'},{start:2,end:5,text:'and friends.'}];
  assert.equal(organizeSegments(rows).sentences.map(row=>row.text).join(' '), 'Hello world and friends.');
  assert.equal(organizeSegments([{start:0,end:3,text:'Hello world'},{start:1,end:4,text:'Hello world.'}]).sentences[0].text,'Hello world.');
  assert.equal(organizeSegments([{start:0,end:2,text:'Again.'},{start:1,end:3,text:'Again.'}]).segments.length,1);
  assert.equal(organizeSegments([{start:0,end:1,text:'Again.'},{start:2,end:3,text:'Again.'}]).segments.length,2);
  assert.equal(organizeSegments([{start:null,text:'Again.'},{start:null,text:'Again.'}]).segments.length,2);
  assert.equal(organizeSegments([{start:0,end:3,text:'Hello.\n안녕.'},{start:1,end:4,text:'Hello.\n다시 안녕.'}]).segments.length,2);
});

test('strict size and sentence limits reject instead of silently losing text', () => {
  assert.throws(()=>organizeText('x'.repeat(32001)), {code:'too_long'});
  assert.throws(()=>organizeText('Sentence. '.repeat(201)), {code:'too_many_sentences'});
  assert.throws(()=>organizeSegments([{start:-1,text:'wrong'}]), {code:'invalid_text'});
  assert.throws(()=>organizeSegments([{start:2,end:1,text:'wrong'}]), {code:'invalid_text'});
  assert.throws(()=>organizeText(''), {code:'invalid_text'});
  assert.throws(()=>organizeText('WEBVTT\n'), {code:'invalid_text'});
  assert.throws(()=>organizeText('00:01 --> 00:02\n'), {code:'invalid_text'});
  assert.throws(()=>organizeText('00:99 --> 01:01\nbad'), {code:'invalid_text'});
});

test('balanced player JSON handles escaped quotes/braces without evaluation', () => {
  const value=player([], {videoDetails:{videoId:ID,title:'A } brace " and \\ slash',author:'Author'}});
  assert.deepEqual(extractPlayerResponse(watch(value)),value);
  assert.equal(extractPlayerResponse('ytInitialPlayerResponse = {bad}; window.__evil=true;'),null);
  assert.equal(extractPlayerResponse('ytInitialPlayerResponse = (()=>{ throw Error("no") })();'),null);
  assert.equal(extractPlayerResponse('x'.repeat(2*1024*1024+1)),null);
});

test('caption parsers decode source characters as text, do not fetch XML entities', () => {
  assert.deepEqual(parseCaptionJSON(json([event(1000,'Hello &amp; welcome.')])),[{start:1,end:2,text:'Hello & welcome.'}]);
  assert.deepEqual(parseCaptionXML('<transcript><text start="1.5" dur="2">Hello &amp; &lt;script&gt;.<br/>안녕.</text></transcript>'),[{start:1.5,end:3.5,text:'Hello & <script>.\n안녕.'}]);
  assert.deepEqual(parseCaptionXML('<timedtext><body><p t="1000" d="2000"><s>Hello</s> world.</p></body></timedtext>'),[{start:1,end:3,text:'Hello world.'}]);
  assert.throws(()=>parseCaptionXML('<!DOCTYPE x [<!ENTITY test SYSTEM "file:///secret">]><transcript></transcript>'));
  assert.equal(decodeCaptionEntities('&#x1f600; &#0; &#xD800; &unknown;'),'😀 &#0; &#xD800; &unknown;');
});

test('public JSON caption success returns only constrained metadata and source sentences',async()=>{
  const m=mockFetch([{body:watch(player())},{body:json([event(1000,'Hello world.'),event(3000,'A second sentence.')])}]);
  const result=await importVideo(URL,{fetchImpl:m.fetchImpl});
  assert.equal(result.captionStatus,'ready');assert.equal(result.videoId,ID);assert.equal(result.language,'en');assert.equal(result.title,'Public video');
  assert.equal(result.thumbnail,`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);assert.deepEqual(result.sentences,[{start:1,text:'Hello world.'},{start:3,text:'A second sentence.'}]);
  assert.equal(m.calls.length,2);assert(m.calls[1].url.includes('fmt=json3'));
  assert(m.calls.every(call=>call.options.redirect==='manual'&&call.options.credentials==='omit'&&!('Cookie' in call.options.headers)));
});

test('XML fallback is the same safe public caption endpoint',async()=>{
  const m=mockFetch([{body:watch(player())},{body:''},{body:'<transcript><text start="2" dur="2">Actual source.</text></transcript>'}]);
  const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'ready');assert.equal(result.sentences[0].text,'Actual source.');assert.equal(m.calls.length,3);assert(!m.calls[2].url.includes('fmt='));
});

test('forbidden caption hosts, protocols, paths and mismatched IDs are never requested',async()=>{
  for(const baseUrl of ['https://127.0.0.1/api/timedtext','https://evil.test/api/timedtext','http://www.youtube.com/api/timedtext','https://www.youtube.com@evil.test/api/timedtext','https://www.youtube.com/api/timedtext/other','https://www.youtube.com:444/api/timedtext',`https://www.youtube.com/api/timedtext?v=aaaaaaaaaaa`]){
    const m=mockFetch([{body:watch(player([{...track,baseUrl}]))}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'unavailable');assert.equal(m.calls.length,1,baseUrl);
  }
});

test('redirects, CAPTCHA HTML, errors and empty bodies never produce invented captions',async()=>{
  for(const response of [{status:302,headers:{location:'https://evil.test/'}},{status:403},{status:429},new Error('network failed')]){
    const m=mockFetch([{body:watch(player())},response]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'blocked');assert.equal(result.title,'Public video');assert.deepEqual(result.sentences,[]);assert.equal(m.calls.length,2);
  }
  const m=mockFetch([{body:watch(player())},{body:'<html>CAPTCHA</html>'},{body:''}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'blocked');assert.deepEqual(result.segments,[]);
});

test('private/auth-required and missing-track videos retain public metadata honestly',async()=>{
  for(const status of ['LOGIN_REQUIRED','UNPLAYABLE','AGE_CHECK_REQUIRED']){
    const m=mockFetch([{body:watch(player([track],{playabilityStatus:{status}}))}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'blocked');assert.equal(m.calls.length,1);
  }
  const m=mockFetch([{body:watch(player([]))}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'unavailable');assert.deepEqual(result.sentences,[]);
});

test('optional oembed metadata never trusts a thumbnail URL from the response',async()=>{
  const m=mockFetch([{body:'<html>public page without player</html>'},{body:JSON.stringify({title:'Known title',author_name:'Author',thumbnail_url:'http://127.0.0.1/secret'})}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.title,'Known title');assert.equal(result.captionStatus,'blocked');assert(result.thumbnail.startsWith('https://i.ytimg.com/vi/'));assert(m.calls[1].url.startsWith('https://www.youtube.com/oembed?'));
});

test('response byte caps apply to headers and streamed bodies',async()=>{
  for(const response of [{body:'small',headers:{'content-length':String(3*1024*1024)}},{body:'x'.repeat(2*1024*1024+1)}]){
    const m=mockFetch([response,{body:'{}'}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'blocked');assert.deepEqual(result.sentences,[]);
  }
  const m=mockFetch([{body:watch(player())},{body:'x'.repeat(512*1024+1)}]);const result=await importVideo(URL,{fetchImpl:m.fetchImpl});assert.equal(result.captionStatus,'blocked');assert.equal(m.calls.length,2);
});

test('caller abort interrupts fetch even if an injected fetch ignores its signal',async()=>{
  const controller=new AbortController();let calls=0;
  const promise=importVideo(URL,{signal:controller.signal,fetchImpl:()=>{calls++;return new Promise(()=>{})}});
  setTimeout(()=>controller.abort(),10);const result=await promise;assert.equal(result.captionStatus,'blocked');assert.equal(calls,1);
  controller.abort();const result2=await importVideo(URL,{signal:controller.signal,fetchImpl:()=>{throw Error('must not request')}});assert.equal(result2.captionStatus,'blocked');
});

test('bad URL fails before any outbound request',async()=>{
  await assert.rejects(importVideo('https://evil.test/',{fetchImpl:()=>{throw Error('must not request')}}),{code:'invalid_url'});
});
