interface Props {
  name: string;
  balance: number;
}

// import { useState } from 'react';
// import { createTransaction } from '@/app/lib/api/transaction';
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

  const [ip, setIp] = useState('');

  useEffect(() => {
    getClieentIp()
      .then((data) => setIp(data.clientIp))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      
      <div className={styles.app_container}>
      <header className={styles.app_header}>
        <div className={styles.header_left}>
          <Image src="https://placehold.jp/30x30/ddd/fff?text=M" alt="MeijiPay Logo" width={30} height={30} className={styles.meijipay_logo} />
          <span className={styles.meijipay_text}>MeijiPay</span>
        </div>
        <button className={styles.logout_button}>{name}</button>
      </header>

      <div className={styles.balance_card}>
        <div className={styles.balance_header}>
          <span className={styles.balance_title}>MeijiPay残高</span>
          <span className={styles.rank_text}>シルバーランク</span>
        </div>
        <div className={styles.balance_amount}>
          {balance}<span className={styles.yen_text}>pt</span>
        </div>
      </div>

      <div className={styles.action_buttons}>
        <div className={styles.action_button} onClick={() => window.location.href = '/pay/pay_QRread'}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3" alt="Scan" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>スキャン</span>
        </div>
        <div className={styles.action_button} onClick={() => window.location.href = '/send/send_list'}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E9%80%81%E3%82%8B" alt="Send" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>送る</span>
        </div>
        <div className={styles.action_button}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88" alt="Points" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>ポイント</span>
        </div>
        <div className={styles.action_button}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E5%8F%96%E5%BC%95%E5%B1%A5%E6%AD%B4" alt="History" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>取引履歴</span>
        </div>
        <div className={styles.action_button}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E3%83%81%E3%83%A3%E3%83%BC%E3%82%B8" alt="Charge" width={30} height={30} className={styles.action_icon} />
          <span className={styles.action_label}>チャージ</span>
        </div>
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

      <div className={styles.frequent_friends_card}>
        <h2 className={styles.card_title}>よく取り引きする友達</h2>
        <div className={styles.friends_container}>
          <div className={styles.friend_item}>
            <div className={styles.friend_avatar}></div>
            <span className={styles.friend_name}>渡邊</span>
          </div>
          <div className={styles.friend_item}>
            <div className={styles.friend_avatar}></div>
            <span className={styles.friend_name}>青木</span>
          </div>
          <div className={styles.friend_item}>
            <div className={styles.friend_avatar}></div>
            <span className={styles.friend_name}>赤城</span>
          </div>
          <div className={styles.friend_item}>
            <div className={styles.friend_avatar}></div>
            <span className={styles.friend_name}>和田</span>
          </div>
        </div>
      </div>

      <nav className={styles.bottom_navigation}>
        <div className={styles.nav_item}>
          <Image src="https://placehold.jp/30x30/7e3af2/fff?text=%E3%83%9B%E3%83%BC%E3%83%A0" alt="Home" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>ホーム</span>
        </div>
        <div className={styles.nav_item}>
          <Image src="https://placehold.jp/30x30/ddd/fff?text=%E8%BF%91%E3%81%8F%E3%81%AE%E5%8F%8B%E9%81%94" alt="Nearby Friends" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>近くの友達</span>
        </div>
        <div className={`${styles.nav_item} ${styles.active}`} onClick={() => window.location.href = '/pay/pay_QRdisplay'}>
          <div className={styles.pay_icon_container}>
            <Image src="https://placehold.jp/40x40/fff/7e3af2?text=%E6%94%AF%E6%89%95%E3%81%86" alt="Pay" width={40} height={40} className={styles.pay_icon} />
          </div>
          <span className={styles.nav_label}>支払う</span>
        </div>
        <div className={styles.nav_item}>
          <Image src="https://placehold.jp/30x30/ddd/fff?text=%E3%82%A6%E3%82%A9%E3%83%AC%E3%83%83%E3%83%88" alt="Wallet" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>ウォレット</span>
        </div>
        <div className={styles.nav_item}>
          <Image src="https://placehold.jp/30x30/ddd/fff?text=%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88" alt="Account" width={30} height={30} className={styles.nav_icon} />
          <span className={styles.nav_label}>アカウント</span>
        </div>
      </nav>
    </div>

      <p>IPアドレス: {ip}</p>
    </div>
    
  );
}