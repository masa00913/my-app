import { PrismaClient} from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/types/user';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'ユーザーネームを入れてください' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { username: name },
            });

            if (!user) {
                return res.status(401).json({ error: 'ユーザーネームが正しくありません。' });
            }

            const wallet = await prisma.wallet.findUnique({
                where: { userId: user.id },
            })

            const userData: User = { id: user.id.toString(), name: user.username, email: user.email, balance: wallet?.balance ?? 0 };

            res.status(200).json({ userData }); // トークンを返す
        } catch (error) {
            console.error("ログインエラー:", error);
            res.status(500).json({ error: 'ログインに失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}