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

let savedGrades = [];

try {
    savedGrades = JSON.parse(localStorage.getItem("studentGrades")) || [];
} catch (error) {
    savedGrades = [];
}

console.log(savedGrades);



const studentSelect = document.getElementById("studentSelect");

const generateReportBtn = document.getElementById("generateReportBtn");

const reportDisplay = document.getElementById("reportDisplay");


const uniqueStudents = [];

savedGrades.forEach(function(student) {

    const alreadyAdded = uniqueStudents.find(function(item) {

        return item.studentID === student.studentID;

    });

    if (!alreadyAdded) {

        uniqueStudents.push(student);

    }

});

uniqueStudents.forEach(function(student) {

    const option = document.createElement("option");

    option.value = student.studentID;

    option.textContent = student.studentName;

    studentSelect.appendChild(option);

});


generateReportBtn.addEventListener("click", function() {

    const selectedID = studentSelect.value;

    const studentRecords = savedGrades.filter(function(student) {

        return student.studentID === selectedID;

    });

    if (studentRecords.length === 0) {

        reportDisplay.textContent = "No records found.";

        return;

    }

    let total = 0;
    const totalAssessments = studentRecords.length;

    let reportHTML = `
        <h2>Student Report Card</h2>

        <p><strong>Student Name:</strong>
        ${studentRecords[0].studentName}</p>

        <p><strong>Student ID:</strong>
        ${selectedID}</p>

        <p><strong>Class:</strong>
        ${studentRecords[0].class}</p>

        <table>
            <tr>
                <th>Subject</th>
                <th>Assessment</th>
                <th>Score</th>
                <th>Grade</th>
            </tr>
    `;

    studentRecords.forEach(function(record) {

        total += Number(record.score);

        reportHTML += `
            <tr>
                <td>${record.subject}</td>
                <td>${record.assessment}</td>
                <td>${record.score}</td>
                <td>${record.grade}</td>
            </tr>
        `;

    });

    const average = total / studentRecords.length;

    let overallGrade;

if (average >= 80) {
    overallGrade = "A";
}
else if (average >= 70) {
    overallGrade = "B";
}
else if (average >= 60) {
    overallGrade = "C";
}
else if (average >= 50) {
    overallGrade = "D";
}
else {
    overallGrade = "F";
}

    reportHTML += `
        </table>

        <h3>Total Assessments: ${totalAssessments}</h3>

        <h3>Overall Average: ${average.toFixed(2)}%</h3>

        <h3>Overall Grade: ${overallGrade}</h3>
    `;

    reportDisplay.innerHTML = reportHTML;

});

