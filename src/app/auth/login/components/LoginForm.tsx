"use client";
import { loginUser } from '@/app/lib/api';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try{
      const userData = await loginUser(email, password); // ログイン時にユーザー情報を取得
      console.log(JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData)); // localStorageにユーザー情報を保存 
      await loginUser(email, password);
      alert('ログイン成功！');
      router.push('/home'); // ログイン成功時にトップページに遷移
    }catch(err: unknown){
      let errorMessage = 'ログインに失敗しました。';
      if(err instanceof Error){
        errorMessage = err.message;
      }
      setError(errorMessage);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>ログイン</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}