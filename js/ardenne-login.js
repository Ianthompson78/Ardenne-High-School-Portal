/* CIT2011 Web Programming Group Assignment — School Portal
 * School: Ardenne High School, 10 Ardenne Road, Kingston 10, Jamaica
 * File: css/ardenne-auth.css
 * Group members (Name | ID# | Lab day/time | Role):
 *   1. Jade Gordon | [2501967] | Friday 12:00-1:50 | Role 1 - UI/UX & Core Master Layout Architect
 *   2. Duanté Chong | 2501967 | Friday 12:00-1:50 | Role 2 - Authentication & State Database Manager
 *   3. Kemesha Waugh | [2508102| Friday 12:00-1:50 | Role 3 - Administrative Interface Developer
 *   4. Ian Thompson | [2501205] | Friday 12:00-1:50 | Role 4 - Instructor Workflow Specialist
 *   5. Shemar [SURNAME] | [230079] | Friday 12:00-1:50 | Role 5 - Financial Accounting & Reporting Engineer
 */

/*
 * Role 2 responsibility: login-page form handling.
 * The authentication rules themselves are kept in ardenne-auth.js.
 */
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginMessage = document.getElementById("login-message");

const REASON_MESSAGES = {
    none: "Please log in to continue.",
    invalid: "Your session is no longer valid. Please log in again.",
    "logged-out": "You have been logged out."
};

/* Display a message returned by the authentication process. */
function showLoginMessage(message) {
    loginMessage.textContent = message;
    loginMessage.hidden = false;
}

/* Clear the previous form message before another attempt. */
function clearLoginMessage() {
    loginMessage.textContent = "";
    loginMessage.hidden = true;
}

/* Explain why the visitor was redirected to the login page, when applicable. */
function showRedirectReason() {
    const reason = sessionStorage.getItem(REASON_KEY);

    if (reason !== null) {
        sessionStorage.removeItem(REASON_KEY);

        if (REASON_MESSAGES[reason]) {
            showLoginMessage(REASON_MESSAGES[reason]);
        }
    }
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearLoginMessage();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === "" || password === "") {
        showLoginMessage("Enter both your username and password.");
        return;
    }

    const result = loginUser(username, password);

    if (!result.success) {
        showLoginMessage(result.message);
        passwordInput.value = "";
        passwordInput.focus();
        return;
    }

    /* ROLE_SETTINGS decides the destination from the verified account role. */
    window.location.replace(ROLE_SETTINGS[result.user.role].dashboardPage);
});

/* Show any redirect message first, then skip the form if already logged in. */
showRedirectReason();
redirectIfLoggedIn();
