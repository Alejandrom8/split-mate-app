import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clientManager from "@/shared/clientManager";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await clientManager.post('/logout');
      } catch (e) {
        console.error('Error al cerrar sesión:', e);
      } finally {
        router.replace('/login'); // redirige siempre
      }
    };
    doLogout();
  }, [router]);

  return <p>Cerrando sesión...</p>;
}