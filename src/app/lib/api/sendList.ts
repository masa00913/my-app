import { handleApiError } from './utils';

export const getPastTransactions = async (userName : string): Promise<string[]> => {
    try {
      const response = await fetch(`/api/sendList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName}),
      });
  
      if (!response.ok) {
        throw new Error('過去の取引の確認に失敗しました。');
      }
  
      await handleApiError(response);

      const data = await response.json();
      return data.partnerNames;
    } catch (error) {
      console.error('確認失敗:', error);
      throw error;
    }
  };
  