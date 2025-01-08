import { handleApiError } from './utils';

export const getPastSendTransactions = async (userName : string) => {
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
      console.log(data);
      console.log('データ軍');
      return data.sendTransactionDetails;
    } catch (error) {
      console.error('確認失敗:', error);
      throw error;
    }
  };
  

export const getPastReceiveTransactions = async (userName : string) => {
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
      console.log(data);
      console.log('データ軍');
      return data.receiveTransactionDetails;
    } catch (error) {
      console.error('確認失敗:', error);
      throw error;
    }
  };