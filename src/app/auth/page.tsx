import styles from './styles.module.css';
import Auth from './components/Auth';

export default function AuthPage() {
  return (
    <div className={styles.container}>
      <h1>認証画面</h1>
      <Auth/>
    </div>
  );
}