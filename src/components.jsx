// components.jsx — Seamless AI Homepage
import React, { useState, useEffect, useRef } from 'react';

/* ─── DATA ─────────────────────────────────────────────────────── */

export const INTRO_BEATS = [
  { id: 'i1', text: "Look — we're not going to pitch you.", cls: 'beat-xl', pause: 2400 },
  { id: 'i2', text: "Seamless builds AI that runs inside real businesses and solves real operational problems.", cls: 'beat-xl', pause: 2700, slow: true },
  { id: 'i3', text: "AI that fits your need and starts earning its keep.", cls: 'beat-lg', pause: 1600 },
  { id: 'i4', text: "So. What brought you here?", cls: 'beat-xl', pause: 0 },
];

export const INTRO_PILLS = [
  { id: 1, label: "We're ready. Let's go." },
  { id: 2, label: "Show me proof it works." },
  { id: 3, label: "Still figuring it out." },
  { id: 4, label: "My boss sent me here." },
];

export const RESPONSES = {
  1: {
    paras: [
      "That's the energy we like.",
      "No long sales process — just a 20-minute conversation to figure out if we're the right fit.",
      "If we are, we'll know fast.",
    ],
    checkin: "Does that work for you, or do you want to tell us a bit about the situation first?",
    pills: [
      { id: '1a', label: "Let's set up the call.", action: 'close' },
      { id: '1b', label: "Tell you more first.", action: 'close' },
    ],
    panel: null,
  },
  2: {
    paras: [
      "Fair question.",
      "We partner with operators in construction, real estate, and adjacent industries to build AI around real problems — not demos.",
      "One of our partners was losing money on coordination overhead they couldn't see coming. We built the tool around that exact problem. It's running now.",
    ],
    checkin: "Does that sound like the kind of work you were hoping to see?",
    pills: [
      { id: '2cs', label: "See case study.", action: 'casestudy' },
      { id: '2a', label: "Tell me more.", action: 'close' },
      { id: '2b', label: "What else have you built?", action: 'close' },
      { id: '2c', label: "That's enough — let's talk.", action: 'close' },
    ],
    panel: null,
  },
  3: {
    paras: [
      "That's actually the most common place people are when they find us.",
      "Here's the short version — Seamless sits at the intersection of AI strategy, product design, and the actual build.",
      "We don't hand you a report and disappear. We stay until it works.",
    ],
    checkin: "Is that the kind of help you're looking for — or is the situation something more specific?",
    pills: [
      { id: '3a', label: "That's exactly it.", action: 'close' },
      { id: '3b', label: "It's more specific.", action: 'close' },
      { id: '3c', label: "Who exactly is Seamless?", action: 'close' },
    ],
    panel: 'capabilities',
  },
  4: {
    paras: [
      "Solid instinct on their part.",
      "Here's what they probably heard — 25 years building products, a team that's been working together for five, and a few things already running in the real world.",
      "We're not a big firm. We don't try to be. Focused by design, not by default.",
    ],
    checkin: "Does that match what you were expecting to find — or were you looking for something specific?",
    pills: [
      { id: '4a', label: "Who are the people?", action: 'close' },
      { id: '4b', label: "What's the technology?", action: 'close' },
      { id: '4c', label: "Set up a call so your boss can hear it.", action: 'close' },
    ],
    panel: 'about',
  },
};

const PANEL_CONTENT = {
  casestudy: {
    eyebrow: "Case study",
    title: "Coordination overhead — solved.",
    body: [
      "The client was a mid-size construction operator losing 6–9% of project margin to coordination gaps — problems visible in hindsight but invisible in the moment.",
      "Seamless AI mapped the workflow, identified the signal that predicted overruns, and built a lightweight tool that surfaces that signal 72 hours in advance.",
      "It runs inside their existing stack. No new software to onboard. No training program. Just results.",
      "The tool has been live for eight months. Margin recovery is measurable. The team calls it 'the thing that makes the other things work.'",
    ]
  },
  capabilities: {
    eyebrow: "What Seamless AI does",
    title: "Strategy, design, and the actual build.",
    body: [
      "Most AI engagements end at the strategy document or the prototype. Seamless AI stays through deployment and operates until outcomes are real.",
      "The practice sits at the intersection of AI strategy, product design, and engineering. They own all three.",
      "Work typically starts with a focused discovery phase — two to four weeks — to understand the operational problem before touching any tools.",
      "From there: a defined scope, a working prototype, and a deployment plan. The team stays engaged until the work is earning its keep.",
    ]
  },
  about: {
    eyebrow: "About Seamless AI",
    title: "Focused by design, not by default.",
    body: [
      "Seamless AI was built around one premise: most AI projects fail not because of the technology, but because nobody owned the outcome.",
      "The practice is led by David Cervantes, AI Strategist — 25 years building products across construction, real estate, and adjacent industries.",
      "The core team has worked together for five years. Small by design — not by circumstance.",
      "Every engagement is a partnership. The goal: something working in the real world, not a deck.",
    ]
  }
};

