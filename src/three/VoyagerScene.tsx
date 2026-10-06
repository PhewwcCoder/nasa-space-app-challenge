import { memo, useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame, SceneOrbitControls } from './SceneActivity';
import { inspectionMinDistance } from './inspectionZoom';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import SpiritModel from './SpiritModel';
function VoyagerCamera(){
  const {camera,size}=useThree();const {inspector,voyagerApproached,viewKey,stage,scanProgress}=useArchive(useShallow(s=>({inspector:s.inspector,voyagerApproached:s.voyagerApproached,viewKey:s.viewKey,stage:s.stage,scanProgress:s.scanProgress})));
  const start=useRef(new THREE.Vector3()),elapsed=useRef(0),arrived=useRef(false);
  const focus=useMemo(()=>new THREE.Vector3(-2.5,3,2),[inspector]);
  useEffect(()=>{start.current.copy(camera.position);elapsed.current=0;arrived.current=false;},[camera,inspector,voyagerApproached,viewKey,stage]);
  useEffect(()=>{const handle=(event:Event)=>{if(!inspector)return;const mode=(event as CustomEvent<string>).detail,d=camera.position.clone().sub(focus);if(mode==='left'||mode==='right')d.applyAxisAngle(new THREE.Vector3(0,1,0),mode==='left'?.25:-.25);else d.multiplyScalar(mode==='in'?.85:1.15);d.setLength(THREE.MathUtils.clamp(d.length(),inspectionMinDistance(inspector),36));camera.position.copy(focus.clone().add(d));camera.lookAt(focus);};window.addEventListener('model-control',handle);return()=>window.removeEventListener('model-control',handle);},[camera,focus,inspector]);
  useFrame((_,dt)=>{
    if(stage==='voyager-travel')return;
    if(camera instanceof THREE.PerspectiveCamera){if(inspector)camera.setViewOffset(size.width,size.height,size.width>760?size.width*.18:0,size.width<=760?size.height*.1:0,size.width,size.height);else camera.clearViewOffset();}
    if(useArchive.getState().paused)return;
    elapsed.current+=dt;if(inspector&&arrived.current&&scanProgress===1)return;
    const t=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,elapsed.current/1.7),smooth=t*t*(3-2*t);
    const destination=inspector?focus.clone().add(new THREE.Vector3(15,10,23)):new THREE.Vector3(...(voyagerApproached?[12.5,13,25]:[17,16,34]) as [number,number,number]);
    camera.position.lerpVectors(start.current,destination,smooth);camera.lookAt(focus);if(t===1)arrived.current=true;
  });
  return inspector&&scanProgress===1?<SceneOrbitControls key={`${inspector}-${viewKey}`} makeDefault target={focus} minDistance={inspectionMinDistance(inspector)} maxDistance={36} maxPolarAngle={Math.PI*.9} enablePan={false}/>:null;
}


function VoyagerScene({active=true}:{active?:boolean}){
 const {scene,gl}=useThree();const stars=useTexture('/textures/nasa-starmap-4k-web.jpg');
 useEffect(()=>{const texture=stars.clone();texture.mapping=THREE.EquirectangularReflectionMapping;texture.colorSpace=THREE.SRGBColorSpace;scene.background=texture;scene.backgroundIntensity=.22;return()=>{scene.background=null;texture.dispose();};},[scene,stars]);
 useEffect(()=>{
  const bytes=new Float32Array(64*32*4);
  for(let y=0;y<32;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4,k=.45+3*Math.exp(-((x/63-.7)**2/.025+(y/31-.3)**2/.07));bytes[i]=k;bytes[i+1]=k*.92;bytes[i+2]=k*.8;bytes[i+3]=1;}
  const texture=new THREE.DataTexture(bytes,64,32,THREE.RGBAFormat,THREE.FloatType);texture.mapping=THREE.EquirectangularReflectionMapping;texture.needsUpdate=true;
  const generator=new THREE.PMREMGenerator(gl),target=generator.fromEquirectangular(texture);scene.environment=target.texture;texture.dispose();generator.dispose();return()=>{scene.environment=null;target.dispose();};
 },[scene,gl]);
 return <><ambientLight intensity={.65}/><directionalLight position={[7,12,10]} intensity={3.2} color="#fff0d7"/><directionalLight position={[-10,4,-8]} intensity={2} color="#98bddc"/><SpiritModel artifact="voyager" url="/models/voyager-refined.glb" rotation={-.4}/>{active&&<VoyagerCamera/>}</>;
}
export function VoyagerTraverse(){
 const {camera}=useThree();const time=useRef(0),start=useRef(new THREE.Vector3());
 useEffect(()=>{start.current.copy(camera.position);if(camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();},[camera]);
 useFrame((_,dt)=>{const state=useArchive.getState();if(state.paused)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){state.setStage('voyager');return;}time.current+=Math.min(dt,.1);const p=Math.min(1,time.current/10);if(p-state.travelProgress>.004||p===1)state.setTravelProgress(p);const t=p<.5?p*2:(p-.5)*2,e=t*t*(3-2*t);if(p<.5)camera.position.lerpVectors(start.current,new THREE.Vector3(25,65,50),e);else camera.position.lerpVectors(new THREE.Vector3(28,17,52),new THREE.Vector3(17,16,34),e);camera.lookAt(-2.5,3,2);if(p===1)state.setStage('voyager');});
 return null;
}
export default memo(VoyagerScene);
