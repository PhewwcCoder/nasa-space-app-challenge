import * as THREE from 'three';
/** Procedural weathering and bedding, not a sampled NASA surface texture. */
export function weatheredRock(color: string, layered = false) {
  const m=new THREE.MeshStandardMaterial({color,roughness:1,envMapIntensity:.1});
  m.customProgramCacheKey=()=>`weathered-rock-${layered}`;
  m.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 rockPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\nrockPoint=position;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 rockPoint;
      float rockHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,71.3)))*43758.5453);}
      float rockNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(rockHash(i),rockHash(i+vec3(1,0,0)),f.x),mix(rockHash(i+vec3(0,1,0)),rockHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(rockHash(i+vec3(0,0,1)),rockHash(i+vec3(1,0,1)),f.x),mix(rockHash(i+vec3(0,1,1)),rockHash(i+vec3(1,1,1)),f.x),f.y),f.z);}`);
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float mottling=rockNoise(rockPoint*5.),grain=rockNoise(rockPoint*85.);
      float bedding=.5+.5*sin(rockPoint.y*110.+rockNoise(rockPoint*3.)*4.);
      float fine=1.-smoothstep(.005,.04,length(fwidth(rockPoint)));
      diffuseColor.rgb*=.68+mottling*.42+(grain-.5)*.22*fine${layered ? '+bedding*.12' : ''};`);
    s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
      float relief=rockNoise(rockPoint*34.)*.008${layered ? '+sin(rockPoint.y*110.+rockNoise(rockPoint*3.)*4.)*.0015' : ''};
      vec3 sx=dFdx(-vViewPosition),sy=dFdy(-vViewPosition),r1=cross(sy,normal),r2=cross(normal,sx);
      float det=dot(sx,r1);normal=normalize(abs(det)*normal-sign(det)*(dFdx(relief)*r1+dFdy(relief)*r2));`);
  };return m;
}
export function irregularRock() {
  const g=new THREE.IcosahedronGeometry(1,2),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const r=1+.12*Math.sin(x*9+y*6)*Math.cos(z*8)+.06*Math.sin(y*13-z*4);p.setXYZ(i,x*r,y*r,z*r);}
  g.computeVertexNormals();return g;
}
