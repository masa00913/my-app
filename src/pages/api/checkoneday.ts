import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { startOfDay, endOfDay } from 'date-fns'; 

const prisma = new PrismaClient();
const TIMEZONE = 'Asia/Tokyo'; // JST

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userName, isMind } = req.body;
        let isLoginBonus: boolean | undefined = undefined;
        let isMindBonus: boolean | undefined = undefined;

        try {
            // userNameと一致するユーザーをデータベースから取得
            const user = await prisma.user.findUnique({
                where: { username: userName },
            });
      
            if (!user) {
                console.log('[/api/checkoneday] ユーザーが見つかりませんでした');
                return res.status(404).json({ error: 'User not found' });
            }

            // JSTの当日の開始時刻と終了時刻を取得
            const nowInJST = toZonedTime(new Date(), TIMEZONE);
            const startOfDayJST = startOfDay(nowInJST);
            const endOfDayJST = endOfDay(nowInJST);

            // JSTの開始・終了時刻をUTCに変換
            const startOfDayUTC = fromZonedTime(startOfDayJST, TIMEZONE);
            const endOfDayUTC = fromZonedTime(endOfDayJST, TIMEZONE);

            console.log('開始時刻 (UTC):', startOfDayUTC);
            console.log('終了時刻 (UTC):', endOfDayUTC);

            // ユーザーID0番が送り手 & 該当ユーザーが受け取り手 & 当日のトランザクションを取得
            const transactions = await prisma.transaction.findMany({
                where: {
                    fromUserId: 0,
                    toUserId: user.id,
                    createdAt: {
                        gte: startOfDayUTC,
                        lte: endOfDayUTC
                    },
                    attribute: 'loginBonus',
                },
                include: { fromUser: true, toUser: true },
            });
            // トランザクションがあるかどうかを確認
            isLoginBonus = transactions.length === 0;

            if (isMind) {
                const transactions2 = await prisma.transaction.findMany({
                    where: {
                        fromUserId: 0,
                        toUserId: user.id,
                        createdAt: {
                            gte: startOfDayUTC,
                            lte: endOfDayUTC
                        },
                        attribute: 'mindBonus',
                    },
                    include: { fromUser: true, toUser: true },
                });
                // トランザクションがあるかどうかを確認
                isMindBonus = transactions2.length === 0;
            }
            else{
                // MIND圏外の場合はボーナスなし
                isMindBonus = false;
            }

            return res.status(200).json({ isLoginBonus , isMindBonus });
        } catch (error) {
            console.error(
                '[/api/checkoneday] エラー発生:',
                error instanceof Error ? error : String(error)
            );
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'メソッドが許可されていません' });
    }   
}
