// App.jsx — Seamless AI Homepage · Main State Machine
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  INTRO_BEATS, INTRO_PILLS, RESPONSES,
  Logo, GhostMark, InputBar, MobileInputBar, MobileCardsPanel,
  PinnedPills, CompactCardStrip, ThemeToggle, CardRail, ContentPanel,
} from './components.jsx';
import CaseStudyOverlay from './CaseStudyOverlay.jsx';

/* ─── BEAT ──────────────────────────────────────────────────────── */
function Beat({ text, cls, state, age, slow }) {
  let classes = `beat ${cls}`;
  if (slow) classes += ' beat-slow';
  if (state === 'on') {classes += ' on';if (age > 0) classes += ` age-${Math.min(age, 3)}`;}
  if (state === 'gone') {classes += ' gone';}

  if (cls === 'beat-cta') {
    return (
      <div className={classes}>
        <button className="book-call-btn"
        onClick={() => window.open('mailto:hello@seamless.ai', '_blank')}>
          Book a call →
        </button>
        <p className="sign-off">
          — David Cervantes, AI Strategist · Seamless<br />
          Real conversations. Real workflows. Real results.
        </p>
      </div>);

  }
  return <div className={classes}>{text}</div>;
}

/* ─── LEFT COLUMN ───────────────────────────────────────────────── */
function LeftColumn({ taglineOn, beats, pillsOn, pills, onPillClick, dim, onHover, onWheel }) {
  /* Fade-mask the beats only when they actually overflow their box —
     re-checked after every render + once more after size transitions. */
  const flowRef = useRef(null);
  const [clipped, setClipped] = useState(false);
  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    const check = () => setClipped(el.scrollHeight > el.clientHeight + 1);
    check();
    const t = setTimeout(check, 650);
    window.addEventListener('resize', check);
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  });
  return (
    <div className={`col-left${dim ? ' dim' : ''}`} onMouseEnter={onHover} onWheel={onWheel}>
      <Logo />
      <div className={`tagline${taglineOn ? ' on' : ''}`}>
        <span className="tagline-text">ai without the noise.</span>
      </div>
      <div className="convo-zone" data-comment-anchor="1f5683a3fe-div-38-7">
        <div className={`beats-flow${clipped ? ' clipped' : ''}`} ref={flowRef}>
          {beats.map((b) =>
          <Beat key={b.id} text={b.text} cls={b.cls} state={b.state} age={b.age || 0} slow={b.slow} />
          )}
        </div>
        <div className={`pills-wrap${pillsOn ? ' on' : ''}`}>
          <div className="pills">
            {pills.map((p) =>
            <button key={p.id} className="pill" onClick={() => onPillClick(p)}>
                {p.label}
              </button>
            )}
          </div>
        </div>
      </div>
      <GhostMark />
    </div>);

}

/* ─── RIGHT COLUMN ──────────────────────────────────────────────── */
function RightColumn({ panelOn, panelType, isListening, onMicToggle, onSend, onCardClick }) {
  return (
    <div className="col-right">
      <CardRail onCardClick={onCardClick} />
      <ContentPanel active={panelOn} type={panelType} />
      <InputBar isListening={isListening} onMicToggle={onMicToggle} onSend={onSend} />
    </div>);

}

