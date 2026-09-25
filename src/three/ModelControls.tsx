import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
export default function ModelControls(){
 const {camera,controls,invalidate}=useThree();
 useEffect(()=>{const handle=(event:Event)=>{const direction=(event as CustomEvent<string>).detail;const center=new THREE.Vector3(0,1.1,0);const delta=camera.position.clone().sub(center);if(direction==='left'||direction==='right')delta.applyAxisAngle(new THREE.Vector3(0,1,0),direction==='left'?.3:-.3);else delta.multiplyScalar(direction==='in'?.85:1.15);delta.setLength(THREE.MathUtils.clamp(delta.length(),4,20));camera.position.copy(center.add(delta));camera.lookAt(0,1.1,0);(controls as unknown as {update?:()=>void})?.update?.();invalidate();};window.addEventListener('model-control',handle);return()=>window.removeEventListener('model-control',handle);},[camera,controls,invalidate]);return null;
}
