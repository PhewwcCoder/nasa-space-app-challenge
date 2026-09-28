import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { components } from '../data/archive';
const positions: Record<string,[number,number,number]> = {structure:[-1.8,2.6,0],engine:[4,1.4,2.1],gear:[0,.2,-.7]};
const tags: Record<string,[number,number,number]> = {structure:[-4.2,5.9,0],engine:[5.3,1.1,2.1],gear:[-4.5,1.4,0]};
function componentFor(name:string) { if(name.startsWith('group13_pC'))return 'engine';if(name.startsWith('group31')||name.startsWith('polySurfa')||name==='pCylinder3')return 'gear';return 'structure'; }
function ModelPart({part,object}:{part:string;object:THREE.Group}) {
 const ref=useRef<THREE.Group>(null);const {inspector,exploded,selected,select,isolated,cutaway}=useArchive();const [hover,setHover]=useState(false);const active=inspector==='eagle'&&useArchive.getState().scanProgress===1;
 useEffect(()=>{object.traverse(o=>{if(o instanceof THREE.Mesh){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial){m.clippingPlanes=active&&cutaway&&part==='structure'?[new THREE.Plane(new THREE.Vector3(0,0,-1),-22)]:[];m.clipShadows=true;m.needsUpdate=true;}});}});},[object,active,selected,hover,part,cutaway]);
 useFrame((_,dt)=>{if(!ref.current)return;const p=active&&(exploded||selected===part)?positions[part]:[0,0,0];const alpha=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*4);ref.current.position.lerp(new THREE.Vector3(...p),alpha);});
 const handle=(e:ThreeEvent<MouseEvent>)=>{if(active){e.stopPropagation();select(part);}};
 return <group ref={ref} visible={!isolated||!selected||selected===part} onClick={handle} onPointerOver={e=>{if(active){e.stopPropagation();setHover(true);document.body.style.cursor='pointer';}}} onPointerOut={()=>{setHover(false);document.body.style.cursor='auto';}}><primitive object={object}/>{active&&selected===part&&<PartEdges object={object}/>}</group>;
}
function PartEdges({object}:{object:THREE.Group}){
 const edges=useMemo(()=>{const group=new THREE.Group();object.traverse(o=>{if(o instanceof THREE.Mesh){const lines=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,28),new THREE.LineBasicMaterial({color:'#63cfff',transparent:true,opacity:.8,depthWrite:false}));lines.applyMatrix4(o.matrix);group.add(lines);}});return group;},[object]);
 useEffect(()=>()=>{edges.traverse(o=>{if(o instanceof THREE.LineSegments){o.geometry.dispose();(o.material as THREE.Material).dispose();}});},[edges]);return <primitive object={edges}/>;
}
export default function ApolloModel(){
 const historical=useArchive(s=>s.historical);const full=useGLTF('/models/apollo-full.glb','/draco/');
 const gltf=useGLTF('/models/apollo-descent.glb','/draco/');
 const {inspector,exploded,inspect,stage,selected,select,isolated,scanProgress}=useArchive();
 const groups=useMemo(()=>{
   const parts:Record<string,THREE.Group>={structure:new THREE.Group(),engine:new THREE.Group(),gear:new THREE.Group()};
   const source=historical?full.scene:gltf.scene;source.updateMatrixWorld(true);
   source.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const mesh=o.clone();mesh.geometry=o.geometry.clone();mesh.applyMatrix4(o.matrixWorld);mesh.castShadow=true;mesh.receiveShadow=true;
     const upperShell=o.name.startsWith('polySurfa')&&new THREE.Box3().setFromObject(mesh).min.y>2.35;
     // Preserve NASA model materials; selection is a separate blue edge overlay.
     const convert=(m:THREE.Material)=>{
       const copy=m.clone();
       if(copy instanceof THREE.MeshStandardMaterial){
         // Authored material interpretation: thermal foil, silver panels and dark insulation.
         if(m.name.startsWith('blinn1SG')||m.name.startsWith('blinn9SG')){
           copy.color.set(m.name.startsWith('blinn9SG')?'#ad5b24':'#e0a74f');copy.metalness=.48;copy.roughness=.38;
           copy.onBeforeCompile=shader=>{
             shader.vertexShader='varying vec3 vFoil;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFoil=position;');
             shader.fragmentShader=`varying vec3 vFoil;
               float fh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
               float fn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(fh(i),fh(i+vec3(1,0,0)),f.x),mix(fh(i+vec3(0,1,0)),fh(i+vec3(1,1,0)),f.x),f.y),mix(mix(fh(i+vec3(0,0,1)),fh(i+vec3(1,0,1)),f.x),mix(fh(i+vec3(0,1,1)),fh(i+vec3(1)),f.x),f.y),f.z);}
             `+shader.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
               vec3 crease=vec3(fn(vFoil*28.),fn(vFoil*31.+7.),fn(vFoil*24.+17.))-.5;
               normal=normalize(normal+crease*.8);`);
           };copy.customProgramCacheKey=()=> 'authored-thermal-foil-v2';
         }else if(!copy.map){copy.metalness=.35;copy.roughness=.48;if(upperShell){copy.color.set(m.name.startsWith('initialShading')?'#343c40':'#b7bec0');copy.roughness=.58;} }
       }
       return copy;
     };mesh.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);parts[upperShell?'structure':componentFor(o.name)].add(mesh);
   });return parts;
 },[gltf,full,historical]);
 return <group scale={1.28} position={[0,-.13,0]} onClick={()=>{if(!inspector){if(stage==='surface'&&useArchive.getState().walk>=1)useArchive.getState().setStage('identified');else if(stage==='explore'||stage==='identified')inspect('eagle');}}}>
 {Object.entries(groups).map(([id,object])=><ModelPart key={id} part={id} object={object}/>)}
 {inspector==='eagle'&&scanProgress===1&&components.map(c=>(!isolated||!selected||c.id===selected)&&<group key={c.id} position={exploded?[0,0,0]:c.id==='engine'?[-2.8,.2,-2]:c.id==='structure'?[4,-2,0]:[0,0,0]}>
 <Line points={[[positions[c.id][0],positions[c.id][1]+(c.id==='structure'?1.8:.6),positions[c.id][2]],tags[c.id]]} color={selected===c.id?'#b8f2f5':'#76999a'} lineWidth={.7} transparent opacity={.65}/>
 <Html position={tags[c.id]} center zIndexRange={[6,5]}><button className={`spatial-part ${selected===c.id?'selected':''}`} onClick={()=>select(c.id)} data-part={c.id} aria-label={c.name} aria-pressed={selected===c.id}><strong>{c.id==='structure'?'Structure':c.id==='engine'?'Engine':'Landing gear'}</strong><small>{selected===c.id?'COMPONENT SELECTED':'INSPECT COMPONENT'} <i>+</i></small></button></Html>
 </group>)}
 </group>;
}
useGLTF.preload('/models/apollo-descent.glb','/draco/');
