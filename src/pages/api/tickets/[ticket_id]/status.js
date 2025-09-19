// /pages/api/me.js
import v1Manager from '../../../../shared/v1Manager';
import {createAuthHeader} from "@/shared/utils";

export default async function handler(req, res) {
  if (!['PUT'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  try {
    const { ticket_id: id } = req.query;
    const { status } = req.body;
    const upstream = await v1Manager.put(`/v1/tickets/${id}/status`, { status }, authHeader)

    if (!upstream.data?.success) {
      return res.status(502).json({
        error: 'Actualización del ticket no exitosa',
        trace_id: upstream.data?.trace_id,
        message: upstream.data?.message,
      });
    }

    return res.status(200).json(upstream.data);
  } catch (err) {
    console.error('[api/tickets/[id]/status] Error:', err?.response?.data || err);

    // Si viene de axios, intenta propagar status razonable
    const status = err?.response?.status || 500;
    const body =
      err?.response?.data ||
      { error: 'Error al actualizar el estado del ticket' };

    return res.status(status).json(body);
  }
}