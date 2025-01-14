// app/home/page.tsx
'use client';
import SendMeijiPoint from './components/SendMeijiPoint';
import { useEffect, useState } from 'react';
import { User } from '@/types/user'; // User型のインポート
import styles from './styles.module.css';

export default function SendMeijiPointPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  // const [recipientName, setRecipientName] = useState<string | null>(null); // 型を明示的に定義
  const [recipient,setRecipient] = useState<User>();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log(user);
    if (!user) {
      window.location.href = '/';
    }
  }, []);
  
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const storedRecipient = localStorage.getItem('recipient');
      if (storedUser && storedRecipient) {
        try {
          setUserData(JSON.parse(storedUser)); // ユーザー情報を取得
          setRecipient(JSON.parse(storedRecipient));
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }, []);
  
    if (!userData) {
      return <div>Loading...</div>; // ローディング表示
    }
  
    return (
      <div className={styles.container}>
          <SendMeijiPoint name={userData.name} userId={userData.id} recipientName={recipient?.name || ''} recipientId={recipient?.id ?? 0}/>
      </div>
    );
}