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
 * Role 2 responsibility: browser-storage initialization.
 * This file creates the shared "database" (arrays saved in localStorage).
 * Every group member must use the STORAGE_KEYS names below and these helper
 * functions: getRecords(key) to read a list, saveRecords(key, list) to save it.
 * Load this file BEFORE ardenne-auth.js and before any dashboard script.
 */

/* Shared storage names. Other group members must use these constants. */
const STORAGE_KEYS = {
    users: "ardenneUsers",
    sessions: "ardenneSessions",
    subjects: "ardenneSubjects",
    students: "students",
    grades: "studentGrades",
    ledger: "ardenneLedger",
    messages: "ardenneMessages"
};

/* Initial browser-storage arrays for the school portal. */
function getStarterData() {
    const starterData = {};

    /* Sample accounts for the Administrator, Teacher and read-only Viewer roles. */
    starterData[STORAGE_KEYS.users] = [
        {
            username: "admin",
            password: "Admin@2026",
            fullName: "System Administrator",
            role: "admin",
            active: true
        },
        {
            username: "teacher",
            password: "Teacher@2026",
            fullName: "Teacher",
            role: "teacher",
            active: true
        },
        {
            username: "viewer",
            password: "Viewer@2026",
            fullName: "General Viewer",
            role: "viewer",
            active: true
        }
    ];

    starterData[STORAGE_KEYS.sessions] = [];
    starterData[STORAGE_KEYS.subjects] = [];
    starterData[STORAGE_KEYS.students] = [];
    starterData[STORAGE_KEYS.grades] = [];
    starterData[STORAGE_KEYS.ledger] = [];
    starterData[STORAGE_KEYS.messages] = [];

    return starterData;
}

/* Read a saved list. A missing or damaged list returns null. */
function loadRecords(key) {
    try {
        const savedText = localStorage.getItem(key);

        if (savedText === null) {
            return null;
        }

        const records = JSON.parse(savedText);
        return Array.isArray(records) ? records : null;
    } catch (error) {
        return null;
    }
}

/* Return a saved list, or an empty array if it is not available. */
function getRecords(key) {
    const records = loadRecords(key);
    return records === null ? [] : records;
}

/* Save an array as JSON in localStorage. Returns true when it worked. */
function saveRecords(key, records) {
    if (!Array.isArray(records)) {
        return false;
    }

    try {
        localStorage.setItem(key, JSON.stringify(records));
        return true;
    } catch (error) {
        return false;
    }
}

/* Create only missing or damaged lists. Existing records are preserved. */
function initializeDatabase() {
    const starterData = getStarterData();

    for (const listName in STORAGE_KEYS) {
        const storageKey = STORAGE_KEYS[listName];

        if (loadRecords(storageKey) === null) {
            if (!saveRecords(storageKey, starterData[storageKey])) {
                console.warn("Browser storage is unavailable or full: " + storageKey);
                return false;
            }
        }
    }

    return true;
}

/* Prepare the shared browser database when this script loads. */
initializeDatabase();
