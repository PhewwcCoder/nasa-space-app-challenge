import * as THREE from 'three';

// The original geometry stays on the main thread; only copies are transferred.
const cache = new WeakMap<THREE.BufferGeometry, Map<number, Promise<Float32Array>>>();
let worker: Worker | undefined;
let sequence = 0;
const pending = new Map<number, { resolve: (positions: Float32Array) => void; reject: (error: Error) => void }>();
function edgePositions(geometry: THREE.BufferGeometry, angle: number) {
  let angles = cache.get(geometry);
  if (!angles) { angles = new Map(); cache.set(geometry, angles); }
  let result = angles.get(angle);
  if (!result) {
    result = new Promise<Float32Array>((resolve, reject) => {
      if (!worker) {
        worker = new Worker(new URL('./edges.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = ({ data }: MessageEvent<{ id: number; positions: Float32Array }>) => {
          pending.get(data.id)?.resolve(data.positions); pending.delete(data.id);
        };
        worker.onerror = () => {
          pending.forEach(job => job.reject(new Error('Edge worker failed'))); pending.clear();
          worker?.terminate(); worker = undefined;
        };
      }
      const source = geometry.getAttribute('position');
      const positions = new Float32Array(source.count * 3);
      for (let i = 0; i < source.count; i++) { positions[i*3] = source.getX(i); positions[i*3+1] = source.getY(i); positions[i*3+2] = source.getZ(i); }
      const indices = geometry.index ? new Uint32Array(geometry.index.array) : null;
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      worker.postMessage({ id, positions, indices, angle }, [positions.buffer, ...(indices ? [indices.buffer] : [])]);
    });
    angles.set(angle, result);
    void result.catch(() => angles!.delete(angle));
  }
  return result;
}

export async function prepareEdges(object: THREE.Group, angle: number) {
  const meshes: THREE.Mesh[] = [];
  object.traverse(o => { if (o instanceof THREE.Mesh) meshes.push(o); });
  return Promise.all(meshes.map(async mesh => ({ mesh, positions: await edgePositions(mesh.geometry, angle) })));
}
