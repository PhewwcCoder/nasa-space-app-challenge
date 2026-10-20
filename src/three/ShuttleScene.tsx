import { weatheredRock, irregularRock } from './MarsGeology';
import SojournerModel from './SojournerModel';
import SpiritModel from './SpiritModel';
import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneFrame } from './SceneActivity';
import { useArchive } from '../stores/archive';
import { flightInput, clearControls } from '../game/input';
import { COURSE_LENGTH, checkpoints, courseCenter, courseHeight, courseHazards, stepSurfaceFlight, type SurfaceRoute } from '../game/surfaceFlight';
import SurveyCraft from './SurveyCraft';

function Course({route}: {route: SurfaceRoute}) {
  const meridiani = route === 'opportunity', rocks = useRef<THREE.InstancedMesh>(null);
  const stone=useMemo(()=>irregularRock(),[]),rockMaterial=useMemo(()=>weatheredRock(meridiani ? '#c0ae8e' : '#817060',meridiani),[meridiani]);
  const from=useArchive(s=>s.shuttleFrom);
  const groundHeight=(x:number,d:number)=>courseHeight(d)+THREE.MathUtils.smoothstep(Math.abs(x-courseCenter(d)),15,100)*(meridiani ? .5 : 4)*Math.sin(x*.08+d*.017);
  const hazards = useMemo(()=>courseHazards(route),[route]);
  const ground = useMemo(()=>{
    const g=new THREE.PlaneGeometry(500,900,100,360);g.rotateX(-Math.PI/2);g.translate(0,0,-350);
    const p=g.attributes.position;for(let i=0;i<p.count;i++){
      const x=p.getX(i),d=-p.getZ(i);
      p.setY(i,groundHeight(x,d));
    }g.computeVertexNormals();return g;
  },[meridiani]);
  const material = useMemo(()=>{
    const m=new THREE.MeshStandardMaterial({color:'#79695e',roughness:1});
    m.customProgramCacheKey=()=>`surface-course-${meridiani}`;
    m.onBeforeCompile=s=>{
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 soil;').replace('#include <begin_vertex>','#include <begin_vertex>\nsoil=position;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 soil;');
      s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float dust=sin(soil.x*.7+sin(soil.z*.5))*sin(soil.z*.9+sin(soil.x*.4));
        float ripple=.5+.5*sin(soil.z*13.+sin(soil.x*.7)*2.);
        float fade=1.-smoothstep(.1,1.,length(fwidth(soil.xz)));
        diffuseColor.rgb*=.86+dust*.08+${meridiani ? 'ripple*.2*fade' : 'ripple*.06*fade'};`);
    };return m;
  },[meridiani]);
  useEffect(()=>{if(!rocks.current)return;const o=new THREE.Object3D();for(let i=0;i<700;i++){
    const d=(i*17.171)%760-35,side=i%2 ? -1:1,x=courseCenter(d)+side*(19+(i*7.131)%85),size=.2+(i%13)*.18;
    o.position.set(x,groundHeight(x,d),-d);o.rotation.set(i*.13,i*1.7,i*.23);o.scale.set(size*1.4,meridiani ? size*.3 : size*.8,size);o.updateMatrix();rocks.current.setMatrixAt(i,o.matrix);
    rocks.current.setColorAt(i,new THREE.Color(meridiani && i%3 ? '#b7aa90' : '#4e433b'));
  }rocks.current.instanceMatrix.needsUpdate=true;},[meridiani]);
  useEffect(()=>()=>{ground.dispose();material.dispose();stone.dispose();rockMaterial.dispose();},[ground,material,stone,rockMaterial]);
  return <>
    <group position={[-7,courseHeight(4),-4]}>{from==='sojourner' ? <SojournerModel/> : <SpiritModel artifact={from==='opportunity' ? 'opportunity' : 'spirit'} url={`/models/${from}-refined.glb`}/>}</group>
    <group position={[courseCenter(COURSE_LENGTH),courseHeight(COURSE_LENGTH),-COURSE_LENGTH-8]}>{route==='sojourner' ? <SojournerModel/> : <SpiritModel artifact={route} url={`/models/${route}-refined.glb`}/>}</group>
    <mesh geometry={ground} material={material} receiveShadow/>
    <instancedMesh ref={rocks} args={[stone,rockMaterial,700]} castShadow receiveShadow/>
    {hazards.map((o,i)=><group key={i} position={[courseCenter(o.distance)+o.offset,courseHeight(o.distance),-o.distance]}>
      <mesh position={[0,1.15,0]} rotation={[.12,i*1.2,.14]} scale={[o.radius,meridiani ? 1.7 : 2.6,o.radius]} castShadow receiveShadow geometry={stone} material={rockMaterial}/>
      {meridiani && [0,1,2].map(n=><mesh key={n} position={[.12,n*.44+.3,0]} rotation={[.03,i*1.2,.03]} scale={[o.radius*1.04,.11,o.radius*1.03]} castShadow><primitive object={stone} attach="geometry"/><primitive object={rockMaterial} attach="material"/></mesh>)}
    </group>)}
    {Array.from({length:32},(_,i)=>i*20).flatMap(d=>[-1,1].map(side=><mesh key={`${d}:${side}`} position={[courseCenter(d)+side*12,courseHeight(d)+.25,-d]}><cylinderGeometry args={[.08,.12,.5,6]}/><meshStandardMaterial color="#d6bd88" emissive="#a88749" emissiveIntensity={.3}/></mesh>))}
    {[...checkpoints.slice(1),COURSE_LENGTH].map(d=><group key={d} position={[courseCenter(d),courseHeight(d),-d]}>{[-1,1].map(side=><group key={side} position={[side*12,0,0]}><mesh position={[0,1.7,0]}><cylinderGeometry args={[.09,.12,3.4,8]}/><meshStandardMaterial color="#c2b7a2"/></mesh><mesh position={[0,3.5,0]}><octahedronGeometry args={[.3]}/><meshBasicMaterial color="#c6eee4"/></mesh></group>)}</group>)}
  </>;
}
export default function ShuttleScene({ active }: { active: boolean }) {
  const craft=useRef<THREE.Group>(null),sun=useRef<THREE.DirectionalLight>(null),target=useMemo(()=>new THREE.Object3D(),[]),{camera}=useThree();
  const route=useArchive(s=>s.shuttleTo);
  const aim=useMemo(()=>new THREE.Vector3(),[]);
  useEffect(()=>{if(active && camera instanceof THREE.PerspectiveCamera)camera.clearViewOffset();},[active,camera]);
  useSceneFrame((_,dt)=>{
    const s=useArchive.getState();if(s.stage!=='shuttle')return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){s.visitChapter(s.shuttleTo);return;}
    const race=s.paused ? s.shuttleRace : stepSurfaceFlight(s.shuttleRace,{steer:flightInput.x,thrust:flightInput.z<0,brake:flightInput.brake,cruise:s.shuttleCruise},dt,s.shuttleTo);
    if(!s.paused)useArchive.setState({shuttleRace:race,travelProgress:race.distance/COURSE_LENGTH,shuttleOffset:race.offset/3});
    const d=race.distance,x=courseCenter(d)+race.offset,y=courseHeight(d);
    if(craft.current){craft.current.position.set(x,y+1,-d);craft.current.rotation.z=THREE.MathUtils.damp(craft.current.rotation.z,s.paused||race.failed ? 0 : -flightInput.x*.22,5,Math.min(dt,.05));craft.current.rotation.y=-Math.atan2(courseCenter(d+2)-courseCenter(d),2);}
    camera.position.set(x*.7+courseCenter(d)*.3,y+6.6,-d+13);aim.set(courseCenter(d+22)+race.offset*.55,courseHeight(d+22)+1.4,-d-22);camera.lookAt(aim);
    target.position.set(x,y,-d);target.updateMatrixWorld();if(sun.current){sun.current.position.set(x-20,y+30,-d+18);sun.current.target=target;}
    if(race.failed&&!s.shuttleRace.failed)clearControls();
    if(race.finished)s.visitChapter(s.shuttleTo);
  });
  return <><color attach="background" args={['#9b7862']}/><fog attach="fog" args={['#9b7862',70,240]}/><hemisphereLight args={['#e9d5bd','#51453e',1.45]}/><directionalLight ref={sun} position={[-20,30,18]} intensity={3} color="#fff0cf" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-far={100} shadow-bias={-.0003}/><primitive object={target}/><Course route={route}/><group ref={craft} scale={.8}><SurveyCraft thrust={.6}/></group></>;
}
