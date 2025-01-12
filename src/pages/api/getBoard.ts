import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === 'POST') {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId, 10) },
            });

            if (!user) {
                return res.status(408).json({ error: 'ユーザーが存在しません' });
            }
            const newBoard = await prisma.board.findMany();
            res.status(200).json({ boards: newBoard });
        } catch (error) {
            console.error("ユーザー作成エラー:", error);
            res.status(500).json({ error: 'ユーザー作成に失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}