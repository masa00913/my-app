// src/app/lib/api/utils.ts
export const handleApiError = async (response: Response) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (jsonError) {
            // JSONパースに失敗した場合のフォールバック
            console.error('JSONパースエラー:', jsonError);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
};

// 必要に応じて他のAPI共通ユーティリティ関数を追加