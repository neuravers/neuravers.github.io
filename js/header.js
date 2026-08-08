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
    menuLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active-menu-link");
        }
    });

    document.querySelectorAll(".contact-button").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "mailto:contact@neuravers.com";
        });
    });

    document.querySelectorAll(".author-button").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "https://github.com/k1raubo";
        });
    });

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