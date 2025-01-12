import { handleApiError } from "./utils";

export const registerBoard = async (userId: number, content: string) => {
    try {
        console.log("ユーザーID" + userId + "content" + content);
        const response = await fetch('/api/setBoard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId,content  }),
        });

        await handleApiError(response);

        
        return await response.json();
    } catch (error) {
        console.error('ユーザー作成失敗:', error);
        throw error;
    }
};