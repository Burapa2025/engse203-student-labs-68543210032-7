import { build } from 'vite';

// Public build flag set in Node so the same command works on every platform.
process.env.VITE_PAGES_DEMO = 'true';
await build({ mode: 'pages' });
