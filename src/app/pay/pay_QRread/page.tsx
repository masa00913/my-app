// app/home/page.tsx
'use client';
import PayQRRead from './components/Pay_QRRead';
import styles from './styles.module.css';

export default function PayQRReadPage() {
  return (
    <div className={styles.container}>
      <h1>QRコードの読み込み</h1>
      <PayQRRead />
    </div>
  );
}