import { useArchive, type Chapter } from './stores/archive';
/** Gallery/model entry shares the destination's direct arrival. */
export function launchExhibit(chapter: Chapter) {
 if(chapter==='sojourner'||chapter==='spirit'||chapter==='opportunity')useArchive.getState().beginMarsLanding(chapter);
 else useArchive.getState().visitChapter(chapter);
}
