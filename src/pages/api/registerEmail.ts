// GASの中継API

import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// import { User } from '@/types/user';

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { method, email } = req.body;
    console.log(email + " is the email");
    if (method !== 'registerEmail' || !email) {
      return res.status(400).json({ error: 'すべてのフィールドを入力してください。' });
    }

    try {
      // req.bodyの型をコンソールに出力
      console.log('req.body type:', typeof req.body);
      console.log(req.body);

      // GAS Web AppにPOSTリクエストを送信
      const gasResponse = await fetch('https://script.google.com/macros/s/' + process.env.GAS_PROJECT_ID + '/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ method: 'registerEmail', email }),
      });

      const gasText = await gasResponse.text();
      const gasData = JSON.parse(gasText);
      console.log(gasData);

      // GASからの返答をそのまま返す
      res.status(gasResponse.status).json(gasData);
    } catch (error) {
      console.error('Email Registerエラー:', error);
      res.status(500).json({ error: 'Emailの登録に失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}
