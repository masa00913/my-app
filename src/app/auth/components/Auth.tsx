"use client";
// import { useState } from 'react';

export default function Auth() {
  // const [error, setError] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null); // エラーをリセット

  //   try {
  //   } catch (err: unknown) {
  //     let errorMessage = '交換に失敗しました。';
  //     if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     setError(errorMessage);
  //   }finally{
  //   }
  // };

  return (
    <div>
        <button onClick={() => window.location.href = '/auth/login'}>ログイン</button>
        <button onClick={() => window.location.href = '/auth/register'}>新規登録</button>
        {/* {error && <p>{error}</p>} */}
    </div>
  );
}