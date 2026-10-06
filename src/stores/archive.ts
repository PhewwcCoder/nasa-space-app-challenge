import { isVoyagerArtifact } from '../data/voyager';
import { isOpportunityArtifact } from '../data/opportunity';
import { isSpiritArtifact } from '../data/spirit';
import { create } from 'zustand';
import { isMarsArtifact } from '../data/mars';
import { clearControls } from '../game/input';
import type { ArtifactId } from '../data/archive';
export type Stage = 'entry' | 'signal' | 'approach' | 'surface' | 'identified' | 'explore' | 'complete' | 'travel' | 'mars' | 'spirit' | 'mars-travel' | 'opportunity' | 'opportunity-travel' | 'voyager' | 'voyager-travel';
export const builtChapters = ['prologue', 'apollo11', 'sojourner', 'spirit', 'opportunity', 'voyager'] as const;
export type Chapter = typeof builtChapters[number];
type State = {
  voyagerApproached:boolean; approachVoyager:()=>void; startVoyagerTravel:()=>void;
  opportunityApproached: boolean; approachOpportunity: ()=>void; startOpportunityTravel: ()=>void;
  spiritApproached: boolean; evidenceStep: number; setEvidenceStep: (n:number)=>void; approachSpirit: ()=>void; startSpiritTravel: ()=>void; lunarSignalSeen: boolean; chapter: Chapter; identified: ArtifactId[]; marsApproached: boolean; travelProgress: number;
  visitChapter: (id: Chapter) => void; startTravel: () => void; setTravelProgress: (n:number) => void; approachMars: () => void; identify: (id: ArtifactId) => void;
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
  voyagerApproached:false, approachVoyager:()=>set({voyagerApproached:true}), startVoyagerTravel:()=>{clearControls();set({stage:'voyager-travel',inspector:null,travelProgress:0,paused:false});},
  opportunityApproached:false, approachOpportunity:()=>set({opportunityApproached:true}), startOpportunityTravel:()=>{clearControls();set({stage:'opportunity-travel',inspector:null,travelProgress:0,paused:false});},
  spiritApproached:false, evidenceStep:0, approachSpirit:()=>set({spiritApproached:true}), setEvidenceStep:evidenceStep=>set({evidenceStep}), startSpiritTravel:()=>{clearControls();set({stage:'mars-travel',inspector:null,travelProgress:0,paused:false});},
  lunarSignalSeen:false, chapter:'prologue',  identified:[], marsApproached:false, travelProgress:0,
  identify:id=>set(s=>({identified:s.identified.includes(id)?s.identified:[...s.identified,id]})),
  approachMars:()=>set({marsApproached:true}),
  setTravelProgress:travelProgress=>set({travelProgress}),
  startTravel:()=>{clearControls();set({stage:'travel',inspector:null,travelProgress:0,paused:false});},
  visitChapter:chapter=>{if(!builtChapters.includes(chapter))return;clearControls();set({chapter,stage:chapter==='prologue'?'entry':chapter==='apollo11'?'explore':chapter==='spirit'?'spirit':chapter==='opportunity'?'opportunity':chapter==='voyager'?'voyager':'mars',inspector:null,selected:'',exploded:false,isolated:false,paused:false,walk:1,viewKey:get().viewKey+1});},
  scanProgress:1,setScanProgress:scanProgress=>set({scanProgress}),walk:0,cutaway:false,historical:true,setWalk:walk=>set({walk}),toggleCutaway:()=>set(s=>({cutaway:!s.cutaway})),toggleHistorical:()=>set(s=>({historical:!s.historical})),
  stage:'entry', progress:0, inspector:null, discovered:[], selected:'', inspectedParts:[],
  exploded:false, isolated:false, viewKey:0, muted:true, assist:false, flightReset:0, paused:false,
  setStage:stage=>set({stage,...(stage==='complete'?{lunarSignalSeen:true}:{}),...(stage==='explore'?{chapter:'apollo11' as Chapter}:stage==='mars'?{chapter:'sojourner' as Chapter}:stage==='spirit'?{chapter:'spirit' as Chapter}:stage==='opportunity'?{chapter:'opportunity' as Chapter}:stage==='voyager'?{chapter:'voyager' as Chapter}: {})}), setProgress:progress=>set({progress}),
  inspect:inspector=>{const previous=get().inspector;set({inspector,evidenceStep:0,scanProgress:inspector&&(isMarsArtifact(inspector)||isSpiritArtifact(inspector)||isOpportunityArtifact(inspector)||isVoyagerArtifact(inspector))&&!get().identified.includes(inspector)?0:1,exploded:false,isolated:false,selected:'',inspectedParts:[]});if(!inspector)requestAnimationFrame(()=>document.querySelector<HTMLElement>(`[data-artifact="${previous}"]`)?.focus());},
  discover:id=>set(s=>({discovered:s.discovered.includes(id)?s.discovered:[...s.discovered,id]})),
  select:selected=>set(s=>({selected:s.selected===selected?'':selected,isolated:false,inspectedParts:s.inspectedParts.includes(selected)?s.inspectedParts:[...s.inspectedParts,selected]})),
  toggleExploded:()=>set(s=>({exploded:!s.exploded})), toggleIsolated:()=>set(s=>({isolated:!s.isolated})),
  resetView:()=>set(s=>({viewKey:s.viewKey+1})), toggleMute:()=>set(s=>({muted:!s.muted})),
  toggleAssist:()=>set(s=>({assist:!s.assist})), retryFlight:()=>set(s=>({flightReset:s.flightReset+1,assist:false})),
  setPaused:paused=>set({paused}),
  restart:()=>set(s=>({voyagerApproached:false,opportunityApproached:false,spiritApproached:false,evidenceStep:0,lunarSignalSeen:false,chapter:'prologue',identified:[],marsApproached:false,travelProgress:0,selected:'',stage:'entry',walk:0,historical:true,cutaway:false,progress:0,inspector:null,discovered:[],inspectedParts:[],exploded:false,isolated:false,assist:false,paused:false,flightReset:s.flightReset+1}))
}));
