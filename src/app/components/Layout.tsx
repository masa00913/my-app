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
          <Link href="/">ホーム</Link>
          <Link href="/auth/login">ログイン</Link>
          <Link href="/auth/register">サインイン</Link>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* フッター */}
        <p>&copy; 2023 学内通貨アプリ</p>
      </footer>
    </div>
  );
}