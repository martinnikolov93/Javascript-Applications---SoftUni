import {get, post} from "./requester.js";

async function solve(){
    let $studentsTBody = document.getElementById('students');

    const students = await get('appdata', 'students');

    let sortedStudents = students.slice(0);
    sortedStudents.sort(function(a,b) {
        return a['ID'] - b['ID'];
    });

    Object.values(sortedStudents).forEach(student => {
        let id = student['ID'];
        let firstName = student['FirstName'];
        let lastName = student['LastName'];
        let facultyNumber = student['FacultyNumber'];
        let grade = student['Grade'];

        let $tr = document.createElement('tr');
        let $idTD = document.createElement('td');
        $idTD.textContent = id;
        let $firstNameTD = document.createElement('td');
        $firstNameTD.textContent = firstName;
        let $lastNameTD = document.createElement('td');
        $lastNameTD.textContent = lastName;
        let $facultyNumberTD = document.createElement('td');
        $facultyNumberTD.textContent = facultyNumber;
        let $gradeTD = document.createElement('td');
        $gradeTD.textContent = grade;

        $tr.append($idTD, $firstNameTD, $lastNameTD, $facultyNumberTD, $gradeTD);
        $studentsTBody.append($tr);
    });
}
solve();

/*let student = {"ID": "1", "FirstName": "zestra mu", "LastName": "gamenova", "FacultyNumber": "2153", "Grade": "5"};
post('appdata', 'students', student);*/
