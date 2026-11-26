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


const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const submitButton = document.getElementById("submitButton");



let students = [];

try {
    students = JSON.parse(localStorage.getItem("students")) || [];
} catch (error) {
    students = [];
}


let editingIndex = -1;


function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}




function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}




function displayStudents() {

    const searchValue = searchInput.value.toLowerCase().trim();

    studentTableBody.innerHTML = "";

    const filteredStudents = students.filter(function(student) {

    return (
        String(student.studentId || "").toLowerCase().includes(searchValue) ||
        String(student.firstName || "").toLowerCase().includes(searchValue) ||
        String(student.lastName || "").toLowerCase().includes(searchValue) ||
        String(student.email || "").toLowerCase().includes(searchValue)
    );
});

    
    if (filteredStudents.length === 0) {

        const emptyRow = document.createElement("tr");

        emptyRow.innerHTML = `
            <td colspan="7" style="text-align:center; padding:20px;">
                ${students.length === 0
                    ? "No student records available. Register a student to get started."
                    : "No students found. Try another search."}
            </td>
        `;

        studentTableBody.appendChild(emptyRow);
        return;
    }


    filteredStudents.forEach(function(student) {

        const originalIndex = students.indexOf(student);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(student.studentId)}</td>
            <td>${escapeHTML(student.firstName)}</td>
            <td>${escapeHTML(student.lastName)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.grade)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>
                <button
                    type="button"
                    class="edit-button"
                    data-index="${originalIndex}">
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-button"
                    data-index="${originalIndex}">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}



studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

   
    const student = {
        studentId: document.getElementById("studentId").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        grade: document.getElementById("grade").value,
        phone: document.getElementById("phone").value.trim()
    };

    const duplicateId = students.some(function(existingStudent, index) {

        return (
            existingStudent.studentId.toLowerCase() ===
            student.studentId.toLowerCase() &&
            index !== editingIndex
        );
    });

    
    if (duplicateId) {

        alert("This Student ID already exists. Please enter a different ID.");
        return;
    }

    if (editingIndex === -1) {

        students.push(student);

        alert("Student added successfully!");

    } else {

   
        students[editingIndex] = student;

        alert("Student record updated successfully!");

        editingIndex = -1;
        submitButton.textContent = "Add Student";
    }

  
    saveStudents();

  
    displayStudents();

    
    studentForm.reset();

});



studentTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button");

   
    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);

  
    if (button.classList.contains("edit-button")) {

        const student = students[index];

     
        document.getElementById("studentId").value = student.studentId;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("email").value = student.email;
        document.getElementById("grade").value = student.grade;
        document.getElementById("phone").value = student.phone;

       
        editingIndex = index;

        submitButton.textContent = "Update Student";

        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

   
    if (button.classList.contains("delete-button")) {

        const confirmDelete = confirm(
            "Are you sure you want to delete this student?"
        );

        if (confirmDelete) {

            students.splice(index, 1);

        
            saveStudents();

            
            displayStudents();

            alert("Student deleted successfully!");
        }
    }

});



studentForm.addEventListener("reset", function() {

    editingIndex = -1;

    submitButton.textContent = "Add Student";

});


searchInput.addEventListener("input", function() {

    displayStudents();

});


displayStudents();