/* ─── APP ───────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const [mobileP2, setMobileP2] = useState(false);
  const [compactRevealed, setCompactRevealed] = useState(false);
  const appRef = useRef(null);

  /* Scroll mobile pager to a panel (0=convo, 1=cards) */
  const goMobilePanel = useCallback((panel) => {
    setMobileP2(panel === 1);
    if (appRef.current) {
      appRef.current.scrollTo({ left: panel === 1 ? window.innerWidth : 0, behavior: 'smooth' });
    }
  }, []);
  const [taglineOn, setTaglineOn] = useState(false);
  const [beats, setBeats] = useState(INTRO_BEATS.map((b) => ({ ...b, state: 'hidden', age: 0 })));
  const [pills, setPills] = useState(INTRO_PILLS);
  const [pillsOn, setPillsOn] = useState(false);
  const [phase, setPhase] = useState('intro');
  const [panelOn, setPanelOn] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [dim, setDim] = useState(false);
  const [listening, setListening] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  /* Scrollback: 0 = present; each step back re-enlarges one older beat */
  const [scrollback, setScrollback] = useState(0);
  const wheelRef = useRef({ acc: 0, last: 0 });
  const maxSRef = useRef(0);

  /* ── Opening sequence ── */
  useEffect(() => {
    const T = [];
    T.push(setTimeout(() => setTaglineOn(true), 400));

    let cursor = 600;
    INTRO_BEATS.forEach((beat, idx) => {
      T.push(setTimeout(() => {
        setBeats((prev) => prev.map((b, j) => {
          if (j === idx) return { ...b, state: 'on', age: 0 };
          if (b.state === 'on') return { ...b, age: (b.age || 0) + 1 };
          return b;
        }));
      }, cursor));
      cursor += 800 + beat.pause + 200;
    });

    T.push(setTimeout(() => {setPillsOn(true);setPhase('ready');}, cursor + 500));
    return () => T.forEach(clearTimeout);
  }, []);

  /* ── Pill click handler ── */
  const handlePill = useCallback((pill) => {
    if (phase !== 'ready' && phase !== 'response') return;

    /* "See case study." — open the document overlay, keep the conversation */
    if (pill.action === 'casestudy') {
      setCsOpen(true);
      return;
    }

    /* Sub-pill → close CTA */
    if (pill.action === 'close') {
      setPhase('responding');
      setScrollback(0);
      setPillsOn(false);
      setTimeout(() => {
        setBeats((prev) => prev.map((b) => b.state === 'on' ? { ...b, state: 'gone' } : b));
        setTimeout(() => {
          const cb = [
          { id: 'c1', text: "Let's set up 20 minutes.", cls: 'beat-xl', state: 'hidden', age: 0, pause: 0 },
          { id: 'c2', text: "No pitch. No deck. Just a real conversation about what you're working on and whether we can help.", cls: 'beat-lg', state: 'hidden', age: 0, pause: 0 },
          { id: 'c3', text: '', cls: 'beat-cta', state: 'hidden', age: 0, pause: 0 }];

          setBeats(cb);
          setPills([]);
          let t = 80;
          cb.forEach((b) => {
            setTimeout(() => setBeats((prev) => prev.map((x) => x.id === b.id ? { ...x, state: 'on' } : x)), t);
            t += 540;
          });
          setPhase('close');
          setPanelOn(false);
          setDim(false);
        }, 340);
      }, 80);
      return;
    }

    /* Main pill → respond */
    const resp = RESPONSES[pill.id];
    if (!resp) return;

    setPhase('responding');
    setScrollback(0);
    setPillsOn(false);
    goMobilePanel(1);
    setCompactRevealed(true);
    setTimeout(() => {
      setBeats((prev) => prev.map((b) => b.state === 'on' ? { ...b, state: 'gone' } : b));
      setTimeout(() => {
        const rb = [
        ...resp.paras.map((text, i) => ({ id: `r${pill.id}-${i}`, text, cls: 'beat-md', state: 'hidden', age: 0, pause: 0 })),
        { id: `r${pill.id}-ck`, text: resp.checkin, cls: 'beat-sm', state: 'hidden', age: 0, pause: 0 }];

        setBeats(rb);
        setPills(resp.pills);
        let t = 80;
        rb.forEach((b) => {
          setTimeout(() => setBeats((prev) => prev.map((x) => x.id === b.id ? { ...x, state: 'on' } : x)), t);
          t += 380;
        });
        setTimeout(() => {setPillsOn(true);setPhase('response');}, t + 200);
        if (resp.panel) {
          setPanelType(resp.panel);
          setTimeout(() => {setPanelOn(true);setDim(true);}, 460);
        }
      }, 340);
    }, 80);
  }, [phase]);

  /* Left column wheel — non-destructive history scrub.
     Wheel up = travel back: older beats re-enlarge to full size, newer
     content pushes down, pills pin at the column bottom (sticky).
     Wheel down = return to the present state. History is never deleted. */
  const handleWheel = useCallback((e) => {
    const w = wheelRef.current;
    const now = Date.now();
    if (now - w.last < 240) return; // settle time per step
    w.acc += e.deltaY;
    if (Math.abs(w.acc) < 30) return;
    const back = w.acc < 0; // wheel up = back in time
    w.acc = 0;
    w.last = now;
    setScrollback((s) => Math.max(0, Math.min(back ? s + 1 : s - 1, maxSRef.current)));
  }, []);

  /* Left column hover dismisses panel */
  const handleLeftHover = useCallback(() => {
    if (panelOn) {setPanelOn(false);setDim(false);}
  }, [panelOn]);

  /* Card click (desktop rail or revealed compact strip) → case study overlay */
  const handleCardClick = useCallback(() => {
    setCsOpen(true);
  }, []);

  /* Derived view: effective ages under scrollback. Scrubbing only
     DE-ages (restores original size) — it never shrinks a beat below
     its present size, and never adds/removes beats. */
  const onPos = [];
  beats.forEach((b, i) => { if (b.state === 'on') onPos.push(i); });
  const maxS = onPos.reduce((n, i) => n + ((beats[i].age || 0) > 0 ? 1 : 0), 0);
  maxSRef.current = maxS;
  const sNow = Math.min(scrollback, maxS);
  const focusPos = onPos.length - 1 - sNow;
  const beatsView = beats.map((b, i) => {
    if (b.state !== 'on') return b;
    const pos = onPos.indexOf(i);
    const eff = Math.max(0, Math.min(b.age || 0, focusPos - pos));
    return eff === (b.age || 0) ? b : { ...b, age: eff };
  });

  return (
    <div className={`app${dark ? ' dark' : ''}${compactRevealed ? ' compact-cards-open' : ''}`} ref={appRef}>
      <LeftColumn
        taglineOn={taglineOn}
        beats={beatsView}
        pillsOn={pillsOn}
        pills={pills}
        onPillClick={handlePill}
        dim={dim}
        onHover={handleLeftHover}
        onWheel={handleWheel} />

      <RightColumn
        panelOn={panelOn}
        panelType={panelType}
        isListening={listening}
        onMicToggle={() => setListening((p) => !p)}
        onSend={() => {}}
        onCardClick={handleCardClick} />

      <ThemeToggle dark={dark} onToggle={() => setDark((p) => !p)} />
      <PinnedPills pills={pills} pillsOn={pillsOn} onPillClick={handlePill} />
      <MobileInputBar onSend={() => { goMobilePanel(1); setCompactRevealed(true); }} />
      <MobileCardsPanel onBack={() => goMobilePanel(0)} />
      <CompactCardStrip
        revealed={compactRevealed}
        onReveal={() => setCompactRevealed(true)}
        onHide={() => setCompactRevealed(false)}
        onCardOpen={handleCardClick} />
      <CaseStudyOverlay open={csOpen} onClose={() => setCsOpen(false)} />
    </div>);

}
