interface Props {
  name: string;
  balance: number;
}

import { useState } from 'react';

export default function Home({ name, balance }: Props) {
  const [sendUser, setSendUser] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット

    try {
      // ここで通貨交換の処理を実装
      console.log(`ユーザー ${name} が ${sendUser} に通貨を送信しようとしています`);
      // ... APIリクエストなど ...
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div>
      <p>こんにちは、{name}さん！</p>
      <p>現在の通貨: {balance}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="senduser"
          placeholder="送る対象"
          value={sendUser}
          onChange={(e) => setSendUser(e.target.value)}
        />
        <button type="submit">交換</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}