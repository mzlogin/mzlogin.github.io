jQuery(function() {
    function adjust_search_box_width() {
        if ($(".post-directory").length) {
            if ($(".post-directory").is(":visible")) {
                $("#site_search").width(300);
            }
        }
        var searchbar_width = $("#site_search").width();
        $("#search_box").width(searchbar_width - 65);
    }

    adjust_search_box_width();

    $(window).on("resize", function() {
        adjust_search_box_width();
    });
});
