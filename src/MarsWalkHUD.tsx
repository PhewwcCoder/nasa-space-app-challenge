import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useArchive } from './stores/archive';
import { clearControls, pressControl } from './game/input';

export default function MarsWalkHUD() {
  const { progress, paused, finish, setPaused } = useArchive(useShallow(s => ({
    progress: s.marsWalk, paused: s.paused, finish: s.finishMarsWalk, setPaused: s.setPaused,
  })));
  const hold = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    hold.current?.focus({ preventScroll: true });
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !(e.target as HTMLElement).closest('dialog')) {
        e.preventDefault(); useArchive.getState().setPaused(!useArchive.getState().paused);
      }
    };
    window.addEventListener('keydown', escape);
    return () => { clearControls(); window.removeEventListener('keydown', escape); };
  }, []);
  return <section className="walk-prompt mars-walk-prompt" aria-label="Walk toward the Mars rover" data-progress={progress.toFixed(3)}>
    <p className="eyebrow">ON FOOT / FICTIONAL EXPEDITION</p>
    <h1>{paused ? 'Take your time.' : 'Walk toward the human trace.'}</h1>
    <p>Hold <kbd>W</kbd> or ↑ to follow the footprints.</p>
    <button ref={hold} className="action" disabled={paused}
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pressControl('KeyW', true); }}
      onPointerUp={() => pressControl('KeyW', false)} onPointerCancel={() => clearControls()} onLostPointerCapture={() => clearControls()}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pressControl('KeyW', true); } }}
      onKeyUp={() => pressControl('KeyW', false)}>Hold to walk →</button>
    <div className="mars-walk-actions"><button className="quiet-button" onClick={() => setPaused(!paused)}>{paused ? 'Resume walk' : 'Pause walk'}</button>
      <button className="quiet-button" onClick={finish}>Skip walk</button></div>
    <progress max="1" value={progress} aria-label="Walking progress"/>
  </section>;
}
