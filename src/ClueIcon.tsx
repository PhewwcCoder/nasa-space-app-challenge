const paths:Record<string,string>={
 eagle:'M8 24h24L29 12H11ZM12 24 6 34M28 24l6 10M3 34h9m16 0h9M16 12V6h8v6M15 18h10',
 footprints:'M12 7c-5 0-7 11-4 15h8c3-4 1-15-4-15ZM8 26h8v6H8ZM28 13c-5 0-7 11-4 15h8c3-4 1-15-4-15ZM24 32h8v5h-8',
 camera:'M7 13h26v21H7ZM13 13l3-6h8l3 6M27 18h2M26 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0',
 seismometer:'M3 22h8l4-10 6 20 5-27 5 17h6',
 reflector:'M13 12h20v20H13ZM13 18h20m-20 7h20M20 12v20m6-20v20M3 4l10 8M3 17l10-5',
 messages:'M7 7h26v26H7ZM12 14h16m-16 6h16m-16 6h10M27 33v4',
 code:'m13 11-9 9 9 9m14-18 9 9-9 9M23 6l-6 28'};
export default function ClueIcon({kind}:{kind:string}){return <svg className="clue-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle className="icon-orbit" cx="20" cy="20" r="19"/><path d={paths[kind]}/></svg>;}
