import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useArchive } from '../stores/archive';
import { useSceneFrame, useSceneActive } from './SceneActivity';

/** Authored composite: these stops span different places and years, not one site. */
function OpportunityEvidence(){
  const {inspector,step}=useArchive(useShallow(s=>({inspector:s.inspector,step:s.evidenceStep})));
  const active=useSceneActive();
  const petals=useRef<(THREE.Group|null)[]>([]),wheel=useRef<THREE.Mesh>(null),cart=useRef<THREE.Group>(null);
  const materials=useMemo(()=>{
    const result={
    limestone:new THREE.MeshStandardMaterial({color:'#9e8d75',roughness:.98}),
    layer:new THREE.MeshStandardMaterial({color:'#89795f',roughness:1}),
    hematite:new THREE.MeshStandardMaterial({color:'#4c4740',roughness:.63,metalness:.22}),
    shield:new THREE.MeshStandardMaterial({color:'#a68b61',roughness:.64,metalness:.65,side:THREE.DoubleSide}),
    blanket:new THREE.MeshStandardMaterial({color:'#bab5a3',roughness:.58,metalness:.55}),
    fabric:new THREE.MeshStandardMaterial({color:'#d5c6aa',roughness:1,side:THREE.DoubleSide}),
    sand:new THREE.MeshStandardMaterial({color:'#997c5a',roughness:1,transparent:true}),
    dark:new THREE.MeshStandardMaterial({color:'#494137',roughness:1}),
    };
    for(const material of [result.limestone,result.layer,result.hematite,result.sand]){
      material.customProgramCacheKey=()=>material===result.sand?'opportunity-sand':'opportunity-stone';
      material.onBeforeCompile=shader=>{
        shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vEvidence;').replace('#include <begin_vertex>','#include <begin_vertex>\nvEvidence=position;');
        shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vEvidence;').replace('#include <color_fragment>',`#include <color_fragment>
          float grit=fract(sin(dot(floor(vEvidence*260.),vec3(12.9898,78.233,37.719)))*43758.5453);
          float beds=sin(vEvidence.y*47.+sin(vEvidence.x*9.)*.5);
          diffuseColor.rgb*=.78+grit*.24+beds*.07;`);
        if(material===result.sand)shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>',`diffuseColor.a*=smoothstep(0.,.18,1.-max(abs(vEvidence.x)/1.4,abs(vEvidence.z)/.95));
          #include <alphatest_fragment>`);
      };
    }
    return result;
  },[]);
  const rock=useMemo(()=>{
    const g=new THREE.SphereGeometry(1,32,20),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=1+.12*Math.sin(x*14+z*9)*Math.cos(y*13);p.setXYZ(i,x*r,y*r,z*r);}
    g.computeVertexNormals();return g;
  },[]);
  const ripple=useMemo(()=>{
    const g=new THREE.PlaneGeometry(2.8,1.9,48,32);g.rotateX(-Math.PI/2);
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),z=p.getZ(i),falloff=Math.max(0,1-(x/1.4)**4)*Math.max(0,1-(z/.95)**4);
      p.setY(i,.009+falloff*(.05+.15*(.5+.5*Math.cos(z*13+x*.5))));
    }
    g.computeVertexNormals();return g;
  },[]);
  const cloth=useMemo(()=>{
    const g=new THREE.PlaneGeometry(1.5,1.3,18,18),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,.045*Math.sin(x*19+y*3)+.035*Math.cos(y*22));}
    g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>()=>{Object.values(materials).forEach(m=>m.dispose());rock.dispose();cloth.dispose();ripple.dispose();},[materials,rock,cloth,ripple]);
  useEffect(()=>{if(!active){if(wheel.current)wheel.current.rotation.y=0;if(cart.current)cart.current.position.z=0;}},[active]);
  useSceneFrame((_,dt)=>{
    if(useArchive.getState().paused)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const landing=inspector==='opportunityLanding'&&step>=1;
    for(const petal of petals.current)if(petal)petal.rotation.x=THREE.MathUtils.damp(petal.rotation.x,landing?-.08:-.8,5,reduced?10:dt);
    const testing=inspector==='purgatory';
    if(wheel.current&&testing&&step>0&&!reduced)wheel.current.rotation.y+=dt*(step===1?2.4:.22);
    if(cart.current)cart.current.position.z=THREE.MathUtils.damp(cart.current.position.z,testing&&step>=2?.58:0,3,reduced?10:dt);
  });
  return <>
    {/* Pale, stepped outcrops distinguish Meridiani from Gusev's volcanic scene. */}
    {Array.from({length:16},(_,i)=><group key={i} position={[-14+i*1.8,0,-9-Math.sin(i*2)*3]} rotation={[0,i*.7,0]}>
      <mesh geometry={rock} material={materials.limestone} scale={[.65+(i%3)*.14,.2,.43]} position={[0,.11,0]} receiveShadow castShadow/>
      <mesh geometry={rock} material={materials.layer} scale={[.62+(i%3)*.14,.025,.41]} position={[0,.19,0]}/>
    </group>)}
    <group position={[-5,0,-4]}>
      <mesh material={materials.blanket} position={[0,.12,0]}><cylinderGeometry args={[.5,.5,.09,3]}/></mesh>
      {[0,1,2].map(i=><group key={i} rotation={[0,i*Math.PI*2/3,0]}>
        <group position={[0,.18,.25]} ref={node=>{petals.current[i]=node;}} rotation={[-.8,0,0]}>
          <mesh material={materials.shield} position={[0,0,.4]} rotation={[-Math.PI/2,0,Math.PI]}><circleGeometry args={[.48,3]}/></mesh>
        </group>
        <mesh material={materials.fabric} geometry={rock} position={[.3,.085,.5]} scale={[.32,.1,.27]}/>
      </group>)}
      <mesh position={[-1.35,.23,-.8]} material={materials.blanket}><coneGeometry args={[.52,.45,16,1,true]}/></mesh>
      <mesh position={[-2,.08,-.7]} rotation={[-Math.PI/2,0,.5]} geometry={cloth} material={materials.fabric}/>
    </group>
    <group position={[-3,0,2]}>
      <mesh material={materials.shield} position={[-.3,.14,0]} rotation={[-Math.PI/2,.28,.3]}><coneGeometry args={[.65,.18,14,1,true,0,4.6]}/></mesh>
      <mesh material={materials.blanket} position={[.25,.16,-.25]} rotation={[-1.2,.3,-.4]}><planeGeometry args={[.38,.48,2,2]}/></mesh>
      <mesh geometry={rock} material={materials.hematite} position={[.9,.15,.1]} scale={[.28,.19,.23]} castShadow/>
      {inspector==='heatShieldRock'&&step>=2&&<mesh position={[.9,.006,.1]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.36,.375,48]}/><meshBasicMaterial color="#aadfe0"/></mesh>}
    </group>
    <group position={[3,0,1]}>
      <mesh geometry={rock} material={materials.limestone} position={[0,.13,0]} scale={[.85,.19,.65]} receiveShadow/>
      {Array.from({length:46},(_,i)=>{const a=i*2.39996,r=.62*Math.sqrt((i+.5)/46),x=Math.cos(a)*r,z=Math.sin(a)*r,y=.13+.19*Math.sqrt(Math.max(0,1-(x/.85)**2-(z/.65)**2));return <mesh key={i} material={materials.hematite} position={[x,y,z]} scale={.014+(i%3)*.002}><sphereGeometry args={[1,8,6]}/></mesh>;})}
      {inspector==='blueberries'&&step>=1&&<group position={[0,.65,0]}>
        <mesh material={materials.limestone} scale={[.55,.055,.4]} geometry={rock}/>
        {[[-.25,.06,0],[0,.06,.1],[.23,.06,-.08]].map((p,i)=><mesh key={i} position={p as [number,number,number]} material={materials.hematite}><sphereGeometry args={[.085,16,12]}/></mesh>)}
      </group>}
    </group>
    <group position={[3,0,-3]}>
      <mesh geometry={ripple} material={materials.sand} receiveShadow/>
      {[-.42,.42].map(x=><mesh key={x} rotation={[-Math.PI/2,0,0]} position={[x,.008,.3]} material={materials.dark}><planeGeometry args={[.1,1.5]}/></mesh>)}
      {inspector==='purgatory'&&step>0&&<group ref={cart}>
        <mesh position={[0,.37,0]} material={materials.blanket}><boxGeometry args={[.58,.12,.45]}/></mesh>
        <group position={[.39,.23,0]} rotation={[0,0,Math.PI/2]}><mesh ref={wheel} material={materials.dark}><cylinderGeometry args={[.22,.22,.12,12]}/><mesh position={[.1,.065,0]} material={materials.blanket}><boxGeometry args={[.16,.005,.025]}/></mesh></mesh></group>
        <mesh position={[-.39,.23,0]} rotation={[0,0,Math.PI/2]} material={materials.dark}><cylinderGeometry args={[.22,.22,.12,16]}/></mesh>
      </group>}
    </group>
    {/* Illustrative route marks, never a claim that original tracks persist. */}
    {Array.from({length:50},(_,i)=>[-1,1].map(side=><mesh key={`${i}-${side}`} material={materials.layer} position={[Math.sin(i*.08)*.4+side*.55,.006,1+i*.12]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.09,.017]}/></mesh>))}
  </>;
}
export default memo(OpportunityEvidence);
