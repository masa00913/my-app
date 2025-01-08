import React, { useState } from 'react';
import { Scanner, IDetectedBarcode} from '@yudiel/react-qr-scanner';

interface ExchangeResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

export default function PayQRRead() {
  const [error, setError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeResult, setExchangeResult] = useState<ExchangeResponse | null>(null);
  const [scanResult, setScanResult] = useState({ format: '', rawValue: '' });

  // const handleError = useCallback((error: any) => {
  //   console.error(error);
  //   setError('QRコードの読み取りに失敗しました。');
  // }, []);

  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      setScanResult({
        format: results[0].format,
        rawValue: results[0].rawValue,
      });
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
      const response = await fetch('/api/transactionQRCode', { // 例: /api/trasactionQRCode エンドポイント
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: scanResult }),
      });

      const data: ExchangeResponse = await response.json();

      if (response.ok) {
        setExchangeResult(data);
      } else {
        setError(data.message || 'ポイント交換に失敗しました。');
      }
    } catch (err) {
      console.error(err);
      setError('ポイント交換中にエラーが発生しました。');
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <div>
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