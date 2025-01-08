interface Props {
  userName: string;
  recipient: string;
}
import { useEffect,useState } from 'react';
import { getPastSendTransactions,getPastReceiveTransactions } from '@/app/lib/api/sendList';
import styles from '../styles.module.css';

export default function IndividualTransactionHistory({userName,recipient}: Props) {
  const [error, setError] = useState<string | null>(null);
  // const [sendTransactionInfo, setSendTransactionInfo] = useState<{ recipient: string, amount: string, createdAt: string, status: string }[]>([]);

  // const [receiveTransactionInfo, setReceiveTransactionInfo] = useState<{ sender: string, amount: string, createdAt: string, status: string }[]>([]);
  const [combinedTransactions, setCombinedTransactions] = useState<{ recipient: string, amount: string, createdAt: string, status: string, type: string }[]>([]);
  useEffect(() => {
      // 過去の取引データを取得
      if(userName != ''){
        console.log(userName);
        const fetchPastTransactions = async () => {
          try {
            const sendTransactions = await getPastSendTransactions(userName);
            const filteredSendTransactions = sendTransactions.filter((transaction: { recipient: string }) => transaction.recipient === recipient);

            const receiveTransactions = await getPastReceiveTransactions(userName);
            const filteredReceiveTransactions = receiveTransactions.filter((transaction: { sender: string }) => transaction.sender === recipient);

            const combinedTransactions = [
              ...filteredSendTransactions.map((transaction: { recipient: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'send' })),
              ...filteredReceiveTransactions.map((transaction: { sender: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'receive' }))
            ];

            combinedTransactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            setCombinedTransactions(combinedTransactions);
            // setSendTransactionInfo(combinedTransactions.filter(transaction => transaction.type === 'send'));
            // setReceiveTransactionInfo(combinedTransactions.filter(transaction => transaction.type === 'receive'));
          } catch (err) {
            console.error('Failed to fetch past transactions', err);
            setError('Failed to fetch past transactions');
          }
        };
  
        fetchPastTransactions();
      }
    }, [userName]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null); // エラーをリセット

  //   try {
  //   } catch (err: unknown) {
  //     let errorMessage = '交換に失敗しました。';
  //     if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     setError(errorMessage);
  //   }finally{
  //   }
  // };

  return (
    <div>
      {error && <p>{error}</p>}
      
      <div className={styles.container_in}>
      <header className={styles.header}>
        <div className={styles.user_icon}></div>
        <div className={styles.user_name}>{recipient}</div>
      </header>
      <div className={styles.history}>
      {combinedTransactions.map((transaction, index) => (
        <div key={index} className={transaction.type === 'send' ? styles.transaction_unit_send : styles.transaction_unit_receive}>
          <div className={styles.date_label}>{transaction.createdAt}</div>
          <div className={transaction.type === 'send' ? styles.transaction_send : styles.transaction_receive}>
            <div className={styles.amount}>
              <span className={styles.label}>{transaction.type === 'send' ? '送る' : '受け取り'}</span>
              <span className={styles.value}>{transaction.amount}</span>
            </div>
            <a href="#" className={styles.details_link}>詳細を見る</a>
          </div>
          <div className={styles.status}>
            <span className={styles.status_text}>{transaction.type === 'send' ? '友だちが受け取りました' : '受け取りが完了しました'}</span>
          </div>
        </div>
      ))}
      </div>
      <footer className={styles.footer}>
        <button className={styles.send_button} onClick={() => window.location.href = '/send/send_meiji_point'}>送る</button>
        <button className={styles.request_button}>請求</button>
        <input type="text" placeholder="メッセージを入力" className={styles.message_input}></input>
      </footer>
    </div>
    </div>
  );
}