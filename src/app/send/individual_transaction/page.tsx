// app/home/page.tsx
'use client';
import IndividualTransactionHistory from './components/IndividualTransactionHistory';
import styles from './styles.module.css';

export default function IndividualTransactionHistoryPage() {
  return (
    <div className={styles.container}>
      <h1>個人間の取引履歴</h1>
      <IndividualTransactionHistory />
    </div>
  );
}