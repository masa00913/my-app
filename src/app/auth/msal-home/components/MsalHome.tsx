"use client";
// import { loginUser } from '@/app/lib/api';
import React, {  useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as msal from '@azure/msal-browser';
import { msalConfig, loginRequest } from '@/app/auth/msal-home/utils/authConfig'; // Adjust the import path as necessary
import { welcomeUser, updateTable } from '@/app/auth/msal-home/utils/ui'; // Adjust the import path as necessary
import { loginUserMsal } from '@/app/lib/api';

export default function MsalHomeForm() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);

  // Create the main myMSALObj instance
  // configuration parameters are located at authConfig.js
  const myMSALObj = React.useMemo(() => new msal.PublicClientApplication(msalConfig), []);

  const usernameRef = React.useRef<string>("");

  const selectAccount = React.useCallback(() => {
    console.log("情報");
    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts) {
      console.log("情報1");
      return;
    } else if (currentAccounts.length > 1) {
      console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
      usernameRef.current = currentAccounts[0].username;
      console.log("情報2" + currentAccounts + currentAccounts[0].username);
      welcomeUser(currentAccounts[0].username);
      if (currentAccounts[0].idTokenClaims) {
        const stringIdTokenClaims = Object.fromEntries(
          Object.entries(currentAccounts[0].idTokenClaims).map(([key, value]) => [key, String(value)])
        );
        updateTable({ idTokenClaims: stringIdTokenClaims });
      }
    }
  }, [myMSALObj]);

  const handleResponse = React.useCallback((response: msal.AuthenticationResult | null) => {
    console.log("情報11");
    if (response !== null && response.account !== null) {
      usernameRef.current = response.account.username;
      welcomeUser(usernameRef.current);
      if (response.account.idTokenClaims) {
        const stringIdTokenClaims = Object.fromEntries(
          Object.entries(response.account.idTokenClaims).map(([key, value]) => [key, String(value)])
        );
        console.log("情報3" + stringIdTokenClaims);
        updateTable({ idTokenClaims: stringIdTokenClaims });

        const preferredUsername = response.account.idTokenClaims.preferred_username;
        const name = response.account.idTokenClaims.name;
        console.log("preferred_username: " + preferredUsername);
        console.log("name: " + name);

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
            console.log('API response register:', data);
            if (preferredUsername && name) {
              const userData = await loginUserMsal(preferredUsername, name);
              console.log(JSON.stringify(userData));
              localStorage.setItem('user', JSON.stringify(userData)); // localStorageにユーザー情報を保存 
              router.push('/home');
            } else {
              throw new Error('preferredUsername or name is undefined');
            }
          })
          
          .catch((error) => {
            console.error('Error calling API:', error);
          });
      }
    } else {
      selectAccount();
    }
  }, [selectAccount,router]);

  useEffect(() => {
    myMSALObj.handleRedirectPromise()
      .then(handleResponse)
      .catch((error) => {
        console.error(error);
      });
  }, [myMSALObj, handleResponse]);

  function signIn() {
    myMSALObj.loginRedirect(loginRequest);
  }

  function signOut() {
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(usernameRef.current),
      postLogoutRedirectUri: '/signout',
    };

    myMSALObj.logoutRedirect(logoutRequest);
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);
  //   try {
  //     const userData = await loginUser(email, password); // ログイン時にユーザー情報を取得
  //     localStorage.setItem('user', JSON.stringify(userData)); // localStorageにユーザー情報を保存 
  //     await loginUser(email, password);
  //     alert('ログイン成功！');
  //     router.push('/home'); // ログイン成功時にトップページに遷移
  //   } catch (err: unknown) {
  //     let errorMessage = 'ログインに失敗しました。';
  //     if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     setError(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary navbarStyle">
        <button className="navbar-brand" onClick={() => window.location.href = '/'}>初期画面へ</button>
        {/* <a className="navbar-brand" href="/">Microsoft identity platform</a> */}
        <div className="navbar-collapse justify-content-end">
          <button type="button" id="signIn" className="btn btn-secondary" onClick={signIn}>Sign-in</button>
          <button type="button" id="signOut" className="btn btn-success d-none" onClick={signOut}>Sign-out</button>
        </div>
      </nav>
      <br />
      <div className="container">
        <div className="row">
          <br />
          <h5 id="title-div" className="card-header text-center">
            Vanilla JavaScript single-page application secured with MSAL.js
          </h5>
          <br />
          <h5 id="welcome-div" className="card-header text-center d-none"></h5>
          <table id="table-div" className="table table-striped table-bordered d-none">
            <thead id="table-head-div">
              <tr>
                <th>Claim Type</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody id="table-body-div"></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}