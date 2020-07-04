---
layout: default
title: mindmap
keywords: mindmap
description: 全屏查看脑图
permalink: /mindmap-viewer/
visit-stat: hidden
---

<style>
.site-header {
    margin-bottom: 0;
}
.site-footer {
    margin-top: 0;
    padding-top: 20px;
    padding-bottom: 20px;
}
.site-footer .octicon-mark-github {
    top: 18px;
}
</style>

<div id="mindmap-container"></div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mzlogin/kityminder-core@dev/dist/kityminder.core.css">
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mzlogin/kity@dev/dist/kity.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mzlogin/kityminder-core@dev/dist/kityminder.core.min.js"></script>

<script>
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}

$(document).ready(function(){
    var headerHeight = $('header.site-header')[0].offsetHeight;
    var footerHeight = $('footer.container')[0].offsetHeight;
    var mindmapHeight = $(window).height() - headerHeight - footerHeight;
    $('#mindmap-container').height('' + mindmapHeight + "px");

    var markdownText = getUrlParam('data');
    var minder = new kityminder.Minder({
      renderTo: '#mindmap-container'
    });
    minder.importData('markdown', decodeURIComponent(markdownText));
    /* minder.disable(); */
    minder.execCommand('hand');
});
</script>
