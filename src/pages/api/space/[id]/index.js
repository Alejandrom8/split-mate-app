// /pages/api/me.js
import nookies from 'nookies';
import v1Manager from '../../../../shared/v1Manager';
import {createAuthHeader} from "@/shared/utils";
import {updateBuildDiagnostics} from "next/dist/diagnostics/build-diagnostics"; // ajusta la ruta según tu proyecto

export default async function handler(req, res) {
  if (!['DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      await v1Manager.delete(`/v1/events/${id}`, authHeader);
      return res.status(200).json({});
    }
    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('[api/space/[id]] Error:', err?.response?.data || err);

    // Si viene de axios, intenta propagar status razonable
    const status = err?.response?.status || 500;
    const body =
      err?.response?.data ||
      { error: 'Error al eliminar el espacio' };

    return res.status(status).json(body);
  }
}