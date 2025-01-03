// サインイン（登録）ページのコンポーネント
import RegisterForm from './components/RegisterForm';
import styles from './styles.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <h1>サインイン</h1>
      <RegisterForm />
    </div>
  );
}