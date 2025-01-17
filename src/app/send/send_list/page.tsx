// app/home/page.tsx
'use client';
import SendList from './components/SendList';
import { useEffect,useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user'; // User型のインポート

export default function SendListPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log(user);
    if (!user) {
      window.location.href = '/';
    }
  }, []);

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
   
  return (
    <div className={styles.container}>
      <SendList userName={userData?.name || ''} userId={userData?.id ?? 0}/>
    </div>
  );
}