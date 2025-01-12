import React, { useState, useEffect, useCallback, useRef } from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import styles from '../styles.module.css';
import { setQRCode } from '@/app/lib/api/setQRCode';

interface Props {
  userName: string;
  userId: number;
  balance: number;
}

export default function PayQRDisplay({ userId,balance }: Props) {
  // ユニークなコードを生成する関数（例：タイムスタンプベース）
  const [qrCodeValue, setQrCodeValue] = useState<string>(''); // 初期値は空文字列
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 初期値は5分（300秒）
  const intervalRef = useRef<number | null>(null); // intervalId を保持するための ref
  const countdownRef = useRef<number | null>(null); // countdown intervalId を保持するための ref

  // ユニークなコードを生成する関数（例：タイムスタンプベース）
  const generateUniqueCode = useCallback(() => {
    const codeText = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    setQRCode(codeText, userId);
    
    return codeText;
  }, [userId]);

  const initialCodeGenerated = useRef(false);

  useEffect(() => {
    if (!initialCodeGenerated.current) {
      const initialCode = generateUniqueCode();
      setQrCodeValue(initialCode);
      initialCodeGenerated.current = true;
    }

    // 5分ごとにQRコードとバーコードを更新する処理
    intervalRef.current = window.setInterval(() => {
      const newCode = generateUniqueCode();
      setQrCodeValue(newCode);
      setTimeLeft(5 * 60); // QRコード更新時に残り時間をリセット
    }, 5 * 60 * 1000); // 5分

    countdownRef.current = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
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

  // 手動でQRコードとバーコードを更新する関数
  const handleRefresh = () => {
    const newCode = generateUniqueCode();
    setQrCodeValue(newCode);
    setTimeLeft(5 * 60); // QRコード更新時に残り時間をリセット
  };

  return (
    <div className={styles.body}>
      <div className={styles.container_inner}>
        <div className={styles.header}>
          <button className={styles.close_button} onClick={() => window.location.href = '/home'} />
          <span className={styles.title}>支払い</span>
        </div>
        <div className={styles.content_area}>
            <div className={styles.payment_container}>
              <div className={styles.qr_code}>
                {qrCodeValue && <QRCodeCanvas value={qrCodeValue} size={128} level="H" />}
              </div>
                <div className={styles.time_left}>
                残り時間: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              <button className={styles.refresh_button} onClick={handleRefresh}>
                更新
              </button>
            </div>
          <div className={styles.available_amount_area}>
        <span className={styles.available_text}>利用可能額</span>
        <span className={styles.amount}>{balance}pt</span>
          </div>
          <div className={styles.point_info_area}>
        <div className={styles.meijipay_point}>
          <div className={styles.point_left}>
            <div className={styles.point_icon} />
            <span className={styles.point_name}>MeijiPayポイント</span>
            <span className={styles.point_value}>{balance}pt</span>
          </div>
          <button className={styles.arrow_button} />
        </div>
        <div className={styles.use_all_points}>
          <span className={styles.use_text}>すべてのポイントを使う</span>
          <button className={styles.change_button}>変更 ＞</button>
        </div>
          </div>
        </div>
        <button className={styles.scan_button} onClick={() => window.location.href = '/pay/pay_QRread'}>
          <div className={styles.scan_icon} />
          <span>スキャンして支払う</span>
        </button>
      </div>
    </div>

  );
}
