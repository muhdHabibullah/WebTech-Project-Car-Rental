import { ref } from 'vue';
import api from './axios.js';

// Load initial user state from localStorage if it exists
const storedUser = localStorage.getItem('user_session');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const currentUser = ref(initialUser);

/**
 * Login - POST /api/login
 * Sends credentials to the PHP Slim backend and stores JWT token
 */
export const loginSim = async (email, password, role) => {
  try {
    console.log('[LOGIN] Attempting login with:', { email, role, apiUrl: api.defaults.baseURL });
    const res = await api.post('/login', { email, password, role });
    const data = res.data;
    console.log('[LOGIN] Success:', data);

    const user = {
      email: data.email,
      name: data.name,
      role: data.role,
      token: data.token
    };

    currentUser.value = user;
    localStorage.setItem('user_session', JSON.stringify(user));
    localStorage.setItem('auth_token', user.token);
    return user;
  } catch (err) {
    console.error('[LOGIN] Failed:', {
      hasResponse: !!err.response,
      status: err.response?.status,
      errorMessage: err.message,
      fullError: err
    });
    
    if (!err.response) {
      throw new Error('Connection failed: Slim backend server is unreachable. Please verify it is running and database is active.');
    }
    const message = err.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

/**
 * Signup - POST /api/register
 */
export const signupSim = async (name, email, password, role) => {
  try {
    console.log('[SIGNUP] Attempting registration with:', { name, email, role, apiUrl: api.defaults.baseURL });
    const res = await api.post('/register', { name, email, password, phone: '', role });
    const data = res.data;
    console.log('[SIGNUP] Success:', data);

    const user = {
      email: data.email,
      name: data.name,
      role: data.role,
      token: data.token
    };

    currentUser.value = user;
    localStorage.setItem('user_session', JSON.stringify(user));
    localStorage.setItem('auth_token', user.token);
    return user;
  } catch (err) {
    console.error('[SIGNUP] Failed:', {
      hasResponse: !!err.response,
      status: err.response?.status,
      errorMessage: err.message,
      fullError: err
    });
    
    if (!err.response) {
      throw new Error('Connection failed: Slim backend server is unreachable. Please verify it is running and database is active.');
    }
    const message = err.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

/**
 * Logout - Clears local session and JWT token
 */
export const logoutSim = () => {
  currentUser.value = null;
  localStorage.removeItem('user_session');
  localStorage.removeItem('auth_token');
};
