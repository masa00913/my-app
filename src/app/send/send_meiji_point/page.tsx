// app/home/page.tsx
'use client';
import SendMeijiPoint from './components/SendMeijiPoint';
import { useEffect, useState } from 'react';
import { User } from '@/types/user'; // User型のインポート

export default function SendMeijiPointPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  const [recipientName, setRecipientName] = useState<string | null>(null); // 型を明示的に定義
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      setRecipientName(localStorage.getItem('recipientName'));
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser)); // ユーザー情報を取得
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }, []);
  
    if (!userData) {
      return <div>Loading...</div>; // ローディング表示
    }
  
    return <SendMeijiPoint name={userData.name} balance={userData.balance} recipientName={recipientName || ''}/>;
}