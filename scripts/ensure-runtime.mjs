import {readFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {createRequire} from 'node:module';

// Windows ja WSL võivad jagada lähtekoodi, kuid vajavad erinevaid natiivseid tööriistu.
export async function ensureRuntime(root,run) {
  const require=createRequire(join(root,'package.json'));
  const linuxABI=process.platform==='linux' && !process.report.getReport().header.glibcVersionRuntime ? 'musl' : 'gnu';
  const rollupSuffix=process.platform==='linux' ? `linux-${process.arch}-${linuxABI}` : process.platform==='win32' ? `win32-${process.arch}-msvc` : `${process.platform}-${process.arch}`;
  const packages=[
    {owner:'rollup',name:`@rollup/rollup-${rollupSuffix}`,entry:''},
    {owner:'esbuild',name:`@esbuild/${process.platform}-${process.arch}`,entry:process.platform==='win32'?'esbuild.exe':'bin/esbuild'}
  ];
  const missing=[];
  for(const pkg of packages) {
    const owner=JSON.parse(await readFile(join(root,'node_modules',pkg.owner,'package.json'),'utf8'));
    const version=owner.optionalDependencies?.[pkg.name];
    if(!version) throw new Error(`See platvorm ei ole toetatud: ${pkg.name}`);
    try {
      const manifest=require.resolve(`${pkg.name}/package.json`);
      const installed=JSON.parse(await readFile(manifest,'utf8'));
      if(installed.version!==version) throw new Error('Vale tööriistaversioon');
      if(pkg.entry) await access(require.resolve(`${pkg.name}/${pkg.entry}`));
      else require(pkg.name); // Kontrolli ka natiivmooduli laadimist, mitte ainult kausta olemasolu.
    } catch { missing.push(`${pkg.name}@${version}`); }
  }
  if(!missing.length)return;
  console.log('Valmistan selle operatsioonisüsteemi käivitustoe ette…');
  const npm=process.env.npm_execpath;
  if(!npm) throw new Error('Käivita projekt käsuga npm run dev.');
  await run(process.execPath,[npm,'install','--no-save','--package-lock=false','--ignore-scripts','--include=optional',...missing]);
  return true;
}

