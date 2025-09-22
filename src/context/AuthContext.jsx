import React, { useEffect, useState, createContext, useContext } from 'react';
import clientManager from "@/shared/clientManager";
import {useRouter} from "next/router";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hydrate = async () => {
    try {
      setLoading(true);
      const res = await clientManager.get('/users/profile');
      setUser(res?.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  // Bootstrap del usuario al montar (si no vino por SSR)
  useEffect(() => {
    hydrate()
      .then(() => console.log('hydrate finished'))
      .catch(error => router.push('/login'));
  }, []);

  // Helpers: login/logout
  const login = async ({ username, password }) => {
    const res = await clientManager.post('/login', {
      username, password
    });
    if (!res.ok) {
      const err = await res?.error || null;
      throw new Error(err.error || 'Credenciales inválidas');
    }
    const meRes = await clientManager.get('/me');
    if (meRes) {
      setUser(meRes);
    } else {
      setUser(null);
    }
};

  const signup = async ({ username, email, password }) => {
    const res = await clientManager.post('/signup', {
      username,
      email,
      password,
    });
    if (!res.ok) {
      const err = await res?.error || null;
      throw new Error(err.error || 'Error al crear cuenta');
    }
    const meRes = await clientManager.get('/me');
    if (meRes) {
      setUser(meRes);
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    await clientManager.post('/logout');
    setUser(null);
  };

  const value = React.useMemo(() => ({ user, setUser, loading, login, logout, signup }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}