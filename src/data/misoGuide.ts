import type { Chapter } from '../stores/archive';

export const chapterSuggestions: Partial<Record<Chapter, string>> = {
  sojourner: 'Start with the little wheeled object. Open it, separate its hardware, and compare what each part does. Then investigate the nearby landing clues.',
  spirit: 'Look closely at the wheeled object, then follow the disturbed pale soil. What could a mark in the ground help us investigate?',
  opportunity: 'Try comparing the torn metal and dark stone, or investigate the wheel furrows. Look at the evidence before deciding what happened.',
  voyager: 'Approach the distant traveler, then open the dish-shaped object. Compare its hardware before investigating the golden circle. What would you want to ask its makers?',
};

// Authored navigation help, not a chatbot or a source of new mission claims.
export const misoFaqs = [
  { question: 'What should I do next?', answer: '' },
  { question: 'How do I explore the museum?', answer: 'Scroll inside the mission story panel to browse all five exhibits, or use the numbered mission tabs. Click a model or its Explore button to enter. Reading never launches a mission automatically.' },
  { question: 'Where should I begin?', answer: 'My pick is Apollo 11! Try the Moon landing, follow the footprints, and investigate the hardware. You can choose any of the five missions whenever you like.' },
  { question: 'How do I fly or skip a journey?', answer: 'Use W/A/S/D or the arrow keys to steer during landing; hold Space to brake. Flight assist and pause are available. Mars landings have Skip landing; other travel has Skip travel. On a Mars surface shuttle, hold W or Up to advance, A/D to steer, or use Cruise or the Skip journey button below the map.' },
  { question: 'How do I walk to an object?', answer: 'Hold W, Up, or the Hold to walk button. Release to stop. Skip walk takes you straight to the end of the path. With reduced motion, Mars walks finish immediately.' },
  { question: 'How do I inspect and separate hardware?', answer: 'Click an object or its clue button to identify it and open inspection. Choose Separate hardware, then select a component to see its lesson. Click the same component again to return it. Assemble hardware brings the separated model together.' },
  { question: 'How do I rotate, zoom, or reset a model?', answer: 'During hardware inspection, drag the model to orbit and scroll to zoom. Rotation, zoom, and Reset view buttons are also available; Apollo keeps them under More model controls. Return to surface or Escape closes inspection.' },
  { question: 'Why can’t I save this discovery yet?', answer: 'The button tells you what is left. For a spacecraft or rover, inspect all three hardware parts. For an evidence clue, follow its investigation actions. You can leave and come back; unfinished investigation steps may need to be repeated.' },
  { question: 'Do I have to answer Miso’s questions?', answer: 'No. Choose Explore without answering to keep exploring. If you try an answer, the explanation and NASA link help you check your thinking. A wrong answer never blocks a mission.' },
  { question: 'Can I visit a different mission?', answer: 'Yes! Explore other missions opens all five chapters. MUSEUM returns to the gallery and remembers your exhibit and scroll position. You do not need to finish a chapter to visit another one.' },
  { question: 'Where do my notes and discoveries go?', answer: 'NOTEBOOK is for your own thoughts and questions; it autosaves in this browser when storage is available. Save discovery records your expedition progress for this session. Refreshing or restarting clears discoveries, but not your saved personal notes.' },
  { question: 'Is everything here real NASA evidence?', answer: 'The mission lessons link to NASA sources. I’m a fictional alien copilot, and your shuttle, walking expedition, and my interpretations are fiction. Models and experiments are educational reconstructions, not exact archaeological surveys. Open NASA source links to check the evidence.' },
];
