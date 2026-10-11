"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, CircleHelp,
  CloudUpload, FileCheck2, FileText, LoaderCircle, LockKeyhole, Pencil,
  Printer, RotateCcw, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { analyzeResume, splitResumeSections, type Analysis } from "@/lib/resume-analysis";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const KEYWORDS = ["leadership", "research", "strategy", "analytics", "design", "customers", "revenue", "operations", "engineering", "communication", "collaboration", "product", "growth", "testing", "automation", "management", "stakeholders", "campaigns", "planning", "delivery"];

async function extractText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return (await file.text()).replace(/\0/g, "");
  if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const document = await pdfjs.getDocument({ data: await file.arrayBuffer(), useSystemFonts: true }).promise;
    if (document.numPages > 30) {
      await document.destroy();
      throw new Error("This file has more than 30 pages. Please upload a shorter resume.");
    }
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
    }
    await document.destroy();
    return pages.join("\n\n");
  }
  throw new Error("Choose a PDF, DOCX, or TXT file.");
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Studio() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"resume" | "job">("resume");

  const jobMatch = useMemo(() => {
    if (!jobDescription.trim() || !resumeText.trim()) return null;
    const resume = resumeText.toLowerCase();
    const job = jobDescription.toLowerCase();
    const terms = KEYWORDS.filter((term) => new RegExp(`\\b${term}\\b`, "i").test(job));
    return { matched: terms.filter((term) => resume.includes(term)), missing: terms.filter((term) => !resume.includes(term)) };
  }, [jobDescription, resumeText]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(extension ?? "")) { setError("Choose a PDF, DOCX, or TXT file."); return; }
    if (file.size > MAX_FILE_SIZE) { setError("This file is over 5 MB. Choose a smaller resume file."); return; }
    if (file.size === 0) { setError("This file is empty. Choose a resume with content."); return; }
    setBusy(true);
    try {
      const text = await extractText(file);
      if (text.trim().length < 30) throw new Error("We could not find readable text. This may be a scanned PDF; try a text-based PDF or DOCX.");
      setResumeText(text);
      setFileName(file.name);
      setFileSize(formatBytes(file.size));
      setAnalysis(analyzeResume(text));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not read this file. Try another PDF, DOCX, or TXT resume.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) { void handleFile(event.target.files?.[0]); }
  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); void handleFile(event.dataTransfer.files[0]); }
  function onDragOver(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(true); }

  function analyzePastedText() {
    if (resumeText.trim().length < 30) { setError("Add at least a few lines of resume text first."); return; }
    setError("");
    setFileName("Pasted resume text");
    setFileSize("");
    setAnalysis(analyzeResume(resumeText));
  }

  function reset() {
    setAnalysis(null); setResumeText(""); setFileName(""); setFileSize(""); setJobDescription(""); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const sections = useMemo(() => splitResumeSections(resumeText), [resumeText]);

  return (
    <main className="studio-shell">
      <aside className="studio-rail">
        <Link className="wordmark rail-logo" href="/" aria-label="Proofline home"><span className="wordmark-mark">P</span><span className="rail-word">proofline</span></Link>
        <div className="rail-divider" />
        <p className="rail-label">YOUR WORKSPACE</p>
        <Link href="/studio" className="rail-link active"><FileText size={17} /> Resume check</Link>
        <button className="rail-link rail-disabled" type="button" title="Available in a future release"><FileCheck2 size={17} /> My versions <span className="soon-dot" /></button>
        <div className="rail-bottom"><div className="privacy-card"><ShieldCheck size={18} /><div><b>Private by default</b><p>Your resume is processed on this device in this preview.</p></div></div><Link href="/" className="rail-link"><ArrowLeft size={17} /> Back to home</Link></div>
      </aside>

      <div className="studio-main">
        <header className="studio-topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Resume check</b></div><div className="topbar-right"><span className="preview-pill"><span /> Preview mode</span><button className="help-button" type="button" title="Resume text stays in this browser tab"><CircleHelp size={18} /><span>How it works</span></button></div></header>
        <div className="studio-content">
          <div className="studio-heading"><div><p className="eyebrow">YOUR NEXT MOVE STARTS HERE</p><h1>{analysis ? "Make the good parts easier to find." : "Let’s make your experience clear."}</h1><p>{analysis ? "Review the signals, edit your story, and keep every change grounded in what you did." : "Start with the resume you have. We’ll check its structure and readability before suggesting a thing."}</p></div>{analysis && <button className="text-button" type="button" onClick={reset}><RotateCcw size={15} /> Start over</button>}</div>

          {!analysis ? <div className="start-grid">
            <section className="upload-panel" aria-labelledby="upload-title">
              <div className="panel-heading"><span className="panel-kicker">STEP 1 OF 3</span><span className="panel-step">Bring your resume</span></div>
              <div className={`drop-zone ${dragging ? "is-dragging" : ""} ${busy ? "is-busy" : ""}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={() => setDragging(false)}>
                <input ref={inputRef} className="visually-hidden" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={onInputChange} aria-label="Choose a resume file" />
                <div className="upload-mark">{busy ? <LoaderCircle size={23} className="spin" /> : <CloudUpload size={23} />}</div>
                <h2 id="upload-title">{busy ? "Reading your resume…" : "Drop your file here"}</h2>
                <p>{busy ? "Your file is being read on this device." : "PDF, DOCX, or TXT · up to 5 MB"}</p>
                {!busy && <button className="button button-dark" type="button" onClick={() => inputRef.current?.click()}>Choose a file <ArrowUpRight size={16} /></button>}
                <span className="or-label">or paste your resume text below</span>
              </div>
              <label className="paste-label" htmlFor="resume-text">Resume text</label>
              <textarea id="resume-text" className="paste-field" value={resumeText} onChange={(event) => setResumeText(event.target.value)} placeholder="Paste the text from your resume here…" rows={5} />
              <div className="upload-bottom"><span><LockKeyhole size={14} /> Stays on this device</span><button className="text-button" type="button" onClick={analyzePastedText}>Check pasted text <ArrowRight size={15} /></button></div>
              {error && <p className="error-message" role="alert"><X size={15} /> {error}</p>}
              <div className="format-note"><span className="format-type">PDF</span><span className="format-type">DOCX</span><span className="format-type">TXT</span><span>Readable text only. Scanned image PDFs need OCR.</span></div>
            </section>
            <aside className="side-note"><div className="note-symbol"><Sparkles size={19} /></div><h2>First, a clear read.</h2><p>We check for things that help a resume scan well: familiar sections, contact details, readable text, and evidence of your work.</p><div className="note-rule" /><div className="note-list"><span><Check size={15} /> No ATS pass/fail claims</span><span><Check size={15} /> No invented achievements</span><span><Check size={15} /> You decide what to change</span></div><p className="note-fine">This preview analyses text in your browser. Nothing is uploaded or saved.</p></aside>
          </div> : <div className="review-grid">
            <section className="editor-panel">
              <div className="editor-tabs"><button type="button" className={activeTab === "resume" ? "selected" : ""} onClick={() => setActiveTab("resume")}><Pencil size={15} /> Your resume</button><button type="button" className={activeTab === "job" ? "selected" : ""} onClick={() => setActiveTab("job")}><FileCheck2 size={15} /> Target role <span className="optional-tag">OPTIONAL</span></button></div>
              {activeTab === "resume" ? <>
                <div className="editor-file"><span className="file-icon"><FileText size={17} /></span><span className="file-title"><b>{fileName}</b><small>{analysis.wordCount.toLocaleString("en-IN")} words{fileSize ? ` · ${fileSize}` : ""} · extracted in browser</small></span><CheckCircle2 size={18} className="file-check" /></div>
                <label className="edit-label" htmlFor="resume-editor">Edit your extracted text <span>Changes stay in this tab</span></label>
                <textarea id="resume-editor" className="resume-editor" value={resumeText} onChange={(event) => { setResumeText(event.target.value); setAnalysis(analyzeResume(event.target.value)); }} spellCheck />
                <div className="editor-actions"><span><LockKeyhole size={14} /> Not saved to an account</span><button type="button" className="button button-dark" onClick={() => window.print()}><Printer size={16} /> Print / save PDF</button></div>
              </> : <div className="job-panel"><label className="edit-label" htmlFor="job-description">Paste the job description <span>We compare a short list of common terms</span></label><textarea id="job-description" className="job-editor" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the role description here…" /><p className="job-privacy"><LockKeyhole size={14} /> Your job description also stays in this browser tab.</p>{jobMatch && <div className="match-result"><h3>Term comparison</h3><p>This is a simple text comparison, not an assessment of your ability.</p>{jobMatch.matched.length > 0 && <div><b>Found in your resume</b><div className="term-list">{jobMatch.matched.map((term) => <span className="term found" key={term}><Check size={12} /> {term}</span>)}</div></div>}{jobMatch.missing.length > 0 && <div><b>Not mentioned in your resume</b><div className="term-list">{jobMatch.missing.map((term) => <span className="term missing" key={term}>{term}</span>)}</div><p className="term-hint">Only add a skill or experience if it accurately describes your work.</p></div>}{!jobMatch.matched.length && !jobMatch.missing.length && <p>No terms from the starter list were found in this description.</p>}</div>}</div>}
              <div className="editor-footnote"><ShieldCheck size={15} /><span>Every suggestion is a prompt to review, not a change made for you.</span></div>
            </section>
            <aside className="analysis-panel">
              <div className="analysis-header"><div><span className="panel-kicker">TEXT READABILITY</span><h2>What we found</h2></div><span className="score-ring" style={{ "--score": `${analysis.score * 3.6}deg` } as React.CSSProperties}><b>{analysis.score}</b><small>/100</small></span></div>
              <p className="score-explainer">A text-based checklist. Not an ATS acceptance score or hiring prediction.</p>
              <div className="finding-list">{analysis.findings.map((finding) => <article className="finding" key={finding.id}><span className={`finding-icon ${finding.severity}`}>{finding.severity === "good" ? <Check size={15} /> : finding.severity === "action" ? <ArrowRight size={15} /> : <Sparkles size={14} />}</span><div><h3>{finding.title}</h3><p>{finding.detail}</p></div></article>)}</div>
              <div className="analysis-footer"><span><ShieldCheck size={15} /> Based on extracted text</span><button type="button" className="icon-button" onClick={reset} aria-label="Remove resume"><X size={16} /></button></div>
            </aside>
            <article className="print-resume"><p className="print-brand">Proofline · Resume preview</p>{sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</article>
          </div>}

          <div className="studio-bottom-note"><span className="bottom-mark">i</span><p><b>Useful, not absolute.</b> Resume parsers differ. This check explains what we can see in your text; it cannot predict how a specific employer’s system will rank you.</p><Link href="/">About Proofline <ArrowUpRight size={14} /></Link></div>
        </div>
      </div>
      <footer className="studio-mobile-footer"><span>Proofline preview</span><span>Text stays on your device</span></footer>
    </main>
  );
}
