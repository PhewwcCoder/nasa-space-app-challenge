import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame } from './SceneActivity';
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import SurveyCraft from './SurveyCraft';

export function DistantSignal(){return <group><mesh position={[-20,27,-115]}><sphereGeometry args={[.32,12,12]}/><meshBasicMaterial color="#e39363"/></mesh><Line points={[[20,4,-22],[5,11,-49],[-20,27,-115]]} color="#9ed9dc" transparent opacity={.3} lineWidth={.6}/></group>;}
export function DepartureCraft(){const ref=useRef<THREE.Group>(null);useFrame(()=>{if(!ref.current)return;const t=Math.min(1,useArchive.getState().travelProgress/.36);ref.current.position.lerpVectors(new THREE.Vector3(2,0,3),new THREE.Vector3(35,80,80),t*t*(3-2*t));});return <group ref={ref} rotation={[0,.8,0]}><SurveyCraft thrust={.85}/></group>;}
export function MarsArrivalCraft(){const ref=useRef<THREE.Group>(null);useFrame(()=>{if(!ref.current)return;const s=useArchive.getState(),t=s.stage==='travel'?THREE.MathUtils.clamp((s.travelProgress-.68)/.32,0,1):1;ref.current.position.lerpVectors(new THREE.Vector3(20,26,53),new THREE.Vector3(10,0,4),t*t*(3-2*t));});return <group ref={ref} scale={.65} rotation={[0,.5,0]}><SurveyCraft thrust={useArchive(s=>s.stage)==='travel'?.4:0}/></group>;}
export function TransitPlanets(){const [moon,mars,stars]=useTexture(['/textures/moon-color-2k.jpg','/textures/mars-globe-2k.jpg','/textures/nasa-starmap-4k-web.jpg']);return <><mesh><sphereGeometry args={[300,40,24]}/><meshBasicMaterial map={stars} side={THREE.BackSide} color="#53616c"/></mesh><ambientLight intensity={.5}/><directionalLight position={[-30,40,20]} intensity={2}/><mesh position={[-38,-24,15]}><sphereGeometry args={[16,48,32]}/><meshStandardMaterial map={moon}/></mesh><mesh position={[0,0,-75]}><sphereGeometry args={[23,64,48]}/><meshStandardMaterial map={mars} color="#bb8063"/></mesh><group position={[1,-2,1]} scale={.65}><SurveyCraft thrust={.5}/></group></>;}
export default function ChapterTravel(){const {camera}=useThree();const started=useRef(false),start=useRef(new THREE.Vector3());const time=useRef(0);const {setStage,setTravelProgress}=useArchive(useShallow(s=>({setStage:s.setStage,setTravelProgress:s.setTravelProgress})));useEffect(()=>{started.current=false;time.current=0;},[]);useFrame((_,dt)=>{const state=useArchive.getState();if(state.paused)return;if(!started.current){started.current=true;start.current.copy(camera.position);if(camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();}if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTravelProgress(1);setStage('mars');return;}time.current+=Math.min(dt,.1);const p=Math.min(1,time.current/19);if(p-state.travelProgress>.004||p===1)setTravelProgress(p);const ease=(t:number)=>t*t*(3-2*t);
 if(p<.36){const t=ease(p/.36);camera.position.lerpVectors(start.current,new THREE.Vector3(60,110,140),t);camera.lookAt(20,1.2,-22);}
 else if(p<.68){const t=ease((p-.36)/.32);camera.position.lerpVectors(new THREE.Vector3(0,3,29),new THREE.Vector3(0,2,-40),t);camera.lookAt(0,0,-75);}
 else{const t=ease((p-.68)/.32);camera.position.lerpVectors(new THREE.Vector3(28,35,68),new THREE.Vector3(12,4.1,19),t);camera.lookAt(0,.2,0);}
 if(p>=1)setStage('mars');});return null;}
