import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useSceneFrame as useFrame } from './SceneActivity';
import { useArchive } from '../stores/archive';
import { initialFlight, stepFlight, type FlightState } from '../game/flight';
import { flightInput, clearControls } from '../game/input';
import SurveyCraft from './SurveyCraft';
import LandingDust from './LandingDust';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function LandingTarget(){const points=useMemo(()=>Array.from({length:65},(_,i)=>new THREE.Vector3(Math.cos(i/64*Math.PI*2)*6,.06,Math.sin(i/64*Math.PI*2)*6)),[]);return <group><Line points={points} color="#a9e8ec" transparent opacity={.65} dashed dashSize={.55} gapSize={.3}/><Line points={[[-8,.06,0],[8,.06,0]]} color="#c5edec" transparent opacity={.35}/><Line points={[[0,.06,-8],[0,.06,8]]} color="#c5edec" transparent opacity={.35}/><Html position={[0,.1,-7]} center><div className="landing-label">LZ / 01<br/><span>LAND WITHIN THE RING</span></div></Html></group>;}
export default function LandingFlight({mars=false}:{mars?:boolean}){const state=useRef<FlightState>(initialFlight());const {camera}=useThree();const craft=useRef<THREE.Group>(null);const {flightReset,assist,paused,setStage}=useArchive(useShallow(s=>({flightReset:s.flightReset,assist:s.assist,paused:s.paused,setStage:s.setStage})));const sent=useRef(0);const landedAt=useRef(0);const [power,setPower]=useState(.1);useEffect(()=>{state.current=initialFlight();landedAt.current=0;clearControls();camera.position.set(6+(mars?10:0),56,212+(mars?4:0));camera.lookAt(-2+(mars?10:0),36,145+(mars?4:0));if(camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();},[flightReset,camera,mars]);
 useFrame((_,dt)=>{if(paused)return;state.current=stepFlight(state.current,{...flightInput,assist},dt);const s=state.current;const y=s.altitude*.48;const p=new THREE.Vector3(s.x+(mars?10:0),y,s.z+s.altitude*1.7+(mars?4:0));if(craft.current){craft.current.position.copy(p);craft.current.rotation.x=THREE.MathUtils.damp(craft.current.rotation.x,flightInput.z*.13,4,dt);craft.current.rotation.z=THREE.MathUtils.damp(craft.current.rotation.z,-flightInput.x*.13,4,dt);}
 // A forward corridor shows altitude through hills and parallax, not a top-down map.
 const target=p.clone().add(new THREE.Vector3(6,8,22));
 camera.position.lerp(target,reduced()?1:1-Math.exp(-dt*5));
 camera.lookAt(p.x-2,y-12,p.z-45);
 sent.current+=dt;if(sent.current>.08){window.dispatchEvent(new CustomEvent('sol-3-flight',{detail:s}));sent.current=0;setPower(s.failed||s.landed?0:flightInput.brake||assist?.9:.15);}
 if(s.landed){if(landedAt.current===0&&!mars)window.dispatchEvent(new Event('sol-3-touchdown'));landedAt.current+=dt;if(landedAt.current>(mars?1.6:1.1)){clearControls();if(mars)useArchive.setState({stage:'mars',chapter:'sojourner',marsApproached:true});else setStage('surface');}}
 });return <><group ref={craft} scale={mars?1.05:1.45}><SurveyCraft thrust={power}/></group><group position={mars?[10,0,4]:[0,0,0]}><LandingDust flight={state} mars={mars}/><LandingTarget/></group></>;}
