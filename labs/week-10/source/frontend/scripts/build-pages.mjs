import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), 'build'], {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  env: { ...process.env, VITE_PAGES_DEMO: 'true' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status === 0) {
  const index = new URL('../dist/index.html', import.meta.url);
  await fs.writeFile(index, (await fs.readFile(index, 'utf8')).replace(/\r/g, ''));
}
process.exit(result.status ?? 1);
