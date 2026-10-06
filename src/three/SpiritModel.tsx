import { memo } from 'react';
import { prepareEdges } from './modelEdges';
import { afterPaint } from '../afterPaint';
import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame, useSceneActive } from './SceneActivity';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';

const offsets:Record<string,[number,number,number]>={body:[0,0,0],power:[0,.65,0],mobility:[-.65,-.03,.25],instruments:[.6,.3,-.4]};
function Assembly({id,object,artifact}:{id:string;object:THREE.Group;artifact:string}){
  const sceneActive=useSceneActive();
  const ref=useRef<THREE.Group>(null);
  const {inspector,scanProgress,selected,exploded,isolated,select,paused}=useArchive(useShallow(s=>({inspector:s.inspector,scanProgress:s.scanProgress,selected:s.selected,exploded:s.exploded,isolated:s.isolated,select:s.select,paused:s.paused})));
  const active=inspector===artifact&&scanProgress===1;
  const [edges,setEdges]=useState<THREE.Group|null>(null);
  useEffect(()=>{
    if(id==='body')return;
    let cancelled=false;let prepared:THREE.Group|null=null;
    const cancel=afterPaint(()=>{void prepareEdges(object,35).then(parts=>{
      if(cancelled)return;
      prepared=new THREE.Group();
      for(const {mesh,positions} of parts){
        const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
        const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:'#74d9ff',transparent:true,opacity:.65,depthWrite:false}));
        lines.applyMatrix4(mesh.matrix);prepared.add(lines);
      }
      setEdges(prepared);
    }).catch(()=>{/* Hardware selection still works if optional outline preparation fails. */});});
    return()=>{cancelled=true;cancel();prepared?.traverse(o=>{if(o instanceof THREE.LineSegments){o.geometry.dispose();(o.material as THREE.Material).dispose();}});};
  },[object,id]);
  useEffect(()=>{if(!sceneActive)ref.current?.position.set(0,0,0);},[sceneActive]);
  useFrame((_,dt)=>{if(!ref.current||paused)return;const target=new THREE.Vector3(...offsets[id]).multiplyScalar(active&&(exploded||selected===id)?1:0);ref.current.position.lerp(target,matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*5));});
  return <group name={`${artifact}-${id}`} ref={ref} visible={!active||!isolated||!selected||selected===id} onClick={e=>{if(active&&id!=='body'){e.stopPropagation();select(id);}}}>
    <primitive object={object}/>{active&&selected===id&&edges&&<primitive object={edges}/>}
  </group>;
}

function SpiritModel({artifact='spirit',url='/models/spirit-refined.glb',rotation=Math.PI*1.1}:{artifact?:'spirit'|'opportunity'|'voyager';url?:string;rotation?:number}){
  const {scene}=useGLTF(url,'/draco/');
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
  return <group position={[0,.003,0]} rotation={[0,rotation,0]}>{Object.entries(groups).map(([id,object])=><Assembly key={id} id={id} object={object} artifact={artifact}/>)}</group>;
}

export default memo(SpiritModel);
