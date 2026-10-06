import { useGLTF, useTexture } from '@react-three/drei';
import type { Chapter } from '../stores/archive';

export function preloadChapter(chapter: Chapter) {
  if (chapter === 'apollo11') {
    useGLTF.preload('/models/apollo-full.glb', '/draco/');
    useGLTF.preload('/models/apollo-descent.glb', '/draco/');
    useTexture.preload('/textures/apollo11-panorama.jpg');
  } else if (chapter === 'opportunity') useGLTF.preload('/models/opportunity-refined.glb', '/draco/');
  else if (chapter === 'spirit') useGLTF.preload('/models/spirit-refined.glb', '/draco/');
}
