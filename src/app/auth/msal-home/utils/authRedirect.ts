import * as msal from '@azure/msal-browser';
import { msalConfig, loginRequest } from './authConfig'; // Adjust the import path as necessary
import { welcomeUser, updateTable } from './ui'; // Adjust the import path as necessary

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";

/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
 */
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });

function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username
        welcomeUser(currentAccounts[0].username);
        if (currentAccounts[0].idTokenClaims) {
            updateTable({ idTokenClaims: currentAccounts[0].idTokenClaims });
        }
    }
}

function handleResponse(response: msal.AuthenticationResult | null) {

    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null && response.account !== null) {
        username = response.account.username;
        welcomeUser(username);
        if (response.account.idTokenClaims) {
            updateTable({ idTokenClaims: response.account.idTokenClaims });
        }
    } else {
        selectAccount();

        /**
         * If you already have a session that exists with the authentication server, you can use the ssoSilent() API
         * to make request for tokens without interaction, by providing a "login_hint" property. To try this, comment the 
         * line above and uncomment the section below.
         */

        // myMSALObj.ssoSilent(silentRequest).
        //     then((response) => {
        //         welcomeUser(response.account.username);
        //         updateTable(response.account);
        //     }).catch(error => {
        //         console.error("Silent Error: " + error);
        //         if (error instanceof msal.InteractionRequiredAuthError) {
        //             signIn();
        //         }
        //     });
    }
}

function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    // Choose which account to logout from by passing a username.
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username),
        postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}`, // remove this line if you would like navigate to index page after logout.

    };

    myMSALObj.logoutRedirect(logoutRequest);
}

export { myMSALObj, selectAccount, handleResponse, signIn, signOut };
