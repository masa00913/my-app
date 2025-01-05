interface Props {
  name: string;
  balance: number;
}
import { useState } from 'react';
import { createTransaction } from '@/app/lib/api/transaction';

export default function SendMeijiPoint({ name, balance }: Props) {
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット
    setIsSending(true); // 送信中に設定

    try {
      // ここで通貨交換の処理を実装
      console.log(`ユーザー ${name} が ${recipient} に通貨を送信しようとしています`);

      // トランザクション作成のAPIリクエストを送信
      await createTransaction(name, recipient, amount);
      alert('交換成功！');
      window.location.reload(); // ページを更新
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }finally{
      setIsSending(false);
    }
  };

  return (
    <div>
      <p>こんにちは、{name}さん！</p>
      <p>現在の通貨: {balance}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="recipient"
          placeholder="送る対象"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input type="amount"
        placeholder='送る金額'
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))} 
        />

        <button type="submit" disabled={isSending}>交換</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}