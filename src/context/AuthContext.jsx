import React, { useEffect, useState } from 'react';
import clientManager from "@/shared/clientManager";

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);


  const hydrate = async () => {
    try {
      setLoading(true);
      const res = await clientManager.get('/me');
      console.log('RES AUTH', res);
      if (res) {
        setUser(res);
      } else {
        setUser(null);
      }
    } catch (error) {
      // pass
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Bootstrap del usuario al montar (si no vino por SSR)
  useEffect(() => {
    if (initialUser) return;
    hydrate().catch((error) => {
      console.log(error);
    });
  }, [initialUser]);

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