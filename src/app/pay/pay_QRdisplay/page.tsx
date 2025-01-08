// app/home/page.tsx
'use client';
import PayQRDisplay from './components/Pay_QRDisplay';
import styles from './styles.module.css';

export default function PayQRDisplayPage() {
    return (
        <div className={styles.container}>
            {/* <h1>QRコードの表示</h1> */}
            <PayQRDisplay />
            <div className={styles.body}>
                <div className={styles.header}>
                    <button className={styles.close_button}>×</button>
                    <div className={styles.header_title}>支払い</div>
                    <div style={{ width: '40px' }}></div>
                </div>

                <div className={styles.main_content}>
                    <div className={styles.payment_container}>
                        <div className={styles.barcode}></div>
                        <div className={styles.qr_code}></div>

                        <div className={styles.amount_section}>
                            <div className={styles.amount_label}>利用可能額</div>
                            <div className={styles.amount_value}>10,000円</div>
                        </div>

                        <div className={styles.balance_section}>
                            <div className={styles.balance_item}>
                                <div className={styles.balance_left}>
                                    <div className={`${styles.balance_icon} ${styles.wallet}`}></div>
                                    <div className={styles.balance_info}>
                                        <div className={styles.balance_name}>MeijiPay残高</div>
                                        <div className={styles.balance_value}>9,500円</div>
                                    </div>
                                </div>
                                <div className={styles.arrow}>＞</div>
                            </div>

                            <div className={styles.balance_item}>
                                <div className={styles.balance_left}>
                                    <div className={`${styles.balance_icon} ${styles.point}`}></div>
                                    <div className={styles.balance_info}>
                                        <div className={styles.balance_name}>MeijiPayポイント</div>
                                        <div className={styles.balance_value}>500pt</div>
                                    </div>
                                </div>
                                <div className={styles.arrow}>＞</div>
                            </div>
                        </div>

                        <div className={styles.points_use}>
                            <div className={styles.points_use_left}>すべてのポイントを使う</div>
                            <div className={styles.points_use_right}>詳細 ＞</div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.scan_button}>
                        <span className={styles.scan_icon}></span>
                        スキャンして支払う
                    </button>
                </div>
            </div>
        </div>
    );
}
