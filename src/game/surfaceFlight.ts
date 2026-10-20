/** Fictional, compressed surface courses; units are simulation units, not Mars distances. */
export type SurfaceRoute = 'sojourner' | 'spirit' | 'opportunity';
export type SurfaceFlight = { distance: number; offset: number; speed: number; checkpoint: number; failed: boolean; finished: boolean };
export const COURSE_LENGTH = 620;
export const checkpoints = [0, 200, 400];
export const courseCenter = (d: number) => Math.sin(d * .015) * 9 + Math.sin(d * .037) * 2;
export const courseHeight = (d: number) => Math.sin(d * .019) * .6 + Math.sin(d * .043) * .18;
export function courseHazards(route: SurfaceRoute) {
  const flip = route === 'opportunity' ? -1 : 1;
  return [70, 125, 175, 260, 320, 365, 460, 520, 570].map((distance, i) => ({ distance, offset: (i % 3 === 0 ? 0 : i % 3 === 1 ? -4 : 4) * flip, radius: route === 'opportunity' ? 2.7 : 2.2 }));
}
export const newSurfaceFlight = (checkpoint = 0): SurfaceFlight => ({ distance: checkpoint, offset: 0, speed: 0, checkpoint, failed: false, finished: false });
export function stepSurfaceFlight(previous: SurfaceFlight, input: { steer: number; thrust: boolean; brake: boolean; cruise: boolean }, dt: number, route: SurfaceRoute): SurfaceFlight {
  const s = { ...previous };
  if (s.failed || s.finished || !Number.isFinite(dt) || dt <= 0) return s;
  const hazards = courseHazards(route), duration = Math.min(dt, .1), steps = Math.ceil(duration * 120), h = duration / steps;
  for (let i = 0; i < steps; i++) {
    const obstacle = hazards.find(o => o.distance > s.distance - o.radius - 3);
    const target = obstacle && obstacle.distance - s.distance < 65 ? (obstacle.offset >= 0 ? -7 : 7) : 0;
    const steer = input.cruise ? Math.max(-1, Math.min(1, (target - s.offset) * .8)) : Math.max(-1, Math.min(1, input.steer));
    const targetSpeed = input.brake ? 0 : input.thrust || input.cruise ? 25 : 0;
    s.speed += Math.max(-h * (input.brake ? 32 : 9), Math.min(h * 11, targetSpeed - s.speed));
    s.offset = Math.max(-11, Math.min(11, s.offset + steer * h * 8));
    s.distance = Math.min(COURSE_LENGTH, s.distance + s.speed * h);
    if (hazards.some(o => Math.hypot(s.distance - o.distance, s.offset - o.offset) < o.radius + 1.65)) { s.failed = true; s.speed = 0; break; }
    s.checkpoint = checkpoints.filter(c => c <= s.distance).at(-1) ?? 0;
    if (s.distance >= COURSE_LENGTH) { s.finished = true; s.speed = 0; break; }
  }
  return s;
}
