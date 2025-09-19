import { createAuthHeader } from '@/shared/utils';
import v1Manager from '@/shared/v1Manager';

export default async function handler(req, res) {
  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  const { ticket_id, item_id } = req.query;
  if (!ticket_id || !item_id) return res.status(404).json({ error: 'Not found'});

  try {
    if (req.method === 'PUT') {
      const {
        name,
        description,
        unit_price,
        total_quantity,
        expense_type,
      } = req.body;
      const upstream = await v1Manager.put(`/v1/tickets/${ticket_id}/items/${item_id}`, {
        name, description, unit_price, total_quantity, expense_type,
      }, authHeader);

      if (!upstream?.data?.success) {
        return res.status(502).json({
          error: 'Actualización del item no exitosa',
          trace_id: upstream?.data?.trace_id,
          message: upstream?.data?.message,
        });
      }

      return res.status(200).json(upstream.data);
    } else if (req.method === 'DELETE') {
      const upstream = await v1Manager.delete(`/v1/tickets/${ticket_id}/items/${item_id}`, authHeader);

      if (!upstream?.data?.success) {
        return res.status(502).json({
          error: 'Eliminación del item no exitosa',
          trace_id: upstream?.data?.trace_id,
          message: upstream?.data?.message,
        });
      }

      return res.status(200).json(upstream.data);
    }
    return res.status(404).json({})
  } catch (error) {
    console.error('[api/item/[id]] Error:', error?.response?.data || error);

    const status = error?.response?.status || 500;
    const body =
      error?.response?.data ||
      { error: 'Error al actualizar el item' };

    return res.status(status).json(body);
  }
}