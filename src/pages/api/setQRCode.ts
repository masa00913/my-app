import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { codeText,userId } = req.body;
    if (!codeText || !userId) {
      return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
    }

    try {

        const qrCode = await prisma.qrCode.create({
            data: {
                userId: userId,
                codeText: codeText,
            },
        }); 
        
        if(!qrCode){
            throw new Error('QRコードDBの作成に失敗しました。');
        }

      res.status(200).json(qrCode);
    } catch (error) {
      console.error('QRセットエラー:', error);
      res.status(500).json({ error: 'QRのセットに失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}

