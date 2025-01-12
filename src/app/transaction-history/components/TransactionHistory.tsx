interface Props {
  userName: string;
}
import { useEffect,useState, useRef } from 'react';
import { getPastSendTransactions,getPastReceiveTransactions } from '@/app/lib/api/sendList';
import styles from '../styles.module.css';

export default function TransactionHistory({userName}: Props) {
  const [error, setError] = useState<string | null>(null);
  // const [sendTransactionInfo, setSendTransactionInfo] = useState<{ recipient: string, amount: string, createdAt: string, status: string }[]>([]);

  // const [receiveTransactionInfo, setReceiveTransactionInfo] = useState<{ sender: string, amount: string, createdAt: string, status: string }[]>([]);
  const [combinedTransactions, setCombinedTransactions] = useState<{ recipient: string, amount: string, createdAt: string, status: string, type: string }[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("indi" + userName);
      // 過去の取引データを取得
      if(userName != ''){
        
        const fetchPastTransactions = async () => {
          try {
            const sendTransactions = await getPastSendTransactions(userName);

            const receiveTransactions = await getPastReceiveTransactions(userName);

            const combinedTransactions = [
              ...sendTransactions.map((transaction: { recipient: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'send' })),
              ...receiveTransactions.map((transaction: { sender: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'receive' }))
            ];

            combinedTransactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            setCombinedTransactions(combinedTransactions);
          } catch (err) {
            console.error('Failed to fetch past transactions', err);
            setError('Failed to fetch past transactions');
          }
        };
  
        fetchPastTransactions();
      }
    }, [userName]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [combinedTransactions]);

  return (
    <div className={styles.body}>
      {error && <p>{error}</p>}
      
      <div className={styles.container_in}>
        
      <header className={styles.header}>
      <button className={styles.back_button} onClick={() => window.location.href = '/home'}>&lt;</button>

        <div className={styles.user_icon}></div>
        <div className={styles.user_name}>{userName}</div>
      </header>
      <div className={styles.history} ref={historyRef}>
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
      {/* <footer className={styles.footer}>
        <button className={styles.send_button} onClick={() => window.location.href = '/send/send_meiji_point'}>送る</button>
        <button className={styles.request_button}>請求</button>
        <input type="text" placeholder="メッセージを入力" className={styles.message_input}></input>
      </footer> */}
    </div>
    </div>
  );
}