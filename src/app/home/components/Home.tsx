interface Props {
  name: string;
  balance: number;
}

// import { useState } from 'react';
import { createTransaction } from '@/app/lib/api/transaction';
import { getClieentIp } from "@/app/lib/api/ipaddress";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles.module.css';
export default function Home({ name, balance }: Props) {
  // const [recipient, setRecipient] = useState('');
  // const [error, setError] = useState<string | null>(null);
  // const [amount, setAmount] = useState<number>(0);
  // // const [isSending, setIsSending] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null); // エラーをリセット
  //   // setIsSending(true); // 送信中に設定

  //   try {
  //     // ここで通貨交換の処理を実装
  //     console.log(`ユーザー ${name} が ${recipient} に通貨を送信しようとしています`);

  //     // トランザクション作成のAPIリクエストを送信
  //     await createTransaction(name, recipient, amount);
  //     alert('交換成功！');
  //     window.location.reload(); // ページを更新
  //   } catch (err: unknown) {
  //     let errorMessage = '交換に失敗しました。';
  //     if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     setError(errorMessage);
  //   }finally{
  //     // setIsSending(false);
  //   }
  // };

  // const storedUser = localStorage.getItem('user') as User | null;
  // if (!name && storedUser) {
  //   name = storedUser.name;
  //   console.log("name再確認" + name);
  // }
  const [currentBalance, setCurrentBalance] = useState(balance);
  useEffect(() => {
    getClieentIp(name)
      .then((data) => {
        if(data.isLoginBonus){
          createTransaction('MeijiPay', name, 10, "loginBonus")
            .then(() => {
              setCurrentBalance(prev => prev + 10);
              alert('ログインポイントを付与しました');
            });
        }
        else{
          console.log('ログインポイントは付与済みです');
        }
        if(data.isMindBonus){
          createTransaction('MeijiPay', name, 20, "mindBonus")
            .then(() => {
              setCurrentBalance(prev => prev + 20);
              alert('登校ポイントを付与しました');
            });
        }
        else{
          console.log('登校ポイントは付与済みまたはMIND圏外です');
        }
      })
      .catch((err) => console.error(err));
  }, [name]);

  return (
    <div>
      
      <div className={styles.app_container}>
      <header className={styles.app_header}>
        <div className={styles.header_left}>
          
          <Image src="https://placehold.jp/30x30/ddd/fff?text=M" alt="MeijiPay Logo" width={30} height={30} className={styles.meijipay_logo} />
          <span className={styles.meijipay_text}>MeijiPay</span>
        </div>
        <div className={styles.logout_button}>{name}</div>
      </header>

      <div className={styles.balance_card}>
        <div className={styles.balance_header}>
          <span className={styles.balance_title}>MeijiPay残高</span>
          <span className={styles.rank_text}>シルバーランク</span>
        </div>
        <div className={styles.balance_amount}>
          {currentBalance}<span className={styles.yen_text}>pt</span>
        </div>
      </div>

      <div className={styles.action_buttons}>
        <div className={styles.action_button} onClick={() => window.location.href = '/pay/pay_QRread'}>
          <Image src="/home/scan.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>スキャン</span>
        </div>
        <div className={styles.action_button} onClick={() => window.location.href = '/send/send_list'}>
          <Image src="/home/send.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>送る</span>
        </div>
        {/* <div className={styles.action_button}>
          <Image src="/home/points.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>ポイント</span>
        </div> */}
        <div className={styles.action_button} onClick={() => window.location.href = '/transaction-history'}>
          <Image src="/home/transaction-history.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>取引履歴</span>
        </div>
        {/* <div className={styles.action_button}>
          <Image src="/home/charge.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>チャージ</span>
        </div> */}
      </div>

      <div className={styles.stamp_rally_card}>
        <h2 className={styles.card_title}>めいじろうスタンプラリー</h2>
        <div className={styles.stamp_container}>
          <div className={styles.stamp_item}>
            <Image src="https://placehold.jp/50x50/ddd/fff?text=TOKYO" alt="Tokyo Stamp" width={50} height={50} className={styles.stamp_image} />
            <span className={styles.stamp_label}>TOKYO</span>
          </div>
          <div className={styles.stamp_item}>
            <Image src="https://placehold.jp/50x50/ddd/fff?text=HOKKAIDO" alt="Hokkaido Stamp" width={50} height={50} className={styles.stamp_image} />
            <span className={styles.stamp_label}>HOKKAIDO</span>
          </div>
        </div>
      </div>

      <div className={styles.meiji_campus_card}>
        <h2 className={styles.card_title}>明治大学キャンパス</h2>
        <div className={styles.campus_container}>
          <div className={styles.campus_item}>
            <div className={styles.campus_avatar}></div>
            <span className={styles.campus_name}>中野</span>
          </div>
          <div className={styles.campus_item}>
            <div className={styles.campus_avatar}></div>
            <span className={styles.campus_name}>生田</span>
          </div>
          <div className={styles.campus_item}>
            <div className={styles.campus_avatar}></div>
            <span className={styles.campus_name}>駿河台</span>
          </div>
          <div className={styles.campus_item}>
            <div className={styles.campus_avatar}></div>
            <span className={styles.campus_name}>和泉</span>
          </div>
        </div>
      </div>

      <nav className={styles.bottom_navigation}>
        {/* <div className={styles.nav_item}>
          <Image src="/home/home.png" alt="Scan Icon" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>ホーム</span>
        </div>
        <div className={styles.nav_item}>
          <Image src="/home/add-friend.png" alt="Scan Icon" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>近くの友達</span>
        </div> */}
        <div className={`${styles.nav_item} ${styles.active}`} onClick={() => window.location.href = '/pay/pay_QRdisplay'}>
          <div className={styles.pay_icon_container}>
            {/* <Image src="home/pay.png" alt="Scan Icon" width={30} height={30} className={styles.pay_icon} /> */}
          </div>
          <span className={styles.nav_label}>支払う</span>
        </div>
        {/* <div className={styles.nav_item}>
          <Image src="/home/wallet.png" alt="Scan Icon" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>ウォレット</span>
        </div>
        <div className={styles.nav_item}>
            <Image src="/home/account.png" alt="Scan Icon" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>アカウント</span>
        </div> */}
      </nav>
    </div>
    </div>
    
  );
}