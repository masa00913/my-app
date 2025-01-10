
import { handleApiError } from './utils';

export const setQRCode = async (codeText: string, userId: number) => {
    try {
    const response = await fetch('/api/setQRCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codeText, userId }),
        });
    await handleApiError(response);
    const clientIp = await response.json();
    return clientIp;
    } catch (error) {
    console.error('IPアドレス取得失敗:', error);
    throw error;
    }
}