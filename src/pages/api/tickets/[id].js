// /pages/api/me.js
import nookies from 'nookies';
import v1Manager from '../../../shared/v1Manager';
import {createAuthHeader} from "@/shared/utils"; // ajusta la ruta según tu proyecto

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = createAuthHeader(req);
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado: falta cookie at' });
    }

    const { id } = req.query;
    const upstream = await v1Manager.delete(`/v1/tickets/${id}`, authHeader);
    const payload = upstream?.data || upstream;

    if (!payload?.success) {
      return res.status(502).json({
        error: 'Eliminación de ticket no exitosa',
        trace_id: payload?.trace_id,
        message: payload?.message,
      });
    }

    // Devolvemos solo el bloque de datos de usuario para el cliente
    return res.status(200).json(payload.data);
  } catch (err) {
    console.error('[api/tickets/[id]] Error:', err?.response?.data || err);

    // Si viene de axios, intenta propagar status razonable
    const status = err?.response?.status || 500;
    const body =
      err?.response?.data ||
      { error: 'Error al eliminar el ticket' };

    return res.status(status).json(body);
  }
}