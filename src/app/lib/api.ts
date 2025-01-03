// APIクライアント (例)
export const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // エラーを上位に伝播
    }
  };
  
  // 他のAPI関連の関数もここに追加