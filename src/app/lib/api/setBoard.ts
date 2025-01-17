import { Board } from "@/types/user";
import { handleApiError } from "./utils";

export const registerBoard = async (userId: number, content: string) => {
    try {
        const response = await fetch('/api/setBoard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId,content  }),
        });

        await handleApiError(response);

        
        return await response.json() as Board;
    } catch (error) {
        console.error('ユーザー作成失敗:', error);
        throw error;
    }
};

export const deleteBoard = async (boardId : number) => {
    try {
        const response = await fetch('/api/deleteBoard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ boardId  }),
        });

        await handleApiError(response);

        
        return await response.json();
    } catch (error) {
        console.error('ユーザー作成失敗:', error);
        throw error;
    }
};