$(document).ready(function () {
    $('#menu-button').click(function () {
        $(this).toggleClass('open');
        $('main').toggleClass('menu-open');
        $('footer').toggleClass('menu-open');
        $('#menu-container').toggleClass('open');
    });
});