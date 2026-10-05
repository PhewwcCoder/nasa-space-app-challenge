import { useEffect, useRef, useState } from 'react';
import { useArchive } from './stores/archive';
import { spiritArtifacts, spiritIds, spiritParts, spiritSources, type SpiritArtifactId } from './data/spirit';
import PartPoster from './PartPoster';
import { PhotoReveal } from './Learning';

export function SpiritTravelHUD(){
  const {travelProgress,paused,setPaused,setStage}=useArchive();
  return <><div className="travel-veil" style={{opacity:Math.max(0,1-Math.abs(travelProgress-.5)/.13)}}/><section className="travel-hud" aria-label="Travel to Gusev Crater"><p className="eyebrow">ARCHIVE TRANSIT / 02 → 03</p><h2>{travelProgress<.5?'Beyond a small beginning.':'A different question in the dust.'}</h2><p className="eyebrow">ARES VALLIS → GUSEV CRATER / COMPRESSED FICTIONAL TRAVEL</p><div className="travel-line"><i style={{width:`${travelProgress*100}%`}}/></div><button className="quiet-button" onClick={()=>setPaused(!paused)}>{paused?'Resume journey':'Pause journey'}</button><button className="quiet-button" onClick={()=>{setPaused(false);setStage('spirit');}}>Skip travel</button></section></>;
}

export function SpiritSurface(){
  const {spiritApproached,approachSpirit,identified,discovered,inspect}=useArchive();
  const count=spiritIds.filter(id=>discovered.includes(id)).length;
  const available=spiritIds.filter(id=>id!=='spiritLog'||count>=4||discovered.includes(id));
  return <>
    <div className="site-caption mars-caption"><p className="eyebrow">CH-03 / GUSEV CRATER</p><h1>{count===5?'A question outlives its explorer.':identified.includes('spirit')?'What did the stones remember?':'A taller shadow in the dust.'}</h1><p>{count===5?'FIVE RECORDS RECOVERED':spiritApproached?'Read the machine. Then read the world it studied.':'Another human trace. Another reason to explore.'}</p></div>
    {!spiritApproached?<div className="mars-approach"><p>Its wheels stopped. Its evidence did not.</p><button className="action" onClick={approachSpirit}>Approach the trace ↗</button></div>:<nav className="discovery-dock mars-dock spirit-dock" aria-label="Spirit discoveries">{available.map((id,i)=><button key={id} data-artifact={id} onClick={()=>inspect(id)}><span>{discovered.includes(id)?'✓':`0${i+1}`}</span><strong>{identified.includes(id)?spiritArtifacts[id].name:spiritArtifacts[id].unknownName}</strong><small>{discovered.includes(id)?'ARCHIVED':identified.includes(id)?'INSPECT ↗':'DETECT / SCAN ↗'}</small></button>)}</nav>}
    <div className="mars-site-note">{count} / 05 RECORDS<br/>COMPOSITE SCIENCE LANDSCAPE<br/>SITES AND DISTANCES ARE SCHEMATIC</div>
    {count===5&&<aside className="spirit-next-signal"><p className="eyebrow">A SECOND SIGNATURE / ARCHIVE MATCH</p><h2>It had a twin.</h2><p>Opportunity. Another explorer, on another part of Mars.</p><small>CHAPTER 04 / SIGNAL RECORDED · NOT YET AVAILABLE</small></aside>}
  </>;
}

