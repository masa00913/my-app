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

export const loginUser = async (email: string, passwordHash: string): Promise<{ token: string }> => { //ログインAPIの例
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: passwordHash }),
        });

        await handleApiError(response);

        const data = await response.json() as { token: string };
        return data;
    } catch (error) {
        console.error('ログイン失敗:', error);
        throw error;
    }
};