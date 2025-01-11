"use client";
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export default function FirstPage() {
    const router = useRouter();

    const handleClick = () => {
      router.push('/auth/msal-home');
    };
  
    return (
      <div className={styles.container}>
        <h1>初期画面</h1>
        <button onClick={handleClick}>認証画面へ</button>
      </div>
    );
}