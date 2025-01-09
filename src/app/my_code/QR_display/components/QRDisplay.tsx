import React, { useState, useEffect, useCallback, useRef } from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import styles from '../styles.module.css';

interface Props {
  userName: string;
  balance: number;
}

export default function QRDisplay({ userName}: Props) {
  // ユニークなコードを生成する関数（例：タイムスタンプベース）
  const [qrCodeValue, setQrCodeValue] = useState<string>(''); // 初期値は空文字列
  const intervalRef = useRef<number | null>(null); // intervalId を保持するための ref
  const countdownRef = useRef<number | null>(null); // countdown intervalId を保持するための ref

  // ユニークなコードを生成する関数（例：タイムスタンプベース）
  const generateUniqueCode = useCallback(() => {
    return `payment_${Date.now()}_${userName}_${Math.random().toString(36).substring(2, 15)}`;
  }, [userName]);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const initialCode = generateUniqueCode();
    setQrCodeValue(initialCode);

    // 5分ごとにQRコードとバーコードを更新する処理
    intervalRef.current = window.setInterval(() => {
      const newCode = generateUniqueCode();
      setQrCodeValue(newCode);
    }, 5 * 60 * 1000); // 5分

    countdownRef.current = window.setInterval(() => {
    }, 1000); // 1秒ごとに残り時間を更新

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // コンポーネントのアンマウント時にクリア
      }

      if (countdownRef.current) {
        clearInterval(countdownRef.current); // コンポーネントのアンマウント時にクリア
      }
    };
  }, [generateUniqueCode]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.header_container}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.back_icon} onClick={() => window.location.href = '/send/send_list'}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <h1 className={styles.header_title}>マイコード</h1>
        </div>

        <div className={styles.instruction_container}>
          <p>ポイントを受け取るには</p>
          <p>QRコードを相手に読み取ってもらってください</p>
        </div>

        <div className={styles.qr_code_container}>
            <div className={styles.qr_code}>
              {qrCodeValue && <QRCodeCanvas value={qrCodeValue} size={128} level="H" />}
            </div>
          {/* <div className={styles.qr_code_placeholder}></div> */}
          <p className={styles.user_name}>{userName}さん</p>
        </div>

        {/* <button className={styles.share_link_button}>
          LINEの友だちにリンクをシェアする
        </button>

        <div className={styles.copy_link_container}>
          <div className={styles.copy_icon}></div>
          <span className={styles.copy_link_text}>受け取りリンクをコピーする</span>
        </div> */}
      </div>
    </div>

  );
}
