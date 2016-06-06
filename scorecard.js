/**
 * Created by mattpowell on 5/20/16.
 */

var numplayers = 3;
var numholes = 21;
var teetime = 29;
var seconds = 60;

function addPlayer() {
    numplayers += 1;
    $("#leftcard").html('');
    $("#rightcard").html('');
    buildcard();
}

function buildcard(theteeboxid){
    beginTimer();
    var holecollection = "";
    var playercollection = "";
    var grandtotalcollection = "";

    // create column of player labels
    for(var pl = 1; pl <= numplayers; pl++ ){
        playercollection += "<div id='player" + pl +"' class='holebox playerbox'> Player " + pl + "</div>";
    }

    // create golf hole columns before you add holes to them.
    for(var c = numholes; c >= 1; c-- ){
        var adjusthole = c - 1;
        holecollection += "<div id='column" + c +"' class='holecol'><div class='holenumbertitle'>" + c + "</div>par " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].par + "</div></div></div>";
    }
    $("#leftcard").html(playercollection);
    $("#rightcard").html(holecollection);

    // call the function that builds the holes into the columns
    buildholes();
}

function holeInfo() {
    
}

function getCourseInfo(id) {
    golfxhttp = new XMLHttpRequest;
    golfxhttp.onreadystatechange = function () {
        if (golfxhttp.readyState == 4 && golfxhttp.status == 200) {
        testCourse = JSON.parse(golfxhttp.responseText);
        $("#golfcourselabel").html(testCourse.course.name);
            gettheWeather(testCourse.course.city);
            for(var t = 0; t < (testCourse.course.holes[0].tee_boxes.length - 1); t++) {
                var teeboxdisplay = "<option value='" + t + "'>"+ testCourse.course.holes[0].tee_boxes[t].tee_color_type +"</option>";
                $("#selectTeebox").append(teeboxdisplay);
            }
        }
    };
}

golfxhttp.open("GET", "https:..folg-courses-api.herokuapp.com/courses/" + id, true);
golfxhttp.send();

function setCourseInfo(teeboxid) {
    buildcard(theteeboxid);
}

function buildholes() {
    // add 18 holes to the columns
    for(var p = 1; p <= numplayers; p++ ){
        for(var h = 1; h <= numholes; h++){
            $("#column" + h).append("<div id='player" + p +"hole" + h +"' class='holebox'></div>");
        }
    }
}

function gettheWeather(thecityname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var myobj = JSON.parse(xhttp.responseText);
            document.getElementById("weather").innerHTML = myobj.weather[0].description;
        }
    }
    xhttp.open("GET", "https://api.openweather", true);
    xhttp.send();
}

/*function runcode() {
    for(var p = 1; p <= numplayers; p++ ){
        collectholes(p);
    }
}

function collectholes(player){
    var golfcourse = "";
    for(var h = 1; h <= 18; h++){
        var hole = "<div id='player" + player +"hole" + h +"'>hole display</div>";
        golfcourse += hole;
        //console.log(golfcourse);
    }
    $("#scorecard").append(golfcourse);
}*/

function beginTimer(){
    var thetimer = setInterval(function(){clocktick()}, 1000);
}

function clocktick(){
    if(seconds > 0){
        seconds --;
        if(seconds < 10){
            seconds = "0" + seconds;
        }
    }
    else{
        teetime --;
        seconds = 59;
    }
    document.getElementById("countdown").innerHTML = teetime + ":" + seconds;
}
