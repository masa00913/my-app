import { PrismaClient} from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { User } from '@/types/user';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください。' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
            }

            const passwordMatch = await bcrypt.compare(password, user.passwordHash);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
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