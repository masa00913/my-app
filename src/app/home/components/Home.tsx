// ウェルカムメッセージのコンポーネント
interface Props {
  name: string;
}

export default function Home({ name }: Props) {
  return <p>こんにちは、{name}さん！</p>;
}