import { useEffect, useRef, useState } from 'react';

const storageKey = 'sol3-curiosity-notebook-v1';
let sessionDraft: string | null = null;
function readDraft() {
  if (sessionDraft !== null) return sessionDraft;
  try { return localStorage.getItem(storageKey) ?? ''; } catch { return ''; }
}
export default function Journal({close}:{close:()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(readDraft);
  const [status, setStatus] = useState('');
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close(); }, []);
  const update = (value:string) => {
    setDraft(value); sessionDraft = value;
    try { localStorage.setItem(storageKey, value); setStatus('Saved on this device.'); }
    catch { setStatus('Kept for this session; device storage is unavailable.'); }
  };
  return <dialog className="journal curiosity-notebook" ref={dialog} onCancel={e=>{e.preventDefault();close();}}>
    <button className="quiet-button close-journal" onClick={close}>Close notebook</button>
    <p className="eyebrow">Sol-3 / YOUR CURIOSITY NOTEBOOK</p>
    <h2>What are you wondering?</h2>
    <p>Your ideas belong here. Leave a thought, an opinion, or a question you want to explore.</p>
    <label htmlFor="curiosity-notes">My thoughts & questions</label>
    <textarea id="curiosity-notes" value={draft} onChange={e=>update(e.target.value)} placeholder="I wonder why..." maxLength={20000}/>
    <p className="notebook-status" role="status">{status || 'Notes save automatically in this browser. They are not sent anywhere.'}</p>
  </dialog>;
}
