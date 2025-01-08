// app/home/page.tsx
'use client';
import IndividualTransactionHistory from './components/IndividualTransactionHistory';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user';

export default function IndividualTransactionHistoryPage() {
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
  
  
  return (
    <div className={styles.container}>
      <h1>個人間の取引履歴</h1>
      <IndividualTransactionHistory userName={userData?.name || ''} recipient={recipientName || ''}/>
      <button onClick={() => window.location.href = '/send/send_meiji_point'}>送る</button>
    </div>
  );
}