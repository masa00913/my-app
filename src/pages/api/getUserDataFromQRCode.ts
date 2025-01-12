import { PrismaClient} from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/types/user';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { codeText } = req.body;

        if (!codeText) {
            return res.status(400).json({ error: 'QRCodeを指定してください' });
        }

        try {
            const qrCode = await prisma.qrCode.findUnique({
                where: { codeText: codeText },
            });

            if (!qrCode) {
                return res.status(401).json({ error: 'ユーザーネームが正しくありません。' });
            }

            const user = await prisma.user.findUnique({
                where: { id: qrCode.userId },
            });

            if(!user){
                return res.status(401).json({ error: 'ユーザーが見つかりません。' });
            }

            const wallet = await prisma.wallet.findUnique({
                where: { userId: user.id },
            })

            if(!wallet){
                return res.status(401).json({ error: 'ウォレットが見つかりません。' });
            }

            const userData: User = { id: user.id, name: user.username, email: user.email, balance: wallet.balance};
            res.status(200).json({ userData }); // トークンを返す
        } catch (error) {
            console.error("ログインエラー:", error);
            res.status(500).json({ error: 'ログインに失敗しました。' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }
}