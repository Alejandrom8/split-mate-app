import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clientManager from "@/shared/clientManager";
import {useAuth} from "@/context/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error('Error al cerrar sesión:', e);
      } finally {
        router.replace('/'); // redirige siempre
      }
    };
    doLogout();
  }, [router]);

  return <p>Cerrando sesión...</p>;
}