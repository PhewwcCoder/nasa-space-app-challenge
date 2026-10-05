import { inspectionMinDistance } from './inspectionZoom';
import SpiritScene, { MarsTraverse } from './SpiritScene';
import MarsScene from './MarsScene';
import ChapterTravel, { DistantSignal, TransitPlanets, DepartureCraft } from './ChapterTravel';
﻿import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { initialFlight, stepFlight, type FlightState } from '../game/flight';
import { flightInput, pressControl, clearControls } from '../game/input';
import ApolloModel from './ApolloModel';
import SurveyCraft from './SurveyCraft';
import Explorer from './Explorer';
import LandingDust from './LandingDust';

const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const eagleOrigin=new THREE.Vector3(20,0,-22);
function Input(){useEffect(()=>{const keys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];const down=(e:KeyboardEvent)=>{if(!['entry','signal','approach','surface'].includes(useArchive.getState().stage)||useArchive.getState().paused)return;if((e.target as HTMLElement).matches('input,textarea')||(e.code==='Space'&&(e.target as HTMLElement).matches('button,a')))return;if(keys.includes(e.code)){e.preventDefault();pressControl(e.code,true);}};const up=(e:KeyboardEvent)=>pressControl(e.code,false);const blur=()=>clearControls();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);clearControls();};},[]);return null;}
function Background(){const {scene}=useThree();const stage=useArchive(s=>s.stage);const stars=useTexture('/textures/nasa-starmap-4k-web.jpg');useEffect(()=>{stars.colorSpace=THREE.SRGBColorSpace;scene.background=new THREE.Color('#030405');},[scene,stars]);return ['entry','signal','complete'].includes(stage)?<mesh><sphereGeometry args={[300,48,32]}/><meshBasicMaterial map={stars} color="#30383d" side={THREE.BackSide} depthWrite={false}/></mesh>:null;}
function Ground(){const photo=useTexture('/textures/apollo11-panorama.jpg');const geometry=useMemo(()=>{const g=new THREE.PlaneGeometry(700,700,180,180);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),d=Math.hypot(x-10,z+10);const outside=THREE.MathUtils.smoothstep(d,40,65);const h=(Math.sin(x*.085)*Math.cos(z*.074)*1.7+Math.sin(x*.42+z*.31)*.18)*outside;const ridge=14*Math.exp(-(((Math.abs(x)-65)/32)**2))*Math.exp(-(((z-90)/95)**2));p.setY(i,h+ridge*outside-.1);}g.computeVertexNormals();return g;},[]);
 const material=useMemo(()=>{const t=photo.clone();t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,1);const m=new THREE.MeshStandardMaterial({map:t,color:'#a8a9a7',roughness:1});m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>','#ifdef USE_MAP\nvec2 terrainUv=vec2(0.32,0.36)+vMapUv*vec2(0.34,0.23);\nvec4 sampledDiffuseColor=texture2D(map,terrainUv);\nfloat grain=fract(sin(dot(vMapUv*17000.0,vec2(12.9898,78.233)))*43758.5453);\ndiffuseColor*=sampledDiffuseColor*(0.84+grain*0.24);\n#endif');};m.customProgramCacheKey=()=> 'nasa-regolith-crop-v2';return m;},[photo]);
 useEffect(()=>()=>{geometry.dispose();material.map?.dispose();material.dispose();},[geometry,material]);return <mesh geometry={geometry} material={material} receiveShadow/>;}
function Rocks(){const ref=useRef<THREE.InstancedMesh>(null);useEffect(()=>{if(!ref.current)return;const o=new THREE.Object3D();for(let i=0;i<220;i++){const a=i*2.39996,r=8+Math.sqrt(i/220)*75;const x=Math.cos(a)*r+10,z=Math.sin(a)*r-12;const size=.06+((Math.sin(i*17.31)+1)/2)**4*.65;o.position.set(x,size*.22-.08,z);o.rotation.set(i*.72,i*1.31,i*.26);o.scale.set(size*1.5,size*.65,size);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);}ref.current.instanceMatrix.needsUpdate=true;},[]);return <instancedMesh ref={ref} args={[undefined,undefined,220]} castShadow receiveShadow><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#656461" roughness={1}/></instancedMesh>;}

