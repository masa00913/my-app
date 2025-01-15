"use client";
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import * as msal from '@azure/msal-browser';
import { msalConfig, loginRequest } from '@/app/auth/msal-home/utils/authConfig'; // Adjust the import path as necessary
import { updateTable } from '@/app/auth/msal-home/utils/ui'; // Adjust the import path as necessary
import { loginUserMsal } from '@/app/lib/api';

const Page = () => {
  const router = useRouter();
  const [hasAccount, setHasAccount] = useState(false);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  const myMSALObj = React.useMemo(() => new msal.PublicClientApplication(msalConfig), []);

  const usernameRef = React.useRef<string>("");

  const selectAccount = React.useCallback(() => {
    const currentAccounts = myMSALObj.getAllAccounts();
    const localAccounts = localStorage.getItem('user');
    console.log('localAccounts:', localAccounts);

    // currentAccountsが存在し、localAccountsが存在しない場合、localAccountsにログイン情報を保存
    if (currentAccounts && currentAccounts.length > 0) {
      if (!localAccounts) {
        const account = currentAccounts[0];
        const preferredUsername = account.idTokenClaims?.preferred_username;
        const name = account.idTokenClaims?.name;
        if (preferredUsername && name) {
          localLogin(preferredUsername, name);
        }
      }
    }

    if (!currentAccounts || !localAccounts) {
      setHasAccount(false); // ログインしてないよ
      return;
    } else if (currentAccounts.length > 1) {
      setHasAccount(true); // ログインしてるよ
      console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
      setHasAccount(true); // ログインしてるよ
      console.log('currentAccounts:', currentAccounts);
      usernameRef.current = currentAccounts[0].username;
      // welcomeUser(currentAccounts[0].username);
      if (currentAccounts[0].idTokenClaims) {
        const stringIdTokenClaims = Object.fromEntries(
          Object.entries(currentAccounts[0].idTokenClaims).map(([key, value]) => [key, String(value)])
        );
        updateTable({ idTokenClaims: stringIdTokenClaims });
      }
    }
  }, [myMSALObj,localLogin]);

  const handleResponse = React.useCallback((response: msal.AuthenticationResult | null) => {
    if (response !== null && response.account !== null) {
      usernameRef.current = response.account.username;
      // welcomeUser(usernameRef.current);
      if (response.account.idTokenClaims) {
        // const stringIdTokenClaims = Object.fromEntries(
        //   Object.entries(response.account.idTokenClaims).map(([key, value]) => [key, String(value)])
        // );
        // updateTable({ idTokenClaims: stringIdTokenClaims });

        const preferredUsername = response.account.idTokenClaims.preferred_username;
        const name = response.account.idTokenClaims.name;
        console.log("preferred_username: " + preferredUsername);
        console.log("name: " + name);

        localLogin(preferredUsername, name); // ローカルストレージにログインする処理
        
      }
    } else {
      selectAccount();
    }
  }, [selectAccount,localLogin]);

  useEffect(() => {
    myMSALObj.handleRedirectPromise()
      .then(handleResponse)
      .catch((error) => {
        console.error(error);
      });
  }, [myMSALObj, handleResponse]);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLogin');
    setIsLogin(loginStatus === 'true');
  }, []);

  if (isLogin === null) {
    // ローカルストレージから取得し終わるまで表示しない
    return null;
  }

  if (isLogin) {
    return (
      <div className={styles.container}>
        <h1>......</h1>
      </div>
    );
  }

  function signIn() {
    myMSALObj.loginRedirect(loginRequest);
    localStorage.setItem('isLogin', 'true');
  }

  // function signOut() {
  //   const logoutRequest = {
  //     account: myMSALObj.getAccountByUsername(usernameRef.current),
  //     postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}`,
  //   };

  //   myMSALObj.logoutRedirect(logoutRequest);
  // }

  function localLogin(preferredUsername: string | undefined, name: string | undefined) {
    fetch('/api/signinMsal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name,
        email: preferredUsername,
      }),
    })
    .then((res) => res.json())
    .then(async (data) => {
      if (preferredUsername && name) {
        console.log('data:', data);
        const userData = await loginUserMsal(preferredUsername, name);
        localStorage.setItem('user', JSON.stringify(userData)); // localStorageにユーザー情報を保存 
        localStorage.removeItem('isLogin');
        router.push('/home');
      } else {
        throw new Error('preferredUsername or name is undefined');
      }
    })
    
    .catch((error) => {
      console.error('Error calling API:', error);
    });
  }

  // ログインしているとき用に、home画面に遷移する
  const handleClick = () => {
    router.push('/home');
  };

  console.log('hasAccount:', hasAccount);

  return (
    <div className={styles.background}>
      <div className={styles.containerBox}>
        <Image src="/home/mainIconHigh.jpg" alt="MeijiPay Logo1" width={512} height={512} className={styles.meijipay_logo} />
        <h1>MeijiPay</h1>
        <p>MeijiPayへようこそ！</p>
        <div className={styles.buttons}>
          <button className={styles.contact_button} onClick={hasAccount ? handleClick : signIn}>{hasAccount ? "ホーム画面へ" : "認証画面へ"}</button>
          <button className={styles.contact_button} onClick={() => window.location.href='https://www.isc.meiji.ac.jp/~ev230543/Meijipay'}>MeijiPayとは</button>
        </div>
        <p>© 2025 MeijiPay All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Page;
