import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { flightInput } from '../game/input';

// Authored explorer and path, not a reconstruction of an Apollo astronaut's route.
export default function Explorer(){
 const body=useRef<THREE.Group>(null);const clock=useRef(0);
 useFrame(({camera},dt)=>{const s=useArchive.getState();if(s.stage!=='surface'||s.inspector)return;const moving=flightInput.z<0&&!s.paused&&s.walk<1;const progress=Math.min(1,s.walk+(moving?Math.min(dt,.05)/7:0));if(progress!==s.walk)s.setWalk(progress);clock.current+=moving?dt*6:0;const x=32-progress*10,z=-1-progress*14;const bob=moving&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches?Math.sin(clock.current*2)*.055:0;
 if(body.current){body.current.position.set(x,bob,z);body.current.rotation.y=Math.atan2(-10,-14);}

 const target=new THREE.Vector3(x+4,3.1,z+6);camera.position.lerp(target,1-Math.exp(-dt*5));camera.lookAt(x-2,1.7,z-5);
 });
 return <><group ref={body} position={[32,0,-1]}><AstronautSuit/>
 </group><group>{Array.from({length:26},(_,i)=>{const t=i/25;return <group key={i} position={[32-t*12+(i%2?.22:-.22),.012,-1-t*18]} rotation={[0,.62,0]}><mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.25,.46]}/><meshStandardMaterial color="#41423f" roughness={1}/></mesh>{Array.from({length:6},(_,j)=><mesh key={j} position={[0,.012,(j-2.5)*.063]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.22,.023]}/><meshStandardMaterial color="#93938a"/></mesh>)}</group>;})}</group></>;
}

function AstronautSuit(){
 const gltf=useGLTF('/models/astronaut.glb','/draco/');
 const phase=useRef(0),stride=useRef(0);
 const rig=useMemo(()=>{
  gltf.scene.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(gltf.scene),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const scale=2.4/size.y,group=new THREE.Group(),root=new THREE.Bone();group.add(root);
  const bones=[root];
  for(const side of [-1,1]){
   const hip=new THREE.Bone();hip.position.set(side*.2,1.05,0);root.add(hip);
   const knee=new THREE.Bone();knee.position.set(0,-.52,0);hip.add(knee);
   const shoulder=new THREE.Bone();shoulder.position.set(side*.34,1.78,0);root.add(shoulder);
   const elbow=new THREE.Bone();elbow.position.set(side*.38,-.08,0);shoulder.add(elbow);
   bones.push(hip,knee,shoulder,elbow);
  }
  group.updateMatrixWorld(true);
  const skeleton=new THREE.Skeleton(bones),meshes:THREE.SkinnedMesh[]=[];
  gltf.scene.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   const geometry=o.geometry.clone();geometry.applyMatrix4(o.matrixWorld);geometry.translate(-center.x,-bounds.min.y,-center.z);geometry.scale(scale,scale,scale);
   const pos=geometry.attributes.position,indices:number[]=[],weights:number[]=[];
   for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i),side=x<0?1:5;
    const arm=THREE.MathUtils.smoothstep(Math.abs(x),.32,.55)*THREE.MathUtils.smoothstep(y,1.15,1.5);
    const backpackMask=y>.7?THREE.MathUtils.smoothstep(pos.getZ(i),-.24,-.08):1;
    const leg=(1-THREE.MathUtils.smoothstep(y,.85,1.03))*(1-arm)*backpackMask;
    if(arm>.01){const forearm=THREE.MathUtils.smoothstep(Math.abs(x),.65,.92);indices.push(0,side+2,side+3,0);weights.push(1-arm,arm*(1-forearm),arm*forearm,0);}
    else{const shin=1-THREE.MathUtils.smoothstep(y,.43,.66);indices.push(0,side,side+1,0);weights.push(1-leg,leg*(1-shin),leg*shin,0);}
   }
   geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
   const material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();
   const mesh=new THREE.SkinnedMesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;group.add(mesh);mesh.bind(skeleton);meshes.push(mesh);
  });
  return {group,bones,meshes,skeleton};
 },[gltf]);
 useEffect(()=>()=>{rig.meshes.forEach(m=>{m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());});rig.skeleton.dispose();},[rig]);
 useFrame((_,dt)=>{
  const s=useArchive.getState();if(s.paused)return;
  const moving=s.stage==='surface'&&!s.inspector&&flightInput.z<0&&s.walk<1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  stride.current=THREE.MathUtils.damp(stride.current,moving?1:0,8,dt);if(moving)phase.current+=Math.min(dt,.05)*6;
  for(const [i,side] of [[1,-1],[5,1]]){
   const step=Math.sin(phase.current+(side<0?0:Math.PI))*stride.current;
   rig.bones[i].rotation.x=step*.42;
   rig.bones[i+1].rotation.x=Math.max(0,-step)*.55;
   rig.bones[i+2].rotation.set(-step*.32,0,-side*.72);
   rig.bones[i+3].rotation.x=-.18-Math.max(0,step)*.22;
  }
 });
 return <primitive object={rig.group}/>;
}
useGLTF.preload('/models/astronaut.glb','/draco/');
