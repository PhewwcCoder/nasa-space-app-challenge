import { useEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { exhibits } from './data/expedition';
import { useArchive } from './stores/archive';
import { launchExhibit } from './launchExhibit';
gsap.registerPlugin(ScrollTrigger);

export default function Museum() {
  const scroller = useRef<HTMLDivElement>(null);
  const exhibit = useArchive(s => s.exhibit);
  useEffect(() => {
    const root = scroller.current!;
    root.scrollTop = useArchive.getState().museumScroll;
    const triggers = Array.from(root.querySelectorAll<HTMLElement>('.museum-exhibit')).map((el, i) => ScrollTrigger.create({
      trigger: el, scroller: root, start: 'top center', end: 'bottom center',
      onEnter: () => useArchive.getState().setExhibit(i), onEnterBack: () => useArchive.getState().setExhibit(i),
    }));
    const remember = () => useArchive.setState({ museumScroll: root.scrollTop });
    root.addEventListener('scroll', remember, { passive: true });
    const resize = () => { const el = root.querySelectorAll<HTMLElement>('.museum-exhibit')[useArchive.getState().exhibit]; if (el) root.scrollTop = el.offsetTop; ScrollTrigger.refresh(); };
    window.addEventListener('resize', resize);

    return () => { triggers.forEach(t => t.kill()); root.removeEventListener('scroll', remember); window.removeEventListener('resize', resize); };
  }, []);
  const choose = (i: number) => {
    useArchive.getState().setExhibit(i);
    scroller.current?.querySelectorAll('.museum-exhibit')[i].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  return <section className="museum" aria-label="Exploration museum">
    <nav className="museum-nav" aria-label="Five missions">{exhibits.map((e, i) => <button key={e.id} aria-current={exhibit === i ? 'true' : undefined} onClick={() => choose(i)}><span>0{i + 1}</span>{e.name}</button>)}</nav>
    <div ref={scroller} className="museum-scroll" tabIndex={0} aria-label="Mission stories, scroll to explore">
      {exhibits.map((e, i) => <article className="museum-exhibit" key={e.id} style={{ '--exhibit': e.accent } as CSSProperties}>
        <p className="eyebrow">0{i + 1} / {e.place} / {e.year}</p>
        <h1>{e.name}</h1>
        <div className="museum-fact"><span>{e.metric}</span><p>{e.fact}</p><a href={e.source} target="_blank" rel="noreferrer">NASA story &#8599;</a></div>
        <button className="action" onClick={() => launchExhibit(e.id)}>Explore {e.name} <span aria-hidden="true">&#8599;</span></button>
      </article>)}
    </div>
    <button className="museum-model-target" aria-label={`Explore ${exhibits[exhibit].name} model`} onClick={() => launchExhibit(exhibits[exhibit].id)}/>
    <div className="museum-model-label" aria-live="polite"><h2>{exhibits[exhibit].name}</h2><p>Click the model to explore</p></div>
    <footer className="museum-footer"><span>FIVE MISSIONS. ONE HUMAN STORY.</span><span>SCROLL TO DISCOVER &#8595;</span><span>Educational reconstructions</span></footer>
  </section>;
}
