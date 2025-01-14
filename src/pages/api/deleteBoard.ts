import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { boardId } = req.body;

        if (!boardId) {
            return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
        }

        try {
            const board = await prisma.board.delete({
                where: { id: parseInt(boardId, 10) },
            });

            if (!board) {
                return res.status(404).json({ error: 'ボードが存在しません' });
            }

            res.status(200).json({ board });
        } catch (error) {
            console.error("ボード削除エラー:", error);
            res.status(500).json({ error: 'ボード削除に失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}