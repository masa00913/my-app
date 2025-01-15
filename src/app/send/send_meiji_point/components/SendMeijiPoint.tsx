interface Props {
  name: string;
  recipientName: string;
  recipientId: number;
  userId: number;
}
import { useState } from 'react';
import { createTransaction } from '@/app/lib/api/transaction';
import styles from '../styles.module.css';
import { useRouter } from 'next/navigation';
import { getUserData } from '@/app/lib/api/getUserData';

export default function SendMeijiPoint({ name,userId ,recipientName,recipientId}: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true); // 送信中に設定

    try {
      // ここで通貨交換の処理を実装
      console.log(`ユーザー ${name} が ${recipientName} に通貨を送信しようとしています`);

      // トランザクション作成のAPIリクエストを送信
      await createTransaction(userId, recipientId, amount, "transaction");
      const userData =  await getUserData(userId);
      localStorage.setItem('user', JSON.stringify(userData));
      const audio = new Audio('/pay_music/meijiPay_sound.m4a');
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.play();
      });

      alert('交換成功！');
      
      const audio_chance = new Audio('/pay_music/chance.m4a');
      await new Promise<void>((resolve) => {
        audio_chance.onended = () => resolve();
        audio_chance.play();
      });

      router.push('/send/individual_transaction');
    } catch (err: unknown) {
      let errorMessage = '交換に失敗しました。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }finally{
      setIsSending(false);
    }
  };

  const handleNumberClick = (number: number | '00') => {
    setAmount((prevAmount) => {
      if (prevAmount === 0) {
        return number === '00' ? 0 : number;
      }
      return parseInt(`${prevAmount}${number}`);
    });
  };

  const handleDeleteClick = () => {
    setAmount((prevAmount) => {
      const newAmount = Math.floor(prevAmount / 10);
      return newAmount;
    });
  };

  const handleChargeClick = () => {
    setAmount((prevAmount) => {
      const newAmount = Math.floor(prevAmount * 1.1);
      return newAmount;
    });
  }

  const handleACClick = () => {
    setAmount(0);
  }

  return (
    <div className={styles.comp}>

      <div className={styles.header_container}>
      <button className={styles.back_arrow} onClick={() => window.location.href = '/send/individual_transaction'}>＜</button>
      <div className={styles.user_section}>
        <div className={styles.user_avatar}></div>
        <div className={styles.user_text}>
          {recipientName}さんに送る
          <span className={styles.forward_arrow}>＞</span>
        </div>
      </div>
    </div>

    <div className={styles.amount_display}>{amount}pt</div>

    
    <form onSubmit={handleSubmit}>
      <button type="submit" className={styles.next_button} disabled={isSending}>
        {isSending ? '送信中...' : '送る'}
      </button>
      </form>
    <div className={styles.keypad}>
      <div className={styles.keypad_grid}>
        <button className={styles.key} onClick={() => handleNumberClick(1)}>1</button>
        <button className={styles.key} onClick={() => handleNumberClick(2)}>2</button>
        <button className={styles.key} onClick={() => handleNumberClick(3)}>3</button>
        <button className={`${styles.key} ${styles.function} ${styles.calculator}`} ></button>
        
        <button className={styles.key} onClick={() => handleNumberClick(4)}>4</button>
        <button className={styles.key} onClick={() => handleNumberClick(5)}>5</button>
        <button className={styles.key} onClick={() => handleNumberClick(6)}>6</button>
        <button className={`${styles.key} ${styles.function}`} onClick={() => handleACClick()}>AC</button>
        
        <button className={styles.key} onClick={() => handleNumberClick(7)}>7</button>
        <button className={styles.key} onClick={() => handleNumberClick(8)}>8</button>
        <button className={styles.key} onClick={() => handleNumberClick(9)}>9</button>
        <button className={`${styles.key} ${styles.function}`} onClick={() => handleChargeClick()}>+税</button>
        
        <button className={styles.key} onClick={() => handleNumberClick('00')}>00</button>
        <button className={`${styles.key} ${styles.zero}`} onClick={() => handleNumberClick(0)}>0</button>
        <button className={`${styles.key} ${styles.function} ${styles.delete}`} onClick={handleDeleteClick}>⌫</button>
      </div>
    </div>
    </div>
  );
}