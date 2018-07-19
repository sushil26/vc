var id = localStorage.getItem("id");
var schoolName = localStorage.getItem("schoolName");
console.log("studSchoolId: " + id + " schoolName: " + schoolName);

function attendance() {
    window.open(
        "https://norecruits.com/#!dashboard/automationAttendanceView/" + id,
        '_blank' // <- This is what makes it open in a new window.
    );

}
function result() {
    window.open(
        "https://norecruits.com/#!dashboard/automationResultView/" + id,
        '_blank' // <- This is what makes it open in a new window.
    );
    // window.location.href = "https://norecruits.com/#!dashboard/automationResultView/"+id;    
}