"use client";
import { loginUser } from '@/app/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try{
      await loginUser(email, password);
      alert('ログイン成功！');
      router.push('/home'); // ログイン成功時にトップページに遷移
    }catch(err: unknown){
      let errorMessage = 'ログインに失敗しました。';
      if(err instanceof Error){
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">ログイン</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}