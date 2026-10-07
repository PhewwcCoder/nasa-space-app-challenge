import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useArchive } from './stores/archive';

gsap.registerPlugin(ScrollTrigger);

/** Native scroll drives the existing world's camera; no second scene or canvas. */
export default function ScanTransition() {
  const scroller=useRef<HTMLDivElement>(null);
  const {inspect,setScanProgress,scanProgress}=useArchive();
  useEffect(()=>{
    const el=scroller.current!;
    el.focus();
    const trigger=ScrollTrigger.create({scroller:el,trigger:el.firstElementChild as HTMLElement,start:'top top',end:'bottom bottom',onUpdate:self=>setScanProgress(self.progress>=.995?1:self.progress)});
    return()=>trigger.kill();
  },[setScanProgress]);
  return <div ref={scroller} className="scan-scroll" tabIndex={0} role="region" aria-label="Scroll to scan hardware">
    <div className="scan-track"><div className="scan-sticky">
      <div className="scan-reticle" aria-hidden="true"><i/><span>ACQUIRING GEOMETRY</span></div>
      <div className="scan-caption"><p className="eyebrow">Sol-3 / HARDWARE SCAN</p><h2>Look a little closer.</h2><div className="scan-meter" role="progressbar" aria-label="Scan progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scanProgress*100)}><i style={{width:`${scanProgress*100}%`}}/></div><p>Scroll to move into the hardware.</p><button className="action" onClick={()=>scroller.current?.scrollTo({top:scroller.current.scrollHeight,behavior:'smooth'})}>Continue scan <span aria-hidden="true">↓</span></button><button className="quiet-button" onClick={()=>inspect(null)}>Return to surface</button></div>
    </div></div>
  </div>;
}