function Moon(){const map=useTexture('/textures/moon-color-2k.jpg');return <mesh position={[0,-18,-15]} rotation={[0,.25,-.12]}><sphereGeometry args={[25,96,64]}/><meshStandardMaterial map={map} roughness={1}/></mesh>;}
function OrbitalCraft(){const ref=useRef<THREE.Group>(null);useFrame((_,dt)=>{if(!ref.current)return;ref.current.position.x=THREE.MathUtils.clamp(ref.current.position.x+flightInput.x*dt*2.5,-3,3);ref.current.position.z=THREE.MathUtils.clamp(ref.current.position.z+flightInput.z*dt*1.8,7,12);ref.current.rotation.z=THREE.MathUtils.damp(ref.current.rotation.z,-flightInput.x*.1,5,dt);});return <group ref={ref} position={[0,-.8,10]} rotation={[0,Math.PI,0]} scale={.72}><SurveyCraft thrust={.15}/></group>;}
function LandingTarget(){const points=useMemo(()=>Array.from({length:65},(_,i)=>new THREE.Vector3(Math.cos(i/64*Math.PI*2)*6,.06,Math.sin(i/64*Math.PI*2)*6)),[]);return <group><Line points={points} color="#a9e8ec" transparent opacity={.65} dashed dashSize={.55} gapSize={.3}/><Line points={[[-8,.06,0],[8,.06,0]]} color="#c5edec" transparent opacity={.35}/><Line points={[[0,.06,-8],[0,.06,8]]} color="#c5edec" transparent opacity={.35}/><Html position={[0,.1,-7]} center><div className="landing-label">LZ / 01<br/><span>LAND WITHIN THE RING</span></div></Html></group>;}
function Flight(){const state=useRef<FlightState>(initialFlight());const {camera}=useThree();const craft=useRef<THREE.Group>(null);const {flightReset,assist,paused,setStage}=useArchive();const sent=useRef(0);const landedAt=useRef(0);const [power,setPower]=useState(.1);useEffect(()=>{state.current=initialFlight();landedAt.current=0;clearControls();camera.position.set(6,56,212);camera.lookAt(-2,36,145);},[flightReset,camera]);
 useFrame((_,dt)=>{if(paused)return;state.current=stepFlight(state.current,{...flightInput,assist},dt);const s=state.current;const y=s.altitude*.48;const p=new THREE.Vector3(s.x,y,s.z+s.altitude*1.7);if(craft.current){craft.current.position.copy(p);craft.current.rotation.x=THREE.MathUtils.damp(craft.current.rotation.x,flightInput.z*.13,4,dt);craft.current.rotation.z=THREE.MathUtils.damp(craft.current.rotation.z,-flightInput.x*.13,4,dt);}
 // A forward corridor shows altitude through hills and parallax, not a top-down map.
 const target=p.clone().add(new THREE.Vector3(6,8,22));
 camera.position.lerp(target,reduced()?1:1-Math.exp(-dt*5));
 camera.lookAt(s.x-2,y-12,p.z-45);
 sent.current+=dt;if(sent.current>.08){window.dispatchEvent(new CustomEvent('mersa-flight',{detail:s}));sent.current=0;setPower(s.failed||s.landed?0:flightInput.brake||assist?.9:.15);}
 if(s.landed){if(landedAt.current===0)window.dispatchEvent(new Event('mersa-touchdown'));landedAt.current+=dt;if(landedAt.current>1.1)setStage('surface');}
 });return <><group ref={craft} scale={1.45}><SurveyCraft thrust={power}/></group><LandingDust flight={state}/><LandingTarget/></>;}
