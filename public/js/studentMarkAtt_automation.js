var id = localStorage.getItem("id");
var schoolName = localStorage.getItem("schoolName");
console.log("studSchoolId: "+id+" schoolName: "+schoolName);

function attendance(){
    window.open(
        "https://vc4all.in/#!dashboard/automationAttendanceView/"+id,
        '_blank' // <- This is what makes it open in a new window.
      );
    
}
function result(){
    window.open(
        "https://vc4all.in/#!dashboard/automationResultView/"+id,
        '_blank' // <- This is what makes it open in a new window.
      );
    // window.location.href = "https://vc4all.in/#!dashboard/automationResultView/"+id;    
}