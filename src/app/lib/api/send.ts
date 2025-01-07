import { handleApiError } from './utils';

export const checkUserExists = async (recipientName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientName }),
      });
  
      if (!response.ok) {
        throw new Error('ユーザーの確認に失敗しました。');
      }
  
      await handleApiError(response);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ユーザー確認失敗:', error);
      throw error;
    }
  };
  