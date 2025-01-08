// pages/api/exchangePoints.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface ExchangeResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExchangeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { qrCodeData, exchangedPoints, currentBalance } = req.body;

  if (!qrCodeData) {
    return res.status(400).json({ success: false, message: 'QRコードデータがありません' });
  }

  try {
    // ここで QRコードデータ (`qrCodeData`) を検証し、
    // データベースなどを参照してポイント交換処理を行う
    // 例: ユーザーIDの抽出、ポイントの減算など

    // ダミーの処理とレスポンス
    // const exchangedPoints = 100; // QRコードに関連付けられたポイント数
    // const currentBalance = 500; // データベースから現在の残高を取得する
    const newBalance = currentBalance + exchangedPoints;

    // 成功レスポンス
    return res.status(200).json({
      success: true,
      message: `${exchangedPoints}pt を交換しました。`,
      newBalance: newBalance,
    });
  } catch (error) {
    console.error('ポイント交換エラー:', error);
    return res.status(500).json({ success: false, message: 'ポイント交換処理中にエラーが発生しました' });
  }
}