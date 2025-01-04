import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // JWTを使用する場合

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

            // JWTを発行（必要に応じて）
            const token = jwt.sign({ userId: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' }); // YOUR_SECRET_KEYは必ず変更

            res.status(200).json({ token }); // トークンを返す
        } catch (error) {
            console.error("ログインエラー:", error);
            res.status(500).json({ error: 'ログインに失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}