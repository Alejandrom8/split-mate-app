import { createAuthHeader } from '@/shared/utils';
import v1Manager from '@/shared/v1Manager';

export default async function handler(req, res) {
  if (!['PUT', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  const { ticket_id } = req.query;
  if (!ticket_id) return res.status(404).json({ error: 'Not found'});

  try {
    if (req.method === 'POST') {
      const {
        items,
      } = req.body;

      const result = await Promise.all(items.map((it) => (
        v1Manager.post(`/v1/tickets/items/${it.id}/assign`, {
          total_quantity: it.total_quantity,
        }, authHeader)
      )));

      const error = result.find(r => r.data.success === false);
      if (error) {
        return res.status(502).json({
          error: 'Asignación del item no exitosa',
          trace_id: error?.data?.trace_id,
          message: error?.data?.message,
        });
      }

      return res.status(200).json({});
    }
    return res.status(404).json({})
  } catch (error) {
    console.error('[api/item] Error:', error?.response?.data || error);

    const status = error?.response?.status || 500;
    const body =
      error?.response?.data ||
      { error: 'Error al crear el item' };

    return res.status(status).json(body);
  }
}