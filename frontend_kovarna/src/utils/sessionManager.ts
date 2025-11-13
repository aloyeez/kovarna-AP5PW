import { toast } from 'sonner';

// Custom event for session expiration
export const SESSION_EXPIRED_EVENT = 'session-expired';

/**
 * Handle session expiration by showing a toast notification
 * and dispatching a custom event that AuthContext can listen to
 */
export const handleSessionExpired = () => {
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');

  // Show toast notification
  toast.error('Your session has expired. Please log in again.', {
    duration: 4000,
  });

  // Dispatch custom event for AuthContext to listen to
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));

  // Redirect to login after a short delay
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};
