import { setAuthCookies } from '../../shared/auth-cookies';
import v1Manager from "@/shared/v1Manager";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};
  const upstream = await v1Manager.post('/v1/users/login', {
    username, password
  });

  if (!upstream?.data?.success) return res.status(401).json({ error: 'Credenciales inválidas' });

  const { access_token } = await upstream.data?.data?.token;

  setAuthCookies({ res }, {
    accessToken: access_token,
  });
  return res.status(200).json({ ok: true });
}