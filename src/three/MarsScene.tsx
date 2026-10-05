import Terrain from './MarsTerrain';
import { inspectionMinDistance } from './inspectionZoom';
import { MarsArrivalCraft } from './ChapterTravel';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { isMarsArtifact, marsArtifacts } from '../data/mars';
import SojournerModel, { PathfinderModel } from './SojournerModel';

const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=(t:number)=>t*t*(3-2*t);
export { default as Terrain } from './MarsTerrain';
function Tracks(){return <group>{Array.from({length:64},(_,i)=>{const t=i/63;return [-1,1].map(s=><mesh key={`${i}-${s}`} position={[-2.8*(1-t)+s*.24,.004,-3.3*(1-t)]} rotation={[-Math.PI/2,0,-.7]}><planeGeometry args={[.09,.027]}/><meshStandardMaterial color="#504332" roughness={1}/></mesh>);})}</group>;}
export function Dust(){const material=useMemo(()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float time;void main(){float a=sin(vUv.x*20.+sin(vUv.y*8.+time*.12))*0.5+0.5;float edge=sin(vUv.x*3.14159)*sin(vUv.y*3.14159);gl_FragColor=vec4(.6,.43,.3,a*edge*.085);}' }),[]);useFrame((_,dt)=>{if(!reduced()&&!useArchive.getState().paused)material.uniforms.time.value+=dt;});useEffect(()=>()=>material.dispose(),[material]);return <group>{[0,1,2].map(i=><mesh key={i} position={[0,.3+i*.4,-9-i*13]} rotation={[-Math.PI/2+.05,0,i*.4]} material={material}><planeGeometry args={[90,30]}/></mesh>)}</group>;}
function MarsCamera(){const {camera,size}=useThree();const {inspector,marsApproached,viewKey,stage,scanProgress}=useArchive();const start=useRef(new THREE.Vector3());const elapsed=useRef(0);const focus=useMemo(()=>isMarsArtifact(inspector)?new THREE.Vector3(...marsArtifacts[inspector].position).add(new THREE.Vector3(0,inspector==='pathfinder'?.6:.22,0)):new THREE.Vector3(0,.2,0),[inspector]);
 useEffect(()=>{start.current.copy(camera.position);elapsed.current=0;},[inspector,marsApproached,viewKey,camera,stage]);
 useEffect(()=>{const handle=(event:Event)=>{if(!inspector)return;const mode=(event as CustomEvent<string>).detail;const delta=camera.position.clone().sub(focus);if(mode==='left'||mode==='right')delta.applyAxisAngle(new THREE.Vector3(0,1,0),mode==='left'?.25:-.25);else delta.multiplyScalar(mode==='in'?.85:1.15);delta.setLength(THREE.MathUtils.clamp(delta.length(),inspectionMinDistance(inspector),14));camera.position.copy(focus.clone().add(delta));camera.lookAt(focus);};window.addEventListener('model-control',handle);return()=>window.removeEventListener('model-control',handle);},[camera,focus,inspector]);
 useFrame((_,dt)=>{if(stage==='travel'||stage==='mars-travel')return;if(camera instanceof THREE.PerspectiveCamera){if(inspector)camera.setViewOffset(size.width,size.height,size.width>760?size.width*.19:0,size.width<=760?size.height*.14:0,size.width,size.height);else camera.clearViewOffset();}
 if(useArchive.getState().paused)return;
 elapsed.current+=dt;const t=reduced()?1:smooth(Math.min(1,elapsed.current/(inspector?1.7:2.8)));
 if(inspector&&elapsed.current>1.75&&scanProgress===1)return;
 const destination=inspector?focus.clone().add(new THREE.Vector3(...(inspector==='sojourner'?[1.25,.75,1.4]:[3,2.3,3.8]) as [number,number,number])):new THREE.Vector3(...(marsApproached?[3,1.8,5.8]:[12,4.1,19]) as [number,number,number]);
 camera.position.lerpVectors(start.current,destination,t);camera.lookAt(focus);
 });
 return inspector&&scanProgress===1?<OrbitControls key={`${inspector}-${viewKey}`} makeDefault target={focus} minDistance={inspectionMinDistance(inspector)} maxDistance={14} maxPolarAngle={Math.PI*.48} enablePan={false}/>:null;
}
export default function MarsScene(){const {scene}=useThree();const {stage,inspector,marsApproached,identified,inspect}=useArchive();useEffect(()=>{const old=scene.background;scene.background=new THREE.Color('#9b7862');scene.fog=new THREE.FogExp2('#9b7862',.012);return()=>{scene.background=old;scene.fog=null;};},[scene]);return <>
 <hemisphereLight args={['#e9d5bd','#51453e',1.45]}/><directionalLight position={[-12,18,8]} intensity={3} color="#fff0cf" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-bias={-.0003}/>
 <Terrain/><MarsArrivalCraft/><Tracks/><Dust/><SojournerModel/><group position={[-3,0,-5]} rotation={[0,.12,0]}><PathfinderModel/></group>
 <mesh position={[-.65,.14,-.1]} scale={[.33,.25,.3]} castShadow><dodecahedronGeometry args={[1,1]}/><meshStandardMaterial color="#66594c" roughness={1}/></mesh>
 <group position={[19,0,-28]}><mesh rotation={[0,.2,.06]}><coneGeometry args={[.8,.25,28,1,true]}/><meshStandardMaterial color="#60544c" side={THREE.DoubleSide}/></mesh><mesh position={[3,.04,-1]} rotation={[-Math.PI/2,0,.3]} scale={[1.8,.6,1]}><circleGeometry args={[1,18]}/><meshStandardMaterial color="#b8a994" side={THREE.DoubleSide} roughness={1}/></mesh></group>
 {stage==='mars'&&!inspector&&marsApproached&&<Html position={[0,.8,0]} center zIndexRange={[4,3]}><button className="world-target" data-artifact="sojourner" onClick={()=>inspect('sojourner')}><span>01</span><small>{identified.includes('sojourner')?'SOJOURNER':'UNKNOWN HARDWARE'}<br/>SCAN OBJECT</small></button></Html>}
 <MarsCamera/>
 </>;}
