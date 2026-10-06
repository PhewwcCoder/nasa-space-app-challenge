import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame, SceneOrbitControls } from './SceneActivity';
import { inspectionMinDistance } from './inspectionZoom';
import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { spiritArtifacts, isSpiritArtifact } from '../data/spirit';
import { Terrain, Dust } from './MarsScene';
import SpiritModel from './SpiritModel';
import SurveyCraft from './SurveyCraft';

function SpiritCamera(){
  const {camera,size}=useThree();const {inspector,spiritApproached,viewKey,stage,scanProgress}=useArchive(useShallow(s=>({inspector:s.inspector,spiritApproached:s.spiritApproached,viewKey:s.viewKey,stage:s.stage,scanProgress:s.scanProgress})));
  const start=useRef(new THREE.Vector3()),elapsed=useRef(0),arrived=useRef(false);
  const focus=useMemo(()=>isSpiritArtifact(inspector)?new THREE.Vector3(...spiritArtifacts[inspector].position).add(new THREE.Vector3(0,inspector==='spirit'||inspector==='spiritLog'?.7:.25,0)):new THREE.Vector3(0,.65,0),[inspector]);
  useEffect(()=>{start.current.copy(camera.position);elapsed.current=0;arrived.current=false;},[camera,inspector,spiritApproached,viewKey,stage]);
  useEffect(()=>{const handle=(event:Event)=>{if(!inspector)return;const mode=(event as CustomEvent<string>).detail,d=camera.position.clone().sub(focus);if(mode==='left'||mode==='right')d.applyAxisAngle(new THREE.Vector3(0,1,0),mode==='left'?.25:-.25);else d.multiplyScalar(mode==='in'?.85:1.15);d.setLength(THREE.MathUtils.clamp(d.length(),inspectionMinDistance(inspector),18));camera.position.copy(focus.clone().add(d));camera.lookAt(focus);};window.addEventListener('model-control',handle);return()=>window.removeEventListener('model-control',handle);},[camera,focus,inspector]);
  useFrame((_,dt)=>{
    if(stage==='mars-travel'||stage==='opportunity-travel')return;
    if(camera instanceof THREE.PerspectiveCamera){if(inspector)camera.setViewOffset(size.width,size.height,size.width>760?size.width*.18:0,size.width<=760?size.height*.1:0,size.width,size.height);else camera.clearViewOffset();}
    if(useArchive.getState().paused)return;
    elapsed.current+=dt;if(inspector&&arrived.current&&scanProgress===1)return;
    const t=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,elapsed.current/1.7),smooth=t*t*(3-2*t);
    const destination=inspector?focus.clone().add(new THREE.Vector3(...(inspector==='spirit'||inspector==='spiritLog'?[3.9,2.7,4.9]:[3,2.4,3.9]) as [number,number,number])):new THREE.Vector3(...(spiritApproached?[6,3.6,9]:[11,5.4,17]) as [number,number,number]);
    camera.position.lerpVectors(start.current,destination,smooth);camera.lookAt(focus);if(t===1)arrived.current=true;
  });
  return inspector&&scanProgress===1?<SceneOrbitControls key={`${inspector}-${viewKey}`} makeDefault target={focus} minDistance={inspectionMinDistance(inspector)} maxDistance={18} maxPolarAngle={Math.PI*.48} enablePan={false}/>:null;
}

