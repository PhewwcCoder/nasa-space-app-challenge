import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useArchive } from './stores/archive';
import { chapterSuggestions, misoFaqs } from './data/misoGuide';
import { launchExhibit } from './launchExhibit';

const portrait = '/textures/alien-cat.png';
const welcome = 'I’m your curious alien copilot. First, let’s look around! Scroll through the museum’s five mission stories, or choose a tab above. When something catches your eye, click its model or Explore to learn more.';
const invitation = 'Now you’ve had a look around, shall we begin with Apollo 11? We can try a Moon landing, follow the footprints, and discover how its hardware worked. Or keep browsing: this is your expedition.';
const eagle = 'Click Separate hardware to see the parts.';

function EagleHint() {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const target = document.querySelector<HTMLElement>('.separate-primary');
    if (!target) return;
    const place = () => {
      const rect = target.getBoundingClientRect();
      setPosition({ left: window.innerWidth > 760 ? rect.right + 14 : rect.left, top: window.innerWidth > 760 ? rect.top + rect.height / 2 : rect.bottom + 12 });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(target.parentElement ?? target);
    window.addEventListener('resize', place);
    return () => { observer.disconnect(); window.removeEventListener('resize', place); };
  }, []);
  if (!position) return null;
  return <><div className="miso-welcome-backdrop miso-eagle-backdrop" aria-hidden="true"/>
    <aside className="miso-eagle-hint" style={position} aria-label="Miso exploration tip" role="status"><img src={portrait} alt="Miso"/><p>{eagle}</p></aside>
  </>;
}

