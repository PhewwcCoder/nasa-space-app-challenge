import * as THREE from 'three';

/** Keep async shader compilation independent of transient UI/scene materials.
 * Geometry and textures are shared; only material wrappers are owned here.
 * Keep these wrappers until preparation settles, even if navigation cancels it.
 */
export function preparationSnapshot(source: THREE.Scene) {
  const scene = source.clone(true);
  const materials = new Map<THREE.Material, THREE.Material>();
  const copy = (material: THREE.Material) => {
    let owned = materials.get(material);
    if (!owned) {
      owned = material.clone();
      // Material.copy does not preserve authored shader callbacks.
      owned.onBeforeCompile = material.onBeforeCompile;
      owned.customProgramCacheKey = material.customProgramCacheKey;
      materials.set(material, owned);
    }
    return owned;
  };
  scene.traverse(object => {
    const renderable = object as THREE.Mesh;
    if (renderable.material) renderable.material = Array.isArray(renderable.material)
      ? renderable.material.map(copy) : copy(renderable.material);
  });
  return {
    scene,
    releaseGraph: () => scene.clear(),
    dispose: () => { scene.clear(); materials.forEach(material => material.dispose()); materials.clear(); },
  };
}
