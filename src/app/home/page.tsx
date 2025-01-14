// app/home/page.tsx
'use client';
import Home from './components/Home';
import { useEffect, useState } from 'react';
import { User } from '@/types/user'; // User型のインポート
import { getUserData } from '../lib/api/getUserData';

export default function HomePage() {
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

  // 2. userData が更新されたあとに API 呼び出しを行う
  useEffect(() => {
    if (!userData) return;
  
    getUserData(userData.id)
      .then((data) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (JSON.stringify(parsedUser) !== JSON.stringify(data)) {
            localStorage.setItem('user', JSON.stringify(data));
            setUserData(data);
          }
        } else {
          localStorage.setItem('user', JSON.stringify(data));
          setUserData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>; // ローディング表示
  }

  return <Home key={userData.balance} userId={Number(userData.id)} name={userData.name} balance={userData.balance} />;
}