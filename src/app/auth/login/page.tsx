// ログインページのコンポーネント
import LoginForm from './components/LoginForm';
import styles from './styles.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1>ログイン</h1>
      <LoginForm />
    </div>
  );
}