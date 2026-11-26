/* CIT2011 Web Programming Group Assignment — School Portal
 * School: Ardenne High School, 10 Ardenne Road, Kingston 10, Jamaica
 * File: css/ardenne-auth.css
 * Group members (Name | ID# | Lab day/time | Role):
 *   1. Jade Gordon | [2501967] | Friday 12:00-1:50 | Role 1 - UI/UX & Core Master Layout Architect
 *   2. Duanté Chong | 2501967 | Friday 12:00-1:50 | Role 2 - Authentication & State Database Manager
 *   3. Kemesha Waugh | [2508102| Friday 12:00-1:50 | Role 3 - Administrative Interface Developer
 *   4. Ian Thompson | [2501205] | Friday 12:00-1:50 | Role 4 - Instructor Workflow Specialist
 *   5. Shemar Williams | [230079] | Friday 12:00-1:50 | Role 5 - Financial Accounting & Reporting Engineer
 */

/*
 * Role 2 responsibility: authentication, role tokens and session checks.
 *
 * HOW OTHER PAGES USE THIS FILE (add to the <head> of each protected page):
 *   <script src="js/ardenne-storage.js"></script>
 *   <script src="js/ardenne-auth.js"></script>
 *   <script>const currentUser = requireRole(["teacher"]);</script>
 * Roles: "admin", "teacher", "viewer". A logout button should call logoutUser().
 * The dashboard filenames below must match the pages the group creates.
 */
const BASE_PATH = "/Ardenne-High-School-Portal";

const TOKEN_KEY = "ardenneToken";
const REASON_KEY = "ardenneLoginReason";
const LOGIN_PAGE = BASE_PATH + "/login.html";

const ROLE_SETTINGS = {
    admin: {
        label: "Administrator",
        dashboardPage: BASE_PATH + "/admin/Student-registration.html"
    },
    teacher: {
        label: "Teacher",
        dashboardPage: BASE_PATH + "/teacher/teacher-dashboard.html"
    },
    viewer: {
        label: "Read-Only Viewer",
        dashboardPage: BASE_PATH + "/viewer-dashboard.html"
    }
};

function findUser(username) {
    const cleanUsername = String(username || "").trim().toLowerCase();
    const users = getRecords(STORAGE_KEYS.users);

    return users.find(function (user) {
        return user && user.username &&
            user.username.toLowerCase() === cleanUsername;
    }) || null;
}

/* Return account details without exposing its password to dashboard scripts. */
function makePublicUser(user) {
    return {
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        subjects: user.subjects || []
    };
}

/* Create a unique session token for this browser tab. */
function createSession(username) {
    const token = Date.now() + "-" + Math.random().toString(36).slice(2);
    const activeSessions = getRecords(STORAGE_KEYS.sessions);

    activeSessions.push({
        token: token,
        username: username
    });

    if (!saveRecords(STORAGE_KEYS.sessions, activeSessions)) {
        return false;
    }

    try {
        sessionStorage.setItem(TOKEN_KEY, token);
        return true;
    } catch (error) {
        return false;
    }
}

/* Remove a session from shared storage and from the current browser tab. */
function endSession(token) {
    const remainingSessions = getRecords(STORAGE_KEYS.sessions).filter(function (session) {
        return session && session.token !== token;
    });

    saveRecords(STORAGE_KEYS.sessions, remainingSessions);
    sessionStorage.removeItem(TOKEN_KEY);
}

/* Validate the current tab's token and account status. */
function checkSession() {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token === null) {
        return { valid: false, reason: "none" };
    }

    const sessions = getRecords(STORAGE_KEYS.sessions);
    const session = sessions.find(function (item) {
        return item && item.token === token;
    });

    if (!session) {
        sessionStorage.removeItem(TOKEN_KEY);
        return { valid: false, reason: "invalid" };
    }

    const user = findUser(session.username);

    if (!user || user.active !== true || !ROLE_SETTINGS[user.role]) {
        endSession(token);
        return { valid: false, reason: "invalid" };
    }

    return { valid: true, user: makePublicUser(user) };
}

/* Get the current account, or null when this tab has no valid login. */
function getLoggedInUser() {
    const session = checkSession();
    return session.valid ? session.user : null;
}

/* Go to the login page and leave a short message explaining why. */
function goToLogin(reason) {
    sessionStorage.setItem(REASON_KEY, reason);
    window.location.replace(LOGIN_PAGE);
}

/* Check whether the signed-in account is allowed to open a page. */
function requireRole(allowedRoles) {
    const session = checkSession();

    if (!session.valid) {
        document.documentElement.hidden = true;
        goToLogin(session.reason);
        return null;
    }

    if (allowedRoles.indexOf(session.user.role) === -1) {
        document.documentElement.hidden = true;
        window.location.replace(ROLE_SETTINGS[session.user.role].dashboardPage);
        return null;
    }

    return session.user;
}

/* Send an already-authenticated visitor directly to their role dashboard. */
function redirectIfLoggedIn() {
    const user = getLoggedInUser();

    if (user !== null) {
        window.location.replace(ROLE_SETTINGS[user.role].dashboardPage);
    }
}

/* Check credentials and create a role-linked session after successful login. */
function loginUser(username, password) {
    const user = findUser(username);

    if (!user || user.password !== password) {
        return {
            success: false,
            message: "Incorrect username or password."
        };
    }

    if (user.active !== true) {
        return {
            success: false,
            message: "This account has been deactivated. Contact the school administrator."
        };
    }

    if (!ROLE_SETTINGS[user.role]) {
        return {
            success: false,
            message: "This account does not have a valid access role."
        };
    }

    if (!createSession(user.username)) {
        return {
            success: false,
            message: "Login could not be saved. Check that browser storage is enabled."
        };
    }

    return {
        success: true,
        user: makePublicUser(user)
    };
}

/* End the current tab's login session. */
function logoutUser() {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token !== null) {
        endSession(token);
    }

    goToLogin("logged-out");
}
