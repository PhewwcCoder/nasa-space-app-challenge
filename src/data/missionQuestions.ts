export type QuizChapter = 'sojourner' | 'spirit' | 'opportunity' | 'voyager';
export type MissionQuestion = { question: string; options: string[]; answer: number; note: string; source: string };
const source = {
  sojourner: 'https://science.nasa.gov/mission/mars-pathfinder/',
  spirit: 'https://science.nasa.gov/mission/mer-spirit/',
  opportunity: 'https://science.nasa.gov/mission/mer-opportunity/',
  voyager: 'https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/',
};
type Entry = [string, string[], number, string];
const entries: Record<QuizChapter, Entry[]> = {
  sojourner: [
    ['How small could a Mars explorer be?', ['About a bus', 'About a microwave oven', 'About a stadium'], 1, 'Sojourner was about the size of a microwave oven.'],
    ['What cushioned Pathfinder’s final arrival?', ['Airbags', 'A runway', 'An ocean splashdown'], 0, 'Airbags cushioned Pathfinder as it bounced onto Mars.'],
    ['When did this tiny rover reach Mars?', ['1969', '2004', '1997'], 2, 'Pathfinder and Sojourner landed on July 4, 1997.'],
    ['Where did Pathfinder land?', ['Gusev Crater', 'Ares Vallis', 'The Moon'], 1, 'Pathfinder landed at Ares Vallis on Mars.'],
    ['What did Sojourner help demonstrate?', ['Robotic driving on Mars', 'Growing trees on Mars', 'Human flight on Mars'], 0, 'Sojourner demonstrated rover mobility and examined nearby rocks and soil.'],
  ],
  spirit: [
    ['What was this rover looking for in the rocks?', ['Clues to past water', 'Buried cities', 'Rocket fuel tanks'], 0, 'Spirit investigated rocks and soil for evidence of past water.'],
    ['What is a sol?', ['A rover wheel', 'A Martian day', 'A type of antenna'], 1, 'A sol is a Martian day. Spirit’s planned surface mission was 90 sols.'],
    ['Where did Spirit land?', ['Ares Vallis', 'Meridiani Planum', 'Gusev Crater'], 2, 'Spirit landed in Gusev Crater in January 2004.'],
    ['How long was Spirit originally meant to explore?', ['90 sols', 'One afternoon', 'Twenty years'], 0, 'The primary mission was planned for 90 sols; Spirit worked for more than six years.'],
    ['Which rover was Spirit’s twin?', ['Sojourner', 'Opportunity', 'Voyager 1'], 1, 'Spirit and Opportunity were the twin Mars Exploration Rovers.'],
  ],
  opportunity: [
    ['How far could a rover go if it kept exploring?', ['About 45 kilometers', 'One meter', 'Around the whole planet'], 0, 'Opportunity traveled 45.16 kilometers across Mars.'],
    ['What was Opportunity’s original mission plan?', ['5,111 sols', '90 sols', 'One sol'], 1, 'Its planned 90-sol mission grew into 5,111 sols of exploration.'],
    ['Where did Opportunity touch down?', ['Gusev Crater', 'Ares Vallis', 'Meridiani Planum'], 2, 'Opportunity landed at Meridiani Planum in January 2004.'],
    ['What did its rock discoveries help reveal?', ['Ancient water on Mars', 'Living forests', 'A buried ocean liner'], 0, 'Opportunity found geological evidence of ancient water. That is not evidence of life.'],
    ['Which event preceded the rover’s final silence?', ['A lunar eclipse', 'A major dust storm', 'A flight to Earth'], 1, 'A major Martian dust storm preceded the loss of contact in June 2018.'],
  ],
  voyager: [
    ['How is this greeting carried through space?', ['As a physical record', 'As a paper airplane', 'As a continuous music broadcast'], 0, 'The Golden Record is physical cargo aboard the spacecraft.'],
    ['How many languages greet a possible listener?', ['Five', '55', '500'], 1, 'The Golden Record includes spoken greetings in 55 languages.'],
    ['What is the record made from?', ['Solid gold', 'Wood', 'Gold-plated copper'], 2, 'The record is a gold-plated copper phonograph record.'],
    ['What could a distant listener discover on it?', ['Only engine noises', 'Sounds, pictures, music and greetings', 'Tomorrow’s weather'], 1, 'The record brings together images, natural sounds, music and greetings from Earth.'],
    ['Who was this message intended for?', ['Only the launch crew', 'A named Mars colony', 'Possible distant finders'], 2, 'The record was created as a message for possible finders in the distant future. No discovery by aliens is claimed.'],
  ],
};
export const missionQuestions = Object.fromEntries(Object.entries(entries).map(([chapter, rows]) => [
  chapter, rows.map(([question, options, answer, note]) => ({ question, options, answer, note, source: source[chapter as QuizChapter] })),
])) as Record<QuizChapter, MissionQuestion[]>;

const previous: Partial<Record<QuizChapter, number>> = {};
export function nextMissionQuestion(chapter: QuizChapter) {
  const pool = missionQuestions[chapter];
  let last = previous[chapter];
  try { const stored = sessionStorage.getItem(`miso-question-${chapter}`); if (stored !== null) last = Number(stored); } catch { /* Memory fallback when storage is unavailable. */ }
  const choices = pool.map((_, i) => i).filter(i => i !== last);
  const index = choices[Math.floor(Math.random() * choices.length)];
  return pool[index];
}

export function rememberMissionQuestion(chapter: QuizChapter, question: MissionQuestion) {
  const index = missionQuestions[chapter].indexOf(question);
  previous[chapter] = index;
  try { sessionStorage.setItem(`miso-question-${chapter}`, String(index)); } catch { /* Optional persistence. */ }
}
