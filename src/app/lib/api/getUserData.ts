import { User } from "@/types/user";
import { handleApiError } from "./utils";

export async function getUserData(name: string): Promise<User> {
    const responseUser = await fetch('/api/getUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    await handleApiError(responseUser);
    if(!responseUser.ok){
        throw new Error('ユーザーデータの取得に失敗しました。');
    }
    const {userData} = await responseUser.json();
    console.log(JSON.stringify(userData));
    return userData;
}