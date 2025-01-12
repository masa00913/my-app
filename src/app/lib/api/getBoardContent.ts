import { Board } from "@/types/user";
import { handleApiError } from "./utils";

export const getBoard = async (userId: number) => {
    try {
        console.log("ユーザーID" + userId );
        const response = await fetch('/api/getBoard', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId  }),
        });

        await handleApiError(response);

        const { boards } = await response.json() as { boards: Board[] };
        return boards;
    } catch (error) {
        console.error('ユーザー作成失敗:', error);
        throw error;
    }
};