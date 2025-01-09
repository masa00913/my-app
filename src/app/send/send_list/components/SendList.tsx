interface Props{
  userName:string;
}

import { useEffect,useState } from 'react';
import {useRouter} from 'next/navigation';
import { checkUserExists } from '@/app/lib/api/send';
import {getPastSendTransactions,getPastReceiveTransactions } from '@/app/lib/api/sendList';
import Image from 'next/image';
import styles from '../styles.module.css'

export default function SendList({userName} : Props) {
  const [error, setError] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [recipientsWithLatest, setRecipientsWithLatest] = useState<{ recipient: string, latestDate: string }[]>([]);
  const router = useRouter();


  useEffect(() => {
    // 過去の取引データを取得
    if(userName != ''){
      console.log(userName + "呼び出し");
      const fetchPastTransactions = async () => {
        try {
          const sendTransactions = await getPastSendTransactions(userName);

          const receiveTransactions = await getPastReceiveTransactions(userName);
          const combinedTransactions = [
            ...sendTransactions.map((transaction: { recipient: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'send' })),
            ...receiveTransactions.map((transaction: { sender: string, amount: string, createdAt: string, status: string }) => ({ ...transaction, type: 'receive' }))
          ];

          console.log(combinedTransactions);

          combinedTransactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            const uniqueRecipients = [...new Set(combinedTransactions.map(transaction => transaction.type === 'send' ? transaction.recipient : transaction.sender))];
            const latestTransactions = uniqueRecipients.map(recipient => {
            const recipientTransactions = combinedTransactions.filter(transaction => (transaction.type === 'send' ? transaction.recipient : transaction.sender) === recipient);
            recipientTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return { recipient, latestDate: recipientTransactions[0].createdAt };
            });
          console.log(uniqueRecipients);
          console.log(latestTransactions);
          setRecipientsWithLatest(latestTransactions);

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
    }
  };

  const ClickRecipient = async (recipient: string) => {
    setError(null); // エラーをリセット
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
    }
  };

  return (
      <div className={styles.body}>
        <div className={styles.container_in}>
        <div className={styles.header}>
            <div className={styles.header_left}>
            <button className={styles.back_button} onClick={() => window.location.href = '/home'}>&lt;</button>
            <span className={styles.header_title}>送る・受け取る</span>
            </div>
            <div className={styles.header_right}>
            <button className={styles.header_icon_button} onClick={() => window.location.href = '/my_code/QR_display'}>
              <Image src="/send/qrcode.png" alt="qrCode" width={25} height={25}className={styles.header_icon}/>
            </button>
            <button className={styles.header_icon_button} onClick={() => window.location.href = '/my_code/QR_read'}>
              <Image src="/send/scan.png" alt="qrCode" width={25} height={25} className={styles.header_icon}/>
            </button>
            </div>
        </div>

        <div className={styles.search_bar_container}>
            <div className={styles.search_bar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.search_icon} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <form className={styles.search_bar_text} onSubmit={handleSubmit}>
              <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="MeijiPay ID・名前"
              className={styles.search_input}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                handleSubmit(e);
                }
              }}
              />
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
            {recipientsWithLatest.map((recipientInfo, index) => (
            <div key={index} className={styles.individual_item} onClick={() => ClickRecipient(recipientInfo.recipient)}>
            <div className={styles.individual_left}>
            <div className={`${styles.profile_icon} ${styles[`profile_icon_color_${(index % 7) + 1}`]}`}>{recipientInfo.recipient.charAt(0)}</div>
            <div className={styles.item_details}>
              <div className={styles.item_name}>{recipientInfo.recipient}</div>
              <div className={styles.item_log}>受け取り依頼を送りました</div>
            </div>
            </div>
            <div className={styles.individual_right}>{recipientInfo.latestDate}</div>
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
  );
}