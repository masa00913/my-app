// // pages/api/exchangePoints.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }

//   const { qrCodeData, fromUser, toUser } = req.body;

//   if (!qrCodeData) {
//     return res.status(400).json({ success: false, message: 'QRコードデータがありません' });
//   }
//   try {
//     // ここで QRコードデータ (`qrCodeData`) を検証し、
//     // データベースなどを参照してポイント交換処理を行う
//     // 例: ユーザーIDの抽出、ポイントの減算など

//     // ダミーの処理とレスポンス
//     // const exchangedPoints = 100; // QRコードに関連付けられたポイント数
//     // const currentBalance = 500; // データベースから現在の残高を取得する
//     const sender = await prisma.user.findUnique({
//       where: { username: fromUser },
//     });

//     const recipient = await prisma.user.findUnique({
//       where: { username: toUser },
//     });

//     if (!sender || !recipient) {
//       return res.status(404).json({ error: 'ユーザーが見つかりません。' });
//     }

//     // 成功レスポンス
//     return res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     console.error('ポイント交換エラー:', error);
//     return res.status(500).json({ success: false, message: 'ポイント交換処理中にエラーが発生しました' });
//   }
// }