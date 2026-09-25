import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useTexture, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';

import ModelControls from './ModelControls';
const up=new THREE.Vector3(0,1,0);
function Strut({a,b,r=.045,color='#b4aa89'}:{a:number[];b:number[];r?:number;color?:string}){
 const start=new THREE.Vector3(...a), end=new THREE.Vector3(...b), delta=end.clone().sub(start);
 return <mesh position={start.add(end).multiplyScalar(.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(up,delta.clone().normalize())} castShadow><cylinderGeometry args={[r,r,delta.length(),8]}/><meshStandardMaterial color={color} metalness={.65} roughness={.5}/></mesh>;
}
function Part({id,children}:{id:string;children:React.ReactNode}){
 const ref=useRef<THREE.Group>(null); const {inspector,selected,select,exploded,isolated}=useArchive();
 const [hover,setHover]=useState(false);
 useFrame((_,dt)=>{if(ref.current){ const target=exploded?(id==='structure'?1.8:id==='engine'?-.5:.15):0;ref.current.position.y=window.matchMedia('(prefers-reduced-motion: reduce)').matches?target:THREE.MathUtils.damp(ref.current.position.y,target,7,dt);}});
 const active=inspector==='eagle';
 useEffect(()=>{ref.current?.traverse(o=>{if(o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial){o.material.emissive.set(active&&(hover||selected===id)?'#504428':'#000000');o.material.emissiveIntensity=hover?.22:.09;}});},[active,hover,selected,id]);
 return <group ref={ref} visible={!active||!isolated||id===selected} onClick={(e:ThreeEvent<MouseEvent>)=>{if(active){e.stopPropagation();select(id);}}} onPointerOver={e=>{if(active){e.stopPropagation();setHover(true);}}} onPointerOut={()=>setHover(false)}>
 {children}
 {active&&(selected===id||hover)&&id==='structure'&&<mesh position={[0,1.75,0]}><boxGeometry args={[3.7,1.72,3.7]}/><meshBasicMaterial color={hover?'#ffffff':'#c6dada'} wireframe transparent opacity={.25}/></mesh>}
 </group>;
}
function Foil(){
 const geometry=useMemo(()=>{const g=new THREE.PlaneGeometry(1.54,1.3,24,20);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x*45+y*28)*.018+Math.cos(x*79-y*36)*.012);}g.computeVertexNormals();return g;},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} position={[0,0,.04]} castShadow><meshStandardMaterial color="#c8a246" metalness={.62} roughness={.48} side={THREE.DoubleSide}/></mesh>;
}
export function Eagle(){
 return <group>
 <Part id="structure">
 <mesh position={[0,1.65,0]} castShadow receiveShadow><cylinderGeometry args={[2.25,2.25,1.65,8]}/><meshStandardMaterial color="#b89a48" roughness={.64} metalness={.7} flatShading/></mesh>
 {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return <group key={i} rotation={[0,-a,0]} position={[Math.sin(a)*2.09,1.64,Math.cos(a)*2.09]}><Foil/><mesh castShadow><boxGeometry args={[1.54,1.3,.05]}/><meshStandardMaterial color={i%2?'#ad8735':'#d1b45e'} metalness={.76} roughness={.6}/></mesh>{[-.46,0,.46].map((n,j)=><mesh key={j} position={[n,0,.032]} rotation={[0,0,(j%2?.1:-.07)]}><boxGeometry args={[.03,1.25,.015]}/><meshStandardMaterial color="#77633d"/></mesh>)}</group>})}
 <mesh position={[0,2.5,0]} receiveShadow><cylinderGeometry args={[2.2,2.2,.14,8]}/><meshStandardMaterial color="#777970" metalness={.6} roughness={.8}/></mesh>
 {[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].map(([x,z],i)=><mesh key={i} position={[x,2.57,z]}><boxGeometry args={[.85,.12,.85]}/><meshStandardMaterial color="#333735"/></mesh>)}
 <mesh position={[0,2.58,0]}><cylinderGeometry args={[.44,.44,.15,24]}/><meshStandardMaterial color="#181b1b"/></mesh>
 </Part>
 <Part id="engine"><mesh position={[0,.64,0]} castShadow><cylinderGeometry args={[.3,.72,1.1,24,1,true]}/><meshStandardMaterial color="#4f514d" side={THREE.DoubleSide} metalness={.85} roughness={.55}/></mesh></Part>
 <Part id="gear">{[0,1,2,3].map(i=><group key={i} rotation={[0,i*Math.PI/2+Math.PI/4,0]}>
 <Strut a={[1.6,2,0]} b={[3.7,.2,0]} r={.1}/><Strut a={[1.4,.95,-.85]} b={[3.4,.36,0]}/><Strut a={[1.4,.95,.85]} b={[3.4,.36,0]}/>
 <mesh position={[3.7,.12,0]} castShadow receiveShadow><cylinderGeometry args={[.55,.6,.16,24]}/><meshStandardMaterial color="#a39772" metalness={.65} roughness={.75}/></mesh>
 <mesh position={[2.5,1.15,0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[.17,.17,.65,10]}/><meshStandardMaterial color="#c5b68b" metalness={.6} roughness={.45}/></mesh>
 </group>)}
 <group rotation={[0,Math.PI/4,0]}><Strut a={[1.8,2.4,-.3]} b={[3.5,.4,-.3]} r={.04} color="#b8bcb8"/><Strut a={[1.8,2.4,.3]} b={[3.5,.4,.3]} r={.04} color="#b8bcb8"/>{Array.from({length:8},(_,i)=><Strut key={i} a={[1.85+i*.21,2.3-i*.24,-.32]} b={[1.85+i*.21,2.3-i*.24,.32]} r={.035} color="#b8bcb8"/>)}</group>
 </Part>
 </group>;
}
function Ground(){
 const geometry=useMemo(()=>{
 const g=new THREE.PlaneGeometry(180,180,180,180); g.rotateX(-Math.PI/2);const p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),d=Math.hypot(x,z); const h=(Math.sin(x*.19)*Math.cos(z*.14)*1.4+Math.sin(x*.47+z*.23)*.32+Math.sin(x*2.7+z*3.9)*.065)*Math.min(1,Math.max(0,(d-7)/15));p.setY(i,h-.07);}g.computeVertexNormals();return g;
 },[]);
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;const image=ctx.createImageData(256,256);let s=42;for(let i=0;i<image.data.length;i+=4){s=(s*1664525+1013904223)>>>0;const n=100+(s%100);image.data[i]=n;image.data[i+1]=n;image.data[i+2]=n;image.data[i+3]=255;}ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(90,90);return t;},[]);
 useEffect(()=>()=>{geometry.dispose();texture.dispose();},[geometry,texture]);
 return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#8a8985" map={texture} bumpMap={texture} bumpScale={.12} roughness={1}/></mesh>;
}
function Rocks(){
 const mesh=useRef<THREE.InstancedMesh>(null);
 useEffect(()=>{const dummy=new THREE.Object3D();let seed=73;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<280;i++){const x=(rnd()-.5)*100,z=(rnd()-.5)*100;const d=Math.hypot(x,z);const h=(Math.sin(x*.19)*Math.cos(z*.14)*1.4+Math.sin(x*.47+z*.23)*.32)*Math.min(1,Math.max(0,(d-7)/15));const s=.06+rnd()*.48;dummy.position.set(x,h,z);dummy.rotation.set(rnd()*3,rnd()*3,rnd()*3);dummy.scale.set(s*1.5,s*.65,s);dummy.updateMatrix();mesh.current!.setMatrixAt(i,dummy.matrix);}mesh.current!.instanceMatrix.needsUpdate=true;},[]);
 return <instancedMesh ref={mesh} args={[undefined,undefined,280]} castShadow receiveShadow><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#666661" roughness={1}/></instancedMesh>;
}
function Moon(){const texture=useTexture('/textures/moon-color-2k.jpg');return <mesh position={[3,0,-2]} rotation={[0,-.7,.12]}><sphereGeometry args={[3.7,72,48]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>;}
function CameraRig(){
 const {camera}=useThree(); const {stage,inspector,progress,viewKey}=useArchive();const look=useRef(new THREE.Vector3());
 useEffect(()=>{if(inspector){camera.position.set(8,5,9);camera.lookAt(0,1.1,0);}},[inspector,viewKey,camera]);
 useFrame((_,dt)=>{if(inspector)return;const space=['entry','signal','approach'].includes(stage);const target=space?new THREE.Vector3(0,1,14-progress*5):new THREE.Vector3(stage==='surface'?17:12,stage==='surface'?5.5:5,stage==='surface'?24:17);camera.position.lerp(target,window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*3));look.current.lerp(space?new THREE.Vector3(0,0,-2):new THREE.Vector3(-.6,1,0),window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*3));camera.lookAt(look.current);});return null;
}
function Scene(){const {stage,inspector,viewKey,inspect}=useArchive();const space=['entry','signal','approach'].includes(stage);return <>
 <color attach="background" args={[space?'#05080c':inspector?'#111416':'#060707']}/>
 <ambientLight intensity={space?.08:inspector?.8:.5}/>{inspector&&<directionalLight position={[6,5,8]} intensity={2} color="#b7c9dc"/>}<directionalLight position={[-16,12,7]} intensity={space?3:3.5} color={space?'#dce8f3':'#fff5db'} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-bias={-.001}/>
 {space?<><Stars radius={110} depth={40} count={1200} factor={2} fade speed={0}/><Moon/></>:<>{!inspector&&<><Ground/><Rocks/><mesh position={[-28,15,-70]}><sphereGeometry args={[.85,24,16]}/><meshStandardMaterial color="#7095a8" emissive="#182738"/></mesh></>}
 {(inspector==='eagle'||!inspector)&&<group onClick={()=>{if(stage==='explore'&&!inspector)inspect('eagle');}}><Eagle/></group>}
 {!inspector&&<>
 <group position={[-5,0,-6]} rotation={[0,-.5,0]}><mesh position={[0,.22,0]} rotation={[-.3,0,0]} castShadow><boxGeometry args={[.8,.08,.8]}/><meshStandardMaterial color="#a3acaf" metalness={.7} roughness={.4}/></mesh><Strut a={[-.3,0,0]} b={[-.3,.35,-.25]}/><Strut a={[.3,0,0]} b={[.3,.35,-.25]}/></group>
 {stage==='explore'&&<><Html position={[0,3.7,0]} center><button className="spatial-marker" aria-label="Investigate the structure in the landscape" onClick={()=>inspect('eagle')}>01</button></Html><Html position={[-5,1,-6]} center><button className="spatial-marker" aria-label="Investigate the array in the landscape" onClick={()=>inspect('reflector')}>02</button></Html><Html position={[-4,.6,3]} center><button className="spatial-marker" aria-label="Investigate surface impressions in the landscape" onClick={()=>inspect('footprints')}>03</button></Html></>}
 </>}
 
 {inspector==='reflector'&&<group rotation={[-.25,0,0]} position={[0,1,0]}><mesh><boxGeometry args={[3,.13,3]}/><meshStandardMaterial color="#bbb9a8" metalness={.7} roughness={.4}/></mesh>{Array.from({length:100},(_,i)=><mesh key={i} position={[(i%10-4.5)*.27,.1,(Math.floor(i/10)-4.5)*.27]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.11,6]}/><meshStandardMaterial color="#c3e1e4" metalness={.9} roughness={.12}/></mesh>)}</group>}
 </>}
 <CameraRig/>{inspector&&<ModelControls/>}{inspector&&<OrbitControls key={`${inspector}-${viewKey}`} makeDefault target={[0,1.1,0]} minDistance={4} maxDistance={20} maxPolarAngle={Math.PI*.85} enablePan={false}/>}
 </>;}
export default function World(){const inspector=useArchive(s=>s.inspector);return <div className={inspector?"world inspecting":"world"} aria-label="Interactive schematic lunar reconstruction"><Canvas shadows dpr={[1,1.5]} camera={{position:[0,1,14],fov:43,near:.1,far:250}} gl={{antialias:true,powerPreference:'high-performance'}}><Suspense fallback={null}><Scene/></Suspense></Canvas></div>;}
