import { createAuthHeader } from '@/shared/utils';
import v1Manager from '@/shared/v1Manager';

export default async function handler(req, res) {
  if (!['PUT', 'GET'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = createAuthHeader(req);
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  if (req.method === 'PUT') {
    const { first_name, last_name, email } = req.body;

    try {
      const upstream = await v1Manager.put('/v1/users/profile', {
          first_name,
          last_name,
          email,
        }, authHeader);
        
        if (!upstream?.data?.success) {
          return res.status(502).json({
            error: 'Actualización de perfil no exitosa',
            trace_id: upstream?.data?.trace_id,
            message: upstream?.data?.message,
          });
        }
      
        return res.status(200).json(upstream.data);
    } catch (error) {
      console.error('[api/users/profile] Error:', error?.response?.data || error);
  
      const status = error?.response?.status || 500;
      const body =
      error?.response?.data ||
      { error: 'Error al actualizar el perfil' };
  
      return res.status(status).json(body);
    }
  } else {
    try {
      const upstream = await v1Manager.get('/v1/users/profile', {}, authHeader);
        
        if (!upstream?.data?.success) {
          return res.status(502).json({
            error: 'Error al obtener el perfil',
            trace_id: upstream?.data?.trace_id,
            message: upstream?.data?.message,
          });
        }
      
        return res.status(200).json(upstream.data);
    } catch (error) {
      console.error('[api/users/profile] Error:', error?.response?.data || error);
  
      const status = error?.response?.status || 500;
      const body =
      error?.response?.data ||
      { error: 'Error al obtener el perfil' };
  
      return res.status(status).json(body);
    }
  }
}