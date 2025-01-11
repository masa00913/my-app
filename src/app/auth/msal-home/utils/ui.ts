let signInButton: HTMLElement | null = null;
let signOutButton: HTMLElement | null = null;
let titleDiv: HTMLElement | null = null;
let welcomeDiv: HTMLElement | null = null;
let tableDiv: HTMLElement | null = null;
let tableBody: HTMLTableElement | null = null;

if (typeof window !== 'undefined') {
    signInButton = document.getElementById('signIn');
    signOutButton = document.getElementById('signOut');
    titleDiv = document.getElementById('title-div');
    welcomeDiv = document.getElementById('welcome-div');
    tableDiv = document.getElementById('table-div');
    tableBody = document.getElementById('table-body-div') as HTMLTableElement;
}

function welcomeUser(username: string): void {
    if (welcomeDiv) {
        welcomeDiv.innerHTML = `Welcome ${username}!`;
        welcomeDiv.classList.remove('d-none');
    }
}

interface IdTokenClaims {
    [key: string]: any;
}

function createClaimsTable(idTokenClaims: any): IdTokenClaims {
    const claimsTable: IdTokenClaims = {};
    Object.keys(idTokenClaims).forEach((key) => {
        claimsTable[key] = idTokenClaims[key];
    });
    return claimsTable;
}

function updateTable(account: { idTokenClaims?: any }): void {
    if (!account.idTokenClaims || !tableBody) return;

    const claimsTable = createClaimsTable(account.idTokenClaims);
    tableBody.innerHTML = '';

    Object.keys(claimsTable).forEach((key) => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = key;
        cell2.innerHTML = claimsTable[key];
        cell3.innerHTML = ''; // Add description if needed
    });

    if (tableDiv) {
        tableDiv.classList.remove('d-none');
    }
}

export { welcomeUser, updateTable };