const investigations = {
  abrasion: {photo:'spiritAbrasion',prompt:'Why scratch the surface of a rock?',actions:['Brush away dust','Grind the weathered layer','Examine the exposed interior'],steps:['Loose dust is cleared so the tool can work against rock.','The rotating Rock Abrasion Tool exposes material below the weathered surface.','Now the instruments can compare the exposed material with the outer surface.'],diagram:['DUST','WEATHERED ROCK','EXPOSED INTERIOR']},
  silica: {photo:'spiritSilica',prompt:'Can a broken wheel uncover a clue?',actions:['Follow the dragged wheel','Read the chemical measurement','Interpret the water clue'],steps:['A dragging wheel exposed this bright soil in 2007. The photograph is real; the ground beside you is illustrative.','NASA reported approximately 90 percent silica in the target. This is an archived finding, not a measurement made by this game.','Hot water or acidic steam could have concentrated silica. These alternatives point to past water; neither is proof of life.'],diagram:['EXPOSE','MEASURE','INTERPRET']},
  spiritLanding: {photo:'spiritHardware',prompt:'What had to stay behind so this journey could begin?',actions:['Locate the descent hardware','Connect landing to exploration'],steps:['This orbital image identifies Spirit’s backshell and parachute at the landing site.','Airbags cushioned arrival. Spirit drove off its lander at Columbia Memorial Station, then explored far beyond it.'],diagram:['DESCENT','LANDER','ROVER JOURNEY']},
  spiritLog: {photo:'spiritRover',prompt:'How much can an explorer do beyond its plan?',actions:['Recover the mission timeline'],steps:['90 sols planned. More than six years of exploration. 7.73 kilometers traveled. Last contact: March 22, 2010.'],diagram:['2004 / ARRIVAL','2009 / TROY','2010 / SILENCE']},
} as const;

