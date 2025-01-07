// src/lib/api/transaction.ts
import { handleApiError } from './utils';

export const createTransaction = async (fromUser: string, toUser: string, amount: number) => {
  try {
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromUser, toUser, amount }),
    });

    await handleApiError(response);

    const transaction = await response.json();
    return transaction;
  } catch (error) {
    console.error('トランザクション作成失敗:', error);
    throw error;
  }

  
};

