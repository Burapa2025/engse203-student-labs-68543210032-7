import fs from "node:fs/promises";
import path from "node:path";
import { ROOT, exists, labPath, listLabs, readJson, validHttpUrl } from "./common.mjs";

const config = await readJson(path.join(ROOT, "student-config.json"));
const docsRoot = path.join(ROOT, "docs");
const base = new URL(`https://${config.githubUsername}.github.io/${config.repositoryName}/`);
const summaries = await readJson(path.join(docsRoot, "labs.json"));
const weeks = await listLabs();
const errors = [];
const portfolio = await fs.readFile(path.join(docsRoot, "index.html"), "utf8");
const cards = [...portfolio.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
if (summaries.map(lab => lab.week).join(",") !== weeks.join(",")) errors.push("Portfolio does not contain every LAB exactly once");
for (const lab of summaries) {
  const labRoot = path.join(ROOT, "labs", lab.week);
  const branch = lab.sourceBranch || `lab/${lab.week}`;
  const expectedSource = `https://github.com/${config.githubUsername}/${config.repositoryName}/tree/${branch}/labs/${lab.week}/${lab.sourcePath || "source"}`;
  if (lab.sourceUrl !== expectedSource) errors.push(`${lab.week}: Source URL does not match its branch/path`);
  if (!(await exists(labPath(labRoot, lab.sourcePath || "source")))) errors.push(`${lab.week}: missing source directory`);
  if (lab.pageUrl !== new URL(`labs/${lab.week}/`, base).href) errors.push(`${lab.week}: wrong Pages URL`);
  const liveUrl = validHttpUrl(lab.liveUrl);
  if (lab.liveUrl && !liveUrl) errors.push(`${lab.week}: invalid live URL`);
  const card = cards.find(html => html.includes(`<span class="week">${lab.week}</span>`));
  const resultHref = card?.match(/<a class="primary" href="([^"]+)">View Result<\/a>/)?.[1];
  const expectedResult = liveUrl || new URL(`labs/${lab.week}/`, base).href;
  if (!resultHref || new URL(resultHref.replaceAll("&amp;", "&"), base).href !== expectedResult) errors.push(`${lab.week}: View Result does not match its live/Pages URL`);
  const submission = await readJson(path.join(docsRoot, "labs", lab.week, "submission.json"));
  if (JSON.stringify(submission) !== JSON.stringify(lab)) errors.push(`${lab.week}: submission metadata is stale`);
}

let checked = 0;
async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    if (/^\.env(?:\.|$)/.test(entry.name) || /\.(db|sqlite)$/i.test(entry.name)) errors.push(`Unexpected private/runtime file in Pages: ${file}`);
    if (!entry.name.endsWith(".html")) continue;
    const html = await fs.readFile(file, "utf8");
    const page = new URL(path.relative(docsRoot, file).split(path.sep).join("/"), base);
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      const url = new URL(match[1], page);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) continue;
      const relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
      let destination = path.resolve(docsRoot, relative);
      if (url.pathname.endsWith("/")) destination = path.join(destination, "index.html");
      if (!destination.startsWith(`${docsRoot}${path.sep}`)) { errors.push(`Link escapes Pages: ${match[1]}`); continue; }
      checked++;
      if (!(await exists(destination))) errors.push(`${path.relative(docsRoot, file)}: missing link/asset ${match[1]}`);
    }
  }
}
await scan(docsRoot);
if (errors.length) {
  errors.forEach(error => console.error(`FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Verify Pages: PASS — ${summaries.length} LABs, ${checked} local links/assets, matching branch URLs and submission metadata`);
}
