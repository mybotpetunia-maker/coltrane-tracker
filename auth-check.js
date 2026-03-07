// Client-side auth check
(function() {
  // Skip if on auth page
  if (window.location.pathname === '/auth.html' || window.location.pathname === '/auth') {
    return;
  }
  
  // Check for auth session
  const cookies = document.cookie.split(';');
  const hasAuth = cookies.some(c => c.trim().startsWith('auth-session='));
  
  if (!hasAuth) {
    // Redirect to auth page
    window.location.href = `/auth.html?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }
})();
