import { writable } from 'svelte/store';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from './db';

const SECRET_KEY = 'your-secret-key';

const getSessionData = () => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    const sessionStr = localStorage.getItem('session');
    return sessionStr ? JSON.parse(sessionStr) : { user: null, token: null };
  } else {
    return { user: null, token: null };
  }
};

export const sessionStore = (() => {
  const { subscribe, set, update } = writable(getSessionData());

  const logout = () => {
    updateSession({ user: null, token: null });
  };

  return {
    subscribe,
    logout,
    updateSession: (newSession) => update(() => newSession),
  };
})();

const updateSession = (newSession) => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    localStorage.setItem('session', JSON.stringify(newSession));
  }

  sessionStore.updateSession(newSession);
};

// ... (rest of the auth.js file)
// ... (rest of the auth.js file)

export const authenticate = async (email, password, isLogin) => {
  const user = await getUserByEmail(email);

  if (isLogin) {
    if (!user) {
      // User not found
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Invalid password
      return null;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    return { user, token };
  } else {
    // Registration
    if (user) {
      // User already exists
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(email, hashedPassword);

    const newUser = await getUserByEmail(email);
    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY);
    return { user: newUser, token };
  }
};