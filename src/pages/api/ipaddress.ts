import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof clientIp === 'string' && clientIp.includes('::ffff:')) {
        clientIp = clientIp.split('::ffff:')[1];
    }
    res.status(200).json({ clientIp });
}