import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import retired from '../api/assets.mjs';

test('retired investment endpoint rejects every method before body or auth access',()=>{
  for(const method of ['GET','POST','PUT','DELETE','OPTIONS']){
    let result;const headers={};const req={method,url:'/api/assets?action=health',get body(){throw Error('must not parse');},get headers(){throw Error('must not authenticate');}};
    const res={setHeader:(key,value)=>headers[key]=value,end:value=>result=JSON.parse(value)};
    retired(req,res);assert.equal(res.statusCode,410);assert.equal(result.retired,true);assert.equal(result.dataAccess,false);assert.match(headers['Cache-Control'],/no-store/);
  }
  assert.doesNotMatch(fs.readFileSync(new URL('../api/assets.mjs',import.meta.url),'utf8'),/\bimport\b|services\(|getFirestore|fetch\(/);
});

test('investment page and compiled assets are removed while personal finance remains',()=>{
  for(const file of ['finance-v190.html','finance-ui-v190.js','finance-ui-v190.css','site-investment-v190.js','assets-client-v190.js'])assert.equal(fs.existsSync(new URL('../'+file,import.meta.url)),false,file);
  const site=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.doesNotMatch(site,/site-investment-v190|assets-client-v190/);
  assert.match(site,/data-personal-category="finance"/);
  assert.match(fs.readFileSync(new URL('../android-src/assets/app-life-v188.js',import.meta.url),'utf8'),/l188-finance/);
});
