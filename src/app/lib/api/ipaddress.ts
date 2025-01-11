import { handleApiError } from './utils';

export const getClieentIp = async (userName: string) => {
  try {
    let isMind = false;
    // IPアドレス取得のAPIリクエストを送信
    const response = await fetch('/api/ipaddress');
    await handleApiError(response);
    const data = await response.json();
    console.log('IPアドレス取得成功:', data.clientIp);
    const ipv4 = data.clientIp.split('.');
    if(ipv4[0] == "133" && ipv4[1] == "26"){
      console.log('IPアドレスはMIND圏内です');
      isMind = true;
    }
    else{
      console.log('IPアドレスはMIND圏外です');
    }

    // 1日1回チェックのAPIリクエストを送信
    const response2 = await fetch(`/api/checkoneday`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName, isMind}),
      });
    await handleApiError(response2);
    const data2 = await response2.json();
    console.log('ログボチェック:', data2.isLoginBonus);
    console.log('Mindチェック:', data2.isMindBonus);

    return data2;
  } catch (error) {
    console.error('IPアドレス取得失敗:', error);
    throw error;
  }
}