import { handleApiError } from './utils';

export const getPastSendTransactions = async (userId : number) => {
    try {
      console.log(userId);
      const response = await fetch(`/api/sendList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        throw new Error('過去の取引の確認に失敗しました。');
      }
  
      await handleApiError(response);

      const data = await response.json();
      return data.sendTransactionDetails;
    } catch (error) {
      console.error('確認失敗:', error);
      throw error;
    }
  };
  

export const getPastReceiveTransactions = async (userId : number) => {
    try {
      const response = await fetch(`/api/sendList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId}),
      });
  
      if (!response.ok) {
        throw new Error('過去の取引の確認に失敗しました。');
      }
  
      await handleApiError(response);

      const data = await response.json();
      return data.receiveTransactionDetails;
    } catch (error) {
      console.error('確認失敗:', error);
      throw error;
    }
  };