interface Props{
  userName:string;
}

import { useEffect,useState } from 'react';
import {useRouter} from 'next/navigation';
import { checkUserExists } from '@/app/lib/api/send';
import { getPastSendTransactions } from '@/app/lib/api/sendList';

export default function SendList({userName} : Props) {
  const [error, setError] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [pastRecipients, setPastRecipients] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 過去の取引データを取得
    if(userName != ''){
      console.log(userName);
      const fetchPastTransactions = async () => {
        try {
          const transactions: { recipient: string }[] = await getPastSendTransactions(userName);
          const uniqueTransactions = [...new Set(transactions.map((transaction: { recipient: string }) => transaction.recipient))];
          console.log(transactions);
          setPastRecipients(uniqueTransactions);
        } catch (err) {
          console.error('Failed to fetch past transactions', err);
        }
      };

      fetchPastTransactions();
    }
  }, [userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット
    setIsSearching(true);
    try {
      const userExists = await checkUserExists(recipient);
      if (userExists) {
        localStorage.setItem('recipientName', recipient);
        router.push('/send/individual_transaction');
      } else {
        setError('ユーザーが見つかりませんでした。');
      }
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }finally{
      setIsSearching(false);
    }
  };

  const ClickRecipient = async (recipient: string) => {
    setError(null); // エラーをリセット
    setIsSearching(true);
    try {
      const userExists = await checkUserExists(recipient);
      if (userExists) {
        localStorage.setItem('recipientName', recipient);
        router.push('/send/individual_transaction');
      } else {
        setError('ユーザーが見つかりませんでした。');
      }
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }finally{
      setIsSearching(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="送信対象"
        />
        <button type="submit" disabled={isSearching}>
          探す
        </button>
        {error && <p>{error}</p>}
        
      </form>

      {pastRecipients.map((recipient, index) => (
        <button key={index} onClick={() => ClickRecipient(recipient)}>
          {recipient}
        </button>
      ))}

      
    </div>
  );
}