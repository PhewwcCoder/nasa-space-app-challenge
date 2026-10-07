import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';
import { useArchive } from './stores/archive';

export function MissionAudio(){
  const player=useRef<HTMLAudioElement>(null);
  const {muted,paused,stage}=useArchive(useShallow(s=>({muted:s.muted,paused:s.paused,stage:s.stage})));
  useEffect(()=>{const play=()=>{if(!useArchive.getState().muted){player.current!.currentTime=0;void player.current?.play().catch(()=>{});}};window.addEventListener('sol-3-touchdown',play);return()=>window.removeEventListener('sol-3-touchdown',play);},[]);
  useEffect(()=>{if(muted||paused||stage==='entry'||stage==='explore')player.current?.pause();},[muted,paused,stage]);
  return <audio ref={player} src="/audio/eagle-has-landed.mp3" preload="auto" aria-hidden="true"/>;
}
export function SoundClip({kind}:{kind:'landing'|'step'}){
  const ref=useRef<HTMLAudioElement>(null);const {muted,paused}=useArchive(useShallow(s=>({muted:s.muted,paused:s.paused})));
  useEffect(()=>{if(muted||paused)ref.current?.pause();},[muted,paused]);
  useEffect(()=>()=>{ref.current?.pause();},[]);
  return <div className="history-audio"><span>{kind==='step'?'HEAR THE FIRST STEP':'HEAR THE LANDING CALL'}</span><audio ref={ref} controls preload="metadata" src={kind==='step'?'/audio/one-small-step.mp3':'/audio/eagle-has-landed.mp3'} aria-label={kind==='step'?'Neil Armstrong first-step recording':'Eagle landing recording'} onPlay={()=>{useArchive.setState({muted:false});document.querySelectorAll('audio').forEach(a=>{if(a!==ref.current)a.pause();});}}/><small>Historical Apollo 11 recording · supplied audio</small><p>{kind==='step'?'Armstrong describes a small step for one person and a giant leap for humankind.':'Armstrong reports that Eagle has landed at Tranquility Base.'}</p></div>;
}
