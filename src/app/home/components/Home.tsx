import React, { useEffect, useState, useRef } from 'react';
import { createTransaction } from '@/app/lib/api/transaction';
import { getClieentIp } from "@/app/lib/api/ipaddress";
import Image from 'next/image';
import styles from '../styles.module.css';
import { registerBoard, deleteBoard } from '@/app/lib/api/setBoard'; // deleteBoardをインポート
import { getBoard } from '@/app/lib/api/getBoardContent';
import { Board } from '@/types/user';
import * as msal from '@azure/msal-browser';
import { msalConfig } from '@/app/auth/msal-home/utils/authConfig'; // Adjust the import path as necessary

interface Props {
  name: string;
  balance: number;
  userId: number;
}

export default function Home({ userId, name, balance }: Props) {
  const myMSALObj = React.useMemo(() => new msal.PublicClientApplication(msalConfig), []);
  const currentAccounts = myMSALObj.getAllAccounts();
  const usernameRef = React.useRef<string>("");
  usernameRef.current = currentAccounts[0].username;
  
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Board[] | undefined>([]);
  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getClieentIp(userId)
      .then((data) => {
        if(data.isLoginBonus){
          createTransaction(0, userId, 10, "loginBonus")
            .then(() => {
              setCurrentBalance(prev => prev + 10);
              alert('ログインポイントを付与しました');
            });
        }
        else{
          console.log('ログインポイントは付与済みです');
        }
        if(data.isMindBonus){
          createTransaction(0, userId, 20, "mindBonus")
            .then(() => {
              setCurrentBalance(prev => prev + 20);
              alert('登校ポイントを付与しました');
            });
        }
        else{
          console.log('登校ポイントは付与済みまたはMIND圏外です');
        }
      })
      .catch((err) => {
        console.error(err);
        // alert('エラーが発生しました: ' + err.message);
      });

      getBoard(userId)
        .then((data) => {
          const boards = data as Board[];
            setPosts(boards.map(boards => boards));
        })
        .catch((err) => {
          console.error(err);
          // alert('掲示板データの取得に失敗しました: ' + err.message);
        });
  }, [name,userId]);

  useEffect(() => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    }
  }, [posts]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() === '') return;
    try {
      const board = await registerBoard(userId, postContent);
      setPosts(prevPosts => [...(prevPosts || []), board]);
      setPostContent('');
    } catch (error) {
      console.error(error);
      // alert('投稿に失敗しました: ' + error);
    }
  };

  const handlePostDelete = async (postId: number) => {
    try {
      await deleteBoard(postId);
      setPosts(prevPosts => prevPosts?.filter(post => post.id !== postId));
    } catch (error) {
      console.error(error);
      // alert('投稿の削除に失敗しました: ' + error);
    }
  };

  const logout = () => {
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(usernameRef.current),
      postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}`,
    };

    myMSALObj.logoutRedirect(logoutRequest);

    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div>
      <div className={styles.app_container}>
        <header className={styles.app_header}>
          <div className={styles.header_left}>
            <Image src="/home/mainIconHigh.jpg" alt="MeijiPay Logo1" width={512} height={512} className={styles.meijipay_logo} />
            <span className={styles.meijipay_text}>MeijiPay</span>
          </div>
          <div className={styles.logout_button} onClick={logout}>ログアウト</div>
        </header>

        <div className={styles.balance_card}>
          <div className={styles.balance_header}>
            <span className={styles.balance_title}>MeijiPay残高</span>
            <span className={styles.rank_text}>{name}</span>
          </div>
          <div className={styles.balance_amount}>
            {currentBalance}<span className={styles.yen_text}>pt</span>
          </div>
        </div>

        <div className={styles.action_buttons}>
          <div className={styles.action_button} onClick={() => window.location.href = '/pay/pay_QRread'}>
            <Image src="/home/scan.png" alt="Scan Icon" width={60} height={60} className={styles.action_icon} />
            <span className={styles.action_label}>スキャン</span>
          </div>
          <div className={styles.action_button} onClick={() => window.location.href = '/send/send_list'}>
            <Image src="/home/send.png" alt="Scan Icon" width={60} height={60} className={styles.action_icon} />
            <span className={styles.action_label}>送る</span>
          </div>
          <div className={styles.action_button} onClick={() => window.location.href = '/transaction-history'}>
            <Image src="/home/transaction-history.png" alt="Scan Icon" width={60} height={60} className={styles.action_icon} />
            <span className={styles.action_label}>取引履歴</span>
          </div>
        </div>

        <div className={styles.board_card}>
          <h2 className={styles.card_title}>明治大学掲示板</h2>
            <div className={styles.posts_container} ref={postsContainerRef}>
            {posts && posts.map((post, index) => (
              <div key={index} className={styles.post_item}>
              <div className={styles.post_header}>
                <div>
                  <div className={styles.post_date}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleString('ja-JP', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '日付不明'}
                  </div>
                  <div className={styles.post_name}>{post.username}</div>
                </div>
                {post.userId === userId && (
                  <button onClick={() => handlePostDelete(post.id)} className={styles.delete_button}>削除</button>
                )}
              </div>
              <div className={styles.post_content}>{post.content}</div>
              </div>
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
            <div className={styles.pay_icon_container}>
              <Image src="/home/qrcode.png" alt="QR Code Icon" width={60} height={60} className={styles.pay_icon} />
              <span className={styles.pay_text}>支払う</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}