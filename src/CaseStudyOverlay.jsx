// CaseStudyOverlay.jsx — Seamless AI Case Study Overlay
// Full-document overlay: right-anchored on desktop, full-screen below 1100px.
// Closes via X, backdrop click, swipe right, or Escape.
import React, { useRef, useEffect } from 'react';

export default function CaseStudyOverlay({ open, onClose }) {
  const csTouchRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function onTouchStart(e) {
    csTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - csTouchRef.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - csTouchRef.current.y);
    if (dx > 70 && dy < 60) onClose(); /* swipe right to dismiss */
  }

  return (
    <React.Fragment>
      <div className={`cs-backdrop${open ? ' open' : ''}`} onClick={onClose}></div>
      <button className={`cs-close${open ? ' open' : ''}`} onClick={onClose} aria-label="Close case study">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
      </button>
      <div className={`cs-overlay${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Case study"
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="cs-doc">
          <header className="cs-header">
            <img className="cs-hero" src="/assets/cs-hero.png" alt="Abstract 3D forms — case study cover" />
            <div className="cs-head-text">
              <p className="cs-eyebrow">Case study</p>
              <h2 className="cs-title">AI automation that modernizes <span className="cs-accent">SMB marketing</span></h2>
              <p className="cs-intro">Small marketing teams juggle endless tasks — drafting campaigns, personalizing content, and reporting on ROI. Our AI automation platform replaces bottlenecks with instant content drafts, real-time insights, and tailored recommendations — so directors focus on strategy, not spreadsheets.</p>
            </div>
          </header>

          <div className="cs-video">Video goes here</div>

          <section className="cs-section">
            <h3>Problem</h3>
            <p>Marketing directors at SMBs face content bottlenecks, shallow personalization, and disconnected reporting dashboards. Campaigns stall and insights arrive too late to act.</p>
            <ul>
              <li>Slow campaign creation</li>
              <li>Generic, one-size-fits-all content</li>
              <li>Delayed, fragmented performance data</li>
            </ul>
          </section>

          <section className="cs-section">
            <h3>AI solution</h3>
            <p>AI automates content drafts, delivers personalization at scale, and streams live performance dashboards — helping lean teams work like enterprises.</p>
            <ul>
              <li>Instant email &amp; ad copy generation</li>
              <li>Personalized recommendations by segment</li>
              <li>Real-time campaign insights &amp; ROI tracking</li>
            </ul>
          </section>

          <section className="cs-section">
            <h3>Impact</h3>
            <div className="cs-impact">
              <div className="cs-tile"><span className="cs-stat">−70%</span><span className="cs-tile-label">Content creation time</span></div>
              <div className="cs-tile"><span className="cs-stat">+25%</span><span className="cs-tile-label">Campaign engagement</span></div>
              <div className="cs-tile"><span className="cs-stat">Live</span><span className="cs-tile-label">ROI dashboards</span></div>
              <div className="cs-tile"><span className="cs-stat">↑ NPS</span><span className="cs-tile-label">Happier customers</span></div>
            </div>
          </section>

          <section className="cs-section">
            <h3>Outcomes</h3>
            <p>Early adopters report major efficiency gains and higher campaign ROI.</p>
            <div className="cs-outcomes">
              <div className="cs-card"><span className="cs-card-title">Minutes not days</span><span className="cs-card-label">Campaign drafts generated instantly</span></div>
              <div className="cs-card"><span className="cs-card-title">+25% CTR</span><span className="cs-card-label">Personalized subject lines &amp; offers</span></div>
              <div className="cs-card"><span className="cs-card-title">↓ Manual reports</span><span className="cs-card-label">Automated performance dashboards</span></div>
            </div>
          </section>

          <hr className="cs-rule" />

          <blockquote className="cs-quote">
            "Before AI automation, our small team spent more time reporting than creating. Now campaigns launch in hours, and I finally have real-time visibility into performance."
            <footer>— Marketing Director, SMB E-commerce</footer>
          </blockquote>

          <section className="cs-next">
            <h3 className="cs-next-title">What would you like to do next?</h3>
            <div className="cs-ctas">
              <button className="cs-cta outline" onClick={onClose}>Dive into another case study.</button>
              <button className="cs-cta filled" onClick={() => window.open('mailto:hello@seamless.ai', '_blank')}>Connect with us right away.</button>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}
