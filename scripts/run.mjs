import {cp, mkdir} from 'node:fs/promises';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {spawn} from 'node:child_process';
import {ensureRuntime} from './ensure-runtime.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const command = process.argv.at(-1);
function run(executable, args, cwd = root) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(executable, args, {cwd, stdio:'inherit', windowsVerbatimArguments:executable === 'cmd.exe'});
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolvePromise() : reject(new Error(`Käsk ebaõnnestus (${code})`)));
  });
}
// Windowsi cmd ei toeta UNC-töökataloogi. pushd määrab sellele ajutise kettatähe.
if (process.platform === 'win32' && root.startsWith('\\\\')) {
  await run('cmd.exe', ['/d','/s','/c',`pushd "${root}" && node scripts/run.mjs ${command}`]);
} else {
  process.chdir(root);
  if ((command === 'dev' || command === 'build') && await ensureRuntime(root,run)) {
    // Uus protsess vabastab Node'i varem puudunud moodulite teekonnavahemälu.
    await run(process.execPath,[join(root,'scripts/run.mjs'),command]);
    process.exit(0);
  }
  // Võrgukettalt käivitatud esbuild.exe võib Windowsis mälukaardistamisel katkeda.
  if (process.platform === 'win32') {
    const binaryDirectory = join(tmpdir(), 'ssc-demo-esbuild');
    await mkdir(binaryDirectory,{recursive:true});
    const binary = join(binaryDirectory, 'esbuild-' + process.pid + '.exe');
    await cp(join(root,'node_modules','@esbuild','win32-' + process.arch,'esbuild.exe'),binary);
    process.env.ESBUILD_BINARY_PATH = binary;
  }
  if (command === 'dev' || command === 'build') {
    // Paketi README: majuta terve viewer-kaust muutmata kujul.
    await mkdir(join(root,'public','3d'),{recursive:true});
    await cp(join(root,'3D-viewer','3D-viewer','viewer'),join(root,'public','3d','viewer'),{recursive:true});
  }
  if (command === 'dev') {
    const {createServer} = await import('vite');
    const server = await createServer({root,server:{host:'127.0.0.1'}});
    await server.listen(); server.printUrls();
  } else if (command === 'build') {
    await run(process.execPath,[join(root,'node_modules/typescript/bin/tsc'),'-b']);
    const {build} = await import('vite'); await build({root});
  } else if (command === 'test') {
    await run(process.execPath,['--test',join(root,'tests/data.test.mjs')]);
  } else throw new Error(`Tundmatu käsk: ${command}`);
}












