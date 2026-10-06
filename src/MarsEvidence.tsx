import { useShallow } from 'zustand/react/shallow';
import { PhotoReveal } from './Learning';
import { useArchive } from './stores/archive';

const landingSteps = [
  {title:'Slow down before the bounce',text:'A heat shield protected entry. A parachute slowed the spacecraft in the thin atmosphere, and rockets on the backshell slowed the final descent.',photo:'pathfinderBackshell'},
  {title:'Inflate, release, bounce',text:'Inflated airbags surrounded the lander and cushioned repeated impacts. The parachute and backshell stayed behind when the lander was released.',photo:'pathfinderAirbags'},
  {title:'Make room to unfold',text:'The airbags deflated and retracted. This early image shows fabric still blocking the rolled rear ramp, so reaching the ground was not the end of the landing work.',photo:'pathfinderAirbags'},
  {title:'A safe path to the ground',text:'The rear ramp was successfully unfurled at the end of Sol 2. Images helped the team choose it for Sojourner’s deployment. A small rover needed a clear first step.',photo:'pathfinderRamp'},
] as const;

export function PathfinderEvidence(){
  const {evidenceStep,setEvidenceStep}=useArchive(useShallow(s=>({evidenceStep:s.evidenceStep,setEvidenceStep:s.setEvidenceStep})));
  return <>
    <PhotoReveal photo="pathfinderRamp"/>
    <p className="lesson-prose">The lander was both a starting platform and a link to Earth. Its opened petals supported the equipment; a separate roll-out ramp gave Sojourner a safe route onto the soil.</p>
    <button className="action" onClick={()=>setEvidenceStep(evidenceStep===2?0:evidenceStep+1)}>{evidenceStep===0?'Trace the relay':evidenceStep===1?'Unfurl the deployment ramp':'Replay deployment'}</button>
    {evidenceStep>0&&<div className="mars-demonstration" role="status">{evidenceStep===1?'ROVER → STATION → EARTH':'PETALS OPEN → RAMP UNFURLS → ROVER DEPLOYS'}</div>}
    {evidenceStep===2&&<p className="lesson-prose">The station also observed the Martian environment. Rover and lander did different jobs within one mission. The nearby model’s ramp moves to explain deployment; it is an authored illustration.</p>}
  </>;
}

export function AirbagEvidence(){
  const {evidenceStep,setEvidenceStep}=useArchive(useShallow(s=>({evidenceStep:s.evidenceStep,setEvidenceStep:s.setEvidenceStep})));const step=landingSteps[Math.max(0,evidenceStep-1)];
  return <>
    <p className="lesson-prose">Before six wheels could move, an entire landing system had to work. Reconstruct its four stages.</p>
    {evidenceStep===0?<><PhotoReveal photo="pathfinderAirbags"/><button className="action" onClick={()=>setEvidenceStep(1)}>Reconstruct the landing</button></>:<>
      <ol className="evidence-workflow" aria-label="Landing sequence">{['SLOW','BOUNCE','DEFLATE','DEPLOY'].map((label,i)=><li className={evidenceStep>i?'observed':''} key={label}>{label}</li>)}</ol>
      <LandingDiagram step={evidenceStep}/><p className="mars-reconstruction">Schematic sequence / distances and timing compressed.</p>
      <h4>{step.title}</h4><p className="lesson-prose" role="status">{step.text}</p><PhotoReveal key={step.photo} photo={step.photo}/>
      <button className="action" onClick={()=>setEvidenceStep(evidenceStep===4?1:evidenceStep+1)}>{evidenceStep===4?'Replay landing sequence':'Next landing stage'}</button>
    </>}
  </>;
}

function LandingDiagram({step}:{step:number}){
  return <svg className="landing-diagram" viewBox="0 0 320 130" role="img" aria-label={['','Parachute and backshell slow the lander','Inflated airbags cushion impact','Airbags collapse around an opened lander','A ramp connects the lander to the surface'][step]}>
    <path d="M12 116h296"/>
    {step===1?<><path d="M95 30q65-55 130 0zm0 0 65 55 65-55M160 85v15"/><path d="m140 83 20-18 20 18z"/><rect x="146" y="100" width="28" height="14"/></>:<>
      {[130,150,170,190].map(x=><ellipse key={x} cx={x} cy={step===2?87:108} rx={step===2?23:26} ry={step===2?27:7}/>)}
      <path d="M140 93h40l-20-22zm-30 8 30-8m40 0 30 8"/>
      {step===4&&<><path d="m180 95 65 20m-65-15 60 19"/><rect x="232" y="95" width="28" height="13"/><circle cx="237" cy="112" r="5"/><circle cx="255" cy="112" r="5"/></>}
    </>}
  </svg>;
}

export function PathfinderResources(){return <section className="mars-resource-story"><h3>The hardware that made the first drive possible</h3><p>NASA images connect each object to a job. These dated records show why landing, deployment and exploration were separate challenges.</p><div className="mars-resource-grid"><article><PhotoReveal photo="pathfinderAirbags"/><h4>First, clear the fabric</h4><p>Partially deflated airbags initially obstructed the rolled rear ramp.</p></article><article><PhotoReveal photo="pathfinderRamp"/><h4>Then, choose a safe exit</h4><p>The Sol 2 image showed a successfully unfurled rear ramp, used for deployment.</p></article><article><PhotoReveal photo="pathfinderBackshell"/><h4>Look beyond the rover</h4><p>The backshell contained the rockets used in the final descent. It was a separate piece of the landing system.</p></article></div></section>;}
