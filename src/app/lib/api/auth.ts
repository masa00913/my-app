import { handleApiError } from './utils';
import { User } from '@/types/user'; // User型をインポート

export const registerUser = async (username: string, email: string, passwordHash: string): Promise<User> => {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, email, password: passwordHash }),
        });

        await handleApiError(response);

        const newUser = await response.json() as User;
        return newUser;
    } catch (error) {
        console.error('ユーザー作成失敗:', error);
        throw error;
    }
};

export async function loginUser(email: string, password: string): Promise<User> {
    // ログイン処理を実装
    // 例: APIリクエストを送信して、認証を行う
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('ログインに失敗しました。');
    }
    const { userData } = await response.json();
    return userData;
  }