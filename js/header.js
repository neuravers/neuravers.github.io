$(document).ready(function () {
    $('#menu-button').click(function () {
        $(this).toggleClass('open');
        $('main').toggleClass('menu-open');
        $('footer').toggleClass('menu-open');
        $('#sidebar-menu').toggleClass('open');
        $('#menu-container').toggleClass('top-nav-animate');
    });
});