import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { afterPaint } from '../afterPaint';
import { prepareEdges } from './modelEdges';

/** Keep each assembly's outlines ready across selection changes. The worker uses
 * the same EdgesGeometry algorithm and angle; source buffers are never transferred. */
export function useModelEdges(object: THREE.Group, enabled = true) {
  const [result, setResult] = useState<{ object: THREE.Group; edges: THREE.Group } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let edges: THREE.Group | undefined;
    const cancel = afterPaint(() => {
      void prepareEdges(object, 65).then(parts => {
        if (cancelled) return;
        edges = new THREE.Group();
        edges.name = 'prepared-hardware-outlines';
        for (const { mesh, positions } of parts) {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: '#a2c8d0', transparent: true, opacity: .28, depthWrite: false }));
          lines.applyMatrix4(mesh.matrix);
          edges.add(lines);
        }
        setResult({ object, edges });
      }).catch(() => { /* Selection and lessons remain available if the optional worker fails. */ });
    });
    return () => {
      cancelled = true; cancel();
      edges?.traverse(o => {
        if (o instanceof THREE.LineSegments) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
      });
    };
  }, [object, enabled]);
  return enabled && result?.object === object ? result.edges : null;
}
