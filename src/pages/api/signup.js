import { setAuthCookies } from '../../shared/auth-cookies';
import v1Manager from "@/shared/v1Manager";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username, password } = req.body || {};

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Faltan parámetros: email, username o password' });
  }

  try {
    const upstream = await v1Manager.post('/v1/users/signup', {
      email, username, password
    });

    if (!upstream?.data?.success) {
      const error = await upstream.data?.error || {};
      return res.status(upstream.status).json({
        error: error.message || 'Error al registrar usuario',
      });
    }

    const { access_token } = await upstream.data?.data?.token;

    // Guardamos tokens en cookies seguras HttpOnly
    setAuthCookies({ res }, {
      accessToken: access_token,
    });

    return res.status(201).json({ ok: true, message: 'Cuenta creada exitosamente' });
  } catch (err) {
    console.error('[Signup API] Error:', err);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
}