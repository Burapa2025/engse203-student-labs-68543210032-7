import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { labPath } from "./common.mjs";
import { renderLabReport } from "./lab-report.mjs";

test("LAB metadata paths cannot leave their LAB", () => {
  const root = path.join(os.tmpdir(), "lab-fixture");
  assert.equal(labPath(root, "lab11/source"), path.join(root, "lab11/source"));
  assert.throws(() => labPath(root, "../other-lab"));
  assert.throws(() => labPath(root, root));
});

test("compact summaries preserve actual status, branch and commit from metadata", async () => {
  const html = await renderLabReport({
    week: "week-09", branch: "lab/week-09", statusLabel: "Published",
    sourceUrl: "https://github.com/u/r/tree/lab/week-09/labs/week-09/lab09/source",
    evidenceUrl: "https://github.com/u/r/tree/lab/week-09/labs/week-09/evidence",
    metadata: { reportLayout: "summary", title: "SQL <SQLite>", testStatus: "partial", originalCommit: "2de67ca43e94efaf815aae3e4ec4cbed0a632834", notes: "Schema & queries" },
  });
  assert.match(html, /class="grid"/);
  assert.match(html, /Published/);
  assert.match(html, /partial/);
  assert.match(html, /<strong>Submission<\/strong><p>lab\/week-09<\/p>/);
  assert.match(html, />2de67ca43e94<\/p>/);
  assert.match(html, /SQL &lt;SQLite&gt;/);
  assert.doesNotMatch(html, /Submitted|lab-09-submission-v1/);
});

test("reports render real results, escape content, and copy only selected screenshots", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "lab-report-test-"));
  try {
    const labRoot = path.join(root, "lab");
    const target = path.join(root, "output");
    await fs.mkdir(labRoot);
    await fs.mkdir(target);
    await fs.writeFile(path.join(labRoot, "API_TEST.md"), "<script>alert('x')</script>");
    await fs.writeFile(path.join(labRoot, "shot.png"), "fixture-image");
    const args = { labRoot, target, week: "week-07", repoUrl: "https://github.com/u/r", sourceUrl: "https://github.com/u/r/tree/lab/week-07/labs/week-07/starter", evidenceUrl: "https://github.com/u/r/tree/lab/week-07/labs/week-07/evidence", branch: "lab/week-07", statusLabel: "Published" };
    const html = await renderLabReport({ ...args, metadata: {
      title: "API <report>", testStatus: "partial", notes: "API ต้องใช้ Node server",
      verification: [{ label: "API checker", result: "partial", command: "node check.mjs", detail: "35/36" }],
      runCommands: ["npm ci", "npm start"],
      reportFiles: [{ label: "API tests", path: "API_TEST.md" }],
      screenshots: [{ path: "shot.png", caption: "Dashboard" }],
    } });
    assert.match(html, /35\/36/);
    assert.match(html, /result partial/);
    assert.match(html, /API &lt;report&gt;/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /blob\/lab\/week-07\/labs\/week-07\/API_TEST.md/);
    assert.equal(await fs.readFile(path.join(target, "evidence/1-shot.png"), "utf8"), "fixture-image");
    await assert.rejects(renderLabReport({ ...args, metadata: { reportFiles: [{ path: "../secret.md" }] } }));
    await assert.rejects(renderLabReport({ ...args, metadata: { reportFiles: [{ path: ".env.production" }] } }));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
