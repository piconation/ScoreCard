/**
 * Created by mattpowell on 5/20/16.
 */

var numplayers = 1;
var numholes = 18;
var teetime = 29;
var seconds = 60;
var testCourse = {};
var closeCourses = {};
var golfxhttp = new XMLHttpRequest();
var local_obj = {latitude: 40.4426135,longitude: -111.8631116,radius: 100};

function loadMe() {

    $.post("https://golf-courses-api.herokuapp.com/courses",local_obj,function(data,status) {
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses) {
            //var mydisplaydiv = "<div id='"+ closeCourses.courses[p].id +"' class='thisCourse' onclick='getCourseInfo(this.id)'>" + closeCourses.courses[p].name +"</div>";
            var selectdisplay = "<option value='"+ closeCourses.courses[p].id +"'>" + closeCourses.courses[p].name +"</option>";
            $("#selectCourse").append(selectdisplay);
        }
    });
}

/*function addPlayer(){
    var parentlength = $('#leftcard').children().size();

    var bignum;

    for(var l = 1; l <= parentlength; l++){
        var grabid = $("#leftcard :nth-child(" + l + ")").attr("id");
        var idsplit = grabid.split("player");
        console.log(idsplit);
        bignum = Number(idsplit[1]);
    }
    var adjnum = bignum + 1;
    $("#leftcard").append("<div id='player" + adjnum +"' class='holebox playerbox'> Player "+ adjnum +"</div>");
    for(var h = 1; h <= numholes; h++){
        $("#column" + h).append("<input onkeyup='calculatescore(" + adjnum +")' id='player" + adjnum +"hole" + h +"' class='holebox'/>");
    }
    $(".totalcol").append("<div id='grand" + adjnum +"' class='holebox'>0</div>");

}*/

function fullconverter(k){
    var toc = +k - 273.15;
    var tof = toc * 9/5 + 32;
    return Math.round(tof);
}

function getCourseInfo(id) {
    golfxhttp = new XMLHttpRequest;
    golfxhttp.onreadystatechange = function () {
        if (golfxhttp.readyState == 4 && golfxhttp.status == 200) {
            testCourse = JSON.parse(golfxhttp.responseText);
            $("#textlabel").html(testCourse.course.name);
            //gettheWeather(testCourse.course.city);
            for (var t = 0; t < (testCourse.course.holes[0].tee_boxes.length - 1); t++) {
                var teeboxdisplay = "<option value='" + t + "'>" + testCourse.course.holes[0].tee_boxes[t].tee_color_type + "</option>";
                $("#selectTeebox").append(teeboxdisplay);
            }
        }
    };

    golfxhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + id, true);
    golfxhttp.send();
    beginTimer();
}

function buildcard(theteeboxid) {
    var holecollection = "";
    var playercollection = "";
    var grandtotalcollection = "";
    var frontnine = "";
    var backnine = "";

    // create column of player labels
    for (var pl = 1; pl <= numplayers; pl++) {
        playercollection += "<div id='player" + pl +"' class='holebox playerbox'><input id='player' type='text' name='FirstName' value placeholder='Enter Player " + pl + "&apos;s Name'></div>";
        grandtotalcollection += "<div class='holebox' id='grand" + pl +"' >0</div>";
        frontnine += "<div class='holebox' id='front" + pl +"'>0</div>";
        backnine += "<div class='holebox' id='back" + pl +"'>0</div>";
    }

    // create golf hole columns before you add holes to them.
    for (var c = numholes; c >= 1; c--) {
        var adjusthole = c - 1;
        holecollection += "<div id='column" + c +"' class='holecol'><div class='holenumbertitle'>" + c + "<div>Par " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].par + "<div>" + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].yards + " Yards<div>HCP " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].hcp + "</div></div></div></div></div>";
    }
    $("#leftcard").html(playercollection);
    $("#rightcard").html( ("<div class='holecol'><div>Total<div>Par" + totalpar() +"</div><div>" + totalyards() + "<br>Yards</div><div>Shots" + grandtotalcollection + "</div></div>") + holecollection );

    // call the function that builds the holes into the columns
    buildholes();
    totalyards();
    totalpar();
}

function addPlayer() {
    numplayers += 1;
    $("#leftcard").html();
    $("#rightcard").html();
}

function setCourseInfo(teeboxid) {
    buildcard(teeboxid);
}

function buildholes() {
// add 18 holes to the columns
    for (var p = 1; p <= numplayers; p++) {
        for (var h = 1; h <= numholes; h++) {
            $("#column" + h).append("<input onkeyup='calculatescore(" + p +")' id='player" + p +"hole" + h +"' class='holebox'/>");
        }
    }
}

/*function gettheWeather(thecityname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            //document.getElementById("weather").innerHTML = obj.weather[0].description;
            document.getElementById("currentconditions").innerHTML = obj.weather[0].description;
            document.getElementById("currenttemp").innerHTML = fullconverter(Number(obj.main.temp));
            document.getElementById("weatherimage").src = "http://openweathermap.org/img/w/" + obj.weather[0].icon + ".png";
        }
    };

    xhttp.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + thecityname + "&appid=8bf0a2141aefa89f4d290c8e92ea2857", true);
    xhttp.send();
}*/

function beginTimer() {
    var thetimer = setInterval(function () {
        clocktick()
    }, 1000);
}

function clocktick() {
    if (seconds > 0) {
        seconds--;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
    }
    else {
        teetime--;
        seconds = 59;
    }
    document.getElementById("countdown").innerHTML = teetime + ":" + seconds;
}

function calculatescore(theplayer){
    var thetotal = 0;
    //var frontnine = 0;
    //var backnine = 0;

    for(var t = 1; t <= numholes; t++){
        thetotal += Number($("#player" + theplayer + "hole" + t).val());
    }

    /*for (var f = 1; f <= 9; f++) {
        frontnine += Number($("#player" + theplayer + "hole" + f).val());
    }

    for (var b = 1; b <= 18; b++) {
        backnine += Number($("#player" + theplayer + "hole" + b).val());
    }*/

    $("#grand" + theplayer).html(thetotal);
    //$("#b" + theplayer).html(backnine);
    //$("#f" + theplayer).html(frontnine);
}

function totalyards() {
    yardage = 0;

    var yindex = $("#selectTeebox").val();
    
    for (var y = 0; y <= numholes - 1; y ++) {
        yardage += testCourse.course.holes[y].tee_boxes[yindex].yards;
    }

    var totalyards = yardage;
    return totalyards;
}

function totalpar() {
    parsum = 0;

    var pindex = $("#selectTeebox").val();

    for (var p = 0; p <= numholes - 1; p ++) {
        parsum += testCourse.course.holes[p].tee_boxes[pindex].par;
    }

    var totalpar = parsum;
    return totalpar;
}


