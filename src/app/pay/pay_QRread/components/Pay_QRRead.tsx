import React, { useState } from 'react';
import { Scanner, IDetectedBarcode} from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';
import styles from '../styles.module.css';
import { getUserDataFromQRCode } from '@/app/lib/api/getUserDataFromQRCode';
import { User } from '@/types/user';

interface ExchangeResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

interface Props{
  userName: string;
}

export default function PayQRRead({userName}: Props) {
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeResult, setExchangeResult] = useState<ExchangeResponse | null>(null);
  const [scanResult, setScanResult] = useState({ format: '', rawValue: '' });
  const [recipient, setRecipient] = useState<User>(); // ユーザーIDを保持するステート
  const router = useRouter();
  
  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      const rawValue = results[0].rawValue;
      const parts = rawValue.split('_');
      if (parts.length === 3 && parts[0] === 'payment') {
        const timestamp = parseInt(parts[1], 10);
        const currentTime = Date.now();
        
        if (currentTime - timestamp <= 5 * 60 * 1000) { // 5分以内
          setScanResult({
            format: results[0].format,
            rawValue: rawValue,
          });

          getUserDataFromQRCode(rawValue).then((userData: User) => {
            if(!userData){
              throw new Error('ユーザーデータの取得に失敗しました。');
            }

            if(userData.name == userName){
              throw new Error('自分自身には送信できません。');
            }else{
              setRecipient(userData); // Assuming you want to set the recipient's name
            }
          }).catch((error) => {
            alert('ユーザーデータの取得に失敗しました。' + error);
          });

        } else {
          alert('QRコードの有効期限が切れています。');
        }
      } else {
        alert('無効なQRコードです。');
      }
    }
  };

  const handleExchange = async () => {
    if (!scanResult) {
      alert('QRコードが読み取られていません。');
      return;
    }

    setIsExchanging(true);
    setExchangeResult(null);

    try {
      if(recipient){
        localStorage.setItem('recipient', JSON.stringify(recipient));
        router.push('/send/send_meiji_point');
      }
      
    } catch (err) {
      console.error(err);
      alert('ポイント交換中にエラーが発生しました。');
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container_inner}>
        <div className={styles.header}>
          <button className={styles.close_button} onClick={() => window.location.href = '/home'} />
          <span className={styles.title}>支払い</span>
        </div>
        <div className={styles.scanner_container}>
          <Scanner
            onScan={handleScan}
            formats={[
              'qr_code', // QR コード
              'micro_qr_code', // マイクロ QR
              'rm_qr_code', // rMQR コード
            ]}
            allowMultiple={true} // これを指定すると連続でスキャンできる
          />
        </div>

        {scanResult && !isExchanging && !exchangeResult && (
          <div className={styles.scan_result_container}>
            {/* <div className={styles.scan_result_text}>読み取り結果: {scanResult.format}</div>
            <div className={styles.scan_result_text}>内容：{scanResult.rawValue}</div> */}
            <button className={styles.exchange_button} onClick={handleExchange} disabled={recipient?.name==''}>ポイント交換を実行</button>
          </div>
        )}

        {isExchanging && <div className={styles.exchanging_message}>ポイント交換処理中...</div>}

        {exchangeResult && exchangeResult.success && (
          <div className={styles.success_message}>
            交換成功！ {exchangeResult.message} {exchangeResult.newBalance !== undefined ? `新しい残高: ${exchangeResult.newBalance}pt` : ''}
          </div>
        )}

        {exchangeResult && !exchangeResult.success && (
          <p className={styles.failure_message}>交換失敗: {exchangeResult.message}</p>
        )}

          <div className={styles.bottom_bar}>
            <button className={styles.barcode_button} onClick={() =>  window.location.href = '/pay/pay_QRdisplay'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 5H7V7H5V5ZM5 9H7V11H5V9ZM5 13H7V15H5V13ZM5 17H7V19H5V17ZM17 17H19V19H17V17ZM9 5H11V11H9V5ZM13 5H15V11H13V5ZM17 5H19V11H17V5ZM9 13H15V19H9V13Z" fill="#6750A4"/>
              </svg>
              <span className={styles.barcode_text}>QRコードを表示する</span>
            </button>
          </div>
      </div>
    </div>
  );
}