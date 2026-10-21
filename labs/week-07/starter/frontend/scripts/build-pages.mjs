import { build } from 'vite';
import fs from 'node:fs/promises';

// Public build flag set in Node so the same command works on every platform.
process.env.VITE_PAGES_DEMO = 'true';
await build({ mode: 'pages' });
// Vite can mix CRLF source HTML with injected LF markup on Windows.
const index = new URL('../dist/index.html', import.meta.url);
await fs.writeFile(index, (await fs.readFile(index, 'utf8')).replace(/\r/g, ''));
