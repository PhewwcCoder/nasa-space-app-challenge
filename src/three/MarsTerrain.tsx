import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// An authored composite landscape; heights are not a landing-site survey.
const height = (x:number,z:number) => -.018 + THREE.MathUtils.smoothstep(Math.hypot(x,z),10,65) *
  (3*Math.sin(x*.027+1)*Math.cos(z*.022)+1.2*Math.sin(x*.11)*Math.sin(z*.07));
const noise = `
float hashSoil(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noiseSoil(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hashSoil(i),hashSoil(i+vec2(1,0)),f.x),mix(hashSoil(i+vec2(0,1)),hashSoil(i+vec2(1,1)),f.x),f.y);}
float soilRelief(vec2 p){return noiseSoil(p*2.)*.006+noiseSoil(p*13.)*.0015+noiseSoil(p*65.)*.0004;}
`;

export default function MarsTerrain(){
  const rocks=useRef<THREE.InstancedMesh>(null);
  const ground=useMemo(()=>{const g=new THREE.PlaneGeometry(520,520,220,220);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,height(p.getX(i),p.getZ(i)));g.computeVertexNormals();return g;},[]);
  const material=useMemo(()=>{
    const m=new THREE.MeshStandardMaterial({color:'#79695e',roughness:.97,envMapIntensity:.12});
    m.onBeforeCompile=s=>{
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vSoil;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSoil=position;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vSoil;\n'+noise);
      s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=vSoil.xz;
        float broad=noiseSoil(p*.21),grain=noiseSoil(p*36.);
        float strata=noiseSoil(vec2(p.x*.8,p.y*5.+noiseSoil(p*.7)*2.));
        diffuseColor.rgb*=.65+broad*.45+strata*.22;
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.16,1.12,1.04),smoothstep(.48,.78,noiseSoil(p*.65)));
        float detail=1.-smoothstep(.025,.09,length(fwidth(p)));
        diffuseColor.rgb*=1.+(grain-.5)*.28*detail;
        // Uneven wind-sorted sediment; no repeating geometric crack grid.
        diffuseColor.rgb*=1.-smoothstep(.73,.87,noiseSoil(p*5.))* .16*detail;`);
      s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
        float relief=soilRelief(vSoil.xz);
        vec3 sx=dFdx(-vViewPosition),sy=dFdy(-vViewPosition);
        vec3 r1=cross(sy,normal),r2=cross(normal,sx);
        float det=dot(sx,r1);
        normal=normalize(abs(det)*normal-sign(det)*(dFdx(relief)*r1+dFdy(relief)*r2));`);
    };
    return m;
  },[]);
  const rockMaterial=useMemo(()=>{const m=material.clone();m.color.set('#ffffff');m.onBeforeCompile=(s,r)=>{material.onBeforeCompile(s,r);s.vertexShader=s.vertexShader.replace('vSoil=position;','vSoil=position*3.;');};return m;},[material]);
  const stone=useMemo(()=>{const g=mergeVertices(new THREE.IcosahedronGeometry(1,2)),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=1+.12*Math.sin(x*8+y*5)*Math.cos(z*7);p.setXYZ(i,x*r,y*r,z*r);}g.computeVertexNormals();return g;},[]);
  const ridges=useMemo(()=>[0,1,2].map(layer=>{
    const g=new THREE.PlaneGeometry(440,1,180,18),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),v=p.getY(i)+.5;
      const crest=7+3*Math.sin(x*.021+layer)+2*Math.sin(x*.067+2*layer)+.6*Math.sin(x*.31);
      p.setXYZ(i,x,-3+v*crest,-78-layer*43-22*Math.pow(1-v,2)+Math.sin(x*.035)*10);
    }g.computeVertexNormals();return g;
  }),[]);
  useEffect(()=>{if(!rocks.current)return;const o=new THREE.Object3D();for(let i=0;i<2200;i++){
    const a=i*2.39996,r=.9+Math.sqrt(i/2200)*65,x=Math.cos(a)*r,z=Math.sin(a)*r;
    const size=.018+((Math.sin(i*72.1)+1)*.5)**8*.35;
    o.position.set(x,height(x,z)+size*.21,z);o.rotation.set(i*.61,i*1.3,i*.17);o.scale.set(size*1.6,size*.65,size);o.updateMatrix();rocks.current.setMatrixAt(i,o.matrix);
    rocks.current.setColorAt(i,new THREE.Color().setHSL(.055,.17+(i%3)*.04,.15+(i%7)*.027));
  }rocks.current.instanceMatrix.needsUpdate=true;},[]);
  useEffect(()=>()=>{ground.dispose();material.dispose();rockMaterial.dispose();stone.dispose();ridges.forEach(g=>g.dispose());},[ground,material,rockMaterial,stone,ridges]);
  return <>
    <mesh geometry={ground} material={material} receiveShadow/>
    <instancedMesh ref={rocks} args={[stone,rockMaterial,2200]} castShadow receiveShadow/>
    {ridges.map((g,i)=><mesh key={i} geometry={g}><meshStandardMaterial color={['#796353','#8b7360','#a18b72'][i]} roughness={1} envMapIntensity={.1} side={THREE.DoubleSide}/></mesh>)}
    <mesh><sphereGeometry args={[290,32,24]}/><shaderMaterial side={THREE.BackSide} depthWrite={false} vertexShader="varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader={`varying vec3 direction;void main(){float h=normalize(direction).y;vec3 c=mix(vec3(.69,.57,.43),vec3(.36,.27,.22),smoothstep(0.,.85,h));gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>\n#include <colorspace_fragment>
}` }/></mesh>
  </>;
}
