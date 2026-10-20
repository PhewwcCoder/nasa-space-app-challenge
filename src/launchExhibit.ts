import { useArchive, type Chapter } from './stores/archive';
/** Both gallery entry points share the same mission start. */
export function launchExhibit(chapter: Chapter) {
  if(chapter==='sojourner'){useArchive.getState().startTravel();return;}
  if(chapter==='spirit'){useArchive.getState().startSpiritTravel();return;}
  if(chapter==='opportunity'){useArchive.getState().startOpportunityTravel();return;}
  useArchive.getState().visitChapter(chapter);
  if (chapter === 'apollo11') {
    useArchive.setState(s => ({ stage: 'approach', walk: 0, assist: false, flightReset: s.flightReset + 1 }));
  }
}
