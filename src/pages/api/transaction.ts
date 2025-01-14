// src/pages/api/transaction.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fromUserId, toUserId, amount ,attribute} = req.body;

    if (!fromUserId || !toUserId || !amount) {
      if (fromUserId === 0) {
        console.log("fromUserIdが0です。");
      } else {
        return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
      }
    }

    try {
      const sender = await prisma.user.findUnique({
        where: { id: parseInt(fromUserId, 10) },
      });

      const recipient = await prisma.user.findUnique({
        where: { id: parseInt(toUserId, 10) },
      });

      if (!sender || !recipient) {
        return res.status(404).json({ error: 'ユーザーが見つかりません。' });
      }

      const transaction = await prisma.transaction.create({
        data: {
          fromUserId: sender.id,
          toUserId: recipient.id,
          amount: amount,
          attribute: attribute,
        },
      });

      const senderWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
      });

      

      if(senderWallet){
        if(senderWallet?.id != 0 &&senderWallet?.balance < amount){
          console.log("残高が不足しています。");
          return res.status(400).json({ error: '残高が不足しています。' });
         
        }

        
      }else{
          return res.status(404).json({ error: '送信者のウォレットが見つかりません。' });
      }

      

      const recipientWallet = await prisma.wallet.findUnique({
        where: { userId: recipient.id },
      });
      
      if (!recipientWallet) {
        return res.status(404).json({ error: '受信者のウォレットが見つかりません。' });
      }

      await prisma.wallet.update({
        where: { userId: sender.id },
        data: { balance: senderWallet.balance - amount },
      });

      await prisma.wallet.update({
        where: { userId: recipient.id },
        data: { balance: recipientWallet.balance + amount },
      });


      res.status(200).json(transaction);
    } catch (error) {
      console.error('トランザクション作成エラー:', error);
      res.status(500).json({ error: 'トランザクション作成に失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}

