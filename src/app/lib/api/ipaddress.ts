import { handleApiError } from './utils';

export const getClieentIp = async () => {
  try {
    const response = await fetch('/api/ipaddress');
    await handleApiError(response);
    const clientIp = await response.json();
    return clientIp;
  } catch (error) {
    console.error('IPアドレス取得失敗:', error);
    throw error;
  }
}