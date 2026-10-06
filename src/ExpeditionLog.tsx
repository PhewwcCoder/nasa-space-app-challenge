import { isOpportunityArtifact } from './data/opportunity';
import { isSpiritArtifact } from './data/spirit';
import { isMarsArtifact } from './data/mars';
import { useArchive } from './stores/archive';
import { artifacts } from './data/archive';

export default function ExpeditionLog({openLog,openJourney}:{openLog:()=>void;openJourney:()=>void}) {
  const discovered=useArchive(s=>s.discovered).filter(id=>!isMarsArtifact(id)&&!isSpiritArtifact(id)&&!isOpportunityArtifact(id));
  return <aside className="expedition-log" aria-label="Journey and field logs">
    <header><span>YOUR EXPEDITION</span><b>{String(discovered.length).padStart(2,'0')} / 06</b></header>
    <h2>A trail of discoveries.</h2>
    <ol className="journey-steps"><li>Arrived at the Moon <span>✓</span></li><li>Followed the footprints <span>✓</span></li><li className="current">Reading the evidence <span>{discovered.length}/6</span></li></ol>
    <div className="recent-log"><span>LATEST FIELD LOG</span>{discovered.length?<><h3>{artifacts[discovered[discovered.length-1]].name}</h3><p>{artifacts[discovered[discovered.length-1]].interpretation}</p><small>Fictional explorer interpretation</small></>:<p>Your first record is waiting. Choose a clue and archive what you find.</p>}</div>
    <button onClick={openLog}>Read your logs <span>↗</span></button><button onClick={openJourney}>Follow Apollo 11’s journey <span>↗</span></button>
  </aside>;
}
