// ホーム画面のコンポーネント
import WelcomeMessage from './components/WelcomeMessage';
import styles from './styles.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>ホーム</h1>
      <WelcomeMessage name="ユーザー名" />
    </div>
  );
}