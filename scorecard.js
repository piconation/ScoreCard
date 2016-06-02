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

function buildcard(){
    beginTimer();
    var holecollection = "";
    var playercollection = "";

    // create column of player labels
    for(var pl = 1; pl <= numplayers; pl++ ){
        playercollection += "<div id='player" + pl +"' class='holebox playerbox'> Player " + pl + "</div>";
    }

    // create golf hole columns before you add holes to them.
    for(var c = numholes; c >= 1; c-- ){
        holecollection += "<div id='column" + c +"' class='holecol'><div class='holenumbertitle'>" + c + "</div></div>";
    }
    $("#leftcard").html(playercollection);
    $("#rightcard").html(holecollection);

    // call the function that builds the holes into the columns
    buildholes();
}

function buildholes() {
    // add 18 holes to the columns
    for(var p = 1; p <= numplayers; p++ ){
        for(var h = 1; h <= numholes; h++){
            $("#column" + h).append("<div id='player" + p +"hole" + h +"' class='holebox'></div>");
        }
    }
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
