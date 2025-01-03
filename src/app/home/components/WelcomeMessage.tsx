// ウェルカムメッセージのコンポーネント
interface Props {
  name: string;
}

export default function WelcomeMessage({ name }: Props) {
  return <p>こんにちは、{name}さん！</p>;
}