// app/home/page.tsx
'use client';
import SendMeijiPoint from './components/SendMeijiPoint';
import styles from './styles.module.css';

export default function SendMeijiPointPage() {
  return (
    <div className={styles.container}>
      <h1>送金</h1>
      <SendMeijiPoint />
    </div>
  );
}