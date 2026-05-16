import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useIdleTimeout = (timeoutMinutes = 30) => {
  const { logout } = useAuth();
  
  // Use mutable refs to keep the event listeners stable and avoid re-binding
  const logoutRef = useRef(logout);
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  // Keep the reference fresh if it changes, without triggering the hook block
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  useEffect(() => {
    let timeoutId;
    let lastEventTime = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      
      // Throttle: Only reset the actual DOM timer if at least 1 second has passed
      // This stops mousemove and scroll from hammering the main main thread
      if (now - lastEventTime < 1000) return; 
      lastEventTime = now;

      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        logoutRef.current();
        // Note: Let your AuthContext state or ProtectedRoutes handle the redirect natively.
        // Hard reloading the browser can cause race conditions with async logout tasks.
      }, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Add passive flag to scroll/touchstart for better scrolling performance
    events.forEach(event => {
      const options = (event === 'scroll' || event === 'touchstart') ? { passive: true } : false;
      window.addEventListener(event, handleUserActivity, options);
    });

    // Initialize first countdown pass
    timeoutId = setTimeout(() => {
      logoutRef.current();
    }, timeoutMs);

    // Clean up completely on unmount
    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutMs]);
};

export default useIdleTimeout;