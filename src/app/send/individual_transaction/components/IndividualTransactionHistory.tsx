interface Props {
  userName: string;
  recipient: string;
  userId : number;
}
import { useEffect,useState, useRef } from 'react';
import { getPastSendTransactions,getPastReceiveTransactions } from '@/app/lib/api/sendList';
import styles from '../styles.module.css';

export default function IndividualTransactionHistory({recipient,userId}: Props) {
  // const [sendTransactionInfo, setSendTransactionInfo] = useState<{ recipient: string, amount: string, createdAt: string, status: string }[]>([]);

  // const [receiveTransactionInfo, setReceiveTransactionInfo] = useState<{ sender: string, amount: string, createdAt: string, status: string }[]>([]);
  const [combinedTransactions, setCombinedTransactions] = useState<{ recipient: string, amount: string, createdAt: string, status: string, type: string }[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
      // 過去の取引データを取得
        
        const fetchPastTransactions = async () => {
          try {
            console.log(recipient + "の取引履歴を取得します");
            const sendTransactions = await getPastSendTransactions(userId);
            const filteredSendTransactions = sendTransactions.filter((transaction: { recipient: string }) => transaction.recipient === recipient);

            const receiveTransactions = await getPastReceiveTransactions(userId);
            const filteredReceiveTransactions = receiveTransactions.filter((transaction: { sender: string }) => transaction.sender === recipient);

            const combinedTransactions = [
              ...filteredSendTransactions.map((transaction: { recipient: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'send' })),
              ...filteredReceiveTransactions.map((transaction: { sender: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'receive' }))
            ];

            combinedTransactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            setCombinedTransactions(combinedTransactions);
          } catch (err) {
            console.error('Failed to fetch past transactions', err);
            // alert('取引履歴の取得に失敗しました' + err);
          }
        };
  
        fetchPastTransactions();
      
    }, [recipient,userId]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [combinedTransactions]);

  return (
    <div className={styles.body}>
      
      <div className={styles.container_in}>
        
      <header className={styles.header}>
      <button className={styles.back_button} onClick={() => window.location.href = '/send/send_list'}>&lt;</button>

        <div className={styles.user_icon}></div>
        <div className={styles.user_name}>{recipient}</div>
      </header>
      <div className={styles.history} ref={historyRef}>
      {combinedTransactions.map((transaction, index) => (
        <div key={index} className={transaction.type === 'send' ? styles.transaction_unit_send : styles.transaction_unit_receive}>
          <div className={styles.date_label}>
            {new Date(transaction.createdAt).toLocaleString('ja-JP', {
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </div>
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
      </footer>
    </div>
    </div>
  );
}