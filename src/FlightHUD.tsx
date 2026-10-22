import { sites } from './data/expedition';
import LandingMap from './LandingMap';
import { landingNavigation } from './game/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { initialFlight, type FlightState } from './game/flight';
import { pressControl, clearControls } from './game/input';
import { useArchive } from './stores/archive';
function TouchControls(){const hold=(key:string,label:string)=><button key={key} aria-label={label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pressControl(key,true);}} onPointerUp={()=>pressControl(key,false)} onPointerCancel={()=>pressControl(key,false)} onLostPointerCapture={()=>pressControl(key,false)}>{label}</button>;return <div className="touch-controls"><div className="d-pad">{hold('KeyW','Forward')}{hold('KeyA','Left')}{hold('KeyS','Back')}{hold('KeyD','Right')}</div>{hold('Space','Brake')}</div>;}
export default function FlightHUD({mars=false}:{mars?:boolean}){const[flight,setFlight]=useState<FlightState>(initialFlight());const{assist,toggleAssist,retryFlight,flightReset,paused,setPaused}=useArchive(useShallow(s=>({assist:s.assist,toggleAssist:s.toggleAssist,retryFlight:s.retryFlight,flightReset:s.flightReset,paused:s.paused,setPaused:s.setPaused})));
 useEffect(()=>{const update=(e:Event)=>setFlight((e as CustomEvent<FlightState>).detail);window.addEventListener('sol-3-flight',update);return()=>window.removeEventListener('sol-3-flight',update);},[]);useEffect(()=>setFlight(initialFlight()),[flightReset]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.code==='Escape'&&!(e.target as HTMLElement).closest('dialog')){clearControls();useArchive.getState().setPaused(!useArchive.getState().paused);}};window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);clearControls();};},[]);
 const navigation=landingNavigation(flight),offset=navigation.range,drift=navigation.speed,descent=navigation.descent;
 return <section className="flight-hud easy-flight" aria-label="Flight controls" data-altitude={flight.altitude.toFixed(1)} data-z={flight.z.toFixed(2)} data-height={navigation.y.toFixed(2)} data-ground-z={navigation.z.toFixed(2)} data-offset={offset.toFixed(1)} data-drift={drift.toFixed(2)}>
 <div className="flight-objective"><p className="eyebrow">{mars?`MARS APPROACH / ${sites[useArchive.getState().chapter as 'sojourner'|'spirit'|'opportunity'].name.toUpperCase()}`:'LUNAR APPROACH'}</p><h1>{assist?'You steer. I’ll help us land.':flight.altitude<12?'Hold Space for a soft landing.':'Fly toward the landing ring.'}</h1><p>{assist?'Release the keys to settle. Miso handles the descent.':'W / ↑ moves forward · Space slows descent · Hold Space to brake.'}</p></div>
 <div className="flight-displays">
  <section className="cockpit-screen telemetry-screen" aria-label="Flight measurements"><header><span>01 / FLIGHT</span><i>{paused?'PAUSED':assist?'STABILIZED':'MANUAL'}</i></header><div className="primary-measure"><span><strong>{Math.round(navigation.y).toString().padStart(3,'0')}</strong><small>m · ALTITUDE</small></span><svg viewBox="0 0 55 90" aria-label="Altitude gauge" role="img"><path d="M15 5v80M15 5h25M15 25h15M15 45h25M15 65h15M15 85h25"/><path className="altitude-pointer" d={`M2 ${85-flight.altitude*.8}h11`}/></svg></div><dl><div><dt>DESCENT / M/S</dt><dd>{descent.toFixed(1)} <small>m/s</small></dd></div><div><dt>GROUND RANGE / M</dt><dd>{offset.toFixed(1)}</dd></div><div><dt>THRUSTER RESERVE</dt><dd>{Math.round(flight.fuel)}<small>%</small></dd></div></dl></section>
  <LandingMap flight={flight}/>
 </div>
 {mars&&<div className="mars-landing-skip"><span>Fictional shuttle / simplified flight</span><button className="quiet-button" onClick={()=>{clearControls();useArchive.getState().finishMarsLanding();}}>Skip landing</button></div>}
 <div className="flight-help"><p><kbd>W A S D</kbd> / arrows · steer <kbd>SPACE</kbd> · slow down</p><div><button className="quiet-button" aria-pressed={assist} onClick={e=>{clearControls();toggleAssist();e.currentTarget.blur();}}>{assist?'Flight assist on':'Enable flight assist'}</button><button className="quiet-button" onClick={()=>{clearControls();setPaused(!paused);}}>{paused?'Resume flight':'Pause flight'}</button></div></div><TouchControls/>
 {paused&&<div className="flight-message" role="status"><p className="eyebrow">FLIGHT PAUSED</p><h2>Take your time.</h2><button className="action" onClick={()=>setPaused(false)}>Resume flight</button></div>}
 {flight.failed&&<div className="flight-message" role="alert"><p className="eyebrow">CRAFT RECOVERED</p><h2>{offset>6?'Outside the landing zone.':'Approach speed too high.'}</h2><p>Steer into the ring, then hold Space. Flight assist is available below.</p><button className="action" onClick={()=>{clearControls();retryFlight();useArchive.setState({assist:false,paused:false});}}>Retry landing</button></div>}
 {flight.landed&&<div className="landing-success" role="status">TOUCHDOWN / WELCOME TO {mars?'MARS':'THE MOON'}</div>}
 </section>;
}
