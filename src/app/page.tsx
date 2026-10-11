import Link from "next/link";
import { ArrowUpRight, Check, FileText, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  { number: "01", title: "Start with your story", copy: "Bring the resume you have. Your details stay yours while you work." },
  { number: "02", title: "See what needs attention", copy: "Get clear, practical feedback on structure, readability, and the role you want." },
  { number: "03", title: "Make it yours", copy: "Edit every suggestion, then export a clean, readable resume when it feels right." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Proofline home"><span className="wordmark-mark">P</span>proofline</Link>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <Link className="header-login" href="/studio">Open studio <ArrowUpRight size={16} /></Link>
        </nav>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A thoughtful resume studio</p>
          <h1>Make your next move <span>with a resume that sounds like you.</span></h1>
          <p className="hero-deck">Clear feedback. Honest improvements. A resume that makes your real work easier to see.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/studio">Improve my resume <ArrowUpRight size={17} /></Link>
            <span className="quiet-note"><ShieldCheck size={16} /> Your files stay on this device in this preview</span>
          </div>
          <div className="hero-proof"><span className="proof-line" /><span>Built for people, readable by hiring systems</span></div>
        </div>

        <div className="hero-art" aria-label="Resume feedback preview">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="resume-sheet">
            <div className="sheet-top"><span>PROFILE / 2025</span><span className="sheet-status"><i /> readable</span></div>
            <h2>Priya Sharma</h2>
            <p className="sheet-role">Product designer · Bengaluru</p>
            <div className="sheet-rule" />
            <p className="sheet-section-title">EXPERIENCE</p>
            <div className="sheet-entry"><b>Product Designer</b><span>Northstar · 2022 — now</span></div>
            <div className="sheet-lines"><i /><i /><i /></div>
            <div className="sheet-entry second"><b>Associate Designer</b><span>Studio Field · 2020 — 2022</span></div>
            <div className="sheet-lines short"><i /><i /></div>
            <div className="sheet-highlight"><span className="highlight-icon"><Check size={15} /></span><span><b>Good signal</b><small>Clear role titles and dates</small></span></div>
          </div>
          <div className="score-note"><span className="score-number">82</span><span><b>Readability</b><small>Room to improve</small></span><span className="score-spark"><Sparkles size={17} /></span></div>
          <div className="art-caption"><FileText size={14} /> A clearer picture of your work</div>
        </div>
      </section>

      <section className="trust-strip"><div className="wrap trust-inner"><span>No hiring promises. Just useful clarity.</span><span className="trust-separator" /><span>One-time credits</span><span className="trust-separator" /><span>Made for the Indian job search</span></div></section>

      <section className="how-section wrap" id="how-it-works">
        <div className="section-heading"><p className="eyebrow">A better process</p><h2>Good work deserves <span>to be understood.</span></h2><p>Make the important parts easier to find, without turning your experience into someone else’s story.</p></div>
        <div className="steps-list">{steps.map((step) => <article className="step-row" key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p><ArrowUpRight size={18} className="step-arrow" /></article>)}</div>
      </section>

      <section className="pricing-section" id="pricing"><div className="wrap pricing-inner"><div><p className="eyebrow">Straightforward by design</p><h2>Pay for a version.<br /><span>Keep your choices.</span></h2><p className="pricing-copy">Start with a free readability check. Choose a one-time plan only when you are ready to create and export.</p></div><div className="pricing-offer"><div className="offer-top"><span>STARTER</span><span className="offer-tag">One-time</span></div><p className="offer-price"><span>₹</span>49</p><p className="offer-detail">One improved resume version and PDF export.</p><Link className="button button-light" href="/studio">Try the free check <ArrowUpRight size={16} /></Link><p className="offer-footnote">No subscription. No payment in this preview.</p></div></div></section>

      <footer className="site-footer wrap"><Link className="wordmark" href="/"><span className="wordmark-mark">P</span>proofline</Link><span>Useful feedback, grounded in your experience.</span><span>© 2025 Proofline</span></footer>
    </main>
  );
}
