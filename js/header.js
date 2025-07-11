$(document).ready(function () {
    $('#menu-button').click(function () {
        $(this).toggleClass('open');
        $('main').toggleClass('menu-open');
        $('footer').toggleClass('menu-open');
        $('#sidebar-menu').toggleClass('open');
        $('#menu-container').toggleClass('top-nav-animate');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.news-track');
    const carousel = document.getElementById('news-carousel');

    function updateCarouselHeight() {
        const activeItem = track.querySelector('.news-item-active');
        if (activeItem) {
            const newHeight = activeItem.offsetHeight;
            carousel.style.height = `${newHeight}px`;
        }
    }

    // Od razu ustaw na starcie
    updateCarouselHeight();

    const items = Array.from(track.querySelectorAll('.news-item'));
    const itemWidth = items[0].offsetWidth + 32; // 32px gap

    // Clone items for infinite effect
    items.forEach(item => {
        const cloneStart = item.cloneNode(true);
        cloneStart.classList.add('clone');
        track.insertBefore(cloneStart, track.firstChild);

        const cloneEnd = item.cloneNode(true);
        cloneEnd.classList.add('clone');
        track.appendChild(cloneEnd);
    });

    const clonesEachSide = items.length;
    const allItems = Array.from(track.querySelectorAll('.news-item'));
    const singleItemWidth = items[0].offsetWidth + 32;

    // Start in the middle
    track.scrollLeft = clonesEachSide * singleItemWidth;

    function updateActiveItem() {
        const center = track.scrollLeft + track.offsetWidth / 2;

        let closestItem = null;
        let closestDistance = Infinity;

        allItems.forEach(item => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const distance = Math.abs(center - itemCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });

        allItems.forEach(item => item.classList.remove('news-item-active'));
        if (closestItem) closestItem.classList.add('news-item-active');
    }

    let isRotating = false;

    track.addEventListener('scroll', () => {
        if (isRotating) return;
        updateActiveItem();

        // Scrolled near the end (right)
        if (track.scrollLeft >= track.scrollWidth - track.offsetWidth - itemWidth) {
            isRotating = true;
            track.style.scrollBehavior = 'auto';
            track.appendChild(track.firstElementChild); // Move first to end
            track.scrollLeft -= itemWidth;
            setTimeout(() => { isRotating = false; track.style.scrollBehavior = 'smooth'; }, 50);
        }
        // Scrolled near the beginning (left)
        else if (track.scrollLeft <= itemWidth) {
            isRotating = true;
            track.style.scrollBehavior = 'auto';
            track.insertBefore(track.lastElementChild, track.firstElementChild); // Move last to start
            track.scrollLeft += itemWidth;
            setTimeout(() => { isRotating = false; track.style.scrollBehavior = 'smooth'; }, 50);
        }
    });

    window.addEventListener('resize', updateActiveItem);
    window.addEventListener('resize', updateCarouselHeight);
    updateActiveItem();
});
