// サインインフォームのコンポーネント
"use client";
import { useState } from 'react';

export default function RegisterForm() {
    // 状態管理
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // サインイン処理
      console.log('サインイン:', name, email, password);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="名前" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">サインイン</button>
      </form>
    );
  }