export function SpiritInspector({id}:{id:SpiritArtifactId}){
  const {identified,identify,scanProgress,setScanProgress,inspect,selected,select,inspectedParts,exploded,toggleExploded,isolated,toggleIsolated,resetView,discover,evidenceStep,setEvidenceStep}=useArchive();
  const close=useRef<HTMLButtonElement>(null);const note=useRef<HTMLElement>(null);const [scanning,setScanning]=useState(false);
  const a=spiritArtifacts[id],known=identified.includes(id),story=id==='spirit'?null:investigations[id];
  const ready=known&&(id==='spirit'?spiritParts.every(p=>inspectedParts.includes(p.id)):evidenceStep>=(story?.actions.length??1));
  useEffect(()=>{close.current?.focus();},[]);
  useEffect(()=>{if(!scanning)return;let frame=0,p=0,last=performance.now();const tick=(now:number)=>{if(!useArchive.getState().paused)p+=Math.min(now-last,100)/1400;last=now;if(matchMedia('(prefers-reduced-motion: reduce)').matches)p=1;setScanProgress(Math.min(1,p));if(p>=1){identify(id);setScanning(false);}else frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[scanning,id,identify,setScanProgress]);
  return <section className="investigation mars-investigation spirit-investigation" role="region" aria-label="Artifact inspection">
    <div className="investigation-title"><p className="eyebrow">{a.code} / {known?'SPATIAL ANALYSIS':'UNIDENTIFIED HARDWARE'}</p><h2>{known?a.name:a.unknownName}</h2></div>
    <button ref={close} className="exit-inspection" onClick={()=>inspect(null)}>ESC / Return to surface <span>×</span></button>
    {!known?<div className="mars-scan-panel"><p className="eyebrow">{scanning?'MATCHING THE ARCHIVE':'TRACE ACQUIRED'}</p><div className="travel-line"><i style={{width:`${scanProgress*100}%`}}/></div><button className="action" disabled={scanning} onClick={()=>setScanning(true)}>{scanning?'Scanning…':'Scan object'}</button><small>Historical evidence within a fictional expedition.</small></div>:<>
      {id==='spirit'?<>
        <nav className="component-switch" aria-label="Hardware components">{spiritParts.map((p,i)=><button key={p.id} aria-pressed={selected===p.id} onClick={()=>select(p.id)}><span>0{i+1}</span>{p.name}<small>{selected===p.id?'✓':'+'}</small></button>)}</nav>
        {selected&&<PartPoster part={`spirit-${selected}`} conclusion={ready?a.interpretation:undefined}/>}
        <div className="mars-model-tools"><button className="quiet-button" aria-pressed={exploded} onClick={toggleExploded}>{exploded?'Assemble':'Separate'} hardware</button><button className="quiet-button" disabled={!selected} aria-pressed={isolated} onClick={toggleIsolated}>{isolated?'Show all parts':'Isolate selection'}</button><button className="quiet-button" onClick={resetView}>Reset view</button>{['left','right','in','out'].map((v,i)=><button key={v} className="quiet-button" aria-label={['Rotate model left','Rotate model right','Zoom in','Zoom out'][i]} onClick={()=>window.dispatchEvent(new CustomEvent('model-control',{detail:v}))}>{['↶','↷','+','−'][i]}</button>)}</div>
        <p className="mars-orbit-hint">Drag to orbit / Scroll to zoom / Reference-based rover reconstruction</p>
      </>:story&&<aside ref={note} className="part-poster floating-lesson mars-note" tabIndex={0} aria-label={`${a.name} field note`}>
        <header className="poster-presenter"><img src="/textures/alien-cat.png" alt="Miso the alien cat"/><div><span>MISO’S DISCOVERY</span><p>{story.prompt}</p></div></header>
        <h3>{id==='spiritLog'&&!ready?'A mission record, unread':a.subtitle}</h3><PhotoReveal photo={story.photo}/>
        <ol className="evidence-workflow" aria-label="Investigation steps">{story.diagram.map((label,i)=><li key={label} className={evidenceStep>i?'observed':''}>{label}</li>)}</ol>
        <p className="mars-reconstruction">Interactive reconstruction / no live science data.</p>
        {evidenceStep<story.actions.length&&<button className="action" onClick={()=>{setEvidenceStep(evidenceStep+1);requestAnimationFrame(()=>note.current?.querySelector<HTMLElement>('[role="status"]')?.scrollIntoView({block:'nearest'}));}}>{story.actions[evidenceStep]}</button>}
        {evidenceStep>0&&<p className="lesson-prose" role="status">{story.steps[evidenceStep-1]}</p>}
        {ready&&<><p className="lesson-prose">{a.purpose}</p><p className="evidence-conclusion poster-conclusion"><small>FICTIONAL ALIEN INTERPRETATION</small>{a.interpretation}</p><button className="quiet-button replay-evidence" onClick={()=>setEvidenceStep(0)}>Replay investigation</button></>}
        <a className="poster-source" href={a.source} target="_blank" rel="noreferrer">Read the NASA source ↗</a>
      </aside>}
      <div className="archive-action"><button className="action" disabled={!ready} onClick={()=>{discover(id);inspect(null);}}>{ready?'Archive discovery':id==='spirit'?`Inspect all parts / ${inspectedParts.length} of 3`:'Investigation incomplete'}</button></div>
    </>}
  </section>;
}

export function SpiritGuideBody(){
  const {identified,discovered}=useArchive();
  return <div className="learning-body"><p className="eyebrow">NASA EVIDENCE / GUSEV CRATER</p><h2 id="learning-title">Spirit: reading the history of water.</h2><p className="learning-intro">A mobile laboratory learned to read a planet through its rocks. Your recovered evidence appears below.</p><div className="learning-story"><PhotoReveal photo="spiritRover"/><article><h3>A new scale of exploration</h3><p>After Sojourner’s small beginning, Spirit carried a mast, a broad solar deck and a robotic science arm. It landed in Gusev Crater on January 4, 2004 UTC (January 3 in California).</p><p>A mineral can retain evidence of an environment that no longer exists. Spirit helped investigate whether water had once altered the rocks and soil.</p><a href={spiritSources.mission} target="_blank" rel="noreferrer">NASA / Spirit mission ↗</a></article></div>
    {spiritIds.filter(id=>identified.includes(id)).map(id=><section className="spirit-guide-record" key={id}><h3>{spiritArtifacts[id].name}</h3><p>{id==='spiritLog'&&!discovered.includes(id)?'Recover the mission timeline to read this record.':spiritArtifacts[id].purpose}</p><a href={spiritArtifacts[id].source} target="_blank" rel="noreferrer">NASA evidence ↗</a></section>)}
    <h3>How to read this reconstruction</h3><p>The 3D rover is a Blender-refined reconstruction based on NASA’s shared Spirit and Opportunity model. Added hardware detail, selection groups, separation, terrain and the nearby evidence stations are authored teaching aids. These stations combine events from different years and places; they are not an exact archaeological survey or a claim about surviving tracks. Photographs show the dates and locations in their captions. Miso’s interpretations and archive travel are fiction.</p>
    <a href={spiritSources.model} target="_blank" rel="noreferrer">NASA / VTAD model provenance ↗</a>
  </div>;
}
