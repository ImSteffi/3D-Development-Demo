import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/data.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {districts, building, apartmentDetails, TOUR_URL, readRoute} = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
test('Mõlema linnaosa kõik korterivalikud taastuvad jagatavast URL-ist',()=>{
 for(const d of districts) for(const a of building.apartments){
  const r=readRoute(`?linnaosa=${d.id}&hoone=${building.id}&korter=${a.number}`);
  assert.equal(r.district,d);assert.equal(r.house,true);assert.equal(r.apartment,a);
  assert.equal(a.floor,Math.ceil(a.number/4));assert.equal(a.details,apartmentDetails);
 }
});
test('Linnaosad kasutavad sama hoonet, igal korrusel täpselt neli korterit',()=>{
 assert.equal(districts.length,2); assert.equal(districts[0].building,districts[1].building);
 for(const floor of building.floors)assert.equal(building.apartments.filter(a=>a.floor===floor).length,4);
 assert.equal(new Set(building.apartments.map(a=>a.number)).size,building.floors.length*4);
});
test('Vigased ja osalised lingid ei ava puuduvaid valikuid',()=>{
 for(const query of ['','?linnaosa=x&hoone=pargi-7&korter=1','?korter=1','?linnaosa=a&korter=1','?linnaosa=a&hoone=x&korter=1'])assert.equal(readRoute(query).apartment,undefined);
 assert.equal(readRoute('?linnaosa=b&hoone=pargi-7&korter=99').house,true);
 assert.equal(readRoute('?linnaosa=b&hoone=pargi-7&korter=99').apartment,undefined);
});
test('Tuur kasutab paketi juhendi iframe-aadressi',()=>assert.equal(TOUR_URL,'/3d/viewer/index.html'));



test('Valitud korrus säilib jagatavas lingis ja korter määrab oma korruse',()=>{
 for(const d of districts) for(const f of building.floors){
  const route=readRoute(`?linnaosa=${d.id}&hoone=${building.id}&korrus=${f}`);
  assert.equal(route.floor,f); assert.equal(route.apartment,undefined);
 }
 assert.equal(readRoute('?linnaosa=a&hoone=pargi-7&korrus=999').floor,1);
 assert.equal(readRoute('?linnaosa=a&hoone=pargi-7&korrus=2&korter=48').floor,12);
});


