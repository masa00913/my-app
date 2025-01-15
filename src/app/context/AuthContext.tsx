import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

type AuthContextProps = {
  isLogin: boolean;
  setLoginTrue: () => void;
  setLoginFalse: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  isLogin: false,
  setLoginTrue: () => {},
  setLoginFalse: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);

  const setLoginTrue = useCallback(() => setIsLogin(true), []);
  const setLoginFalse = useCallback(() => setIsLogin(false), []);

  return (
    <AuthContext.Provider value={{ isLogin, setLoginTrue, setLoginFalse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);