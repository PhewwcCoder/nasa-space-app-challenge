import { SpiritGuideBody } from './SpiritChapter';
import { MarsGuideBody } from './MarsChapter';
import { useArchive } from './stores/archive';
import MissionOverview from './MissionOverview';
import { useEffect, useRef, useState } from 'react';

const photoSource = 'https://www.nasa.gov/history/astronaut-still-photography-during-apollo/';
const moduleSource = 'https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/';
export const photographs = {
 spiritAbrasion: {image:'spirit-abrasion',alt:'Spirit rock abrasion tool above the ground patch on Adirondack',caption:'NASA / JPL / Cornell - Adirondack after grinding, February 2004',source:'https://science.nasa.gov/photojournal/first-grinding-of-a-rock-on-mars/'},
 spiritRover: {image:'spirit-rover',alt:'Spirit self-portrait mosaic, sols 329 and 330',caption:'NASA / JPL / Cornell - Spirit, December 7-8, 2004 - self-portrait mosaic',source:'https://science.nasa.gov/photojournal/spirit-self-portrait-sols-329-330/'},
 spiritSilica: {image:'spirit-silica',alt:'Bright soil exposed by the dragging wheel of Spirit',caption:'NASA / JPL / Cornell - Gertrude Weise, April 6, 2007 - approximately true color',source:'https://science.nasa.gov/photojournal/silica-rich-soil-in-gusev-crater/'},
 spiritHardware: {image:'spirit-hardware',alt:'Orbital image of the parachute and backshell from Spirit',caption:'NASA / JPL / MSSS - orbital image of Spirit landing hardware, 2004',source:'https://science.nasa.gov/photojournal/spirits-hardware-up-close-on-mars/'},
 pathfinderAirbags: {image:'pathfinder-airbags',alt:'Sojourner beside a rolled ramp and partially deflated airbags',caption:'NASA / JPL - partially deflated airbags blocking the ramp, July 1997',source:'https://science.nasa.gov/resource/airbags-and-sojourner-rover/'},
 pathfinderRamp: {image:'pathfinder-ramp',alt:'Pathfinder rear ramp successfully unfurled at the end of Sol 2',caption:'NASA / JPL - rear deployment ramp, end of Sol 2',source:'https://science.nasa.gov/resource/pathfinder-rear-ramp/'},
 pathfinderBackshell: {image:'pathfinder-backshell',alt:'Pathfinder image locating its distant backshell',caption:'NASA / JPL / University of Arizona - Pathfinder backshell identification, 1997',source:'https://science.nasa.gov/resource/backshell-located/'},
 sojourner: { image:'sojourner-sol2',alt:'Sojourner on Mars on Sol 2',caption:'NASA / JPL - Sojourner, Sol 2 mosaic',source:'https://www.nasa.gov/image-article/nasas-first-rover-red-planet/' },
  science: { image: 'science-deployment', alt: 'Buzz Aldrin carrying experiment packages across the lunar surface', caption: 'Deploying Apollo 11 science equipment · NASA', source: 'https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/' },
  eagle: { image: 'eagle-orbit', alt: 'Eagle in lunar orbit, with its four legs extended', caption: 'Eagle before landing · Apollo 11 · NASA', source: moduleSource },
  gear: { image: 'aldrin-eagle', alt: 'Buzz Aldrin beside a landing leg of Eagle on the Moon', caption: 'Buzz Aldrin beside Eagle · Apollo 11 · NASA', source: photoSource },
  houbolt: { image: 'houbolt', alt: 'John Houbolt explaining a lunar orbit rendezvous on a chalkboard', caption: 'John Houbolt explains the plan · NASA', source: moduleSource },
  camera: { image: 'camera-training', alt: 'Armstrong and Aldrin practising with a camera before Apollo 11', caption: 'Camera practice on Earth · Apollo 11 · NASA', source: photoSource },
  lovell: { image: 'lovell-training', alt: 'Jim Lovell collecting a practice sample with a camera on his chest', caption: 'Jim Lovell training for Apollo 13, 1969 · NASA', source: photoSource },
};
export function PhotoReveal({ photo }: { photo: keyof typeof photographs }) {
  const [expanded, setExpanded] = useState(false);
  const p = photographs[photo];
  return <figure className={`photo-reveal ${expanded ? 'expanded' : ''}`}>
    <button className="photo-window" aria-label={`${expanded ? 'Fold' : 'Expand'} photo: ${p.alt}`} aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
      <img src={`/learning/${p.image}.jpg`} alt={p.alt} loading="lazy" />
      <span>{expanded ? '− Fold photograph' : '+ Hover or tap to unfold'}</span>
    </button>
    <figcaption>{p.caption} <a href={p.source} target="_blank" rel="noreferrer">Source ↗</a></figcaption>
  </figure>;
}

