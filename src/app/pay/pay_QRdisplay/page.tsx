// app/home/page.tsx
'use client';
import PayQRDisplay from './components/Pay_QRDisplay';
import styles from './styles.module.css';

export default function PayQRDisplayPage() {
  return (
    <div className={styles.container}>
      <h1>QRコードの表示</h1>
      <PayQRDisplay />
      <div className="header">
          <button className="close-button">×</button>
          <div className="header-title">支払い</div>
          <div style={{ width: '40px' }}></div>
      </div>

      <div className="main-content">
          <div className="payment-container">
              <div className="barcode"></div>
              <div className="qr-code"></div>

              <div className="amount-section">
                  <div className="amount-label">利用可能額</div>
                  <div className="amount-value">10,000円</div>
              </div>

              <div className="balance-section">
                  <div className="balance-item">
                      <div className="balance-left">
                          <div className="balance-icon wallet"></div>
                          <div className="balance-info">
                              <div className="balance-name">MeijiPay残高</div>
                              <div className="balance-value">9,500円</div>
                          </div>
                      </div>
                      <div className="arrow">＞</div>
                  </div>

                  <div className="balance-item">
                      <div className="balance-left">
                          <div className="balance-icon point"></div>
                          <div className="balance-info">
                              <div className="balance-name">MeijiPayポイント</div>
                              <div className="balance-value">500pt</div>
                          </div>
                      </div>
                      <div className="arrow">＞</div>
                  </div>
              </div>

              <div className="points-use">
                  <div className="points-use-left">すべてのポイントを使う</div>
                  <div className="points-use-right">詳細 ＞</div>
              </div>
          </div>
      </div>

      <div className="footer">
          <button className="scan-button">
              <span className="scan-icon"></span>
              スキャンして支払う
          </button>
      </div>
    </div>
    
  );
}