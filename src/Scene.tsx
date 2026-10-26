import {Suspense,useRef,useState} from 'react';
import {Canvas,useFrame,ThreeEvent} from '@react-three/fiber';
import {ContactShadows,OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
import {building,districts} from './data';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
type Vec=[number,number,number];
function Block({p,s,c}:{p:Vec,s:Vec,c:string}){return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={.82}/></mesh>}
function ContextHouse({x,z,w,d,h}:{x:number,z:number,w:number,d:number,h:number}){return <group position={[x,0,z]}><Block p={[0,h/2,0]} s={[w,h,d]} c="#e7e2d5"/><Block p={[0,h+.04,0]} s={[w+.12,.12,d+.12]} c="#b5b6a9"/>{[0,1].map(f=>[0,1,2].map(i=><Block key={`${f}-${i}`} p={[-w*.3+i*w*.3,.4+f*.65,d/2+.02]} s={[.22,.32,.03]} c="#81938e"/>))}</group>}
function Tower({active,onSelect,onFloor,onHover}:{active:boolean,onSelect:()=>void,onFloor:(floor:number)=>void,onHover:(floor:number|null)=>void}){
 const [hover,setHover]=useState<number|null>(null); const height=building.floors.length*.67+.6;
 function over(e:ThreeEvent<PointerEvent>,floor:number){if(!active)return;e.stopPropagation();setHover(floor);onHover(floor);document.body.style.cursor='pointer'}
 function out(){setHover(null);onHover(null);document.body.style.cursor='auto'}
 return <group position={[.3,0,0]} onClick={active?undefined:e=>{e.stopPropagation();onSelect()}}>
 <Block p={[0,.25,0]} s={[3.8,.5,2.8]} c="#6b756f"/>
 {building.floors.map(f=><group key={f} position={[0,.6+(f-1)*.67,0]} onPointerOver={e=>over(e,f)} onPointerOut={out} onClick={e=>{e.stopPropagation();active?onFloor(f):onSelect()}}>
 <Block p={[0,.32,0]} s={[3.7,.64,2.5]} c={hover===f?'#73ae80':'#f0eee7'}/>
 <Block p={[0,.015,0]} s={[3.83,.055,2.64]} c={hover===f?'#4c8d60':'#deded6'}/>
 {[-1.25,-.4,.45,1.3].map((x,i)=><group key={i}>
 <Block p={[x,.32,1.27]} s={[.5,.43,.035]} c={hover===f?'#427755':'#6b8287'}/>
 <Block p={[x,.32,-1.27]} s={[.5,.42,.035]} c={hover===f?'#427755':'#849994'}/>
 {i!==1&&<><Block p={[x,.045,1.49]} s={[.73,.07,.57]} c={hover===f?'#6caa79':'#e9e8e0'}/><Block p={[x,.19,1.76]} s={[.72,.25,.045]} c={hover===f?'#68a678':'#b6c4c0'}/><Block p={[x-.35,.19,1.49]} s={[.035,.25,.55]} c="#e8e6dd"/><Block p={[x+.35,.19,1.49]} s={[.035,.25,.55]} c="#e8e6dd"/></>}
 </group>)}
 <Block p={[-1.86,.32,.65]} s={[.04,.43,.4]} c="#7f9699"/>
 <Block p={[1.86,.32,.6]} s={[.04,.43,.4]} c="#70888b"/>
 <Block p={[-.79,.32,1.295]} s={[.13,.64,.08]} c={hover===f?'#4e915f':'#d79a53'}/>
 {f>2&&f<9&&<Block p={[1.88,.32,-.6]} s={[.07,.64,.76]} c={hover===f?'#4e915f':'#dc9b53'}/>}
 {hover===f&&<mesh position={[0,.32,.18]}><boxGeometry args={[3.97,.65,3.3]}/><meshStandardMaterial color="#60b477" transparent opacity={.36} depthWrite={false}/></mesh>}
 </group>)}
 <Block p={[0,height,0]} s={[3.9,.18,2.8]} c="#d8d9ce"/>
 <Block p={[-.1,height+.28,-.3]} s={[1.1,.45,1.2]} c="#ecebe3"/>
 <Block p={[.7,height+.25,-.6]} s={[.23,.5,.23]} c="#969e94"/>
 <Block p={[0,.5,1.75]} s={[2.3,.1,1.15]} c="#d99b52"/>
 <Block p={[0,.24,1.28]} s={[.65,.45,.05]} c="#435e60"/>
 <Block p={[0,.04,2.2]} s={[2.9,.09,1.7]} c="#d2c9b7"/>
 </group>
}
function Tree({x,z}:{x:number,z:number}){return <group position={[x,0,z]}><Block p={[0,.35,0]} s={[.1,.7,.1]} c="#8b7b60"/><mesh position={[0,1,0]} castShadow><icosahedronGeometry args={[.57,1]}/><meshStandardMaterial color="#82947a" roughness={1}/></mesh></group>}
function District({offset,active,onSelect,onFloor,onHover}:{offset:number,active:boolean,onSelect:()=>void,onFloor:(f:number)=>void,onHover:(f:number|null)=>void}){return <group position={[offset,0,0]} onClick={e=>{e.stopPropagation();if(!active)onSelect()}}>
 <Block p={[0,-.24,0]} s={[12,.4,12]} c={active?'#c9d2b8':'#d2d8c2'}/><Block p={[0,-.01,3.7]} s={[12,.04,1.3]} c="#b8b8ac"/><Block p={[-3.8,-.005,0]} s={[1.2,.04,12]} c="#b8b8ac"/><Block p={[0,.005,2.7]} s={[12,.04,.35]} c="#e8e3d6"/><Block p={[-2.95,.005,0]} s={[.35,.04,12]} c="#e8e3d6"/>
 <Tower active={active} onSelect={onSelect} onFloor={onFloor} onHover={onHover}/>
 {[[0,-4,2.4,1.5,1.8],[3.9,-3.9,1.6,2,1.4],[-5,-3,1,2,1.2],[-5,1,1,2,1.6],[4.4,.3,1.2,2,1.8],[1.4,5,2,1.1,1],[-1.6,5,1.6,1.1,1.2]].map(([x,z,w,d,h],i)=><ContextHouse key={i} x={x} z={z} w={w} d={d} h={h}/>)}
 {[[-2,-4.5],[-1.5,-2.5],[2.5,-2.5],[4.5,2],[2.7,1.7],[-1.8,1.5],[-5,5],[4.7,5],[-5,-5]].map(([x,z],i)=><Tree key={i} x={x} z={z}/>)}
 {[0,1,2].map(i=><Block key={i} p={[i*1.1-1,.13,3.7]} s={[.6,.25,.32]} c={['#f0ece2','#7f8e88','#b9aa91'][i]}/>)}
 </group>}
function Camera({district}:{district?:string}){const controls=useRef<any>(null);useFrame(({camera,size},delta)=>{const t=reduced?1:1-Math.exp(-4*delta);const ortho=camera as THREE.OrthographicCamera;const zoom=Math.min(size.width/(district?10.7:32),size.height/(district?12.3:22));ortho.zoom=THREE.MathUtils.lerp(ortho.zoom,zoom,t);ortho.updateProjectionMatrix();const x=district?(district==='a'?-7.2:7.8):0;const target=new THREE.Vector3(x,district?4.2:2,0);const pos=new THREE.Vector3(x+(district?12:21),district?10:24,district?18:29);camera.position.lerp(pos,t);if(controls.current){controls.current.target.lerp(target,t);controls.current.update()}});return <OrbitControls ref={controls} enableRotate={false} enableZoom={false} enablePan={false}/>}
export function Model({district,onSelect,onFloor,onHover}:{district?:string,onSelect:(id:string)=>void,onFloor:(floor:number)=>void,onHover:(floor:number|null)=>void}){return <Canvas shadows orthographic camera={{position:[21,24,29],zoom:20,near:.1,far:150}} dpr={[1,1.8]} onCreated={({gl})=>gl.setClearColor('#e9e9df')}><ambientLight intensity={1.7}/><directionalLight castShadow position={[4,18,8]} intensity={2.5} shadow-mapSize={[2048,2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={20} shadow-camera-bottom={-20}/><Suspense fallback={null}>{districts.map((d,i)=><District key={d.id} offset={i===0?-7.5:7.5} active={district===d.id} onSelect={()=>onSelect(d.id)} onFloor={onFloor} onHover={onHover}/>)}<ContactShadows position={[0,-.5,0]} opacity={.3} scale={55} blur={2} far={15}/></Suspense><Camera district={district}/></Canvas>}
