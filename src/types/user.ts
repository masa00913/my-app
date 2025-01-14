// TypeScriptの型定義 (例)
export interface User {
    id: number;
    name: string;
    email: string;
    balance: number;
  }

export interface Board {
  userId: number;
  id: number;
  username: string;
  content: string;
  createdAt: Date;
}