const EvidenceGround=memo(function EvidenceGround(){
  const {inspector,evidenceStep}=useArchive(useShallow(s=>({inspector:s.inspector,evidenceStep:s.evidenceStep})));const abrasion=inspector==='abrasion'&&evidenceStep>=2,silica=inspector==='silica'&&evidenceStep>=1;
  const rock=useMemo(()=>{
    const g=new THREE.IcosahedronGeometry(1,2),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const r=1+.14*Math.sin(x*7+z*9)*Math.cos(y*8);p.setXYZ(i,x*r,Math.min(.86,y*r),z*r);}
    g.computeVertexNormals();return g;
  },[]);
  const rockMaterial=useMemo(()=>{
    const m=new THREE.MeshStandardMaterial({color:'#68594b',roughness:.98,envMapIntensity:.1});
    m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRock;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRock=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vRock;').replace('#include <color_fragment>',`#include <color_fragment>
      float grain=fract(sin(dot(floor(vRock*190.),vec3(12.9898,78.233,37.719)))*43758.5453);
      float layer=sin(vRock.y*38.+sin(vRock.x*5.)*.8);
      diffuseColor.rgb*=.78+grain*.23+layer*.045;`);};return m;
  },[]);
  const patch=useMemo(()=>{const shape=new THREE.Shape();for(let i=0;i<48;i++){const a=i/48*Math.PI*2,r=1+Math.sin(i*2.7)*.09;const x=Math.cos(a)*.23*r,y=Math.sin(a)*1.05*r;if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);}shape.closePath();return new THREE.ShapeGeometry(shape);},[]);
  useEffect(()=>()=>{patch.dispose();rock.dispose();rockMaterial.dispose();},[patch,rock,rockMaterial]);
  return <>
    <group position={[-3,0,1]}>
      <mesh position={[0,.25,0]} scale={[.65,.37,.58]} geometry={rock} material={rockMaterial} castShadow receiveShadow/>
      <mesh position={[0,.575,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[abrasion?.23:.16,48]}/><meshStandardMaterial color={abrasion?'#c6b89c':'#66564a'} roughness={.92}/></mesh>
      <mesh position={[0,.578,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.16,.18,48]}/><meshStandardMaterial color="#9d8c73" roughness={1}/></mesh>
    </group>
    <group position={[2.8,.008,-1]} rotation={[0,.35,0]}>
      <mesh rotation={[-Math.PI/2,0,0]} geometry={patch}><meshStandardMaterial transparent opacity={.5} color={silica?'#b5a68b':'#8c7964'} roughness={1}/></mesh>
      {Array.from({length:38},(_,i)=><mesh key={i} position={[Math.sin(i*23)*.15,.004,-.92+i*.05]} scale={[.018,.004,.027]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#b2a088" roughness={1}/></mesh>)}
    </group>
    {Array.from({length:75},(_,i)=>[-1,1].map(side=>{const z=i*.095;return <mesh key={`${i}-${side}`} position={[Math.sin(z*.5)*.6+side*.57,.001,z]} rotation={[-Math.PI/2,0,-Math.atan(.3*Math.cos(z*.5))]}><planeGeometry args={[.11,.012]}/><meshStandardMaterial color="#51473d" transparent opacity={.22} depthWrite={false}/></mesh>;}))}
    <group position={[-7,.01,-7]}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.7,.73,64]}/><meshBasicMaterial color="#a8d8da" transparent opacity={.6}/></mesh><Line points={[[0,0,0],[0,1.8,0]]} color="#a8d8da" lineWidth={.6}/></group>
  </>;
});

function SpiritScene({active=true}:{active?:boolean}){
  const {scene,gl}=useThree();const {inspector,spiritApproached,identified,inspect,stage}=useArchive(useShallow(s=>({inspector:s.inspector,spiritApproached:s.spiritApproached,identified:s.identified,inspect:s.inspect,stage:s.stage})));
  useEffect(()=>{const old=scene.background;scene.background=new THREE.Color('#b39a7d');scene.fog=new THREE.FogExp2('#b39a7d',.009);return()=>{scene.background=old;scene.fog=null;};},[scene]);
  useEffect(()=>{
    // Authored linear HDR sky/ground reflection, with a broad sunward highlight.
    // Keeps metal readable without a photographic environment or runtime network fetch.
    const bytes=new Float32Array(128*64*4),sky=new THREE.Color('#d7c7af'),ground=new THREE.Color('#6e4a34');
    for(let y=0;y<64;y++)for(let x=0;x<128;x++){const c=sky.clone().lerp(ground,THREE.MathUtils.smoothstep(y/63,.35,.8)),i=(y*128+x)*4;const light=1+2.5*Math.exp(-((x/127-.7)**2/.008+(y/63-.28)**2/.015));bytes[i]=c.r*light;bytes[i+1]=c.g*light;bytes[i+2]=c.b*light;bytes[i+3]=1;}
    const texture=new THREE.DataTexture(bytes,128,64,THREE.RGBAFormat,THREE.FloatType);texture.mapping=THREE.EquirectangularReflectionMapping;texture.needsUpdate=true;
    const generator=new THREE.PMREMGenerator(gl),target=generator.fromEquirectangular(texture),old=scene.environment;
    scene.environment=target.texture;texture.dispose();generator.dispose();
    return()=>{scene.environment=old;target.dispose();};
  },[scene,gl]);
  return <>
    <hemisphereLight args={['#e5d7bd','#493a30',.85]}/><directionalLight position={[-10,14,7]} intensity={2.8} color="#fff7eb" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0003}/>
    <Terrain/><Dust/><SpiritModel/><EvidenceGround/>
    <group position={[11,0,-6]} rotation={[0,-.6,0]} scale={.65}><SurveyCraft thrust={0}/></group>
    {active&&stage==='spirit'&&!inspector&&spiritApproached&&<Html position={[1.4,1.7,0]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="spirit" onClick={()=>inspect('spirit')}><span>01</span><small>{identified.includes('spirit')?'SPIRIT':'UNKNOWN HARDWARE'}<br/>INSPECT TRACE</small></button></Html>}
    {active&&<SpiritCamera/>}
  </>;
}

export function MarsTraverse(){
  const {camera}=useThree();const time=useRef(0),start=useRef(new THREE.Vector3());
  useEffect(()=>{start.current.copy(camera.position);if(camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();},[camera]);
  useFrame((_,dt)=>{const state=useArchive.getState();if(state.paused)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){state.setStage('spirit');return;}time.current+=Math.min(dt,.1);const p=Math.min(1,time.current/10);if(p-state.travelProgress>.004||p===1)state.setTravelProgress(p);const t=p<.5?p*2:(p-.5)*2,e=t*t*(3-2*t);if(p<.5)camera.position.lerpVectors(start.current,new THREE.Vector3(25,45,40),e);else camera.position.lerpVectors(new THREE.Vector3(-28,42,40),new THREE.Vector3(11,5.4,17),e);camera.lookAt(0,.6,0);if(p===1)state.setStage('spirit');});
  return null;
}

export default memo(SpiritScene);
