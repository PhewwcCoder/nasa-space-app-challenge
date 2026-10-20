import { useEffect, useRef, useState } from 'react';
import { nextMissionQuestion, rememberMissionQuestion, type QuizChapter } from './data/missionQuestions';
import { useArchive } from './stores/archive';

export default function MissionQuestion({ chapter }: { chapter: QuizChapter }) {
  const [question] = useState(() => nextMissionQuestion(chapter));
  const [answer, setAnswer] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const inspector = useArchive(s => s.inspector);
  const skip = useRef<HTMLButtonElement>(null);
  const close = () => {
    setDismissed(true);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.mars-approach .action, .discovery-dock button')?.focus());
  };
  useEffect(() => { skip.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { rememberMissionQuestion(chapter, question); }, [chapter, question]);
  useEffect(() => { if (inspector) setDismissed(true); }, [inspector]);
  if (dismissed || inspector) return null;
  return <section className="cat-question mission-question" aria-label="Miso mission question" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
    <img src="/textures/alien-cat.png" alt="Miso, a fictional alien copilot"/>
    <div><p className="eyebrow">MISO / YOUR CURIOUS COPILOT</p><h1>A quick wonder.</h1>
      <p data-testid="miso-question">{question.question}</p>
      <div className="quiz-options">{question.options.map((option, i) => <button key={option} aria-pressed={answer === i} className={answer === null ? '' : i === question.answer ? 'answer-correct' : answer === i ? 'answer-wrong' : ''} onClick={() => setAnswer(i)}>{option}{answer !== null && i === question.answer && <small>Correct answer</small>}{answer === i && i !== question.answer && <small>Try this idea instead</small>}</button>)}</div>
      {answer !== null && <p role="status">{answer === question.answer ? 'You got it! ' : 'Not quite — let’s look closer. '}{question.note} <a href={question.source} target="_blank" rel="noreferrer">NASA source ↗</a></p>}
      <button ref={skip} className="action" onClick={close}>{answer === null ? 'Explore without answering' : 'Let’s explore'} <span aria-hidden="true">→</span></button>
    </div>
  </section>;
}
