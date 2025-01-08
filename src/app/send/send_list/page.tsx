// app/home/page.tsx
'use client';
import SendList from './components/SendList';
import { useEffect,useState } from 'react';
import styles from './styles.module.css';
import { User } from '@/types/user'; // User型のインポート

export default function SendListPage() {
  const [userData, setUserData] = useState<User | null>(null); // 型を明示的に定義
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(JSON.parse(parsedUser)); // ユーザー情報を取得
        console.log(userData?.name + "呼び出しあり");
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);
   
  return (
    <div className={styles.container}>
      <SendList userName={userData?.name || ''}/>
    </div>
  );
}