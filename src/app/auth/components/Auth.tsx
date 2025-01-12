"use client";
// import { useState } from 'react';

export default function Auth() {

  return (
    <div>
        <button onClick={() => window.location.href = '/auth/login'}>ログイン</button>
        <button onClick={() => window.location.href = '/auth/register'}>新規登録</button>
        {/* {error && <p>{error}</p>} */}
    </div>
  );
}