function Reflector({position=[0,0,0]}:{position?:[number,number,number]}){return <group position={position} rotation={[-.35,0,0]}><mesh castShadow><boxGeometry args={[1.4,.1,1.4]}/><meshStandardMaterial color="#aaa894" metalness={.6} roughness={.5}/></mesh>{Array.from({length:100},(_,i)=><mesh key={i} position={[(i%10-4.5)*.13,.065,(Math.floor(i/10)-4.5)*.13]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.055,6]}/><meshStandardMaterial color="#cee4e7" metalness={.9} roughness={.18}/></mesh>)}</group>;}
function SurfaceObjects(){const {stage,inspector,inspect,walk}=useArchive();return <><Explorer/>
 <group position={eagleOrigin}><ApolloModel/></group>
 <group position={[10,.4,-15]} onClick={()=>{if(stage==='explore')inspect('reflector');}}><Reflector/></group>
 {stage==='travel'?<DepartureCraft/>:<group position={[2,0,3]} rotation={[0,.8,0]}><SurveyCraft thrust={0}/></group>}
 {stage==='surface'&&walk>=1&&!inspector&&<Html position={[20,3.8,-22]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="eagle" onClick={()=>useArchive.getState().setStage('identified')}><span>+</span><small>UNKNOWN HARDWARE<br/>SCAN OBJECT</small></button></Html>}
 {stage==='explore'&&!inspector&&<><Html position={[20,3.8,-22]} center zIndexRange={[4,3]}><button className="world-target eagle-target" data-artifact="eagle" onClick={()=>inspect('eagle')}><span>01</span><small>EAGLE<br/>DISSECT HARDWARE</small></button></Html><Html position={[10,1.4,-15]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="reflector" onClick={()=>inspect('reflector')}><span>02</span><small>REFLECTIVE ARRAY</small></button></Html><Html position={[26,.4,-14]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="footprints" onClick={()=>inspect('footprints')}><span>03</span><small>SURFACE TRACES</small></button></Html></>}
 </>;}
function ViewRig(){
 const {stage,inspector,viewKey}=useArchive();const {camera,size}=useThree();
 const start=useRef(new THREE.Vector3()),look=useRef(new THREE.Vector3(20,1.2,-22));
 useEffect(()=>{start.current.copy(camera.position);},[inspector,viewKey,camera]);
 useFrame((_,dt)=>{
  const progress=useArchive.getState().scanProgress;
  if(camera instanceof THREE.PerspectiveCamera){
   const framed=inspector==='eagle'||inspector==='reflector';
   if(framed)camera.setViewOffset(size.width,size.height,size.width>760?size.width*.18*progress:0,size.width<=760?size.height*.15*progress:0,size.width,size.height);
   else camera.clearViewOffset();
  }
  if(inspector){
   if(progress<1){
    const destination=inspector==='reflector'?new THREE.Vector3(14,5,-9):new THREE.Vector3(29,7,-8);
    const focus=inspector==='reflector'?new THREE.Vector3(10,.4,-15):new THREE.Vector3(20,3,-22);
    const t=progress*progress*(3-2*progress);
    camera.position.lerpVectors(start.current,destination,t);camera.position.y+=Math.sin(t*Math.PI)*2;
    camera.lookAt(look.current.clone().lerp(focus,t));
   }
   return;
  }
  if(stage==='approach'||stage==='surface'||stage==='travel'||stage==='mars')return;
  const orbital=stage==='entry'||stage==='signal';const pos=orbital?new THREE.Vector3(0,4.5,23):new THREE.Vector3(33,6,-3);
  const focus=orbital?new THREE.Vector3(0,0,0):new THREE.Vector3(20,1.2,-22);
  camera.position.lerp(pos,reduced()?1:1-Math.exp(-dt*2));look.current.lerp(focus,reduced()?1:1-Math.exp(-dt*2));camera.lookAt(look.current);
 });
 useEffect(()=>{if(inspector&&useArchive.getState().scanProgress===1){camera.position.set(...(inspector==='reflector'?[14,5,-9]:[29,7,-8]) as [number,number,number]);}},[inspector,viewKey,camera]);
 return null;
}
function LunarScene(){const {stage,inspector,viewKey,scanProgress}=useArchive();const orbit=stage==='entry'||stage==='signal';const {camera,controls,invalidate}=useThree();
 useEffect(()=>{const action=(event:Event)=>{if(!inspector)return;const mode=(event as CustomEvent<string>).detail;const center=inspector==='reflector'?new THREE.Vector3(10,window.innerWidth<761?-1.2:.4,-15):new THREE.Vector3(20,3,-22);const delta=camera.position.clone().sub(center);if(mode==='left'||mode==='right')delta.applyAxisAngle(new THREE.Vector3(0,1,0),mode==='left'?.25:-.25);else delta.multiplyScalar(mode==='in'?.87:1.15);delta.setLength(THREE.MathUtils.clamp(delta.length(),inspectionMinDistance(inspector),40));camera.position.copy(center.add(delta));(controls as unknown as {update?:()=>void})?.update?.();invalidate();};window.addEventListener('model-control',action);return()=>window.removeEventListener('model-control',action);},[camera,controls,inspector,invalidate]);
 return <><Background/><ambientLight intensity={orbit?.08:.65}/><directionalLight position={orbit?[-70,15,-25]:[-30,35,30]} intensity={orbit?2.1:2.4} color="#f6f3e8" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-65} shadow-camera-right={65} shadow-camera-top={65} shadow-camera-bottom={-65} shadow-bias={-.0006}/><directionalLight position={[40,12,-5]} intensity={inspector?.85:stage==='approach'?.55:.12} color="#adc3d2"/>
 {orbit?<><Moon/><OrbitalCraft/></>:<><Ground/><Rocks/>{stage==='approach'?<><Flight/><group position={eagleOrigin}><ApolloModel/></group></>:<SurfaceObjects/>}</>}
 {stage==='complete'&&<DistantSignal/>}<ViewRig/>{inspector&&scanProgress===1&&(inspector==='eagle'||inspector==='reflector')&&<OrbitControls key={`${inspector}-${viewKey}`} makeDefault target={inspector==='reflector'?[10,window.innerWidth<761?-1.2:.4,-15]:[20,3,-22]} minDistance={inspectionMinDistance(inspector)} maxDistance={40} maxPolarAngle={Math.PI*.49} enablePan={false}/>}
 </>;}
function Scene(){const {stage,travelProgress}=useArchive();return <>{stage==='spirit'||stage==='mars-travel'&&travelProgress>=.5?<SpiritScene/>:stage==='mars-travel'||stage==='mars'||stage==='travel'&&travelProgress>=.68?<MarsScene/>:stage==='travel'&&travelProgress>=.36?<TransitPlanets/>:<LunarScene/>}{stage==='travel'&&<ChapterTravel/>}{stage==='mars-travel'&&<MarsTraverse/>}</>;}
export default function World(){return <div className="world" aria-label="Three dimensional archive exploration"><Canvas shadows dpr={[1,2]} camera={{position:[0,4.5,23],fov:49,near:.1,far:700}} gl={{antialias:true,powerPreference:'high-performance',localClippingEnabled:true}}><Input/><Suspense fallback={null}><Scene/></Suspense></Canvas></div>;}