/* ─── SVG PATH CONSTANTS ───────────────────────────────────────── */

const LP1 = "M22.2495 30.3536L27.177 25.4305C28.169 24.4394 28.169 22.8319 27.177 21.8407C26.1849 20.8496 24.576 20.8496 23.584 21.8407L18.1939 27.2261C15.312 30.1055 10.6224 30.1055 7.74179 27.2261C6.34591 25.8314 5.57739 23.9771 5.57739 22.004C5.57739 20.0308 6.34591 18.1765 7.74179 16.7818L19.7009 4.83318C20.6929 3.84203 20.6929 2.23451 19.7009 1.24336C18.7089 0.252213 17.0999 0.252213 16.1079 1.24336L4.14752 13.1933C-0.715841 18.0524 -0.715841 25.9581 4.14752 30.8159C4.18673 30.8551 4.22594 30.893 4.26515 30.9308H4.26385L12.9672 39.6279L22.2495 30.3536Z";
const LP2 = "M33.8516 15.1874C33.8124 15.1482 33.7731 15.1103 33.7339 15.0724H33.7352L25.0319 6.3754L15.7495 15.6496L10.8221 20.5727C9.83012 21.5639 9.83012 23.1714 10.8221 24.1625C11.8142 25.1537 13.4231 25.1537 14.4151 24.1625L19.8052 18.7772C22.6871 15.8977 27.3767 15.8977 30.2573 18.7772C31.6532 20.1718 32.4217 22.0262 32.4217 23.9993C32.4217 25.9725 31.6532 27.8268 30.2573 29.2214L18.2982 41.1701C17.3062 42.1612 17.3062 43.7687 18.2982 44.7599C19.2902 45.751 20.8991 45.751 21.8912 44.7599L33.8503 32.8113C38.7136 27.9522 38.7136 20.0465 33.8503 15.1887L33.8516 15.1874Z";

// Large ghost mark paths from LargeGradientS.svg
const GP1 = "M255.719 351.003L313.653 293.12C325.317 281.466 325.317 262.566 313.653 250.913C301.99 239.259 283.073 239.259 271.409 250.913L208.035 314.231C174.151 348.086 119.014 348.086 85.145 314.231C68.733 297.833 59.6972 276.031 59.6972 252.832C59.6972 229.633 68.733 207.83 85.145 191.433L225.754 50.9472C237.417 39.2938 237.417 20.3934 225.754 8.74005C214.09 -2.91335 195.173 -2.91335 183.51 8.74005L42.8856 149.241C-14.2952 206.372 -14.2952 299.323 42.8856 356.438C43.3466 356.899 43.8076 357.344 44.2687 357.789H44.2533L146.583 460.044L255.719 351.003Z";
const GP2 = "M392.13 172.686C391.669 172.226 391.208 171.781 390.747 171.335H390.762L288.433 69.0801L179.296 178.122L121.362 236.005C109.698 247.658 109.698 266.558 121.362 278.212C133.026 289.865 151.942 289.865 163.606 278.212L226.98 214.893C260.864 181.039 316.001 181.039 349.87 214.893C366.282 231.291 375.318 253.093 375.318 276.293C375.318 299.492 366.282 321.294 349.87 337.692L209.262 478.177C197.598 489.831 197.598 508.731 209.262 520.384C220.925 532.038 239.842 532.038 251.506 520.384L392.114 379.899C449.295 322.768 449.295 229.817 392.114 172.702L392.13 172.686Z";

/* ─── COMPONENTS ────────────────────────────────────────────────── */

