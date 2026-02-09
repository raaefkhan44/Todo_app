// Authentication service for handling JWT tokens and user session
import { UserSession } from '@/types/auth';

// Key for storing user session in localStorage
const USER_SESSION_KEY = 'user-session';

// Get auth token from session
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const sessionData = localStorage.getItem(USER_SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    const session: UserSession = JSON.parse(sessionData);

    // Check if token is expired
    if (session.expiresAt && new Date() >= new Date(session.expiresAt)) {
      // Token is expired, remove session
      localStorage.removeItem(USER_SESSION_KEY);
      return null;
    }

    return session.token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    localStorage.removeItem(USER_SESSION_KEY);
    return null;
  }
};

// Save user session to localStorage
export const saveUserSession = (session: UserSession): void => {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

// Get user session from localStorage
export const getUserSession = (): UserSession | null => {
  try {
    const sessionData = localStorage.getItem(USER_SESSION_KEY);
    if (!sessionData) {
      return null;
    }
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

// Remove user session (logout)
export const removeUserSession = (): void => {
  try {
    localStorage.removeItem(USER_SESSION_KEY);
  } catch (error) {
    console.error('Error removing user session:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return token !== null;
};

// Refresh token if needed
export const refreshToken = async (): Promise<string | null> => {
  // In a real implementation, you would call an API endpoint to refresh the token
  // For now, we'll just return the current token or null
  const token = await getAuthToken();
  return token;
};