const programs = [
  { title: '01 / Slow the lander', file: 'THE_LUNAR_LANDING.agc', from: 34, to: 49, focus: [35, 40, 43, 46, 47], label: 'P63 · Braking phase', explanation: 'This starts a part of the landing program. It checks the navigation system and sets up values for the engine burn.', hints: ['P63 names the braking phase of landing.', 'TC calls another routine — a small job inside the program.', 'CAF loads a value. TS saves it in a named memory location.'] },
  { title: '02 / Pick the next job', file: 'EXECUTIVE.agc', from: 34, to: 47, focus: [34, 37, 39, 44], label: 'EXECUTIVE · Job requests', explanation: 'The computer had many jobs. The Executive managed requests and their priorities, so the next task could get its turn.', hints: ['NOVAC is an entry point for this kind of job request.', 'NEWPRIO stores information about the new job’s priority.', 'NEWLOC stores where the requested job begins.'] },
  { title: '03 / Talk to the crew', file: 'DISPLAY_INTERFACE_ROUTINES.agc', from: 31, to: 40, focus: [33, 34, 36, 37], label: 'DISPLAY · Messages for people', explanation: 'These original comments explain different kinds of display messages. Critical warnings can take priority over normal mission displays.', hints: ['Lines beginning with # are notes for people, not commands.', 'Priority displays can show urgent information.', 'Normal displays help the astronauts follow the mission.'] },
];

