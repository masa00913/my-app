// src/lib/api/transaction.ts
import { handleApiError } from './utils';

export const createTransaction = async (fromUserId: number, toUserId: number, amount: number, attribute: string) => {
  try {
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromUserId, toUserId, amount , attribute}),
    });

    await handleApiError(response);

    const transaction = await response.json();
    return transaction;
  } catch (error) {
    console.error('トランザクション作成失敗:', error);
    throw error;
  }

  
};

