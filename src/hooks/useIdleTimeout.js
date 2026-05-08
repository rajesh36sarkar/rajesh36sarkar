import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useIdleTimeout = (timeoutMinutes = 30) => {
  const { logout } = useAuth();

  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        window.location.href = '/admin/login';
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [logout, timeoutMinutes]);
};

export default useIdleTimeout;