export function Logo() {
  return (
    <div className="logo">
      <svg width="37" height="45" viewBox="0 0 38 46" fill="none" aria-hidden="true">
        <path d={LP1} fill="#F54900"/>
        <path d={LP2} fill="#F54900"/>
      </svg>
      <span className="logo-text">seamless<span className="logo-ai">.ai</span></span>
    </div>
  );
}

export function GhostMark() {
  return (
    <div className="ghost-mark" aria-hidden="true">
      <svg viewBox="-20 -5 470 532" fill="none" width="100%">
        <path d={GP1} fill="currentColor"/>
        <path d={GP2} fill="currentColor"/>
      </svg>
    </div>
  );
}

export function InputBar({ isListening, onMicToggle, onSend }) {
  const [val, setVal] = useState('');
  function handleKey(e) {
    if (e.key === 'Enter' && val.trim()) { onSend(val); setVal(''); }
  }
  return (
    <div className={`input-bar${isListening ? ' listening' : ''}`}>
      <svg width="20" height="24" viewBox="0 0 38 46" fill="none"
           className="input-mark" style={{ flexShrink: 0, color: 'var(--signal-orange)' }} aria-hidden="true">
        <path d={LP1} fill="currentColor"/>
        <path d={LP2} fill="currentColor"/>
      </svg>
      <input
        className="input-field"
        placeholder={isListening ? "Listening..." : "Type your role or challenge"}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={handleKey}
      />
      <button className="input-icon mic" onClick={onMicToggle} title="Voice input">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="11" rx="3"/>
          <path d="M5 10a7 7 0 0 0 14 0"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
      </button>
      <button className="input-icon input-send"
              onClick={() => { if (val.trim()) { onSend(val); setVal(''); } }} title="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2z"/>
        </svg>
      </button>
    </div>
  );
}

export function ThemeToggle({ dark, onToggle }) {
  return (
    <div className="theme-toggle">
      <button className={`toggle-btn${!dark ? ' on' : ''}`}
              onClick={() => dark && onToggle()} title="Light mode">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>
      <button className={`toggle-btn${dark ? ' on' : ''}`}
              onClick={() => !dark && onToggle()} title="Dark mode">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  );
}

export function CardRail({ onCardClick }) {
  const cards = ['card-teal', 'card-blue', 'card-marble', 'card-marble', 'card-teal', 'card-blue'];
  const panelFor = { 'card-teal': 'casestudy', 'card-blue': 'capabilities', 'card-marble': 'about' };
  return (
    <div className="card-rail">
      {cards.map((c, i) =>
      <div key={i} className={`card-item ${c}`} role="button" tabIndex={0}
        onClick={() => onCardClick && onCardClick(panelFor[c])}
        onKeyDown={(e) => { if (e.key === 'Enter' && onCardClick) onCardClick(panelFor[c]); }}></div>
      )}
    </div>
  );
}

