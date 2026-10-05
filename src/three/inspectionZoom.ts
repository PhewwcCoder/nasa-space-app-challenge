// Closest framing is the authored inspection view, not a macro lens.
// Shared by OrbitControls (wheel/pinch) and the existing zoom buttons.
export function inspectionMinDistance(id: string | null): number {
  if (id === 'eagle') return 17;
  if (id === 'reflector') return 8;
  if (id === 'sojourner') return 2;
  if (id === 'spirit' || id === 'spiritLog') return 4.8;
  return 4.2;
}
