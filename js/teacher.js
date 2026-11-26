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
const teacherSubjects = [
    {
        subject: "Mathematics",
        classes: ["Grade 7", "Grade 8", "Grade 9"]
    },
    {
        subject: "English Language",
        classes: ["Grade 7","Grade 8"]
    },
    {
        subject: "Physics",
        classes: ["Grade 10", "Grade 11"]
    }

];

const subjectSelect = document.getElementById("subjectSelect");
const classSelect = document.getElementById("classSelect");
const viewStudentsBtn = document.getElementById("viewStudentsBtn");
const studentList = document.getElementById("studentList");

teacherSubjects.forEach(function(item){
    const option = document.createElement("option");

    option.value = item.subject;
    option.textContent = item.subject;

    subjectSelect.appendChild(option);
});



subjectSelect.addEventListener("change", function() {

    classSelect.innerHTML =
        '<option value="">Select a Class</option>';

    viewStudentsBtn.disabled = true;

    studentList.innerHTML =
    "<p>Select a subject and class to view students.</p>";

    const selectedSubject = subjectSelect.value;

    const subject = teacherSubjects.find(function(item) {
        return item.subject === selectedSubject;
    });

    if (subject) {

        subject.classes.forEach(function(className) {

            const option = document.createElement("option");

            option.value = className;
            option.textContent = className;

            classSelect.appendChild(option);

        });

        classSelect.disabled = false;

    } else {

        classSelect.disabled = true;

    }

});


classSelect.addEventListener("change", function() {

    if (subjectSelect.value !== "" && classSelect.value !== "") {

        viewStudentsBtn.disabled = false;

    } else {

        viewStudentsBtn.disabled = true;

    }
    
});


let students = [];

try {
    students = JSON.parse(localStorage.getItem("students")) || [];
} catch (error) {
    students = [];
}

viewStudentsBtn.addEventListener("click", function() {

    const selectedClass = classSelect.value;

    const selectedGrade = selectedClass.replace("Grade ", "");

    const filteredStudents = students.filter(function(student) {

        return student.grade === selectedGrade;

    });

    studentList.innerHTML = "";

if (filteredStudents.length > 0) {

    filteredStudents.forEach(function(student) {

        const studentInfo = document.createElement("p");

        studentInfo.textContent =
            student.studentId + " - " +
            student.firstName + " " +
            student.lastName;

        studentList.appendChild(studentInfo);

    });

} else {

    studentList.textContent = "No students found for this class.";

}

});

    
    
  
    