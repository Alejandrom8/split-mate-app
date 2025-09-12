// /pages/api/me.js
import nookies from 'nookies';
import v1Manager from '../../../shared/v1Manager'; // ajusta la ruta según tu proyecto

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = nookies.get({ req });
    const at = cookies.at;

    if (!at) {
      return res.status(401).json({ error: 'No autorizado: falta cookie at' });
    }

    const { name, description, event_date } = req.body;

    const upstream = await v1Manager.post('/v1/events/', {
        name,
        description,
        event_date,
    }, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
    });

    const payload = upstream?.data || upstream;

    if (!payload?.success) {
      return res.status(502).json({
        error: 'Creación de espacio no exitoso',
        trace_id: payload?.trace_id,
        message: payload?.message,
      });
    }

    // Devolvemos solo el bloque de datos de usuario para el cliente
    return res.status(200).json(payload.data);
  } catch (err) {
    console.error('[api/me] Error:', err?.response?.data || err);

    // Si viene de axios, intenta propagar status razonable
    const status = err?.response?.status || 500;
    const body =
      err?.response?.data ||
      { error: 'Error al crear el espacio' };

    return res.status(status).json(body);
  }
}