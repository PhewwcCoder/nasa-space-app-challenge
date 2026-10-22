import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useArchive, type Chapter } from './stores/archive';
import { coordinates, marsStops, routePosition, sites, type MarsStop } from './data/expedition';
import { clearControls, pressControl } from './game/input';

function MapPlot({ chapter, progress = 0, from, to, offset = 0 }: { chapter: Exclude<Chapter, 'prologue'>; progress?: number; from?: MarsStop; to?: MarsStop; offset?: number }) {
  const site = sites[chapter], mars = site.body === 'Mars';
  const position = from && to ? routePosition(from, to, progress, offset) : { lat: site.lat, lon: site.lon };
  if (position.lat === null || position.lon === null) return <div className="deep-space-map"><span>✦</span><p>BEYOND THE PLANETS</p><small>A fictional encounter, without live spacecraft tracking.<br/>Surface latitude and longitude do not apply here.</small></div>;
  if (from && to) return <>
    <div className="route-endpoints"><span>FROM / {sites[from].name}</span><strong>TO / {sites[to].name}</strong></div>
    <svg className="planet-map route-map" viewBox="0 0 300 220" role="img" aria-label={`Forward route from ${sites[from].name} to ${sites[to].name}; ${Math.round(progress*100)} percent complete. Destination is at the top.`}>
      <rect width="300" height="220" fill="#30251f"/>
      <path d="M40 30H260M40 85H260M40 140H260M40 195H260M90 25V200M210 25V200" stroke="#bda98a" strokeOpacity=".18"/>
      <path d="M150 190V30" stroke="#a9c7c6" strokeWidth="2" strokeDasharray="4 5"/>
      <path d={`M150 190V${190-progress*160}`} stroke="#b5f1ec" strokeWidth="4"/>
      {[1,2].map(n=><g key={n}><circle cx="150" cy={190-n/3*160} r="5" fill={progress>=n/3?'#b5f1ec':'#756c59'}/><text x="170" y={194-n/3*160} fill="#eee8db" fontSize="12">Checkpoint {n}</text></g>)}
      <circle cx="150" cy="190" r="5" fill="#e9c990"/><text x="20" y="210" fill="#e9c990" fontSize="12">DEPARTURE</text>
      <path d="M142 38L150 27L158 38" fill="none" stroke="#e9c990" strokeWidth="2"/><text x="18" y="18" fill="#e9c990" fontSize="12">DESTINATION / FORWARD</text>
      <g data-testid="route-marker" transform={`translate(${150+Math.max(-60,Math.min(60,offset*3))},${190-progress*160})`}><circle r="13" fill="#142e31" stroke="#b5f1ec" strokeWidth="2"/><path d="M0-8L6 6 0 3-6 6Z" fill="#d9fffa"/><text x="-40" y="5" fill="#fff" fontSize="12">YOU</text></g>
    </svg><small>Destination-up route / schematic</small><p className="coordinate-value" data-testid="coordinates">{coordinates(position.lat, position.lon)}</p>
  </>;
  const x = (lon: number) => 35 + (lon - 170) / 190 * 530, y = (lat: number) => 35 + (25 - lat) / 50 * 170;
  return <><svg className="planet-map" viewBox="0 0 600 240" role="img" aria-label={`${site.body} coordinate map with your ${from ? 'simulated shuttle' : 'historical landing site'} marker`}>
    <defs><pattern id="map-grid" width="50" height="40" patternUnits="userSpaceOnUse"><path d="M50 0H0V40" fill="none" stroke="#b0cbd0" strokeOpacity=".18"/></pattern></defs>
    <rect width="600" height="240" fill={mars ? '#39241f' : '#202b33'}/><rect width="600" height="240" fill="url(#map-grid)"/>
    <path d="M0 120H600" stroke="#b0cbd0" strokeOpacity=".5" strokeDasharray="3 5"/>
    {(mars ? marsStops : ['apollo11'] as const).map(id => <g key={id}><circle cx={x(sites[id].lon!)} cy={y(sites[id].lat!)} r="4" fill="#e9c990"/><text x={x(sites[id].lon!)} y={y(sites[id].lat!) + (id === 'sojourner' ? -18 : 28)} textAnchor={sites[id].lon! > 300 ? 'end' : 'start'} fill="#fff4df" fontSize="26">{sites[id].name}</text></g>)}
    {from && to && Array.from({ length: 61 }, (_, i) => { const pos = routePosition(from, to, i / 60); return <circle key={i} cx={x(pos.lon)} cy={y(pos.lat)} r="1.5" fill="#94e6ec" opacity=".6"/>; })}
    <circle cx={x(position.lon)} cy={y(position.lat)} r="8" stroke="#b2f4ff" fill="#103e4a" strokeWidth="2"/>
    <text x="8" y="18" fill="#d4e3df" fontSize="15">N ↑</text><text x="8" y="230" fill="#d4e3df" fontSize="15">Regional view</text><text x="550" y="18" fill="#d4e3df" fontSize="15">E →</text>
  </svg><p className="coordinate-value" data-testid="coordinates">{coordinates(position.lat, position.lon)}</p></>;
}
export default function FlightMap() {
  const { stage, chapter, inspector, walking } = useArchive(useShallow(s => ({ stage: s.stage, chapter: s.chapter, inspector: s.inspector, walking: s.marsWalking })));
  const id = chapter === 'prologue' ? 'apollo11' : chapter;
  // Hardware inspection reserves the whole model area for orbiting and assembly controls.
  if (inspector && ['sojourner', 'pathfinder', 'spirit', 'spiritLog', 'opportunity', 'opportunityLog'].includes(inspector)) return null;
  if (walking || id === 'voyager' || id === 'apollo11' || stage === 'entry' || stage.includes('travel') || stage === 'shuttle' || stage === 'approach' || stage === 'mars-landing') return null;
  return <aside className="minimap" aria-label="Expedition minimap">
    <header><span>{sites[id].body}</span><strong>{sites[id].name}</strong></header>
    <MapPlot chapter={id}/>
    <a className="minimap-source" href={sites[id].source} target="_blank" rel="noreferrer">Landing site / schematic / NASA</a>
    {!inspector && marsStops.includes(id as MarsStop) && <details><summary>Fly to another site</summary><div className="minimap-routes">{marsStops.filter(stop => stop !== id).map(stop => <button key={stop} onClick={() => useArchive.getState().startShuttle(stop)}>Fly to {sites[stop].name}</button>)}</div></details>}
  </aside>;
}
export function ShuttleHUD() {
  const { shuttleFrom: from, shuttleTo: to, travelProgress: p, shuttleOffset: offset, shuttleCruise: cruise, paused, race } = useArchive(useShallow(s => ({ shuttleFrom: s.shuttleFrom, shuttleTo: s.shuttleTo, travelProgress: s.travelProgress, shuttleOffset: s.shuttleOffset, shuttleCruise: s.shuttleCruise, paused: s.paused, race:s.shuttleRace })));
  const hold = (code: string, text: string) => <button key={code} aria-label={text} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pressControl(code, true); }} onPointerUp={() => pressControl(code, false)} onPointerCancel={() => pressControl(code, false)} onLostPointerCapture={() => pressControl(code, false)} onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pressControl(code, true); } }} onKeyUp={() => pressControl(code, false)}>{text}</button>;
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && !(e.target as HTMLElement).closest('dialog')) { clearControls(); useArchive.getState().setPaused(!useArchive.getState().paused); } }; window.addEventListener('keydown', escape); return () => { clearControls(); window.removeEventListener('keydown', escape); }; }, []);
  return <section className="shuttle-hud" aria-label="Mars shuttle flight"><div className="shuttle-heading"><p className="eyebrow">PETROVA / SURFACE SEARCH</p><h1>Next stop: {sites[to].name}</h1><p className="shuttle-departure">Departing {sites[from].name} / Follow the guide lights. Dodge the rocks.</p></div>
    <aside className="shuttle-map"><span>SIMULATED POSITION / MARS</span><MapPlot chapter={to} from={from} to={to} progress={p} offset={offset}/><small>Live in this experience · Compressed fictional route<br/>Not rover telemetry or a navigation chart</small></aside>
    <div className="shuttle-controls"><p className="shuttle-keyboard-hint">W / ↑ to fly · A D / ← → to steer · Space to brake</p><div className="surface-telemetry"><span>{Math.round(race.speed * 4)} <small>SPEED %</small></span><span>{race.checkpoint === 400 ? 2 : race.checkpoint === 200 ? 1 : 0} / 2 <small>CHECKPOINTS</small></span><span>{Math.round(p * 100)}% <small>SIGNAL LOCK</small></span></div><p role="status">{race.failed ? 'Rock contact / retry from your last checkpoint' : paused ? 'Journey paused' : cruise ? 'Cruise assist on' : 'You have the controls'} / {Math.round(p * 100)}%</p><progress max="1" value={p} aria-label="Journey progress"/><div className="shuttle-touch">{hold('KeyA', 'Steer left')}{hold('KeyW', 'Thrust')}{hold('KeyD', 'Steer right')}{hold('Space', 'Brake')}</div><div className="shuttle-actions">{race.failed && <button className="shuttle-retry" onClick={()=>useArchive.getState().retryShuttle()}>Retry from checkpoint</button>}<button aria-pressed={cruise} onClick={() => useArchive.setState({ shuttleCruise: !cruise })}>Cruise assist {cruise ? 'on' : 'off'}</button><button onClick={() => { clearControls(); useArchive.getState().setPaused(!paused); }}>{paused ? 'Resume journey' : 'Pause journey'}</button><button onClick={() => useArchive.getState().visitChapter(to)}>Skip travel</button><button onClick={() => useArchive.getState().visitChapter(from)}>Return to departure</button></div></div>
  </section>;
}
