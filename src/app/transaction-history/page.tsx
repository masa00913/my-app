// app/home/page.tsx
'use client';
import TransactionHistory from './components/TransactionHistory';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user';

export default function IndividualTransactionHistoryPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  // const [recipientName, setRecipientName] = useState<string | null>(null); // 型を明示的に定義
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      // setRecipientName(localStorage.getItem('recipientName'));
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser)); // ユーザー情報を取得
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }, []);
  
  
  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container}>
      <TransactionHistory userName={userData.name} userId={userData.id}/>
    </div>
  );
}