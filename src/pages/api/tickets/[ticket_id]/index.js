// /pages/api/me.js
import nookies from 'nookies';
import v1Manager from '../../../../shared/v1Manager';
import {createAuthHeader} from "@/shared/utils";
import {updateBuildDiagnostics} from "next/dist/diagnostics/build-diagnostics"; // ajusta la ruta según tu proyecto

export default async function handler(req, res) {
  if (!['DELETE', 'PUT'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  const { ticket_id: id } = req.query;

  try {
    if (req.method === 'DELETE') {
      const upstream = await v1Manager.delete(`/v1/tickets/${id}`, authHeader);

      if (!upstream.data?.success) {
        return res.status(502).json({
          error: 'Eliminación de ticket no exitosa',
          trace_id: upstream.data?.trace_id,
          message: upstream.data?.message,
        });
      }

      return res.status(200).json(upstream.data);
    } else if (req.method === 'PUT') {
      const upstream = await v1Manager.put(`/v1/tickets/${id}`, { ...req.body }, authHeader)

      if (!upstream.data?.success) {
        return res.status(502).json({
          error: 'Actualización del ticket no exitosa',
          trace_id: upstream.data?.trace_id,
          message: upstream.data?.message,
        });
      }

      return res.status(200).json(upstream.data);
    }
    return res.status(404).json({ error: 'Not found' });
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