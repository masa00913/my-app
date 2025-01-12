import { User } from '@/types/user';
import { handleApiError } from './utils';

export const checkUserExists = async (recipient: string): Promise<User> => {
    try {
      console.log(recipient + "を確認します");
      const response = await fetch(`/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientName: recipient }),
      });
  
      if (!response.ok) {
        throw new Error('ユーザーの確認に失敗しました。');
      }
  
      await handleApiError(response);

      const data = await response.json() as User;
      console.log("send.tsない" + data);
      return data;
    } catch (error) {
      console.error('ユーザー確認失敗:', error);
      throw error;
    }
  };
  