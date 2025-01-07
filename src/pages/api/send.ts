import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { recipientName } = req.body;
    console.log(recipientName + "を確認");
    if (!recipientName) {
      return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
    }

    try {

      const recipient = await prisma.user.findUnique({
        where: { username: recipientName },
      });

      if (!recipient) {
        return res.status(404).json({ error: 'ユーザーが見つかりません。' });
      }     

      res.status(200).json(recipient);
    } catch (error) {
      console.error('トランザクション作成エラー:', error);
      res.status(500).json({ error: 'トランザクション作成に失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}

