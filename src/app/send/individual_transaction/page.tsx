// app/home/page.tsx
'use client';
import IndividualTransactionHistory from './components/IndividualTransactionHistory';
import { use, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user';
import { set } from 'date-fns';

export default function IndividualTransactionHistoryPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  // const [recipientName, setRecipientName] = useState<string | null>(null); // 型を明示的に定義
  const [recipient,setRecipient] = useState<User | null>(null);
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser)); // ユーザー情報を取得
          console.log("ユーザー情報"+storedUser);
          
          console.log("ユーザー情報"+storedUser);
          
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
          console.log("受取人情報"+storedRecipient);
          console.log("受取人情報"+recipient);
        }catch(error){
          console.error('Failed to parse recipient data:',error);
        }
      }
    }, []);
  
  
  if (!userData || !recipient) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container}>
     
      <IndividualTransactionHistory userName={userData.name} recipient={recipient.name} userId={userData.id} />
    </div>
  );
}