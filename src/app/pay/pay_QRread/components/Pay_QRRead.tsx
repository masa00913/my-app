import React, { useState } from 'react';
import { Scanner, IDetectedBarcode} from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';
// import styles from './styles.module.css';

interface ExchangeResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

interface Props{
  userName: string;
}


export default function PayQRRead({userName}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeResult, setExchangeResult] = useState<ExchangeResponse | null>(null);
  const [scanResult, setScanResult] = useState({ format: '', rawValue: '' });
  const [recipientName, setRecipientName] = useState<string>(''); // ユーザーIDを保持するステート
  const router = useRouter();
  

  // const handleError = useCallback((error: any) => {
  //   console.error(error);
  //   setError('QRコードの読み取りに失敗しました。');
  // }, []);

  

  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      const rawValue = results[0].rawValue;
      const parts = rawValue.split('_');
      if (parts.length === 4 && parts[0] === 'payment') {
        const timestamp = parseInt(parts[1], 10);
        const scannedUserName = parts[2];
        const currentTime = Date.now();

        if (currentTime - timestamp <= 5 * 60 * 1000) { // 5分以内
          setRecipientName(scannedUserName);
          setScanResult({
            format: results[0].format,
            rawValue: rawValue,
          });
        } else {
          setError('QRコードの有効期限が切れています。');
        }
      } else {
        setError('無効なQRコードです。');
      }
    }
  };

  const handleExchange = async () => {
    if (!scanResult) {
      setError('QRコードが読み取られていません。');
      return;
    }

    setIsExchanging(true);
    setExchangeResult(null);
    setError(null);

    try {
      // ここでバックエンドのAPIを呼び出してポイント交換を行う
      // scanResult には読み取られたQRコードのデータが入っています
      const responseQR = await fetch('/api/transactionQRCode', { // 例: /api/trasactionQRCode エンドポイント
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: scanResult, fromUser: userName, toUser: recipientName}),
      });

      if(!responseQR.ok){
        setError('ポイント交換に失敗しました。');
        throw new Error('ユーザーの探索に失敗');
      }


      localStorage.setItem('recipientName', recipientName);
      router.push('/send/send_meiji_point');
    } catch (err) {
      console.error(err);
      setError('ポイント交換中にエラーが発生しました。');
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <div>
      <button onClick={() => window.location.href = '/home'}>×</button>
      <h1>QRコードを読み込んでポイント交換</h1>
      
      <div style={{ width: '300px' }}>
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

      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}

      {scanResult && !isExchanging && !exchangeResult && (
        <div>
          <p>読み取り結果: {scanResult.format}</p>
          <p>内容：{scanResult.rawValue}</p>
          <button onClick={handleExchange}>ポイント交換を実行</button>
        </div>
      )}

      {isExchanging && <p>ポイント交換処理中...</p>}

      {exchangeResult && exchangeResult.success && (
        <p style={{ color: 'green' }}>
          交換成功！ {exchangeResult.message} {exchangeResult.newBalance !== undefined ? `新しい残高: ${exchangeResult.newBalance}pt` : ''}
        </p>
      )}

      {exchangeResult && !exchangeResult.success && (
        <p style={{ color: 'red' }}>交換失敗: {exchangeResult.message}</p>
      )}
    </div>
  );
}