// 認証関連のユーティリティ関数
export const isValidEmail = (email: string) => {
    // メールアドレスのバリデーション
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // 他のユーティリティ関数もここに追加