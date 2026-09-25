import { create } from 'zustand';
import type { ArtifactId } from '../data/archive';
export type Stage = 'entry'|'signal'|'approach'|'surface'|'identified'|'explore'|'complete';
type State = { stage:Stage; progress:number; inspector:ArtifactId|null; discovered:ArtifactId[]; selected:string; exploded:boolean; isolated:boolean; viewKey:number; muted:boolean; setStage:(stage:Stage)=>void; setProgress:(n:number)=>void; inspect:(id:ArtifactId|null)=>void; discover:(id:ArtifactId)=>void; select:(id:string)=>void; toggleExploded:()=>void; toggleIsolated:()=>void; resetView:()=>void; toggleMute:()=>void; restart:()=>void };
let inspectionScroll = 0;
export const useArchive = create<State>((set,get)=>({
 stage:'entry',progress:0,inspector:null,discovered:[],selected:'structure',exploded:false,isolated:false,viewKey:0,muted:true,
 setStage:stage=>set({stage}),setProgress:progress=>set({progress}),inspect:inspector=>{const previous=get().inspector;if(inspector)inspectionScroll=window.scrollY;set({inspector,exploded:false,isolated:false,selected:'structure'});if(!inspector)requestAnimationFrame(()=>{window.scrollTo({top:inspectionScroll,behavior:'instant'});document.querySelector<HTMLElement>(`[data-artifact="${previous}"]`)?.focus({preventScroll:true});});},
 discover:id=>set(s=>({discovered:s.discovered.includes(id)?s.discovered:[...s.discovered,id]})),select:selected=>set({selected}),
 toggleExploded:()=>set(s=>({exploded:!s.exploded})),toggleIsolated:()=>set(s=>({isolated:!s.isolated})),resetView:()=>set(s=>({viewKey:s.viewKey+1})),toggleMute:()=>set(s=>({muted:!s.muted})),
 restart:()=>set({stage:'entry',progress:0,inspector:null,discovered:[],exploded:false,isolated:false})
}));
