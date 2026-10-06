import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame, SceneOrbitControls } from './SceneActivity';
import { inspectionMinDistance } from './inspectionZoom';
import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { opportunityArtifacts, isOpportunityArtifact } from '../data/opportunity';
import { Terrain, Dust } from './MarsScene';
import SpiritModel from './SpiritModel';
import OpportunityEvidence from './OpportunityEvidence';
import SurveyCraft from './SurveyCraft';

function OpportunityCamera(){
  const {camera,size}=useThree();const {inspector,opportunityApproached,viewKey,stage,scanProgress}=useArchive(useShallow(s=>({inspector:s.inspector,opportunityApproached:s.opportunityApproached,viewKey:s.viewKey,stage:s.stage,scanProgress:s.scanProgress})));
  const start=useRef(new THREE.Vector3()),elapsed=useRef(0),arrived=useRef(false);
  const focus=useMemo(()=>isOpportunityArtifact(inspector)?new THREE.Vector3(...opportunityArtifacts[inspector].position).add(new THREE.Vector3(0,inspector==='opportunity'||inspector==='opportunityLog'?.7:.25,0)):new THREE.Vector3(0,.65,0),[inspector]);
  useEffect(()=>{start.current.copy(camera.position);elapsed.current=0;arrived.current=false;},[camera,inspector,opportunityApproached,viewKey,stage]);
  useEffect(()=>{const handle=(event:Event)=>{if(!inspector)return;const mode=(event as CustomEvent<string>).detail,d=camera.position.clone().sub(focus);if(mode==='left'||mode==='right')d.applyAxisAngle(new THREE.Vector3(0,1,0),mode==='left'?.25:-.25);else d.multiplyScalar(mode==='in'?.85:1.15);d.setLength(THREE.MathUtils.clamp(d.length(),inspectionMinDistance(inspector),18));camera.position.copy(focus.clone().add(d));camera.lookAt(focus);};window.addEventListener('model-control',handle);return()=>window.removeEventListener('model-control',handle);},[camera,focus,inspector]);
  useFrame((_,dt)=>{
    if(stage==='opportunity-travel'||stage==='voyager-travel')return;
    if(camera instanceof THREE.PerspectiveCamera){if(inspector)camera.setViewOffset(size.width,size.height,size.width>760?size.width*.18:0,size.width<=760?size.height*.1:0,size.width,size.height);else camera.clearViewOffset();}
    if(useArchive.getState().paused)return;
    elapsed.current+=dt;if(inspector&&arrived.current&&scanProgress===1)return;
    const t=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,elapsed.current/1.7),smooth=t*t*(3-2*t);
    const destination=inspector?focus.clone().add(new THREE.Vector3(...(inspector==='opportunity'||inspector==='opportunityLog'?[3.9,2.7,4.9]:[3,2.4,3.9]) as [number,number,number])):new THREE.Vector3(...(opportunityApproached?[6,3.6,9]:[11,5.4,17]) as [number,number,number]);
    camera.position.lerpVectors(start.current,destination,smooth);camera.lookAt(focus);if(t===1)arrived.current=true;
  });
  return inspector&&scanProgress===1?<SceneOrbitControls key={`${inspector}-${viewKey}`} makeDefault target={focus} minDistance={inspectionMinDistance(inspector)} maxDistance={18} maxPolarAngle={Math.PI*.48} enablePan={false}/>:null;
}

function OpportunityScene({active=true}:{active?:boolean}){
  const {scene,gl}=useThree();const {inspector,opportunityApproached,identified,inspect,stage}=useArchive(useShallow(s=>({inspector:s.inspector,opportunityApproached:s.opportunityApproached,identified:s.identified,inspect:s.inspect,stage:s.stage})));
  useEffect(()=>{const old=scene.background;scene.background=new THREE.Color('#b9a383');scene.fog=new THREE.FogExp2('#b9a383',.009);return()=>{scene.background=old;scene.fog=null;};},[scene]);
  useEffect(()=>{
    // Authored linear HDR sky/ground reflection, with a broad sunward highlight.
    // Keeps metal readable without a photographic environment or runtime network fetch.
    const bytes=new Float32Array(128*64*4),sky=new THREE.Color('#d7c7af'),ground=new THREE.Color('#78604a');
    for(let y=0;y<64;y++)for(let x=0;x<128;x++){const c=sky.clone().lerp(ground,THREE.MathUtils.smoothstep(y/63,.35,.8)),i=(y*128+x)*4;const light=1+2.5*Math.exp(-((x/127-.7)**2/.008+(y/63-.28)**2/.015));bytes[i]=c.r*light;bytes[i+1]=c.g*light;bytes[i+2]=c.b*light;bytes[i+3]=1;}
    const texture=new THREE.DataTexture(bytes,128,64,THREE.RGBAFormat,THREE.FloatType);texture.mapping=THREE.EquirectangularReflectionMapping;texture.needsUpdate=true;
    const generator=new THREE.PMREMGenerator(gl),target=generator.fromEquirectangular(texture),old=scene.environment;
    scene.environment=target.texture;texture.dispose();generator.dispose();
    return()=>{scene.environment=old;target.dispose();};
  },[scene,gl]);
  return <>
    <hemisphereLight args={['#e5d7bd','#554434',.85]}/><directionalLight position={[-10,14,7]} intensity={2.8} color="#fff7eb" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0003}/>
    <Terrain/><Dust/><SpiritModel artifact="opportunity" url="/models/opportunity-refined.glb"/><OpportunityEvidence/>
    <group position={[11,0,-6]} rotation={[0,-.6,0]} scale={.65}><SurveyCraft thrust={0}/></group>
    {active&&stage==='opportunity'&&!inspector&&opportunityApproached&&<Html position={[1.4,1.7,0]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="opportunity" onClick={()=>inspect('opportunity')}><span>01</span><small>{identified.includes('opportunity')?'OPPORTUNITY':'UNKNOWN TRACE'}<br/>INSPECT TRACE</small></button></Html>}
    {active&&<OpportunityCamera/>}
  </>;
}

export function OpportunityTraverse(){
  const {camera}=useThree();const time=useRef(0),start=useRef(new THREE.Vector3());
  useEffect(()=>{start.current.copy(camera.position);if(camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();},[camera]);
  useFrame((_,dt)=>{const state=useArchive.getState();if(state.paused)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){state.setStage('opportunity');return;}time.current+=Math.min(dt,.1);const p=Math.min(1,time.current/10);if(p-state.travelProgress>.004||p===1)state.setTravelProgress(p);const t=p<.5?p*2:(p-.5)*2,e=t*t*(3-2*t);if(p<.5)camera.position.lerpVectors(start.current,new THREE.Vector3(25,45,40),e);else camera.position.lerpVectors(new THREE.Vector3(-28,42,40),new THREE.Vector3(11,5.4,17),e);camera.lookAt(0,.6,0);if(p===1)state.setStage('opportunity');});
  return null;
}

export default memo(OpportunityScene);
