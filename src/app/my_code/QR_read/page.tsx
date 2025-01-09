// app/home/page.tsx
'use client';
import { useEffect, useState } from 'react';
import QRRead from './components/QRRead';
import styles from './styles.module.css';

export default function PayQRReadPage() {
  const [userName, setUserName] = useState<string>(''); // ユーザー名を保持するステート
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  },[]);
  return (
    <div className={styles.container}>
      <QRRead userName={userName}/>
    </div>
  );
}