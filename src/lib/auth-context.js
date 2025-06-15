// lib/auth-context.js
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-config';  // ← Import from firebase-config

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoad] = useState(true);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, 
    (u) => {
      setUser(u);
      setLoad(false);
    },
    (error) => {
      console.error('Auth state error:', error);
      setLoad(false);
    }
  );
  return () => unsub();
}, []); // ← Remove auth from dependencies since we're importing it

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);