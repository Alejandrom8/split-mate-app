
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

    try {
        const upstream = await v1Manager.post('/v1/users/profile/image', req.body, {
            ...authHeader,
            headers: {
                ...authHeader.headers,
                'Content-Type': 'multipart/form-data',
            }
        });
        
        if (!upstream?.data?.success) {
            return res.status(502).json({
            error: 'Actualización de imagen de perfil no exitosa',
            trace_id: upstream?.data?.trace_id,
            message: upstream?.data?.message,
            });
        }
        
        return res.status(200).json(upstream.data);
    } catch (error) {
        console.error('[api/users/profile/image] Error:', error?.response?.data || error);

        const status = error?.response?.status || 500;
        const body =
        error?.response?.data ||
        { error: 'Error al actualizar la imágen de perfil' };

        return res.status(status).json(body);
    }
}