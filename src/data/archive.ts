export type ArtifactId = 'eagle' | 'reflector' | 'footprints' | 'camera' | 'seismometer' | 'messages';
export const artifacts = {
  camera: {id:'camera',code:'TB / 004',unknownName:'Optical instrument',name:'Camera',subtitle:'Television camera',purpose:'A black-and-white television camera transmitted the first steps to viewers on Earth.',interpretation:'They wanted others to witness it.',source:'https://www.nasa.gov/history/astronaut-still-photography-during-apollo/',sourceName:'NASA / Apollo photography'},
  seismometer: {id:'seismometer',code:'TB / 005',unknownName:'Silent instrument',name:'Seismometer',subtitle:'Passive seismic experiment',purpose:'The instrument measured vibrations to help scientists study the lunar interior.',interpretation:'They wanted to understand this world.',source:'https://science.nasa.gov/resource/apollo-11-seismic-experiment/',sourceName:'NASA / Seismic experiment'},
  messages: {id:'messages',code:'TB / 006',unknownName:'Inscribed objects',name:'Plaque + goodwill disc',subtitle:'Messages left behind',purpose:'A plaque and a silicon disc carrying goodwill messages were left on the Moon.',interpretation:'They expected their presence to be discovered.',source:'https://www.nasa.gov/history/55-years-ago-one-month-until-the-moon-landing/',sourceName:'NASA / Memorial items'},
  eagle: { id: 'eagle', code: 'TB / 001', unknownName: 'Metallic structure', name: 'Eagle', subtitle: 'Lunar module · descent stage', purpose: 'Its engine and landing gear carried two humans to the surface. The lower stage stayed behind when they left.', interpretation: 'They could build machines capable of reaching another world.', source: 'https://www.nasa.gov/history/apollo-11-mission-overview/', sourceName: 'NASA · Apollo 11 mission overview' },
  reflector: { id: 'reflector', code: 'TB / 002', unknownName: 'Reflective array', name: 'Retroreflector', subtitle: 'Laser ranging retroreflector', purpose: 'One hundred corner-cube prisms return laser light toward its source. Timing the round trip lets observers on Earth measure the distance to the Moon.', interpretation: 'Their science continued after they left.', source: 'https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/', sourceName: 'NASA · The experiment that keeps on giving' },
  footprints: { id: 'footprints', code: 'TB / 003', unknownName: 'Repeated surface impressions', name: 'Footprints', subtitle: 'Human presence · bootprint', purpose: 'A boot pressed this pattern into lunar regolith. Without wind or rain, such impressions can persist, although impacts gradually alter the surface.', interpretation: 'They came here themselves.', source: 'https://science.nasa.gov/resource/apollo-11-bootprint/', sourceName: 'NASA · Apollo 11 bootprint' }
} as const;
export const components = [
 { id: 'structure', name: '01 / Descent structure', material: 'Aluminum structure · thermal blankets', fact: 'The lower stage supported the lander and served as the launch platform for the ascent stage.', offset: [0,1.5,0] },
 { id: 'engine', name: '02 / Descent engine', material: 'Propulsion assembly', fact: 'A throttleable engine controlled the final descent to the lunar surface. It remained with this stage.', offset: [0,-0.6,0] },
 { id: 'gear', name: '03 / Landing gear', material: 'Struts · crushable energy absorbers', fact: 'Four legs spread the load and absorbed the impact of landing on an unfamiliar surface.', offset: [0,0,0] }
] as const;
export const chapters = [
 { id:'prologue', theme:{ink:'#e3e9e8',accent:'#a6cfd1',world:'#050a12'}, available:true },
 { id:'apollo11', theme:{ink:'#eee9dd',accent:'#c9ad72',world:'#090a0b'}, available:true },
 { id:'sojourner',theme:{ink:'#efdfca',accent:'#c98e5b',world:'#482d25'},available:false },
 { id:'spirit',theme:{ink:'#efdfca',accent:'#bd7151',world:'#301f1c'},available:false },
 { id:'opportunity',theme:{ink:'#efdfca',accent:'#ad7a56',world:'#281d18'},available:false },
 { id:'voyager',theme:{ink:'#e1e6f1',accent:'#8dabe0',world:'#03040a'},available:false },
 { id:'epilogue',theme:{ink:'#f0e4cc',accent:'#d1b77e',world:'#14120e'},available:false }
];

