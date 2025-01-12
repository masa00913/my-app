interface Props {
  name: string;
  balance: number;
  userId: number;
}

// import { useState } from 'react';
import { createTransaction } from '@/app/lib/api/transaction';
import { getClieentIp } from "@/app/lib/api/ipaddress";
import Image from 'next/image';
import styles from '../styles.module.css';
// import { register } from 'module';
import { registerBoard } from '@/app/lib/api/setBoard';
import { getBoard } from '@/app/lib/api/getBoardContent';
import { Board } from '@/types/user';
import { useEffect, useState, useRef } from 'react';
// ...existing code...

export default function Home({ userId, name, balance }: Props) {
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<string[] | undefined>([]);
  const postsContainerRef = useRef<HTMLDivElement>(null);

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

      console.log("ユーザーID" + userId);
      getBoard(userId)
        .then((data) => {
          const boards = data as Board[];
          console.log("boards", boards);
            setPosts(boards.map(board => board.content));
        })
        .catch((err) => console.error(err));
  }, [name,userId]);

  useEffect(() => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    }
  }, [posts]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() === '') return;
    registerBoard(userId, postContent);
    setPosts([...(posts || []), postContent]);
    setPostContent('');
  };

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
          <div className={styles.action_button} onClick={() => window.location.href = '/transaction-history'}>
            <Image src="/home/transaction-history.png" alt="Scan Icon" width={30} height={30} className={styles.action_icon} />
            <span className={styles.action_label}>取引履歴</span>
          </div>
        </div>

        <div className={styles.board_card}>
          <h2 className={styles.card_title}>明治大学掲示板</h2>
          <div className={styles.posts_container} ref={postsContainerRef}>
            {posts && posts.map((post, index) => (
              <div key={index} className={styles.post_item}>{post}</div>
            ))}
          </div>
          <form onSubmit={handlePostSubmit} className={styles.post_form}>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className={styles.post_input}
              placeholder="投稿内容を入力してください"
            />
            <button type="submit" className={styles.post_button}>投稿</button>
          </form>
        </div>

        <nav className={styles.bottom_navigation}>
          <div className={`${styles.nav_item} ${styles.active}`} onClick={() => window.location.href = '/pay/pay_QRdisplay'}>
            <div className={styles.pay_icon_container}></div>
            <span className={styles.nav_label}>支払う</span>
          </div>
        </nav>
      </div>
    </div>
  );
}