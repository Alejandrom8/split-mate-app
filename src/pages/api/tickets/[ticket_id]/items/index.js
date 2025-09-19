import { createAuthHeader } from '@/shared/utils';
import v1Manager from '@/shared/v1Manager';

export default async function handler(req, res) {
  if (!['POST'].includes(req.method)) {
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
        name,
        description,
        unit_price,
        total_quantity,
        expense_type,
      } = req.body;
      const upstream = await v1Manager.post(`/v1/tickets/${ticket_id}/items`, {
        name, description, unit_price, total_quantity, expense_type,
      }, authHeader);

      if (!upstream?.data?.success) {
        return res.status(502).json({
          error: 'Creación del item no exitosa',
          trace_id: upstream?.data?.trace_id,
          message: upstream?.data?.message,
        });
      }

      console.log('---- UPSTREAM DATA -----', upstream.data);

      return res.status(200).json(upstream.data);
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