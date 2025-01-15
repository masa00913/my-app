import React, { useEffect } from 'react';
import * as msal from '@azure/msal-browser';
import { msalConfig } from '@/app/auth/msal-home/utils/authConfig'; // Adjust the import path as necessary

// export default function ForceLogout({ userId, name, balance }: Props) {
export default function ForceLogout() {
  const myMSALObj = React.useMemo(() => new msal.PublicClientApplication(msalConfig), []);
  const currentAccounts = myMSALObj.getAllAccounts();
  const usernameRef = React.useRef<string>("");
  if(currentAccounts[0])usernameRef.current = currentAccounts[0].username;
  else usernameRef.current = '';

  useEffect(() => {
    // if (postsContainerRef.current) {
    //   postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    // }
    if(currentAccounts[0])logout();
  }, []);

  const logout = () => {
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(usernameRef.current),
      postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}`,
    };

    myMSALObj.logoutRedirect(logoutRequest);

    localStorage.setItem('isLogin', 'false');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if(currentAccounts[0]){
    return (
      <div>
        logging out...
      </div>
    ); 
  }else{
    return (
      <div>
        already logged out
      </div>
    );
  }
}