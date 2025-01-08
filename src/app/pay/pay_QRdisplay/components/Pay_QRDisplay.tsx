import React, { useState, useEffect, useCallback, useRef } from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import styles from '../styles.module.css';

interface Props {
  userName: string;
  balance: number;
}

export default function PayQRDisplay({ userName , balance }: Props) {
  // ユニークなコードを生成する関数（例：タイムスタンプベース）
  const [qrCodeValue, setQrCodeValue] = useState<string>(''); // 初期値は空文字列
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 初期値は5分（300秒）
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
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <button className={styles.close_button}>×</button>
        <div className={styles.header_title}>支払い</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className={styles.main_content}>
        <div className={styles.payment_container}>
            {/* <div className={styles.barcode}>
            簡単なバーコード表示の例（実際のスキャンには対応していません）
            <div>{barcodeValue}</div>
          </div> */}
          <div className={styles.qr_code}>
            {qrCodeValue && <QRCodeCanvas value={qrCodeValue} size={128} level="H" />}
          </div>
          <div className={styles.time_left}>
            残り時間: {Math.floor(timeLeft / 60)}分{timeLeft % 60}秒
          </div>
          <button className={styles.refresh_button} onClick={handleRefresh}>
            更新
            </button>
          <div className={styles.amount_section}>
            <div className={styles.amount_label}>利用可能額</div>
            <div className={styles.amount_value}>{balance}pt</div>
          </div>
          

          <div className={styles.balance_section}>
            <div className={styles.balance_item}>
              <div className={styles.balance_left}>
                <div className={`${styles.balance_icon} ${styles.wallet}`}></div>
                <div className={styles.balance_info}>
                  <div className={styles.balance_name}>MeijiPay残高</div>
                  <div className={styles.balance_value}>{balance}pt</div>
                </div>
              </div>
              <div className={styles.arrow}>＞</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.scan_button} onClick={() => window.location.href = '/pay/pay_QRread'}>
          <span className={styles.scan_icon}></span>
          スキャンして支払う
        </button>
        
      </div>
    </div>
  );
}
