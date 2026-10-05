import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

// Small deterministic surface variation for authored foil and fabric, not a NASA texture.
export function useHardwareMaterial(color:string,metalness=0){
 const material=useMemo(()=>{
  const m=new THREE.MeshStandardMaterial({color,metalness,roughness:metalness?.52:.93});
  m.onBeforeCompile=s=>{
   s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vHardware;').replace('#include <begin_vertex>','#include <begin_vertex>\nvHardware=position;');
   s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
    varying vec3 vHardware;
    float hardwareTexture(vec3 p){return sin(p.x*83.+sin(p.y*52.))*sin(p.z*61.+p.y*93.);}`)
    .replace('#include <color_fragment>','#include <color_fragment>\nfloat crease=hardwareTexture(vHardware);diffuseColor.rgb*=.89+crease*.11;')
    .replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nvec3 surfacePos=vHardware*42.;normal=normalize(normal+vec3(sin(surfacePos.y+surfacePos.z)*.13,cos(surfacePos.x)*.09,sin(surfacePos.x+surfacePos.y)*.1));');
  };return m;
 },[color,metalness]);
 useEffect(()=>()=>material.dispose(),[material]);return material;
}
export function Strut({from,to,radius=.01}:{from:[number,number,number];to:[number,number,number];radius?:number}){
 const {mid,length,quaternion}=useMemo(()=>{const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to);return {mid:a.clone().add(b).multiplyScalar(.5),length:a.distanceTo(b),quaternion:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize())};},[from,to]);
 return <mesh position={mid} quaternion={quaternion} castShadow><cylinderGeometry args={[radius,radius,length,10]}/><meshStandardMaterial color="#b3b0a2" metalness={.78} roughness={.36}/></mesh>;
}
