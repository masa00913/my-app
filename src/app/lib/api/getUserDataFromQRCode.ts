import { User } from "@/types/user";
import { handleApiError } from "./utils";

export async function getUserDataFromQRCode(codeText: string): Promise<User> {
    const response = await fetch('/api/getUserDataFromQRCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codeText }),
    });

    await handleApiError(response);
    if(!response.ok){
        throw new Error('ユーザーデータの取得に失敗しました。');
    }
    const {userData} = await response.json();
    console.log(JSON.stringify(userData));
    return userData;
}