export default function MisoGuide() {
  const s = useArchive(useShallow(s => ({ browsed: s.museumBrowsed, exhibit: s.exhibit, stage: s.stage, chapter: s.chapter, inspector: s.inspector, selected: s.selected, exploded: s.exploded, marsWalking: s.marsWalking, ready: s.missionQuestionReady, dismissed: s.missionQuestionDismissed, tips: s.misoTipsDismissed, paused: s.paused })));
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const priorPause = useRef(false);
  const tipKey = s.stage === 'entry' ? !s.tips.includes('welcome') ? 'welcome' : s.browsed ? 'apollo-invite' : '' : s.inspector === 'eagle' ? 'eagle' : '';
  const tip = tipKey === 'welcome' ? welcome : tipKey === 'apollo-invite' ? invitation : eagle;
  const dismissTip = () => { if (tipKey) useArchive.getState().dismissMisoTip(tipKey); };
  const showTip = tipKey && tip && !s.tips.includes(tipKey) && !open && !s.paused && !(s.inspector === 'eagle' && (s.selected || s.exploded));
  const eagleDismissed = s.tips.includes('eagle');
  useEffect(() => {
    if (s.inspector !== 'eagle' || eagleDismissed) return;
    const timer = window.setTimeout(() => useArchive.getState().dismissMisoTip('eagle'), 3000);
    return () => window.clearTimeout(timer);
  }, [s.inspector, eagleDismissed]);
  const next = s.stage === 'entry' ? s.browsed ? 'Now that you’ve browsed the museum, my suggestion is Apollo 11. Return to its exhibit, then click its model or Explore button when you’re ready.' : 'First, look around the museum. Scroll inside the mission stories or choose a tab to browse the five exhibits. There’s no need to launch a mission yet.'
    : s.inspector === 'eagle' ? eagle
    : s.inspector ? 'You’re inspecting a clue. Try its component buttons or evidence actions, then read the lesson and its NASA source. Save discovery becomes available when you have explored its required steps.'
    : s.stage === 'approach' || s.stage === 'mars-landing' ? 'You’re landing! Use W/A/S/D or arrows to steer, and hold Space to brake. Enable flight assist if you want help lining up with the ring. You can pause while you get your bearings.'
    : s.marsWalking || s.stage === 'surface' ? 'Follow the footprints: hold W or Up to walk, or choose Skip walk. On the Moon, choose Explore the hardware when you reach the end.'
    : s.stage === 'identified' || s.ready && !s.dismissed ? 'Try the optional question, or choose Explore without answering. Then click an unknown clue to open its inspection.'
    : ['travel', 'mars-travel', 'opportunity-travel', 'voyager-travel', 'shuttle'].includes(s.stage) ? 'You’re on a fictional shuttle journey. Use the visible pause or skip controls whenever you want. On the Mars surface course, hold W or Up to advance, or try Cruise.'
    : chapterSuggestions[s.chapter] ?? 'Choose a clue on the surface to open it. Start with the metallic structure, try Separate hardware, and inspect each part. You can also open the Field Guide or write a question in your notebook.';

  useEffect(() => {
    if (s.inspector === 'eagle' && (s.selected || s.exploded)) useArchive.getState().dismissMisoTip('eagle');
  }, [s.inspector, s.selected, s.exploded]);
  useEffect(() => {
    if (s.stage !== 'entry') { useArchive.getState().dismissMisoTip('welcome'); useArchive.getState().dismissMisoTip('apollo-invite'); }
  }, [s.stage, s.inspector, s.chapter]);
  useEffect(() => {
    if (!open) return;
    const el = dialog.current;
    el?.showModal();
    return () => { el?.close(); };
  }, [open]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    useArchive.getState().setPaused(priorPause.current);
    trigger.current?.focus({ preventScroll: true });
  };
  return <>
    <button ref={trigger} className="miso-trigger" aria-label="Ask Miso" aria-haspopup="dialog" aria-expanded={open} aria-controls="miso-guide" onClick={() => { priorPause.current = useArchive.getState().paused; useArchive.getState().setPaused(true); setAnswer(0); setOpen(true); }}>
      <img src={portrait} alt=""/><span>Ask Miso</span>
    </button>
    {showTip && tipKey === 'welcome' && <div className="miso-welcome-backdrop" aria-hidden="true"/>}
    {showTip && tipKey === 'eagle' && <EagleHint/>}
    {showTip && tipKey !== 'eagle' && <aside className={`miso-tip ${tipKey === 'welcome' ? 'miso-welcome' : tipKey === 'apollo-invite' ? 'miso-museum-invite' : ''}`} aria-label={tipKey === 'welcome' ? 'Welcome from Miso' : tipKey === 'apollo-invite' ? 'Miso museum suggestion' : 'Miso exploration tip'}>
      <img src={portrait} alt="Miso, your fictional alien copilot"/>
      <div><p className="eyebrow">MISO / YOUR COPILOT</p>{tipKey === 'welcome' && <h2>Hi, explorer. I’m Miso.</h2>}{tipKey === 'apollo-invite' && <h2>A first step together?</h2>}<p>{tip}</p>
        <div className="miso-tip-actions">
          {tipKey === 'welcome' ? <button onClick={() => { dismissTip(); document.querySelector<HTMLElement>('.museum-scroll')?.focus({ preventScroll: true }); }}>Let’s browse the museum <span aria-hidden="true">↓</span></button> : <>
            {tipKey === 'apollo-invite' && <button onClick={() => {
              if (s.exhibit !== 0) window.dispatchEvent(new Event('miso-show-apollo'));
              else { dismissTip(); launchExhibit('apollo11'); }
            }}>{s.exhibit === 0 ? 'Explore with Miso' : 'Show me Apollo 11'} <span aria-hidden="true">↗</span></button>}
            <button onClick={() => { dismissTip(); trigger.current?.focus({ preventScroll: true }); }}>{tipKey === 'apollo-invite' ? 'Keep browsing' : 'Got it'}</button>
          </>}
        </div>
      </div>
    </aside>}
    {open && <dialog ref={dialog} id="miso-guide" className="miso-dialog" aria-labelledby="miso-title" onKeyDown={e => {
      e.stopPropagation();
      if (e.key !== 'Tab') return;
      const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('button');
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }} onCancel={e => { e.preventDefault(); close(); }}>
      <header><img src={portrait} alt=""/><div><p className="eyebrow">YOUR FICTIONAL COPILOT</p><h2 id="miso-title">Ask Miso</h2></div><button onClick={close} aria-label="Close Miso guide">×</button></header>
      <p className="miso-intro">A little help for your next discovery. Choose a question below.</p>
      <div className="miso-answer" aria-live="polite" aria-atomic="true"><h3>{misoFaqs[answer].question}</h3><p>{answer === 0 ? next : misoFaqs[answer].answer}</p></div>
      <nav aria-label="Questions for Miso">{misoFaqs.map((faq, i) => <button key={faq.question} aria-pressed={answer === i} onClick={() => { setAnswer(i); dialog.current?.scrollTo({ top: 0, behavior: 'instant' }); }}><span>{String(i + 1).padStart(2, '0')}</span>{faq.question}</button>)}</nav>
      <p className="miso-disclosure">12 prepared answers · No live chat · Your expedition pauses while this guide is open.</p>
    </dialog>}
  </>;
}
