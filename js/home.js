
document.addEventListener('DOMContentLoaded', function () {
    let newsTrack = document.querySelector('.news-track');
    const items = newsTrack.querySelectorAll('.news-item');
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const clonedFirstItem = firstItem.cloneNode(true);
    const clonedLastItem = lastItem.cloneNode(true);
    clonedFirstItem.querySelectorAll('a').forEach(a => {
        const content = a.innerHTML;
        const parent = a.parentNode;
        parent.removeChild(a);
        parent.innerHTML += content;
    });
    clonedLastItem.querySelectorAll('a').forEach(a => {
        const content = a.innerHTML;
        const parent = a.parentNode;
        parent.removeChild(a);
        parent.innerHTML += content;
    });

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
            }, 50);
        });

        updateActiveItem();

        let isDragging = false;
        let startX;
        let scrollLeft;

        newsTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            newsTrack.classList.add('dragging');
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
            const walk = (x - startX) * 2;
            newsTrack.scrollLeft = scrollLeft - walk;
        });

    });

    const slider = document.querySelector('#slider');
    const sliderItems = slider.querySelectorAll('.slider-item');
    for (let i = 0; i < sliderItems.length; i++) {
        const clonedItem = sliderItems[i].cloneNode(true);
        slider.appendChild(clonedItem);
    }

    newsTrack.addEventListener('transitionend', () => {
        const activeItem = newsTrack.querySelector('.news-item-active');
        if (activeItem) {
            newsTrack.style.height = activeItem.offsetHeight + 'px';
        }
    }, { once: true });



    const upperInner = document.querySelector('#news-container-upper-inner');
    const upperInnerItems = upperInner.querySelectorAll('.news-item-b');
    const upperMain = document.querySelector('#news-container-upper > .news-item-b:first-child');
    const lower = document.querySelector('#news-container-lower');

    upperMain.style.opacity = '1';
    upperInnerItems.forEach(item => {
        item.style.opacity = '0.9';
    });
    lower.style.opacity = '1';

    upperInnerItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            upperInnerItems.forEach(i => i.style.opacity = '0.9');
            item.style.opacity = '1';
            upperMain.style.opacity = '0.9';
            lower.style.opacity = '0.9';
        });
        item.addEventListener('mouseleave', () => {
            item.style.opacity = '0.9';
            upperInnerItems.forEach(i => i.style.opacity = '0.9');
            upperMain.style.opacity = '1'; 
            lower.style.opacity = '1';
        });
    });

});