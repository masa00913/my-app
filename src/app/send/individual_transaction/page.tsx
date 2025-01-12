// app/home/page.tsx
'use client';
import IndividualTransactionHistory from './components/IndividualTransactionHistory';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user';

export default function IndividualTransactionHistoryPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  // const [recipientName, setRecipientName] = useState<string | null>(null); // 型を明示的に定義
  const [recipient,setRecipient] = useState<User | null>(null);
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser)); // ユーザー情報を取得
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }, []);

    useEffect(() => {
      const storedRecipient = localStorage.getItem('recipient');
      if(storedRecipient){
        try{
          setRecipient(JSON.parse(storedRecipient));
        }catch(error){
          console.error('Failed to parse recipient data:',error);
        }
      }
    }, [recipient]);
  
  
  if (!userData || !recipient) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container}>
     
      <IndividualTransactionHistory userName={userData.name} recipient={recipient.name} userId={userData.id} />
    </div>
  );
}