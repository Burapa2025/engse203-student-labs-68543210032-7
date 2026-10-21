import fs from "node:fs/promises";
import path from "node:path";
import { escapeHtml as h, labPath, validHttpUrl } from "./common.mjs";

export async function renderLabReport({ labRoot, target, metadata, week, repoUrl, sourceUrl, evidenceUrl, statusLabel, branch }) {
  const verification = (metadata.verification ?? []).map(check => `<tr><th scope="row">${h(check.label)}</th><td><span class="result ${h(check.result)}">${h(check.result)}</span></td><td><code>${h(check.command)}</code><p>${h(check.detail)}</p></td></tr>`).join("");
  const highlights = (metadata.highlights ?? []).map(item => `<li>${h(item)}</li>`).join("");
  const runCommands = (metadata.runCommands ?? []).map(command => h(command)).join("\n");
  const reports = [];
  for (const file of metadata.reportFiles ?? []) {
    const filePath = labPath(labRoot, file.path);
    if (!/\.(md|txt|json|sql)$/i.test(filePath) || path.basename(filePath).startsWith(".env")) {
      throw new Error(`${week}: unsupported public report file ${file.path}`);
    }
    const content = await fs.readFile(filePath, "utf8");
    const url = `${repoUrl}/blob/${branch}/labs/${week}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
    reports.push(`<details><summary>${h(file.label)}</summary><p><a href="${h(url)}">เปิดไฟล์บน GitHub</a></p><pre>${h(content)}</pre></details>`);
  }
  const screenshots = [];
  for (const [i, shot] of (metadata.screenshots ?? []).entries()) {
    const source = labPath(labRoot, shot.path);
    if (!/\.(png|jpe?g|webp)$/i.test(source)) throw new Error(`${week}: unsupported screenshot ${shot.path}`);
    const relative = `evidence/${i + 1}-${path.basename(source)}`;
    await fs.mkdir(path.join(target, "evidence"), { recursive: true });
    await fs.copyFile(source, path.join(target, relative));
    screenshots.push(`<figure><a href="${h(relative)}"><img src="${h(relative)}" alt="${h(shot.caption)}" loading="lazy"></a><figcaption>${h(shot.caption)}</figcaption></figure>`);
  }
  const original = validHttpUrl(metadata.originalRepoUrl);
  return `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#092746">
<title>${h(week)} — ${h(metadata.title)}</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;line-height:1.65;color:#10253d;background:#eaf1f7}header{padding:30px max(22px,calc((100% - 1100px)/2));color:white;background:linear-gradient(135deg,#071f39,#0d4c77 72%,#078386)}header a{color:#d7edf9}h1{line-height:1.3;font-size:clamp(24px,4vw,34px)}main{max-width:1144px;margin:0 auto;padding:24px 22px 48px}section{padding:22px;margin-bottom:18px;background:white;border:1px solid #c4d6e4;border-radius:14px}h2{margin-top:0;font-size:21px}a{color:#075ea8}.pill,.result{color:#10253d;display:inline-block;padding:4px 10px;border-radius:99px;background:#e5f1fa;font-size:14px;font-weight:bold}.result.pass{color:#155d39;background:#e3f3e9}.result.fail{color:#8a2727;background:#fbe7e7}.result.partial{color:#705005;background:#fff1c8}.notice{padding:16px;border-left:5px solid #f4b942;background:#fff8e6}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}.actions a{padding:9px 14px;border:1px solid #1261a6;border-radius:8px;text-decoration:none}.actions .primary{background:#1261a6;color:white}table{width:100%;border-collapse:collapse}th,td{padding:12px;text-align:left;vertical-align:top;border-bottom:1px solid #dce5ec}th{min-width:140px}.table-wrap{overflow-x:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;background:#f0f5f9;border-radius:8px;font-size:14px}code{overflow-wrap:anywhere}details{margin:12px 0;border:1px solid #c4d6e4;border-radius:8px;padding:12px}summary{cursor:pointer;font-weight:bold}figure{margin:22px 0}img{display:block;max-width:100%;height:auto;border:1px solid #c4d6e4;border-radius:8px}figcaption{margin-top:8px;color:#52677c}.meta{color:#52677c;font-size:14px}@media(max-width:560px){section{padding:16px}main{padding:18px 12px}th,td{padding:9px}th{min-width:110px}}</style></head>
<body><header><a href="../../index.html">← LAB Portfolio</a><h1>${h(week)} — ${h(metadata.title)}</h1><span class="pill">${h(statusLabel)}</span></header>
<main><section><h2>ผลลัพธ์และหลักฐาน</h2><p class="notice">${h(metadata.notes || "LAB นี้แสดงผลลัพธ์ในรูปแบบรายงานและหลักฐานประกอบ")}</p>${highlights ? `<ul>${highlights}</ul>` : ""}
<div class="actions"><a class="primary" href="${h(sourceUrl)}">View Source</a><a href="${h(evidenceUrl)}">View Evidence</a>${validHttpUrl(metadata.pullRequestUrl) ? `<a href="${h(metadata.pullRequestUrl)}">Pull Request</a>` : ""}${original ? `<a href="${h(original)}">Original Repository</a>` : ""}</div>
<p class="meta">Branch: <code>${h(branch)}</code>${metadata.submissionTag ? ` • Version: ${h(metadata.submissionTag)}` : ""}${metadata.originalCommit ? ` • Source commit: ${h(metadata.originalCommit)}` : ""}</p></section>
${verification ? `<section><h2>ผลการตรวจสอบ</h2><div class="table-wrap"><table><thead><tr><th>รายการ</th><th>ผล</th><th>คำสั่งและรายละเอียด</th></tr></thead><tbody>${verification}</tbody></table></div></section>` : `<section><h2>Test Status</h2><p>${h(metadata.testStatus)}</p></section>`}
${runCommands ? `<section><h2>วิธีรันบนเครื่อง</h2><pre>${runCommands}</pre></section>` : ""}
${screenshots.length ? `<section><h2>ภาพหลักฐานจากงานเดิม</h2>${screenshots.join("\n")}</section>` : ""}
${reports.length ? `<section><h2>เอกสารและผลทดสอบ</h2>${reports.join("\n")}</section>` : ""}
</main></body></html>`;
}
