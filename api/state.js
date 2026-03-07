// Simple serverless function to store/retrieve checkbox state
// Stores in-memory (will reset on cold start, but good enough for demo)
let state = {};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json(state);
  }
  
  if (req.method === 'POST') {
    state = { ...state, ...req.body };
    return res.status(200).json({ success: true, state });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
