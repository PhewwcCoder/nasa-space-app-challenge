import { LANDING_RADIUS, type FlightState } from './game/flight';
import { landingMapScale, landingNavigation } from './game/navigation';

export default function LandingMap({ flight }: { flight: FlightState }) {
  const position = landingNavigation(flight), scale = landingMapScale(position.x, position.z);
  const x = 115 + position.x / scale, y = 90 + position.z / scale;
  return <section className="cockpit-screen map-screen" aria-label="Landing map" data-range={position.range.toFixed(1)} data-x={position.x.toFixed(2)} data-z={position.z.toFixed(2)} data-scale={scale}>
    <header><span>02 / LOCAL APPROACH</span><i>LZ 01</i></header>
    <svg viewBox="0 0 230 180" role="img" aria-label={`Craft ground distance ${position.range.toFixed(1)} metres; height ${position.y.toFixed(1)} metres. Landing circle radius ${LANDING_RADIUS} metres.`}>
      <defs><pattern id="landing-grid" width={20 / scale} height={20 / scale} patternUnits="userSpaceOnUse" x="115" y="90"><path d={`M${20 / scale} 0H0V${20 / scale}`} fill="none" stroke="#81cce333"/></pattern></defs>
      <rect width="230" height="180" fill="url(#landing-grid)"/>
      <path d="M115 10V170M15 90H215" stroke="#81cce344" fill="none"/>
      <circle className="map-zone" cx="115" cy="90" r={LANDING_RADIUS / scale}/>
      <path className="map-guide" d={`M115 90L${x} ${y}`}/>
      <path data-testid="landing-marker" className="map-craft" transform={`translate(${x},${y})`} d="M0-6L5 5 0 2-5 5Z"/>
      <text x="127" y="77">LZ 01</text><text x="8" y="12">FORWARD / −Z ↑</text><text x="160" y="12">+X →</text>
      <path d="M12 160v5h40v-5" fill="none" stroke="#b7e6f0"/><text x="12" y="177">{(40 * scale).toFixed(0)} m</text>
    </svg>
    <footer><span>GROUND <b>{position.range.toFixed(1)} m</b></span><span>{position.range <= LANDING_RADIUS ? 'OVER THE RING' : 'FOLLOW THE LINE'}</span></footer>
    <p className="map-local-readout">X {position.x.toFixed(1)} / Z {position.z.toFixed(1)} m<br/>Local simulation · grid 20 m</p>
  </section>;
}
