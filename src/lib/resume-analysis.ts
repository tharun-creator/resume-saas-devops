export type Finding = {
  id: string;
  title: string;
  detail: string;
  severity: "good" | "notice" | "action";
};

export type Analysis = {
  score: number;
  wordCount: number;
  headings: string[];
  findings: Finding[];
  extractedText: string;
};

const sectionNames = ["experience", "work experience", "education", "skills", "projects", "summary", "profile", "certifications", "achievements"];

export function analyzeResume(text: string): Analysis {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized ? normalized.split(/\s+/).length : 0;
  const headings = sectionNames.filter((heading) => new RegExp(`\\b${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));
  const hasEmail = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);
  const hasBullets = /(?:^|\n)\s*[•●▪◦*-]\s/m.test(text);
  const hasNumbers = /\b\d+(?:\.\d+)?\s*(?:%|x|k|l|m|users|customers|days|weeks|months|years)?\b/i.test(text);
  const hasColumns = /\t{2,}/.test(text) || /\|.{2,}\|/.test(text);
  const findings: Finding[] = [];
  if (hasEmail && hasPhone) findings.push({ id: "contact", title: "Contact details are easy to spot", detail: "Email and phone details were detected in the extracted text.", severity: "good" });
  else findings.push({ id: "contact", title: "Check your contact details", detail: `We detected ${hasEmail ? "an email" : "no email"}${hasEmail && hasPhone ? " and " : ""}${hasPhone ? "a phone number" : hasEmail ? "" : " or phone number"}. Make sure both are correct and visible.`, severity: "action" });
  if (headings.length >= 3) findings.push({ id: "sections", title: "Your experience has a clear structure", detail: `${headings.length} familiar section headings were detected: ${headings.slice(0, 4).join(", ")}.`, severity: "good" });
  else findings.push({ id: "sections", title: "Add familiar section headings", detail: "Use clear headings such as Experience, Education, and Skills so readers can scan your resume quickly.", severity: "action" });
  if (hasBullets) findings.push({ id: "bullets", title: "Bullet points help with scanning", detail: "At least one bullet-style line was detected.", severity: "good" });
  else findings.push({ id: "bullets", title: "Break long paragraphs into bullets", detail: "Short, focused bullets make responsibilities and outcomes easier to scan.", severity: "notice" });
  if (hasNumbers) findings.push({ id: "evidence", title: "Specific details add evidence", detail: "Numbers or measurable outcomes were found. Keep them accurate and explain the context.", severity: "good" });
  else findings.push({ id: "evidence", title: "Add outcomes where you can support them", detail: "If you know the scale or result of your work, include the real number. Never guess or invent a metric.", severity: "notice" });
  if (hasColumns) findings.push({ id: "layout", title: "Check the reading order", detail: "The extracted text may contain columns or table-like content. Review the exported PDF in a plain-text reader.", severity: "notice" });
  else findings.push({ id: "layout", title: "Text extraction looks straightforward", detail: "No obvious column separators were found in the extracted text. This cannot confirm the visual layout.", severity: "good" });
  if (words < 120) findings.push({ id: "length", title: "This looks shorter than a full resume", detail: "Confirm that all pages and sections were extracted. Scanned or image-only pages may need OCR.", severity: "notice" });
  const score = Math.max(20, Math.min(98, Math.round(48 + findings.reduce((sum, item) => sum + (item.severity === "good" ? 10 : item.severity === "notice" ? 3 : -8), 0))));
  return { score, wordCount: words, headings, findings, extractedText: normalized };
}

export function splitResumeSections(text: string): Array<{ heading: string; body: string }> {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections: Array<{ heading: string; body: string }> = [];
  let current: { heading: string; body: string[] } | null = null;
  const isHeading = (line: string) => sectionNames.some((name) => name === line.toLowerCase().replace(/[:\s]+$/, ""));
  for (const line of lines) {
    if (isHeading(line)) {
      if (current) sections.push({ heading: current.heading, body: current.body.join("\n") });
      current = { heading: line.replace(/:$/, ""), body: [] };
    } else if (current) current.body.push(line);
    else if (sections.length === 0) sections.push({ heading: "Profile", body: line });
  }
  if (current) sections.push({ heading: current.heading, body: current.body.join("\n") });
  if (!sections.length) sections.push({ heading: "Resume", body: lines.join("\n") });
  return sections;
}
