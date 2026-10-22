import type { FlightState } from './flight';

/** Authored local scene metres, not planetary latitude/longitude or NASA telemetry.
 * The descent follows a sloping corridor; all instruments include that motion. */
export function landingPosition(s: FlightState) {
  return { x: s.x, y: s.altitude * .48, z: s.z + s.altitude * 1.7 };
}
export function landingNavigation(s: FlightState) {
  const p = landingPosition(s);
  return { ...p, range: Math.hypot(p.x, p.z), descent: Math.abs(s.vy * .48),
    speed: Math.hypot(s.vx, s.vz + s.vy * 1.7) };
}
/** Equal scale on both axes; expand the view instead of clamping the marker. */
export function landingMapScale(x: number, z: number) {
  // Discrete zoom steps let the marker visibly approach between scale changes.
  return 2 ** Math.ceil(Math.log2(Math.max(.5, Math.abs(x) / 90, Math.abs(z) / 72)));
}
