"use client";
import { useState } from 'react';
import { registerUser } from '@/app/lib/api/auth';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット

    try {
      await registerUser(username, email, passwordHash);
      alert('登録成功！');
      setUsername('');
      setEmail('');
      setPasswordHash('');
    } catch (err: unknown) { // 型をunknownに変更
      if (err instanceof Error) {
        setError(err.message || '登録に失敗しました。');
      } else {
        setError('登録に失敗しました。');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="名前"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={passwordHash}
        onChange={(e) => setPasswordHash(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">登録</button>
    </form>
  );
}