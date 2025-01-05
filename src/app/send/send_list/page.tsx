// app/home/page.tsx
'use client';
import SendList from './components/SendList';
import styles from './styles.module.css';

export default function SendListPage() {
  return (
    <div className={styles.container}>
      <h1>送金一覧</h1>
      <SendList />
    </div>
  );
}