// レイアウトコンポーネント（続き）
interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
}