import { newSurfaceFlight, type SurfaceFlight } from '../game/surfaceFlight';
import type { MarsStop } from '../data/expedition';
import { create } from 'zustand';
import { clearControls } from '../game/input';
import type { ArtifactId } from '../data/archive';
export type Stage = 'mars-landing' | 'shuttle' | 'entry' | 'signal' | 'approach' | 'surface' | 'identified' | 'explore' | 'complete' | 'travel' | 'mars' | 'spirit' | 'mars-travel' | 'opportunity' | 'opportunity-travel' | 'voyager' | 'voyager-travel';
export const builtChapters = ['prologue', 'apollo11', 'sojourner', 'spirit', 'opportunity', 'voyager'] as const;
export type Chapter = typeof builtChapters[number];
type State = {
  exhibit: number; museumScroll: number; setExhibit: (n:number)=>void;
  shuttleRace: SurfaceFlight; retryShuttle: ()=>void; shuttleFrom: MarsStop; shuttleTo: MarsStop; shuttleOffset: number; shuttleCruise: boolean; startShuttle: (to:MarsStop)=>void;
  voyagerApproached:boolean; approachVoyager:()=>void; startVoyagerTravel:()=>void;
  opportunityApproached: boolean; approachOpportunity: ()=>void; startOpportunityTravel: ()=>void;
  spiritApproached: boolean; evidenceStep: number; setEvidenceStep: (n:number)=>void; approachSpirit: ()=>void; startSpiritTravel: ()=>void; lunarSignalSeen: boolean; chapter: Chapter; identified: ArtifactId[]; marsApproached: boolean; travelProgress: number;
  visitChapter: (id: Chapter) => void; startTravel: () => void; beginMarsLanding: () => void; setTravelProgress: (n:number) => void; approachMars: () => void; identify: (id: ArtifactId) => void;
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
  exhibit:0,museumScroll:0,setExhibit:exhibit=>set({exhibit}),
  shuttleRace:newSurfaceFlight(),retryShuttle:()=>{clearControls();set({shuttleRace:newSurfaceFlight(get().shuttleRace.checkpoint),paused:false});},shuttleFrom:'sojourner',shuttleTo:'spirit',shuttleOffset:0,shuttleCruise:false,
  startShuttle:to=>{const from=get().chapter;if(!['sojourner','spirit','opportunity'].includes(from)||from===to)return;clearControls();set({shuttleRace:newSurfaceFlight(),shuttleFrom:from as MarsStop,shuttleTo:to,shuttleOffset:0,shuttleCruise:false,travelProgress:0,stage:'shuttle',inspector:null,paused:false});},
  voyagerApproached:false, approachVoyager:()=>set({voyagerApproached:true}), startVoyagerTravel:()=>{clearControls();set({stage:'voyager-travel',inspector:null,travelProgress:0,paused:false});},
  opportunityApproached:false, approachOpportunity:()=>set({opportunityApproached:true}), startOpportunityTravel:()=>{get().visitChapter('spirit');get().startShuttle('opportunity');},
  spiritApproached:false, evidenceStep:0, approachSpirit:()=>set({spiritApproached:true}), setEvidenceStep:evidenceStep=>set({evidenceStep}), startSpiritTravel:()=>{get().visitChapter('sojourner');get().startShuttle('spirit');},
  lunarSignalSeen:false, chapter:'prologue',  identified:[], marsApproached:false, travelProgress:0,
  identify:id=>set(s=>({identified:s.identified.includes(id)?s.identified:[...s.identified,id]})),
  approachMars:()=>set({marsApproached:true}),
  setTravelProgress:travelProgress=>set({travelProgress}),
  startTravel:()=>{clearControls();set({chapter:'sojourner',stage:'travel',inspector:null,selected:'',exploded:false,isolated:false,travelProgress:0,paused:false});},
  beginMarsLanding:()=>{clearControls();set(s=>({chapter:'sojourner',stage:'mars-landing',travelProgress:1,inspector:null,marsApproached:false,assist:false,paused:false,flightReset:s.flightReset+1}));},
  visitChapter:chapter=>{if(!builtChapters.includes(chapter))return;clearControls();set({chapter,stage:chapter==='prologue'?'entry':chapter==='apollo11'?'explore':chapter==='spirit'?'spirit':chapter==='opportunity'?'opportunity':chapter==='voyager'?'voyager':'mars',inspector:null,selected:'',exploded:false,isolated:false,paused:false,walk:1,viewKey:get().viewKey+1});},
  scanProgress:1,setScanProgress:scanProgress=>set({scanProgress}),walk:0,cutaway:false,historical:true,setWalk:walk=>set({walk}),toggleCutaway:()=>set(s=>({cutaway:!s.cutaway})),toggleHistorical:()=>set(s=>({historical:!s.historical})),
  stage:'entry', progress:0, inspector:null, discovered:[], selected:'', inspectedParts:[],
  exploded:false, isolated:false, viewKey:0, muted:true, assist:false, flightReset:0, paused:false,
  setStage:stage=>set({stage,...(stage==='complete'?{lunarSignalSeen:true}:{}),...(stage==='explore'?{chapter:'apollo11' as Chapter}:stage==='mars'?{chapter:'sojourner' as Chapter}:stage==='spirit'?{chapter:'spirit' as Chapter}:stage==='opportunity'?{chapter:'opportunity' as Chapter}:stage==='voyager'?{chapter:'voyager' as Chapter}: {})}), setProgress:progress=>set({progress}),
  inspect:inspector=>{const previous=get().inspector;set({inspector,evidenceStep:0,scanProgress:1,identified:inspector&&!get().identified.includes(inspector)?[...get().identified,inspector]:get().identified,exploded:false,isolated:false,selected:'',inspectedParts:[]});if(!inspector)requestAnimationFrame(()=>document.querySelector<HTMLElement>(`[data-artifact="${previous}"]`)?.focus());},
  discover:id=>set(s=>({discovered:s.discovered.includes(id)?s.discovered:[...s.discovered,id]})),
  select:selected=>set(s=>({selected:s.selected===selected?'':selected,isolated:false,inspectedParts:s.inspectedParts.includes(selected)?s.inspectedParts:[...s.inspectedParts,selected]})),
  toggleExploded:()=>set(s=>({exploded:!s.exploded})), toggleIsolated:()=>set(s=>({isolated:!s.isolated})),
  resetView:()=>set(s=>({viewKey:s.viewKey+1})), toggleMute:()=>set(s=>({muted:!s.muted})),
  toggleAssist:()=>set(s=>({assist:!s.assist})), retryFlight:()=>set(s=>({flightReset:s.flightReset+1,assist:false})),
  setPaused:paused=>set({paused}),
  restart:()=>{clearControls();set(s=>({exhibit:0,museumScroll:0,shuttleOffset:0,shuttleCruise:false,voyagerApproached:false,opportunityApproached:false,spiritApproached:false,evidenceStep:0,lunarSignalSeen:false,chapter:'prologue',identified:[],marsApproached:false,travelProgress:0,selected:'',stage:'entry',walk:0,historical:true,cutaway:false,progress:0,inspector:null,discovered:[],inspectedParts:[],exploded:false,isolated:false,assist:false,paused:false,flightReset:s.flightReset+1}));}
}));
