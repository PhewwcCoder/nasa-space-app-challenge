import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';

const offsets:Record<string,[number,number,number]>={body:[0,0,0],power:[0,.65,0],mobility:[-.65,-.03,.25],instruments:[.6,.3,-.4]};
function Assembly({id,object}:{id:string;object:THREE.Group}){
  const ref=useRef<THREE.Group>(null);
  const {inspector,scanProgress,selected,exploded,isolated,select,paused}=useArchive();
  const active=inspector==='spirit'&&scanProgress===1;
  const edges=useMemo(()=>{
    const group=new THREE.Group();
    object.traverse(o=>{if(o instanceof THREE.Mesh){const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,35),new THREE.LineBasicMaterial({color:'#74d9ff',transparent:true,opacity:.65,depthWrite:false}));e.applyMatrix4(o.matrix);group.add(e);}});
    return group;
  },[object]);
  useEffect(()=>()=>edges.traverse(o=>{if(o instanceof THREE.LineSegments){o.geometry.dispose();(o.material as THREE.Material).dispose();}}),[edges]);
  useFrame((_,dt)=>{if(!ref.current||paused)return;const target=new THREE.Vector3(...offsets[id]).multiplyScalar(active&&(exploded||selected===id)?1:0);ref.current.position.lerp(target,matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*5));});
  return <group ref={ref} visible={!active||!isolated||!selected||selected===id} onClick={e=>{if(active&&id!=='body'){e.stopPropagation();select(id);}}}>
    <primitive object={object}/>{active&&selected===id&&<primitive object={edges}/>}
  </group>;
}

export default function SpiritModel(){
  const {scene}=useGLTF('/models/spirit-refined.glb','/draco/');
  const groups=useMemo(()=>{
    const result:Record<string,THREE.Group>={body:new THREE.Group(),power:new THREE.Group(),mobility:new THREE.Group(),instruments:new THREE.Group()};
    scene.updateMatrixWorld(true);
    scene.traverse(o=>{
      if(!(o instanceof THREE.Mesh))return;
      const material=Array.isArray(o.material)?o.material[0]:o.material;
      const name=material.name;
      const id=o.userData.assembly??(name.includes('panels')?'power':name.includes('suspension')?'mobility':/mast|arm|instruments|foil_silver|Silver/.test(name)?'instruments':'body');
      const mesh=o.clone();mesh.matrixAutoUpdate=false;mesh.matrix.copy(o.matrixWorld);mesh.castShadow=true;mesh.receiveShadow=true;result[id].add(mesh);
    });
    return result;
  },[scene]);
  // Blender-refined NASA base with authored reference details; not a Troy survey.
  return <group position={[0,.003,0]} rotation={[0,Math.PI*1.1,0]}>{Object.entries(groups).map(([id,object])=><Assembly key={id} id={id} object={object}/>)}</group>;
}
