var flag = false;
var jArr;
var jArr2;

function validate() {
    flag = true;
    $('[data-toggle="tooltip"]').tooltip('dispose');
    $('[data-toggle="tooltip"]').removeAttr("title");
    $('[data-toggle="tooltip"]').removeAttr("data-toggle");
    validateName();
    validateDate();
    validateSum();
    validateRelation();
    validateDob();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'right', trigger: 'manual' }).tooltip('show');
    if (flag == true) { store(); }
    return false;
}


function validateName() {
    var str = $("#name").val();
    if (str == '') {
        $("#name").attr("data-toggle", "tooltip");
        $("#name").attr("title", "Mandatory");
        flag = false;
    }
    else {
        var b = new RegExp("[^A-Za-z ]").test(str);
        if (b) {
            $("#name").attr("data-toggle", "tooltip");
            $("#name").attr("title", "Name can contain only letters and spaces");
            flag = false;
        }
    }
}

function validateDate() {
    var str = $("#date").val();
    if (str == '') {
        $("#date").attr("data-toggle", "tooltip");
        $("#date").attr("title", "Mandatory");
        flag = false;
    }
}


function validateSum() {
    var str = $("#sum").val();
    if (str == '') {
        $("#sum").attr("data-toggle", "tooltip");
        $("#sum").attr("title", "Mandatory");
        flag = false;
    }
    else {
        var match = str.match("[0-9]+");
        var match2 = str.match("[0-9]+\\.[0-9]+");
        if (!(match != null && str == match[0])) {
            if (!(match2 != null && str == match2[0])) {
                $("#sum").attr("data-toggle", "tooltip");
                $("#sum").attr("title", "Sum should only contain digits");
                flag = false;
            }
        }
    }
}



function validateRelation() {
    var str = $("#relation").val();
    if (str == '') {
        $("#relation").attr("data-toggle", "tooltip");
        $("#relation").attr("title", "Mandatory");
        flag = false;
    }
}


function validateDob() {
    var str = $("#dob").val();
    if (str == '') {
        $("#dob").attr("data-toggle", "tooltip");
        $("#dob").attr("title", "Mandatory");
        flag = false;
    }
    else {
        var d1 = Date.parse(str);
        var d2 = new Date().getTime();
        if (d1 > d2) {
            $("#dob").attr("data-toggle", "tooltip");
            $("#dob").attr("title", "DOB can't be more than system date");
            flag = false;
        }
    }
}

function getJson() {
    var $items = $('#appid,#custid,#polid,#agentid,#date,#sum,#mode,#comtype,#name,#relation,#dob');
    var obj = {};
    $items.each(function () {
        obj[this.id] = $(this).val();
    });
    var json = JSON.stringify(obj);
    return json;
}

function store() {
    var json = getJson();
    $.ajax({
        type: "POST",
        url: "http://localhost:6844/admin/customer/policy/register",
        async: false,
        data: json,
        contentType: "application/json",
        dataType: "text",
        success: function (data) {

            $("#alertmodalbody").empty();
            $("#alertmodalbody").append('The registration was successful for : ' + data);
            $("#alertmodal").on("hidden.bs.modal", function () {
                window.location = "AdminHome"
            });
            $("#alertmodal").modal('show');
        },
        error: function () {
            $("#alertmodalbody").empty();
            $("#alertmodalbody").append('Data could not be stored!');
            $("#alertmodal").modal('show');
        }
    });
}

function init() {
    if (sessionStorage.getItem('adminUser') === null) {
        alert('Unauthorized Access');
        localStorage.clear();
        window.location = 'Login';
    }
    getAppointments();
    populateAppointments();
    getPolicies();
    fill();
}

function getAppointments() {
    $.ajax({
        type: "GET",
        url: "http://localhost:6844/admin/appointment/",
        async: false,
        dataType: "json",
        success: function (data) {
            jArr = data;
        },
        error: function () {
            $("#alertmodalbody").empty();
            $("#alertmodalbody").append('No suitable records Exist!');
            $("#alertmodal").modal('show');
        }
    });
}

function populateAppointments() {
    $("#appid").empty();
    for (i = 0; i < jArr.length; i++) {
        $("#appid").append('<option value=\"' + jArr[i].id + '\">' + jArr[i].id + '</option>');
    }
}

function fill() {
    $('#custid').empty();
    $('#agentid').empty();
    $('#date').empty();
    var apid = $("#appid").val();
    for (i = 0; i < jArr.length; i++) {
        if (jArr[i].id == apid) {
            $('#custid').val(jArr[i].customer.id);
            $('#agentid').val(jArr[i].agent.id);
            $('#date').val(jArr[i].date);
            break;
        }
    }
}

function logout() {
    sessionStorage.clear();
    window.location = "Login";
}

function getPolicies() {
    $.ajax({
        type: "GET",
        url: "http://localhost:6844/admin/policy",
        async: false,
        dataType: "json",
        success: function (data) {
            $("#polid").empty();
            for (i = 0; i < data.length; i++) {
                var d1 = new Date(data[i].licenceExpiryDate);
                var d2 = new Date();
                if (d1 > d2) {
                    $("#polid").append('<option value="' + data[i].id + '">' + data[i].id + '</option>');
                }
            }
        },
        error: function () {
            $("#alertmodalbody").empty();
            $("#alertmodalbody").append('No policies exist!');
            $("#alertmodal").modal('show');
        }
    });
}