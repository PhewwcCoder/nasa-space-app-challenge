import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { components } from '../data/archive';
const positions: Record<string,[number,number,number]> = {structure:[-1.8,2.6,0],engine:[3.1,.55,2.1],gear:[0,.2,-.7]};
const tags: Record<string,[number,number,number]> = {structure:[-4.2,5.9,0],engine:[5.3,1.1,2.1],gear:[-4.5,1.4,0]};
function componentFor(name:string) { if(name.startsWith('group13_pC'))return 'engine';if(name.startsWith('group31')||name.startsWith('polySurfa')||name==='pCylinder3')return 'gear';return 'structure'; }
function ModelPart({part,object}:{part:string;object:THREE.Group}) {
 const ref=useRef<THREE.Group>(null);const {inspector,exploded,selected,select,isolated}=useArchive();const [hover,setHover]=useState(false);const active=inspector==='eagle';
 useEffect(()=>{object.traverse(o=>{if(o instanceof THREE.Mesh){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial){m.emissive.set(active&&(selected===part||hover)?'#15484a':'#000000');m.emissiveIntensity=hover?.25:.11;}});}});},[object,active,selected,hover,part]);
 useFrame((_,dt)=>{if(!ref.current)return;const p=active&&exploded?positions[part]:[0,0,0];const alpha=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*4);ref.current.position.lerp(new THREE.Vector3(...p),alpha);});
 const handle=(e:ThreeEvent<MouseEvent>)=>{if(active){e.stopPropagation();select(part);}};
 return <group ref={ref} visible={!isolated||selected===part} onClick={handle} onPointerOver={e=>{if(active){e.stopPropagation();setHover(true);document.body.style.cursor='pointer';}}} onPointerOut={()=>{setHover(false);document.body.style.cursor='auto';}}><primitive object={object}/></group>;
}
export default function ApolloModel(){
 const gltf=useGLTF('/models/apollo-descent.glb','/draco/');
 const {inspector,exploded,inspect,stage,selected,select,isolated}=useArchive();
 const groups=useMemo(()=>{
   const parts:Record<string,THREE.Group>={structure:new THREE.Group(),engine:new THREE.Group(),gear:new THREE.Group()};
   gltf.scene.updateMatrixWorld(true);
   gltf.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const mesh=o.clone();mesh.geometry=o.geometry.clone();mesh.applyMatrix4(o.matrixWorld);mesh.castShadow=true;mesh.receiveShadow=true;
     const convert=(m:THREE.Material)=>{const c=m.clone() as THREE.MeshStandardMaterial;if(c.isMeshStandardMaterial){const gold=c.color.r>c.color.b*1.4; c.metalness=gold?.48:.35;c.roughness=gold?.52:.56;if(gold)c.color.set("#b58b3c");c.envMapIntensity=1.1;
       if(gold){c.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vFoil;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFoil=position;');shader.fragmentShader='varying vec3 vFoil;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal=normalize(normal+0.28*vec3(sin(vFoil.x*37.0+sin(vFoil.y*23.0)*3.0),sin(vFoil.y*31.0+sin(vFoil.z*19.0)*4.0),cos(vFoil.z*41.0+sin(vFoil.x*17.0)*3.0)));');};c.customProgramCacheKey=()=> 'mersa-foil-v2';}}
       return c;};mesh.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);parts[componentFor(o.name)].add(mesh);
   });return parts;
 },[gltf]);
 return <group scale={1.28} position={[0,-.13,0]} onClick={()=>{if(!inspector){if(stage==='surface')useArchive.getState().setStage('identified');else if(stage==='explore'||stage==='identified')inspect('eagle');}}}>
 {Object.entries(groups).map(([id,object])=><ModelPart key={id} part={id} object={object}/>)}
 {inspector==='eagle'&&exploded&&components.map(c=>(!isolated||c.id===selected)&&<group key={c.id}>
 <Line points={[[positions[c.id][0],positions[c.id][1]+(c.id==='structure'?1.8:.6),positions[c.id][2]],tags[c.id]]} color={selected===c.id?'#b8f2f5':'#76999a'} lineWidth={.7} transparent opacity={.65}/>
 <Html position={tags[c.id]} center zIndexRange={[6,5]}><button className={`spatial-part ${selected===c.id?'selected':''}`} onClick={()=>select(c.id)} aria-label={c.name}><span>{c.id==='structure'?'01':c.id==='engine'?'02':'03'} / {c.id==='structure'?'THERMAL STRUCTURE':c.id==='engine'?'DESCENT ENGINE':'LANDING ASSEMBLY'}</span><strong>{c.id==='structure'?'Protection':c.id==='engine'?'Controlled descent':'First contact'}</strong><small>{selected===c.id?'COMPONENT SELECTED':'INSPECT COMPONENT'} <i>+</i></small></button></Html>
 </group>)}
 </group>;
}
useGLTF.preload('/models/apollo-descent.glb','/draco/');
