/**
 * Created by chuandong on 15/12/17.
 */

var counter = 0;

setInterval(function(){
    counter += 1;

    $("#sub-title").fadeOut(1000, function() {
        switch (counter % 3) {
            case 0:
                $("#sub-title").html("码而立·码而生");
                break;
            case 1:
                $("#sub-title").html("熟能生巧");
                break;
            case 2:
                $("#sub-title").html("打码改变人生");
                break;
            default:
                $("#sub-title").html("码而立·码而生");
                break;
        }
    });
    $("#sub-title").fadeIn(1000);

}, 3000);
