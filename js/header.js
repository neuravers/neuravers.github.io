$(document).ready(function () {
    $('#menu-button').click(function () {
        $(this).toggleClass('open');
        $('main').toggleClass('menu-open');
        $('footer').toggleClass('menu-open');
        $('#sidebar-menu').toggleClass('open');
        $('#menu-container').toggleClass('top-nav-animate');
    });
})

document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    const menuLinks = document.querySelectorAll("#menu-container nav ul li a");
    console.log("Current Path:", currentPath);
    menuLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active-menu-link");
        }
    });

    for (const button of document.querySelectorAll(".contact-button")) {
        button.addEventListener("click", () => {
            window.location.href = "mailto:";
        });
    }

    const languageSelector = document.querySelector("#language-selector");
    const popup = document.querySelector("#language-popup");
    if (languageSelector) {
        languageSelector.addEventListener("click", () => {
            popup.style.display = "block";
            setTimeout(() => {
                popup.style.display = "none";
            }, 3000);
        });
    }
});
