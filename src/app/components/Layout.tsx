// レイアウトコンポーネント（続き）
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <header>
        {/* ヘッダー */}
        <nav>
          <Link href="/home">ホーム</Link>
          <Link href="/auth">認証画面</Link>
          <Link href="/auth/login">ログイン</Link>
          <Link href="/auth/register">サインイン</Link>
          <Link href="/pay/pay_QRdisplay">QRコード表示</Link>
          <Link href="/pay/pay_QRread">QRコード読み込み</Link>
          <Link href="/send/individual_transaction">個人間の取引履歴</Link>
          <Link href="/send/send_list">取引相手一覧</Link>
          <Link href="/send/send_meiji_point">個人間の取引実行</Link>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* フッター */}
        <p>&copy; 2025 学内通貨アプリ</p>
      </footer>
    </div>
  );
}