export function ContentPanel({ active, type }) {
  const [visIdx, setVisIdx] = useState(-1);
  const content = type ? PANEL_CONTENT[type] : null;

  useEffect(() => {
    setVisIdx(-1);
    if (!active || !content) return;
    const total = 2 + content.body.length;
    let t = 540;
    for (let i = 0; i < total; i++) {
      const idx = i;
      setTimeout(() => setVisIdx(idx), t);
      t += 310;
    }
  }, [active, type]);

  return (
    <div className={`content-panel${active ? ' on' : ''}`}>
      {content && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p className={`panel-line${visIdx >= 0 ? ' on' : ''}`}
             style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 500,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--signal-orange)', marginBottom: '18px' }}>
            {content.eyebrow}
          </p>
          <h2 className={`panel-line${visIdx >= 1 ? ' on' : ''}`}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2vw, 28px)',
                       fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '22px' }}>
            {content.title}
          </h2>
          {content.body.map((para, i) => (
            <p key={i} className={`panel-line${visIdx >= i + 2 ? ' on' : ''}`}
               style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 400,
                        lineHeight: 1.68, marginBottom: i < content.body.length - 1 ? '14px' : 0 }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileInputBar({ onSend }) {
  const [val, setVal] = useState('');
  const [listening, setListening] = useState(false);
  function handleKey(e) {
    if (e.key === 'Enter' && val.trim()) { onSend(val); setVal(''); }
  }
  return (
    <div className={`mobile-input${listening ? ' listening' : ''}`}>
      <svg width="16" height="20" viewBox="0 0 38 46" fill="none"
           style={{ flexShrink: 0, color: 'var(--signal-orange)' }} aria-hidden="true">
        <path d={LP1} fill="currentColor"/>
        <path d={LP2} fill="currentColor"/>
      </svg>
      <input
        className="input-field"
        placeholder={listening ? 'Listening...' : 'Type your role or challenge'}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={handleKey}
      />
      <button className="input-icon mic" onClick={() => setListening(p => !p)}
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--mid-gray)', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="11" rx="3"/>
          <path d="M5 10a7 7 0 0 0 14 0"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
      </button>
      <button className="input-icon input-send"
              onClick={() => { if (val.trim()) { onSend(val); setVal(''); } }}
              style={{ color: 'var(--signal-orange)', background: 'none', border: 'none', padding: '4px', cursor: 'pointer', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2z"/>
        </svg>
      </button>
    </div>
  );
}

export function MobileCardRail() {
  const [revealed, setRevealed] = useState(false);
  const touchRef = useRef({ startX: 0 });

  function onTouchStart(e) {
    touchRef.current.startX = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchRef.current.startX;
    if (delta > 40) setRevealed(true);
    if (delta < -40) setRevealed(false);
  }

  return (
    <div
      className={`mobile-card-rail${revealed ? ' revealed' : ''}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-hidden="true"
    >
      <div className="card-item card-teal"></div>
      <div className="card-item card-blue"></div>
      <div className="card-item card-marble"></div>
      <div className="card-item card-marble"></div>
      <div className="card-item card-teal"></div>
      <div className="card-item card-blue"></div>
    </div>
  );
}

export function MobileCardsPanel({ onBack }) {
  const touchRef = useRef({ startX: 0 });
  function onTouchStart(e) { touchRef.current.startX = e.touches[0].clientX; }
  function onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchRef.current.startX;
    if (delta > 60) onBack();
  }
  return (
    <div className="mobile-cards-panel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button className="mobile-cards-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
        </svg>
        Back
      </button>
      <div className="mobile-card-item card-teal"></div>
      <div className="mobile-card-item card-blue"></div>
      <div className="mobile-card-item card-marble"></div>
      <div className="mobile-card-item card-marble"></div>
      <div className="mobile-card-item card-teal"></div>
      <div className="mobile-card-item card-blue"></div>
    </div>
  );
}

export function PinnedPills({ pills, pillsOn, onPillClick }) {
  return (
    <div className={`pinned-pills${pillsOn ? ' on' : ''}`}>
      {pills.map(p => (
        <button key={p.id} className="pill" onClick={() => onPillClick(p)}>{p.label}</button>
      ))}
    </div>
  );
}

export function CompactCardStrip({ revealed, onReveal, onHide, onCardOpen }) {
  const touchRef = useRef({ startX: 0 });
  const mouseRef = useRef({ down: false, startX: 0 });

  function onTouchStart(e) { touchRef.current.startX = e.touches[0].clientX; }
  function onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(delta) < 8) {
      if (revealed) { if (onCardOpen) onCardOpen(); } else { onReveal(); }
      return;
    }
    if (delta < -40) onReveal();
    if (delta > 40) onHide();
  }
  function onMouseDown(e) { mouseRef.current = { down: true, startX: e.clientX }; }
  function onMouseUp(e) {
    if (!mouseRef.current.down) return;
    const delta = e.clientX - mouseRef.current.startX;
    mouseRef.current.down = false;
    if (Math.abs(delta) < 8) {
      if (revealed) { if (onCardOpen) onCardOpen(); } else { onReveal(); }
      return;
    }
    if (delta < -40) onReveal();
    if (delta > 40) onHide();
  }
  function onMouseLeave(e) {
    if (!mouseRef.current.down) return;
    const delta = e.clientX - mouseRef.current.startX;
    mouseRef.current.down = false;
    if (delta < -40) onReveal();
  }

  return (
    <>
      {revealed && <div className="compact-overlay" onClick={onHide} />}
      <div
        className={`compact-card-strip${revealed ? ' revealed' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ userSelect: 'none', cursor: revealed ? 'default' : 'pointer' }}
      >
        <div className="card-item card-teal"></div>
        <div className="card-item card-blue"></div>
        <div className="card-item card-marble"></div>
        <div className="card-item card-marble"></div>
        <div className="card-item card-teal"></div>
        <div className="card-item card-blue"></div>
      </div>
    </>
  );
}
