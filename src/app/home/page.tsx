// ホーム画面のコンポーネント
import Home from './components/Home';
import styles from './styles.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>ホーム</h1>
      <Home name="ユーザー名" />
    </div>
  );
}