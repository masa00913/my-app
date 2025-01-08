interface Props {
  userName: string;
  recipient: string;
}
import { useEffect,useState } from 'react';
import { getPastSendTransactions,getPastReceiveTransactions } from '@/app/lib/api/sendList';

export default function IndividualTransactionHistory({userName,recipient}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [sendTransactionInfo, setSendTransactionInfo] = useState<{ recipient: string, amount: string, createdAt: string, status: string }[]>([]);

  const [receiveTransactionInfo, setReceiveTransactionInfo] = useState<{ sender: string, amount: string, createdAt: string, status: string }[]>([]);

  useEffect(() => {
      // 過去の取引データを取得
      if(userName != ''){
        console.log(userName);
        const fetchPastTransactions = async () => {
          try {
            const sendTransactions = await getPastSendTransactions(userName);
            const filteredSendTransactions = sendTransactions.filter((transaction: { recipient: string }) => transaction.recipient === recipient);
            setSendTransactionInfo(filteredSendTransactions);

            const receiveTransactions = await getPastReceiveTransactions(userName);
            const filteredReceiveTransactions = receiveTransactions.filter((transaction: { sender: string }) => transaction.sender === recipient);
            setReceiveTransactionInfo(filteredReceiveTransactions);
          } catch (err) {
            console.error('Failed to fetch past transactions', err);
            setError('Failed to fetch past transactions');
          }
        };
  
        fetchPastTransactions();
      }
    }, [userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット

    try {
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }finally{
    }
  };

  return (
    <div>
      <p>{recipient}</p>
      {error && <p>{error}</p>}
      <ul>
        {sendTransactionInfo.map((transaction, index) => (
          <li key={index}>
            send - {transaction.recipient} - {transaction.amount} - {new Date(transaction.createdAt).toLocaleString()} - {transaction.status}
          </li>
        ))}

        {receiveTransactionInfo.map((transaction, index) => (
          <li key={index}>
            receive - {transaction.sender} - {transaction.amount} - {new Date(transaction.createdAt).toLocaleString()} - {transaction.status}
          </li>
        ))}
      </ul>
    </div>
  );
}