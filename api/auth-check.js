const ALLOWED_EMAILS = ['mybotpetunia@gmail.com'];
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  const { path: requestPath } = req.query;
  
  // Skip auth page
  if (requestPath === 'auth.html' || requestPath?.startsWith('auth')) {
    return res.redirect(307, `/${requestPath}`);
  }
  
  // Check for auth session cookie
  const session = req.cookies['auth-session'];
  
  if (!session || session !== 'valid') {
    // Redirect to auth page
    return res.redirect(307, `/auth.html?return=${encodeURIComponent(`/${requestPath || ''}`)}`);
  }
  
  // Serve the requested file
  const filePath = requestPath || 'index.html';
  return res.redirect(307, `/${filePath}`);
}