function explainLine(text: string) {
  if (text.trim().startsWith('#')) return 'A programmer’s note: ' + text.replace(/^#\s*/, '').trim();
  if (text.includes('NEWPRIO')) return 'Save the new job’s priority information. Priority helps the computer decide which work should run.';
  if (text.includes('NEWLOC')) return 'Save the address of the new job: the place in memory where its instructions begin.';
  if (/\bTC\b/.test(text)) return 'Transfer control to another routine. A routine is a reusable set of instructions for a small task.';
  if (/\bCAF\b/.test(text)) return 'Clear the accumulator, then load a value from fixed memory. The accumulator is a small working space for calculations.';
  if (/\bTS\b/.test(text)) return 'Store the working value in the named memory location, ready for another part of the program to use.';
  if (/\bINHINT\b/.test(text)) return 'Temporarily prevent interrupts while the computer updates information that must stay together.';
  return 'This line is part of the setup for this routine. Follow the highlighted lines and the notes above to understand its main job.';
}
export function CodeExplorer() {
  const [active, setActive] = useState(0);
  const [source, setSource] = useState('');
  const [failed, setFailed] = useState(false);
  const [line, setLine] = useState<number | null>(null);
  const program = programs[active];
  useEffect(() => {
    const controller = new AbortController();
    setSource(''); setFailed(false); setLine(null);
    fetch(`/learning/${program.file}`, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Missing source'); return r.text(); }).then(setSource).catch(e => { if (e.name !== 'AbortError') setFailed(true); });
    return () => controller.abort();
  }, [program]);
  return <section className="code-explorer" aria-labelledby="code-title">
    <p className="eyebrow">03 / THE SOFTWARE THAT FLEW</p><h3 id="code-title">A tiny computer. A very big job.</h3>
    <p>Explore real Apollo 11 code from <strong>Luminary 099</strong>, Eagle’s guidance program. Columbia used a different program, <strong>Comanche 055</strong>. These are historical source excerpts, with our short explanations.</p>
    <nav className="code-choices" aria-label="Apollo code programs">{programs.map((p, i) => <button key={p.file} aria-pressed={active === i} onClick={() => setActive(i)}>{p.title}</button>)}</nav>
    <div className="code-workbench"><div className="code-sheet"><header>{program.file}</header><div className="code-lines" tabIndex={0} aria-label="Original Apollo source excerpt">
      {!source && <p role="status">{failed ? 'The local excerpt could not load. Use the original source link below.' : 'Opening the flight code…'}</p>}
      {source.split('\n').slice(program.from - 1, program.to).map((text, i) => { const number = program.from + i; return <button key={number} aria-pressed={line === number} className={`${program.focus.includes(number) ? 'code-focus' : ''} ${line === number ? 'code-selected' : ''}`} onClick={() => setLine(line === number ? null : number)}><span>{number}</span><code>{text || ' '}</code></button>; })}
    </div></div><aside className="code-explanation" aria-live="polite"><span className="eyebrow">{program.label}</span><h4>{program.explanation}</h4><ul>{program.hints.map(h => <li key={h}>{h}</li>)}</ul><p className="code-tip">{line ? `Line ${line}: ${explainLine(source.split('\n')[line - 1] || '')}` : 'The soft highlights mark useful lines. Tap any line to follow it.'}</p><a href={`https://github.com/chrislgarry/Apollo-11/blob/911e5c0283c629c50cb97666f34065e8c07d71a5/Luminary099/${program.file}#L${program.from}-L${program.to}`} target="_blank" rel="noreferrer">Read this file on GitHub ↗</a></aside></div>
    <small>Public-domain Apollo source · transcribed by the Virtual AGC project from MIT Museum scans · <a href="https://github.com/chrislgarry/Apollo-11" target="_blank" rel="noreferrer">Repository & attribution ↗</a>. This explorer does not run the spacecraft software.</small>
  </section>;
}

export default function Learning({ close,codeOnly=false }: { close: () => void; codeOnly?:boolean }) {
 const chapter=useArchive(s=>s.chapter),mars=chapter==='sojourner',spirit=chapter==='spirit';
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close(); }, []);
  return <dialog className="learning" ref={dialog} aria-labelledby={codeOnly?'code-page-title':'learning-title'} onCancel={e => { e.preventDefault(); e.stopPropagation(); close(); }}>
    <header className="learning-bar"><span>MISO’S FIELD GUIDE / {spirit?'SPIRIT':mars?'MARS':'APOLLO'}</span><button onClick={close} autoFocus>Return to exploration ×</button></header>
    {spirit?<SpiritGuideBody/>:mars?<MarsGuideBody/>:codeOnly?<div className="learning-body code-page"><p className="eyebrow">THE INVISIBLE PART OF THE MISSION</p><h2 id="code-page-title">Discover the Apollo 11 code.</h2><div className="repository-story"><a className="repository-image" href="https://vscode.dev/github/chrislgarry/Apollo-11" target="_blank" rel="noreferrer"><img src="/learning/apollo-repository.png" alt="The Apollo-11 GitHub repository, showing its original guidance computer source folders"/><span>Open the repository in VS Code for the Web ↗</span></a><article><h3>Instructions that helped reach the Moon.</h3><p>A spacecraft needs more than engines. Its computer needs instructions: what to measure, what to calculate, and what to do next.</p><p>This archive contains the Apollo 11 guidance software. Luminary 099 ran in Eagle. Comanche 055 ran in Columbia, the command module.</p><p>People wrote these programs as many small routines. Some guided flight. Others handled jobs or showed information to the crew.</p><p>The files use an assembly language made for the Apollo Guidance Computer. You will see short commands, names for memory locations, and notes starting with #.</p><p>Virtual AGC contributors transcribed this code from scanned listings held by the MIT Museum. You can read the historical source yourself.</p><p>Start with one of the three jobs below. Pick a highlighted line and follow its explanation.</p><a href="https://github.com/chrislgarry/Apollo-11" target="_blank" rel="noreferrer">View the original GitHub repository ↗</a></article></div><CodeExplorer/></div>:<div className="learning-body"><p className="eyebrow">REAL PHOTOS · REAL IDEAS · REAL CODE</p><h2 id="learning-title">Apollo 11: the journey, the people, the science.</h2><p className="learning-intro">Follow the mission from launch to splashdown. Meet the crew, explore their tools, and read the code that helped them fly.</p>
    <nav className="learning-index" aria-label="Learning page sections"><a href="#learn-mission">The mission</a><a href="#learn-timeline">The timeline</a><a href="#learn-lander">The lander</a><a href="#learn-camera">The pictures</a><a href="#code-title">The code</a></nav>
    <MissionOverview/><section className="learning-story" id="learn-lander"><div><p className="eyebrow">01 / TRAVEL LIGHT</p><h3>Two pieces. One clever plan.</h3><p>Eagle took two astronauts down while Columbia stayed in orbit. After the moonwalk, Eagle’s upper half lifted off. Its lower half stayed on the Moon.</p><p>The landing engine could change its push. That helped the crew slow down and choose where to land.</p><details><summary>Why use a smaller lander?</summary><p>John Houbolt supported meeting again in lunar orbit. A smaller vehicle needed to land, saving weight.</p><PhotoReveal photo="houbolt" /></details><a href={moduleSource} target="_blank" rel="noreferrer">Explore NASA’s lunar module story ↗</a></div><PhotoReveal photo="eagle" /></section>
    <section className="learning-story" id="learn-camera"><div><p className="eyebrow">02 / BRING THE MOON HOME</p><h3>A camera you aim with your body.</h3><p>Astronauts practised with cameras attached to their chests. To aim, they turned their bodies. Large controls helped gloved hands.</p><p>Those little crosses in lunar photos? A glass plate inside the camera added them, helping scientists measure things in the pictures.</p><details><summary>What came back to Earth?</summary><p>The exposed film came home. The surface camera and lens stayed behind.</p><PhotoReveal photo="lovell" /><p>This training picture shows Jim Lovell preparing for Apollo 13, a later mission.</p></details><a href={photoSource} target="_blank" rel="noreferrer">Explore NASA’s photography story ↗</a></div><PhotoReveal photo="camera" /></section>
    <CodeExplorer />
    <footer className="learning-credit">NASA photography is historical evidence. Miso, your spacecraft and the occasional sky glows and streaks are fictional storytelling. The lunar scene and separated hardware are reconstructions, not an exact site survey.</footer></div>}
  </dialog>;
}
