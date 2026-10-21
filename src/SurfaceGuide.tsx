export default function SurfaceGuide({openJourney}:{openJourney:()=>void}) {
  return <aside className="surface-guide" aria-label="Apollo field guide">
    <button onClick={openJourney}><span>FIELD GUIDE</span><strong>Apollo 11 / The story behind the hardware</strong><span aria-hidden="true">&#8599;</span></button>
  </aside>;
}
