import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await prisma.user.findUnique({
                where: { email: email },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'このメールアドレスは既に登録されています。' });
            }

            const newUser = await prisma.user.create({
                data: {
                    username: name,
                    email: email,
                    passwordHash: hashedPassword,
                },
            });

            // Walletエントリを作成
            await prisma.wallet.create({
                data: {
                    userId: newUser.id,
                    balance: 0, // 初期残高を0に設定
                },
            });

            res.status(200).json(newUser);
        } catch (error) {
            console.error("ユーザー作成エラー:", error);
            res.status(500).json({ error: 'ユーザー作成に失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}