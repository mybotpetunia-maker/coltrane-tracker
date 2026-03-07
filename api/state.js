// Supabase-backed state persistence for cross-device sync
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const stateKey = 'coltrane-med-state';

  try {
    if (req.method === 'GET') {
      // Fetch current state
      const { data, error } = await supabase
        .from('app_state')
        .select('value')
        .eq('key', stateKey)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found, which is OK
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ state: data?.value || {} });
    } else if (req.method === 'POST') {
      // Save state
      const { state } = req.body;
      
      if (!state || typeof state !== 'object') {
        return res.status(400).json({ error: 'Invalid state object' });
      }

      // Upsert (update if exists, insert if not)
      const { error } = await supabase
        .from('app_state')
        .upsert({
          key: stateKey,
          value: state,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error('Supabase POST error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: err.message });
  }
}
