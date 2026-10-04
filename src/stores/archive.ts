import { create } from 'zustand';
import type { ArtifactId } from '../data/archive';
export type Stage = 'entry' | 'signal' | 'approach' | 'surface' | 'identified' | 'explore' | 'complete';
type State = {
  scanProgress: number; setScanProgress: (n: number) => void; stage: Stage; progress: number; inspector: ArtifactId | null; discovered: ArtifactId[];
  selected: string; inspectedParts: string[]; exploded: boolean; isolated: boolean; viewKey: number;
  walk: number; cutaway: boolean; historical: boolean; setWalk: (n: number) => void; toggleCutaway: () => void; toggleHistorical: () => void;
  muted: boolean; assist: boolean; flightReset: number; paused: boolean;
  setStage: (stage: Stage) => void; setProgress: (n: number) => void;
  inspect: (id: ArtifactId | null) => void; discover: (id: ArtifactId) => void;
  select: (id: string) => void; toggleExploded: () => void; toggleIsolated: () => void;
  resetView: () => void; toggleMute: () => void; toggleAssist: () => void;
  retryFlight: () => void; setPaused: (n: boolean) => void; restart: () => void;
};
export const useArchive = create<State>((set, get) => ({
  scanProgress:1,setScanProgress:scanProgress=>set({scanProgress}),walk:0,cutaway:false,historical:true,setWalk:walk=>set({walk}),toggleCutaway:()=>set(s=>({cutaway:!s.cutaway})),toggleHistorical:()=>set(s=>({historical:!s.historical})),
  stage:'entry', progress:0, inspector:null, discovered:[], selected:'', inspectedParts:[],
  exploded:false, isolated:false, viewKey:0, muted:true, assist:false, flightReset:0, paused:false,
  setStage:stage=>set({stage}), setProgress:progress=>set({progress}),
  inspect:inspector=>{const previous=get().inspector;set({inspector,scanProgress:1,exploded:false,isolated:false,selected:'',inspectedParts:[]});if(!inspector)requestAnimationFrame(()=>document.querySelector<HTMLElement>(`[data-artifact="${previous}"]`)?.focus());},
  discover:id=>set(s=>({discovered:s.discovered.includes(id)?s.discovered:[...s.discovered,id]})),
  select:selected=>set(s=>({selected:s.selected===selected?'':selected,isolated:false,inspectedParts:s.inspectedParts.includes(selected)?s.inspectedParts:[...s.inspectedParts,selected]})),
  toggleExploded:()=>set(s=>({exploded:!s.exploded})), toggleIsolated:()=>set(s=>({isolated:!s.isolated})),
  resetView:()=>set(s=>({viewKey:s.viewKey+1})), toggleMute:()=>set(s=>({muted:!s.muted})),
  toggleAssist:()=>set(s=>({assist:!s.assist})), retryFlight:()=>set(s=>({flightReset:s.flightReset+1,assist:false})),
  setPaused:paused=>set({paused}),
  restart:()=>set(s=>({stage:'entry',walk:0,historical:true,cutaway:false,progress:0,inspector:null,discovered:[],inspectedParts:[],exploded:false,isolated:false,assist:false,paused:false,flightReset:s.flightReset+1}))
}));
