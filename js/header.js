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
    // Pobierz bieżący URL lub pathname
    const currentPath = window.location.pathname; // np. "/blog" lub "/about"

    // Pobierz wszystkie linki menu
    const menuLinks = document.querySelectorAll("#menu-container nav ul li a");
    console.log("Current Path:", currentPath);
    menuLinks.forEach(link => {
        // Sprawdź, czy href linku pasuje do currentPath
        // Możesz dopasować dokładnie lub sprawdzić zawiera itp.
        if (link.getAttribute("href") === currentPath) {
            // Dodaj klasę lub zmień styl inline
            link.classList.add("active-menu-link");
        }
    });

    // Add event listener for "Contact" button
    for (const button of document.querySelectorAll(".contact-button")) {
        button.addEventListener("click", () => {
            window.location.href = "mailto:";
        });
    }
});
