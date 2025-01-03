// ログインフォームのコンポーネント
"use client";
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ログイン処理
    console.log('ログイン:', email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">ログイン</button>
    </form>
  );
}