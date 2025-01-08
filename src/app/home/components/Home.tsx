interface Props {
  name: string;
  balance: number;
}

// import { useState } from 'react';
// import { createTransaction } from '@/app/lib/api/transaction';
import { getClieentIp } from "@/app/lib/api/ipaddress";
import { useEffect, useState } from 'react';

export default function Home({ name, balance }: Props) {
  // const [recipient, setRecipient] = useState('');
  // const [error, setError] = useState<string | null>(null);
  // const [amount, setAmount] = useState<number>(0);
  // // const [isSending, setIsSending] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null); // エラーをリセット
  //   // setIsSending(true); // 送信中に設定

  //   try {
  //     // ここで通貨交換の処理を実装
  //     console.log(`ユーザー ${name} が ${recipient} に通貨を送信しようとしています`);

  //     // トランザクション作成のAPIリクエストを送信
  //     await createTransaction(name, recipient, amount);
  //     alert('交換成功！');
  //     window.location.reload(); // ページを更新
  //   } catch (err: unknown) {
  //     let errorMessage = '交換に失敗しました。';
  //     if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     setError(errorMessage);
  //   }finally{
  //     // setIsSending(false);
  //   }
  // };

  const [ip, setIp] = useState('');

  useEffect(() => {
    getClieentIp()
      .then((data) => setIp(data.clientIp))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <p>こんにちは、{name}さん！</p>
      <p>現在の通貨: {balance}</p>
      <p>IPアドレス: {ip}</p>

      <button onClick={() => window.location.href = '/send/send_list'}>送る</button>
      <button onClick={() => window.location.href = '/pay/pay_QRdisplay'}>支払う</button>
      <button onClick={() => window.location.href = '/pay/pay_QRread'}>スキャン</button>
    </div>
  );
}