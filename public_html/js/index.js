
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90931431|-31949321940897724|90949985";

$('#rollno').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStuIdAsJsonObj() {
    var rollno = $('#rollno').val();
    var jsonStr = {
        "Roll-No": rollno
    };
    return JSON.stringify(jsonStr);
}

function filldata(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#fullname').val(data["Full-Name"]);
    $('#clas').val(data["Class"]);
    $('#birthd').val(data["Birth-Date"]);
    $('#add').val(data["Address"]);
    $('#enrolldate').val(data["Enrollment-Date"]);
}

function resetForm() {
    $('#rollno').val("");
    $('#fullname').val("");
    $('#clas').val("");
    $('#birthd').val("");
    $('#add').val("");
    $('#enrolldate').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollno').focus();
}

function validateData() {
    var rollno, fullname, clas, birthd, add, enrolldate;
    rollno = $('#rollno').val();
    fullname = $('#fullname').val();
    clas = $('#clas').val();
    birthd = $('#birthd').val();
    add = $('#add').val();
    enrolldate = $('#enrolldate').val();

    if (rollno === '') {
        alert("Roll-No missing");
        $('#rollno').focus();
        return "";
    }
    if (fullname === '') {
        alert("Full-Name missing");
        $('#fullname').focus();
        return "";
    }
    if (clas === '') {
        alert("Class missing");
        $('#clas').focus();
        return "";
    }
    if (birthd === '') {
        alert("Birth-Date missing");
        $('#birthd').focus();
        return "";
    }
    if (add === '') {
        alert("Address missing");
        $('#add').focus();
        return "";
    }
    if (enrolldate === '') {
        alert("Enrollment-Date missing");
        $('#enrolldate').focus();
        return "";
    }

    var jsonStrObj = {
        "Roll-No": rollno,
        "Full-Name": fullname,
        "Class": clas,
        "Birth-Date": birthd,
        "Address": add,
        "Enrollment-Date": enrolldate
    };
    return JSON.stringify(jsonStrObj);
}

function getStud() {
    var stuIdJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, stuIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#rollno').focus();
    } else if (resJsonObj.status === 200) {
        $('#rollno').prop("disabled", true);
        filldata(resJsonObj);
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#rollno').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $('#rollno').focus();
}

function changeData() {
    $('#change').prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}

