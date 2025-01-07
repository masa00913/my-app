// コード2
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[/api/sendList] リクエスト受信', req.method, req.body); // リクエスト情報をログ出力

  if (req.method === 'POST') {
    const { userName } = req.body;
    console.log('[/api/sendList] userName:', userName); // 受け取ったuserNameをログ出力

    try {
      // userNameと一致するユーザーをデータベースから取得
      const user = await prisma.user.findUnique({
        where: { username: userName },
      });

      if (!user) {
        console.log('[/api/sendList] ユーザーが見つかりませんでした'); // ユーザーが見つからなかった場合のログ出力
        return res.status(404).json({ error: 'User not found' });
      }

      // 取引相手の名前を取得
      const transactions = await prisma.transaction.findMany({
        where: { fromUserId: user.id },
        include: { toUser: true },
      });

      const partnerNames = transactions.map(transaction => transaction.toUser.username);
      console.log('[/api/sendList] partnerNames:', partnerNames); // 取引相手の名前をログ出力

      return res.status(200).json({ partnerNames });
    } catch (error) {
      console.error('[/api/sendList] エラー発生:', error); // エラー内容をログ出力
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}