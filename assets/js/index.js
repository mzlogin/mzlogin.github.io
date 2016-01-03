/**
 * Created by chuandong on 15/12/17.
 * Updated by mzlogin on 16/01/03.
 */

var counter = 0;
var len = 3;
var subtitles = new Array("码而立·码而生", "熟能生巧", "打码改变人生");

setInterval(function(){
    counter += 1;

    $("#sub-title").fadeOut(1000, function() {
        var pos = counter % len;
        $("#sub-title").html(subtitles[pos]);
    });
    $("#sub-title").fadeIn(1000);

}, 3000);
