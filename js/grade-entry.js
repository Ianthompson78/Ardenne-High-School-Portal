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
let students = [];

try {
    students = JSON.parse(localStorage.getItem("students")) || [];
} catch (error) {
    students = [];
}

const subjectClasses = [
    {
        subject: "Mathematics",
        classes: ["Grade 7", "Grade 8", "Grade 9"]
    },
    {
        subject: "English Language",
        classes: ["Grade 7", "Grade 8"]
    },
    {
        subject: "Physics",
        classes: ["Grade 10", "Grade 11"]
    }
];

const gradeSubject = document.getElementById("gradeSubject");

const gradeTableBody = document.getElementById("gradeTableBody");

const calculateGradesBtn = document.getElementById("calculateGradesBtn");

const gradeClass = document.getElementById("gradeClass");


gradeSubject.addEventListener("change", function() {

    const selectedSubject = gradeSubject.value;

    gradeClass.innerHTML =
        '<option value="">Select Class</option>';

    gradeTableBody.innerHTML = "";

    calculateGradesBtn.disabled = true;

    const subject = subjectClasses.find(function(item) {
        return item.subject === selectedSubject;
    });

    if (subject) {

        subject.classes.forEach(function(className) {

            const option = document.createElement("option");

            option.value = className;
            option.textContent = className;

            gradeClass.appendChild(option);

        });

        gradeClass.disabled = false;

    } else {

        gradeClass.disabled = true;

    }

});
 

gradeClass.addEventListener("change", function() {

    const selectedSubject = gradeSubject.value;
    const selectedClass = gradeClass.value;

    const selectedGrade = selectedClass.replace("Grade ", "");

const filteredStudents = students.filter(function(student) {

    return student.grade === selectedGrade;

});

    gradeTableBody.innerHTML = "";

    filteredStudents.forEach(function(student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>
                <input type="number" min="0" max="100"
                class="student-score" required>
            </td>
            <td class="student-grade">-</td>
        `;

        gradeTableBody.appendChild(row);

    });

    calculateGradesBtn.disabled = filteredStudents.length === 0;

});


    
calculateGradesBtn.addEventListener("click", function() {

    const scoreInputs = document.querySelectorAll(".student-score");



    for (let i = 0; i < scoreInputs.length; i++) {

        const score = Number(scoreInputs[i].value);

        if (scoreInputs[i].value === "" ||
            score < 0 || score > 100) {

            alert("Please enter a valid score between 0 and 100.");

            scoreInputs[i].focus();

            return;
        }
    }

    scoreInputs.forEach(function(input) {

        const score = Number(input.value);

        let grade;

        if (score >= 80) {
            grade = "A";
        }
        else if (score >= 70) {
            grade = "B";
        }
        else if (score >= 60) {
            grade = "C";
        }
        else if (score >= 50) {
            grade = "D";
        }
        else {
            grade = "F";
        }

        const gradeCell = input.parentElement.nextElementSibling;

        gradeCell.textContent = grade;

    });

    alert("Grades calculated successfully!");

     saveGrades();

});




function saveGrades() {

    const savedGrades = JSON.parse(
        localStorage.getItem("studentGrades")
    ) || [];

    const rows = document.querySelectorAll("#gradeTableBody tr");

    rows.forEach(function(row) {

        const studentID = row.cells[0].textContent;
        const studentName = row.cells[1].textContent;
        const score = row.querySelector(".student-score").value;
        const grade = row.querySelector(".student-grade").textContent;

        
        const existingRecord = savedGrades.find(function(record) {

            return record.studentID === studentID &&
                   record.subject === gradeSubject.value &&
                   record.assessment === document.getElementById("assessmentType").value;

        });

        if (existingRecord) {

            
            existingRecord.score = score;
            existingRecord.grade = grade;

        } else {

            
            savedGrades.push({

                studentID: studentID,
                studentName: studentName,
                subject: gradeSubject.value,
                class: gradeClass.value,
                assessment: document.getElementById("assessmentType").value,
                score: score,
                grade: grade

            });

        }

    });

    localStorage.setItem(
        "studentGrades",
        JSON.stringify(savedGrades)
    );

    alert("Grades saved successfully!");

}


    