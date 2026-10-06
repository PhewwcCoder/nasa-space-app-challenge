import { BufferAttribute, BufferGeometry, EdgesGeometry } from 'three';

self.onmessage = ({ data }: MessageEvent<{ id: number; positions: Float32Array; indices: Uint32Array | null; angle: number }>) => {
  const source = new BufferGeometry();
  source.setAttribute('position', new BufferAttribute(data.positions, 3));
  if (data.indices) source.setIndex(new BufferAttribute(data.indices, 1));
  const edges = new EdgesGeometry(source, data.angle);
  const positions = edges.getAttribute('position').array as Float32Array;
  self.postMessage({ id: data.id, positions }, { transfer: [positions.buffer] });
  source.dispose();
  edges.dispose();
};
