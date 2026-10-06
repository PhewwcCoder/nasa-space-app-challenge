/** Yield through a paint, then run in a new task (a microtask/RAF alone is too early). */
export function afterPaint(work: () => void) {
  let task: ReturnType<typeof setTimeout> | undefined;
  const frame = requestAnimationFrame(() => { task = setTimeout(work, 0); });
  return () => { cancelAnimationFrame(frame); clearTimeout(task); };
}
