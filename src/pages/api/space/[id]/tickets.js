import v1Manager from "../../../../shared/v1Manager";
import nookies from "nookies";

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const cookies = nookies.get({ req });
  const at = cookies.at;

  if (!at) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  const { id } = req.query || {};
  const upstream = await v1Manager.get(`/v1/tickets/events/${id}/tickets`, {}, {
    headers: {
      Authorization: `Bearer ${at}`,
    },
  });

  if (!upstream?.data?.success) {
    return res.status(502).json({
      error: 'Upstream no exitoso',
      trace_id: upstream?.trace_id,
      message: upstream?.message,
    });
  }

  return res.status(200).json(upstream.data);
}