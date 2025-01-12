import { User } from "@/types/user";
import { handleApiError } from "./utils";

export async function getUserData(userId: number): Promise<User> {
    const responseUser = await fetch('/api/getUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    await handleApiError(responseUser);
    if(!responseUser.ok){
        throw new Error('ユーザーデータの取得に失敗しました。');
    }
    const {userData} = await responseUser.json();
    return userData;
}