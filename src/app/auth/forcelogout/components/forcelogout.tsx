import React, { useEffect, useState, useRef } from 'react';
import { Board } from '@/types/user';
import * as msal from '@azure/msal-browser';
import { msalConfig } from '@/app/auth/msal-home/utils/authConfig'; // Adjust the import path as necessary

// export default function ForceLogout({ userId, name, balance }: Props) {
export default function ForceLogout() {
  const myMSALObj = React.useMemo(() => new msal.PublicClientApplication(msalConfig), []);
  const currentAccounts = myMSALObj.getAllAccounts();
  const usernameRef = React.useRef<string>("");
  usernameRef.current = currentAccounts[0].username;
  
  // const [currentBalance, setCurrentBalance] = useState(balance);
  // const [postContent, setPostContent] = useState('');
  const [posts] = useState<Board[] | undefined>([]);
  // const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (postsContainerRef.current) {
    //   postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    // }
    logout();
  }, [posts]);

  const logout = () => {
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(usernameRef.current),
      postLogoutRedirectUri: '/auth/msal-logout',
    };

    myMSALObj.logoutRedirect(logoutRequest);

    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div>
      logging out...
    </div>
  );
}