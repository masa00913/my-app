// app/home/page.tsx
'use client';
import PayQRDisplay from './components/Pay_QRDisplay';
import styles from './styles.module.css';
import { useEffect,useState } from 'react';
import { User } from '@/types/user';

export default function PayQRDisplayPage() {
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
            {/* <h1>QRコードの表示</h1> */}
            <PayQRDisplay balance={userData?.balance ?? 0}/>
        </div>
    );
}
