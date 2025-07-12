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
    let newsTrack = document.querySelector('.news-track');
    const items = newsTrack.querySelectorAll('.news-item');
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const clonedFirstItem = firstItem.cloneNode(true);
    const clonedLastItem = lastItem.cloneNode(true);

    newsTrack.appendChild(clonedLastItem);
    newsTrack.insertBefore(clonedFirstItem, newsTrack.firstChild);

    const activeItem = newsTrack.querySelector('.news-item-active');
    if (activeItem) {
        newsTrack.style.height = activeItem.offsetHeight + 'px';
    }

    requestAnimationFrame(() => {
        const style = getComputedStyle(firstItem);
        const marginLeft = parseInt(style.marginLeft) || 0;
        const marginRight = parseInt(style.marginRight) || 0;
        const itemWidth = firstItem.offsetWidth + marginLeft + marginRight;

        const bufferVisiblePx = 32;

        newsTrack.scrollLeft = itemWidth;

        const minScroll = itemWidth / 2;
        const maxScroll = newsTrack.scrollWidth - newsTrack.clientWidth - itemWidth / 2;

        newsTrack.scrollLeft = itemWidth * 3 / 2;

        let isScrolling;
        function updateActiveItem() {
            const trackRect = newsTrack.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            let closestItem = null;
            let closestDistance = Infinity;

            for (let i = 1; i < newsTrack.children.length - 1; i++) {
                const item = newsTrack.children[i];
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;

                const distance = Math.abs(trackCenter - itemCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = item;
                }
            }

            newsTrack.querySelectorAll('.news-item-active').forEach(el => el.classList.remove('news-item-active'));

            if (closestItem) {
                closestItem.classList.add('news-item-active');
            }
        }

        newsTrack.addEventListener('scroll', () => {
            updateActiveItem();

            clearTimeout(isScrolling);

            isScrolling = setTimeout(() => {
                if (newsTrack.scrollLeft < minScroll) {
                    newsTrack.scrollLeft = minScroll;
                } else if (newsTrack.scrollLeft > maxScroll) {
                    newsTrack.scrollLeft = maxScroll;
                }
            }, 100);
        });

        updateActiveItem();

        // ======= DODAJEMY OBSŁUGĘ DRAG MYSZĄ =======

        let isDragging = false;
        let startX;
        let scrollLeft;

        newsTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            newsTrack.classList.add('dragging'); // możesz dodać styl dla kursora
            startX = e.pageX - newsTrack.offsetLeft;
            scrollLeft = newsTrack.scrollLeft;
            e.preventDefault();
        });

        newsTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            newsTrack.classList.remove('dragging');
        });

        newsTrack.addEventListener('mouseup', () => {
            isDragging = false;
            newsTrack.classList.remove('dragging');
        });

        newsTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - newsTrack.offsetLeft;
            const walk = (x - startX) * 2; // 2 to szybkość scrollowania - możesz zmienić
            newsTrack.scrollLeft = scrollLeft - walk;
        });

    });
});
