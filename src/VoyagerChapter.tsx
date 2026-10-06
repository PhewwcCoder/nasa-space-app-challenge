import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef, useState } from 'react';
import { useArchive } from './stores/archive';
import { voyagerArtifacts, voyagerIds, voyagerParts, voyagerSources, voyagerInvestigations, type VoyagerArtifactId } from './data/voyager';
import PartPoster from './PartPoster';
import { PhotoReveal } from './Learning';

export function VoyagerTravelHUD(){
 const {travelProgress:p,paused,setPaused,setStage}=useArchive(useShallow(s=>({travelProgress:s.travelProgress,paused:s.paused,setPaused:s.setPaused,setStage:s.setStage})));
 return <><div className="travel-veil" style={{opacity:Math.max(0,1-Math.abs(p-.5)/.14)}}/><section className="travel-hud" aria-label="Travel to deep space"><p className="eyebrow">ARCHIVE TRANSIT / 04 / 05</p><h2>{p<.5?'One last whisper beyond Mars.':'Someone sent a message this far.'}</h2><p className="eyebrow">COMPRESSED FICTIONAL TRAVEL / NOT A REAL FLIGHT PATH</p><div className="travel-line"><i style={{width:`${p*100}%`}}/></div><button className="quiet-button" onClick={()=>setPaused(!paused)}>{paused?'Resume journey':'Pause journey'}</button><button className="quiet-button" onClick={()=>{setPaused(false);setStage('voyager');}}>Skip travel</button></section></>;
}
export function VoyagerSurface(){
 const {voyagerApproached,approachVoyager,identified,discovered,inspect}=useArchive(useShallow(s=>({voyagerApproached:s.voyagerApproached,approachVoyager:s.approachVoyager,identified:s.identified,discovered:s.discovered,inspect:s.inspect})));
 const count=voyagerIds.filter(id=>discovered.includes(id)).length;
 return <><div className="site-caption mars-caption"><p className="eyebrow">CH-05 / BETWEEN THE STARS</p><h1>{count===5?'A message for whoever came next.':identified.includes('voyager')?'How do you say hello to a stranger?':'Something is still traveling.'}</h1><p>{count===5?'FIVE RECORDS / ONE SMALL WORLD':'Miso has run out of planets. Not questions.'}</p></div>
 {!voyagerApproached?<div className="mars-approach"><p>&ldquo;No wheels. No landing legs. Where was it going?&rdquo;</p><button className="action" onClick={approachVoyager}>Approach the distant traveler</button></div>:<nav className="discovery-dock mars-dock spirit-dock voyager-dock" aria-label="Voyager discoveries">{voyagerIds.filter(id=>id!=='voyagerMessage'||count>=4||discovered.includes(id)).map((id,i)=><button key={id} data-artifact={id} onClick={()=>inspect(id)}><span>{discovered.includes(id)?'\u2713':`0${i+1}`}</span><strong>{identified.includes(id)?voyagerArtifacts[id].name:voyagerArtifacts[id].unknownName}</strong><small>{discovered.includes(id)?'ARCHIVED':identified.includes(id)?'INSPECT':'DETECT / SCAN'}</small></button>)}</nav>}
 <div className="mars-site-note">{count} / 05 RECORDS<br/>FICTIONAL DEEP-SPACE ENCOUNTER<br/>HISTORICAL SPACECRAFT RECONSTRUCTION</div>
 {count===5&&<aside className="spirit-next-signal"><p className="eyebrow">MISO’S FINAL REPORT / FICTION</p><h2>We found more than machines.</h2><p>&ldquo;They sent questions into the dark. And, just in case, they packed a hello.&rdquo;</p><button className="quiet-button" onClick={()=>useArchive.getState().visitChapter('apollo11')}>Revisit where we began</button></aside>}</>;
}
function VoyagerDiagram({id,step}:{id:VoyagerArtifactId;step:number}){
 return <svg className="voyager-diagram" viewBox="0 0 360 96" role="img" aria-label={id==='voyagerSignal'?`Schematic radio link, stage ${step} of 3`:id==='goldenRecord'?`Record instructions, stage ${step} of 3`:id==='paleBlueDot'?'Schematic home marker, not the NASA photograph':'Schematic record contents'}>
 {id==='voyagerSignal'?<><path d="M35 20Q80 48 35 76M35 48H80"/><circle cx="322" cy="48" r="14"/><path className={step>=1?'observed':''} d="M80 48H306" strokeDasharray="5 6"/>{step>=2&&<path d="M310 68H80" strokeDasharray="2 8"/>}<text x="100" y="31">{step>=3?'RADIO NEEDS TIME':'POINT TOWARD HOME'}</text></>:id==='goldenRecord'?<><circle cx="48" cy="48" r="34"/><circle cx="48" cy="48" r="5"/>{step>=1&&<path d="M45 45L83 20H105"/>}{step>=2&&<><rect x="139" y="18" width="58" height="58"/><circle cx="168" cy="47" r="23"/></>}{step>=3&&<path d="M280 48l-45-28m45 28l48-25m-48 25l-29 32m29-32l44 25m-44-25V12"/>}</>:id==='paleBlueDot'?<><path d="M40 0L200 96M70 0L230 96" opacity=".3"/><circle cx="163" cy="55" r={step>=2?3:1}/>{step>=2&&<><circle cx="163" cy="55" r="17" strokeDasharray="3 4"/><text x="207" y="60">EARTH / HOME</text></>}</>:<><circle cx="48" cy="48" r="32"/><path d="M43 23v50M25 39l46 20M25 59l46-20"/><text x="105" y="43">{step>=2?'55 LANGUAGES':'SOUNDS + IMAGES'}</text><text x="105" y="68">{step>=3?'ONE INVITATION':'A PHYSICAL RECORD'}</text></>}
 </svg>;
}
export function VoyagerInspector({id}:{id:VoyagerArtifactId}){
  const {identified,identify,scanProgress,setScanProgress,inspect,selected,select,inspectedParts,exploded,toggleExploded,isolated,toggleIsolated,resetView,discover,evidenceStep,setEvidenceStep}=useArchive(useShallow(s=>({identified:s.identified,identify:s.identify,scanProgress:s.scanProgress,setScanProgress:s.setScanProgress,inspect:s.inspect,selected:s.selected,select:s.select,inspectedParts:s.inspectedParts,exploded:s.exploded,toggleExploded:s.toggleExploded,isolated:s.isolated,toggleIsolated:s.toggleIsolated,resetView:s.resetView,discover:s.discover,evidenceStep:s.evidenceStep,setEvidenceStep:s.setEvidenceStep})));
  const close=useRef<HTMLButtonElement>(null);const note=useRef<HTMLElement>(null);const [scanning,setScanning]=useState(false);
  const a=voyagerArtifacts[id],known=identified.includes(id),story=id==='voyager'?null:voyagerInvestigations[id];
  const ready=known&&(id==='voyager'?voyagerParts.every(p=>inspectedParts.includes(p.id)):evidenceStep>=(story?.actions.length??1));
  useEffect(()=>{close.current?.focus();},[]);
  useEffect(()=>{if(!scanning)return;let frame=0,p=0,last=performance.now();const tick=(now:number)=>{if(!useArchive.getState().paused)p+=Math.min(now-last,100)/1400;last=now;if(matchMedia('(prefers-reduced-motion: reduce)').matches)p=1;setScanProgress(Math.min(1,p));if(p>=1){identify(id);setScanning(false);}else frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[scanning,id,identify,setScanProgress]);
  return <section className="investigation mars-investigation spirit-investigation voyager-investigation" role="region" aria-label="Artifact inspection">
    <div className="investigation-title"><p className="eyebrow">{a.code} / {known?'SPATIAL ANALYSIS':'UNIDENTIFIED TRACE'}</p><h2>{known?a.name:a.unknownName}</h2></div>
    <button ref={close} className="exit-inspection" onClick={()=>inspect(null)}>ESC / Return to encounter <span>×</span></button>
    {!known?<div className="mars-scan-panel"><p className="eyebrow">{scanning?'MATCHING THE ARCHIVE':'TRACE ACQUIRED'}</p><div className="travel-line"><i style={{width:`${scanProgress*100}%`}}/></div><button className="action" disabled={scanning} onClick={()=>setScanning(true)}>{scanning?'Scanning…':'Scan object'}</button><small>Historical evidence within a fictional expedition.</small></div>:<>
      {id==='voyager'?<>
        <nav className="component-switch" aria-label="Hardware components">{voyagerParts.map((p,i)=><button key={p.id} aria-pressed={selected===p.id} onClick={()=>select(p.id)}><span>0{i+1}</span>{p.name}<small>{selected===p.id?'✓':'+'}</small></button>)}</nav>
        {selected&&<PartPoster part={`voyager-${selected}`} conclusion={ready?a.interpretation:undefined}/>}
        <div className="mars-model-tools"><button className="quiet-button" aria-pressed={exploded} onClick={toggleExploded}>{exploded?'Assemble':'Separate'} hardware</button><button className="quiet-button" disabled={!selected} aria-pressed={isolated} onClick={toggleIsolated}>{isolated?'Show all parts':'Isolate selection'}</button><button className="quiet-button" onClick={resetView}>Reset view</button>{['left','right','in','out'].map((v,i)=><button key={v} className="quiet-button" aria-label={['Rotate model left','Rotate model right','Zoom in','Zoom out'][i]} onClick={()=>window.dispatchEvent(new CustomEvent('model-control',{detail:v}))}>{['↶','↷','+','−'][i]}</button>)}</div>
        <p className="mars-orbit-hint">Drag to orbit / Scroll to zoom / NASA-based spacecraft reconstruction</p>
      </>:story&&<aside ref={note} className="part-poster floating-lesson mars-note" tabIndex={0} aria-label={`${a.name} field note`}>
        <header className="poster-presenter"><img src="/textures/alien-cat.png" alt="Miso the alien cat"/><div><span>MISO’S DISCOVERY</span><p>{story.prompt}</p></div></header>
        <h3>{id==='voyagerMessage'&&!ready?'A mission record, unread':a.subtitle}</h3><PhotoReveal photo={story.photo}/><VoyagerDiagram id={id} step={evidenceStep}/>
        <ol className="evidence-workflow" aria-label="Investigation steps">{story.diagram.map((label,i)=><li key={label} className={evidenceStep>i?'observed':''}>{label}</li>)}</ol>
        <p className="mars-reconstruction">Schematic archive reconstruction / no live telemetry.</p>
        {evidenceStep<story.actions.length&&<button className="action" onClick={()=>{setEvidenceStep(evidenceStep+1);requestAnimationFrame(()=>note.current?.querySelector<HTMLElement>('[role="status"]')?.scrollIntoView({block:'nearest'}));}}>{story.actions[evidenceStep]}</button>}
        {evidenceStep>0&&<p className="lesson-prose" role="status">{story.steps[evidenceStep-1]}</p>}
        {ready&&<><p className="lesson-prose">{a.purpose}</p><p className="evidence-conclusion poster-conclusion"><small>FICTIONAL ALIEN INTERPRETATION</small>{a.interpretation}</p><button className="quiet-button replay-evidence" onClick={()=>setEvidenceStep(0)}>Replay investigation</button></>}
        {id==='voyagerMessage'&&evidenceStep>=2&&<p><a href={voyagerSources.greetings} target="_blank" rel="noreferrer">Listen to the original greetings at NASA</a></p>}<a className="poster-source" href={a.source} target="_blank" rel="noreferrer">Read the NASA source ↗</a>
      </aside>}
      <div className="archive-action"><button className="action" disabled={!ready} onClick={()=>{discover(id);inspect(null);}}>{ready?'Archive discovery':id==='voyager'?`Inspect all parts / ${inspectedParts.length} of 3`:'Investigation incomplete'}</button></div>
    </>}
  </section>;
}


export function VoyagerGuideBody(){
 const identified=useArchive(s=>s.identified);
 return <div className="learning-body"><p className="eyebrow">NASA EVIDENCE / VOYAGER 1</p><h2 id="learning-title">A traveler carrying a world.</h2><p className="learning-intro">Miso’s guesses are fiction. The spacecraft, the image of Earth and the record belong to human history.</p><div className="learning-story"><PhotoReveal photo="voyagerDiagram"/><article><h3>From the planets to interstellar space</h3><p>Voyager 1 launched on September 5, 1977. Jupiter followed in 1979, Saturn in 1980, and the heliopause crossing in August 2012. Voyager 2 is a separate spacecraft with a different route.</p><p>This chapter imagines a future encounter. It does not claim that Voyager is abandoned today, that we know its future condition, or that its record has been found.</p><a href={voyagerSources.mission} target="_blank" rel="noreferrer">NASA / Voyager 1 mission</a></article></div>
 {voyagerIds.filter(id=>identified.includes(id)).map(id=><section className="spirit-guide-record" key={id}><h3>{voyagerArtifacts[id].name}</h3><p>{voyagerArtifacts[id].purpose}</p><a href={voyagerArtifacts[id].source} target="_blank" rel="noreferrer">NASA evidence</a></section>)}
 <h3>A note about the reconstruction</h3><p>The editable Blender spacecraft preserves the NASA/VTAD model geometry and texture coordinates. Assembly separation and lighting are teaching adaptations. The star field and compressed journey are cinematic; Saturn is not shown beside an interstellar Voyager. This is not engineering CAD or an exact archaeological survey. The record cover and Pale Blue Dot are historical evidence, not new images from the encounter.</p><a href={voyagerSources.model} target="_blank" rel="noreferrer">NASA / VTAD model provenance</a></div>;
}
