import { handleApiError } from './utils';
import { User } from '@/types/user';

export const getUser = async (userId: string): Promise<User> => {
    try {
        const response = await fetch(`/api/users/${userId}`); // 例: ユーザーIDで取得
        await handleApiError(response);
        const user = await response.json() as User;
        return user;
    } catch (error) {
        console.error('ユーザー情報取得失敗:', error);
        throw error;
    }
};

// 他のユーザー関連API (getUserList, updateUserなど) を追加