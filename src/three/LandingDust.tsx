import { useSceneFrame as useFrame } from './SceneActivity';
import { useMemo, useRef, useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import type { FlightState } from '../game/flight';
import { useArchive } from '../stores/archive';

// Turbulent transparent sheets suggest regolith flow, not atmospheric smoke.
export default function LandingDust({flight}:{flight:RefObject<FlightState>}) {
  const group=useRef<THREE.Group>(null);
  const material=useMemo(()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{time:{value:0},strength:{value:0}},
    vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv; uniform float time; uniform float strength;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
      float fbm(vec2 p){float n=0.;float a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+3.7;a*=.5;}return n;}
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);vec2 flow=p*5.-normalize(p+vec2(.001))*time*.65;
      float n=fbm(flow+fbm(flow*.7));float veil=(1.-smoothstep(.2,1.,r))*smoothstep(.04,.28,r);
      float alpha=veil*smoothstep(.23,.77,n)*strength*.43;
      gl_FragColor=vec4(mix(vec3(.35,.36,.37),vec3(.68,.69,.70),n),alpha);}`}),[]);
  useEffect(()=>()=>material.dispose(),[material]);
  useFrame((_,dt)=>{
    if(!group.current)return;
    const s=flight.current;
    group.current.visible=s.altitude<18&&!s.failed;
    if(!group.current.visible||useArchive.getState().paused)return;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)material.uniforms.time.value+=dt;
    material.uniforms.strength.value=1-Math.min(1,s.altitude/18);
    group.current.position.set(s.x,.08,s.z+s.altitude*1.7);
  });
  return <group ref={group}>{[0,1,2,3].map(i=><mesh key={i} position={[0,i*.13,0]} rotation={[-Math.PI/2,0,i*.73]} material={material}><planeGeometry args={[21+i*2,21+i*2]}/></mesh>)}</group>;
}
