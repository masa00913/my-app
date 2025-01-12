import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { User } from '@/types/user';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { recipientName } = req.body;
    console.log(recipientName + " is the recipient name");
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

      const wallet = await prisma.wallet.findUnique({
        where: { userId: recipient.id },
      });

      if(!wallet){
        return res.status(401).json({ error: 'ウォレットが見つかりません。' });
      }
      const recipientData: User = { id: recipient.id, name: recipient.username, email: recipient.email, balance: wallet.balance};
      
      res.status(200).json(recipientData);
    } catch (error) {
      console.error('トランザクション作成エラー:', error);
      res.status(500).json({ error: 'トランザクション作成に失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}

