/** Fictional survey-craft handling; these are game units, not lunar engineering data. */
export type FlightState = {
  x: number; z: number; altitude: number;
  vx: number; vz: number; vy: number;
  fuel: number; landed: boolean; failed: boolean;
};
export type FlightInput = { x: number; z: number; brake: boolean; assist: boolean };
export const LANDING_RADIUS = 6;
export const MAX_HORIZONTAL_TOUCHDOWN_SPEED = 3;
export const MAX_VERTICAL_TOUCHDOWN_SPEED = 3.5;
const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));
export function initialFlight(): FlightState {
  return { x: 0, z: 20, altitude: 100, vx: 0, vz: 0, vy: -2, fuel: 100, landed: false, failed: false };
}

/** Pass seconds; a long suspended frame advances at most 100ms. Inputs are world X/Z axes. */
export function stepFlight(state: FlightState, input: FlightInput, dt: number): FlightState {
  if (state.landed || state.failed || !Number.isFinite(dt) || dt <= 0) return { ...state };
  const next = { ...state };
  let remaining = Math.min(dt, 0.1);
  while (remaining > 0.000001) {
    const h = Math.min(remaining, 1 / 120);
    remaining -= h;
    const powered = next.fuel > 0;
    let ax = 0, az = 0, ay = -1.62, burn = 0;
    if (powered && input.assist) {
      // Steering requests a gentle speed; assistance never switches off on keydown.
      // Releasing a key recenters the craft, and final capture settles it safely.
      const ix = Number.isFinite(input.x) ? clamp(input.x, -1, 1) : 0;
      const iz = Number.isFinite(input.z) ? clamp(input.z, -1, 1) : 0;
      const capture = next.altitude < 3;
      const targetX = !capture && ix && !input.brake ? ix * 2.8 : clamp(-next.x * .6, -4, 4);
      const targetZ = !capture && iz && !input.brake ? iz * 2.8 : clamp(-next.z * .6, -4, 4);
      ax = clamp((targetX - next.vx) * 2.2, -3.5, 3.5);
      az = clamp((targetZ - next.vz) * 2.2, -3.5, 3.5);
      // Reduce descent progressively; hold altitude if still outside the landing circle near ground.
      const aligned = Math.hypot(next.x, next.z) < LANDING_RADIUS * 0.7 && Math.hypot(next.vx,next.vz) < 2;
      const targetVy = next.altitude < 8 && !aligned ? 0 : input.brake ? -.6 : -Math.min(7, 1.1 + next.altitude * 0.25);
      ay = clamp((targetVy - next.vy) * 2.8, -1.62, 6);
      burn = 0.22;
    } else if (powered) {
      const ix = Number.isFinite(input.x) ? clamp(input.x, -1, 1) : 0;
      const iz = Number.isFinite(input.z) ? clamp(input.z, -1, 1) : 0;
      const norm = Math.max(1, Math.hypot(ix, iz));
      // Responsive speed control, with no automatic centering in manual mode.
      ax = (ix / norm * 3.8 - next.vx) * 3;
      az = (iz / norm * 3.8 - next.vz) * 3;
      // A forgiving game descent gives time to steer; Space is still needed to land safely.
      ay = clamp((-5.5 - next.vy) * 2, -1.62, 6);
      if (input.brake) {
        ax -= next.vx * 1.8; az -= next.vz * 1.8;
        // Braking stabilizes a slow descent, so holding Space never launches the craft away.
        ay = clamp((-0.8 - next.vy) * 2.5, -1.62, 6);
      }
      burn = Math.hypot(ix, iz) * 0.55 + (input.brake ? 1.15 : 0);
    }
    next.vx += ax * h; next.vz += az * h; next.vy += ay * h;
    next.x += next.vx * h; next.z += next.vz * h; next.altitude += next.vy * h;
    next.fuel = Math.max(0, next.fuel - burn * h);
    if (next.altitude <= 0) {
      next.altitude = 0;
      const safe = Math.hypot(next.x, next.z) <= LANDING_RADIUS
        && Math.hypot(next.vx, next.vz) < MAX_HORIZONTAL_TOUCHDOWN_SPEED
        && Math.abs(next.vy) < MAX_VERTICAL_TOUCHDOWN_SPEED;
      next.landed = safe; next.failed = !safe;
      // Keep impact velocities as telemetry; terminal states are immutable on later steps.
      break;
    }
  }
  return next;
}
