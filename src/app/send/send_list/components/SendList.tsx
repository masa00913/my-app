interface Props{
  userName:string;
}

import { useEffect,useState } from 'react';
import {useRouter} from 'next/navigation';
import { checkUserExists } from '@/app/lib/api/send';
import { getPastSendTransactions } from '@/app/lib/api/sendList';
import styles from '../styles.module.css'

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

      <div className={styles.body}>
        <div className={styles.container_in}>
        <div className={styles.header}>
            <div className={styles.header_left}>
            <button className={styles.back_button} onClick={() => window.location.href = '/home'}>&lt;</button>
            <span className={styles.header_title}>送る・受け取る</span>
            </div>
            <div className={styles.header_right}>
            <button className={styles.header_icon_button}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M32 32C14.3 32 0 46.3 0 64V448c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V384H448v64c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H448V128H64V32zM64 96H448V416H64V96zm352 320h32v32c0 0 0 0 0 0H416c0 0 0 0 0 0V416zM416 96H480V64c0 0 0 0 0 0h-32c0 0 0 0 0 0V96z"/></svg> */}
            </button>
            <button className={styles.header_icon_button}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M96 32V64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32zM64 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128H352v64c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V128H64z"/></svg> */}
            </button>
            </div>
        </div>

        <div className={styles.search_bar_container}>
            <div className={styles.search_bar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.search_icon} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="MeijiPay ID・名前"
                className={styles.search_input}
              />
              <button type="submit" disabled={isSearching}>
                探す
              </button>
              {error && <p>{error}</p>}
              
            </form>
            </div>
        </div>

        <div className={styles.segmented_control}>
            <div className={`${styles.segment_button} ${styles.active}`}>履歴</div>
            <div className={styles.segment_button}>連絡先</div>
            <div className={styles.segment_button}>グループ</div>
        </div>

        <div className={styles.content}>
            {pastRecipients.map((recipient, index) => (
            <div key={index} className={styles.individual_item} onClick={() => ClickRecipient(recipient)}>
            <div className={styles.individual_left}>
            <div className={`${styles.profile_icon} ${styles[`profile_icon_color_${(index % 7) + 1}`]}`}>{recipient.charAt(0)}</div>
            <div className={styles.item_details}>
              <div className={styles.item_name}>{recipient}</div>
              <div className={styles.item_log}>受け取り依頼を送りました</div>
            </div>
            </div>
            <div className={styles.individual_right}>2025/01/01</div>
            </div>
            ))}
        </div>

        <div className={styles.bottom_buttons}>
            <button className={`${styles.bottom_button} ${styles.send_button}`}>
            送る
            </button>
            <button className={`${styles.bottom_button} ${styles.request_button}`}>
            請求
            </button>
        </div>
        </div>
    </div>
    </div>
  );
}