import { Fragment, Suspense, startTransition, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive, type Stage } from '../stores/archive';
import { afterPaint } from '../afterPaint';
import { SceneActivity } from './SceneActivity';
import { preparationSnapshot } from './preparationSnapshot';

export type WorldId = 'orbit' | 'lunar' | 'mars' | 'spirit' | 'transit' | 'opportunity' | 'voyager';
export function worldFor(stage: Stage, progress: number): WorldId {
  if (stage === 'voyager' || stage === 'voyager-travel' && progress >= .5) return 'voyager';
  if (stage === 'voyager-travel') return 'opportunity';
  if (stage === 'entry' || stage === 'signal') return 'orbit';
  if (stage === 'opportunity' || stage === 'opportunity-travel' && progress >= .5) return 'opportunity';
  if (stage === 'opportunity-travel') return 'spirit';
  if (stage === 'spirit' || stage === 'mars-travel' && progress >= .5) return 'spirit';
  if (stage === 'mars' || stage === 'mars-travel' || stage === 'travel' && progress >= .68) return 'mars';
  if (stage === 'travel' && progress >= .36) return 'transit';
  return 'lunar';
}

function Prepared({ id, ready }: { id: WorldId; ready: (id: WorldId) => void }) {
  const { scene, gl, camera } = useThree();
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let cancelled = false;
    let settled = false;
    let snapshot: ReturnType<typeof preparationSnapshot> | undefined;
    const cancel = afterPaint(() => {
      const start = performance.now();
      snapshot = preparationSnapshot(scene);
      void gl.compileAsync(snapshot.scene, camera).then(() => {
        settled = true;
        snapshot?.releaseGraph();
        // Hold material wrappers/program references for this retained world's life.
        // Transient source materials may disappear while compileAsync is polling.
        if (cancelled) { snapshot?.dispose(); return; }
        if (!cancelled) {
          performance.measure(`mersa:prepare:${id}`, { start });
          ready(id);
        }
      }).catch((cause: unknown) => {
        settled = true;
        snapshot?.dispose();
        if (!cancelled) setError(cause instanceof Error ? cause : new Error(String(cause)));
      });
    });
    return () => { cancelled = true; cancel(); if (settled) snapshot?.dispose(); };
  }, [id, scene, gl, camera, ready]);
  if (error) throw error;
  return null;
}

/** Separate scene graphs, one WebGLRenderer, one canvas, and the original shared camera.
 * Only the displayed scene is rendered/raycast/animated. Visited resources stay resident.
 */
export default function RetainedWorlds({ renderWorld }: { renderWorld: (id: WorldId, active: boolean) => ReactNode }) {
  const requested = useArchive(s => worldFor(s.stage, s.travelProgress));
  const root = useThree();
  const [mounted, setMounted] = useState<WorldId[]>([requested]);
  const [prepared, setPrepared] = useState<WorldId[]>([]);
  const worlds = useMemo(() => new Map<WorldId, THREE.Scene>(), []);
  const shown = useRef<WorldId | null>(null);
  const ready = useCallback((id: WorldId) => setPrepared(ids => ids.includes(id) ? ids : [...ids, id]), []);
  useEffect(() => {
    if (mounted.includes(requested)) return;
    return afterPaint(() => startTransition(() => setMounted(ids => ids.includes(requested) ? ids : [...ids, requested])));
  }, [requested, mounted]);
  const displayed = prepared.includes(requested) ? requested : shown.current;
  useEffect(() => { shown.current = displayed; }, [displayed]);
  useEffect(() => {
    const element = root.gl.domElement;
    element.dataset.world = displayed ?? '';
    element.setAttribute('aria-busy', String(displayed !== requested));
  }, [displayed, requested, root.gl]);
  useFrame(({ gl, camera }) => {
    const scene = displayed && worlds.get(displayed);
    // Keep the last composited frame while preparing a cold destination. Repeatedly
    // drawing the inactive world competes with parallel shader compilation on the GPU.
    if (scene && displayed === requested) gl.render(scene, camera);
  }, 1);
  return <>{mounted.map(id => {
    if (!worlds.has(id)) { const scene = new THREE.Scene(); scene.name = `mersa:${id}`; worlds.set(id, scene); }
    const active = id === displayed && id === requested;
    return <Fragment key={id}>{createPortal(<SceneActivity active={active} root={root}><Suspense fallback={null}>
      {renderWorld(id, active)}<Prepared id={id} ready={ready}/>
    </Suspense></SceneActivity>, worlds.get(id)!, { camera: root.camera, events: { enabled: active, priority: 1 } })}</Fragment>;
  })}</>;
}
