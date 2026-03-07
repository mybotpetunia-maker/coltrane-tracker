const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find the persistence functions and replace them
const newPersistence = `
const API_URL = '/api/state';

async function loadState(){
  // Try API first
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      return data || {};
    }
  } catch(e) {
    console.warn('API unavailable, using localStorage');
  }
  
  // Fallback to localStorage
  let ls={};
  try{ ls=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }catch(e){ ls={}; }
  return ls;
}

async function persistState(state){
  // Save to API
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch(e) {
    console.warn('API save failed, using localStorage');
  }
  
  // Also save locally as backup
  const payload=JSON.stringify(state);
  try{ localStorage.setItem(KEY,payload); }catch(e){}
  try{ setCookie(COOKIE_KEY,payload); }catch(e){}
}
`;

// Replace the old functions
const updated = html.replace(
  /function loadState\(\)\{[\s\S]*?\n\}/,
  newPersistence.split('\n').slice(1, 18).join('\n')
).replace(
  /function persistState\(state\)\{[\s\S]*?\n\}/,
  newPersistence.split('\n').slice(20, 31).join('\n')
);

// Also need to make the state loading async
const updated2 = updated.replace(
  'const state=loadState();',
  'let state={}; loadState().then(s => { state=s; render(); });'
).replace(
  'persistState(state);',
  'persistState(state).catch(e=>console.error(e));'
);

fs.writeFileSync('index.html', updated2);
console.log('Updated persistence functions');
