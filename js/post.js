document.addEventListener("DOMContentLoaded", function () {
    const aside = document.querySelector("aside");
    const sentinel = document.querySelector("#main-section span");

    const sentinelObserver = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                aside.classList.add("visible");
            } else {
                aside.classList.remove("visible");
            }
        },
        { root: null, threshold: 0 }
    );

    sentinelObserver.observe(sentinel);

    const tocList = aside.querySelector("ul");
    const tocToggle = document.querySelector("#toc-toggle");
    const headings = document.querySelectorAll("article section h1");
    const sections = document.querySelectorAll("article section");

    headings.forEach((h, i) => {
        if (!h.id) {
            h.id = `section-heading-${i + 1}`;
        }
    });

    const tocLinks = tocList.querySelectorAll("li");
    const tocToggleImg = document.querySelector("#toc-toggle img");

    tocToggle.addEventListener("click", () => {
        const expanded = tocList.classList.toggle("expanded");
        tocToggle.setAttribute("aria-expanded", expanded);
        tocToggleImg.src = expanded ? "/images/arrow-up-off.png" : "/images/arrow-down-off.png";
    });

    tocLinks.forEach(link => {
        link.addEventListener("click", () => {
            tocList.classList.remove("expanded");
            tocToggle.setAttribute("aria-expanded", false);
            tocToggleImg.src = "/images/arrow-down-off.png";
        });
    });

    // Tu jest poprawiona funkcja
    function updateActiveHeader() {
        const viewportOffset = 100; // px od góry
        let selectedSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportOffset && rect.bottom > viewportOffset) {
                selectedSection = section;
            }
        });

        if (!selectedSection) {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && !selectedSection) {
                    selectedSection = section;
                }
            });
        }

        if (!selectedSection) {
            tocLinks.forEach(li => li.classList.remove("active-header"));
            return;
        }

        const h1 = selectedSection.querySelector("h1");
        if (!h1) return;

        tocLinks.forEach(li => {
            const a = li.querySelector("a");
            if (!a) return;
            li.classList.toggle("active-header", a.getAttribute("href") === `#${h1.id}`);
        });
    }

    // IntersectionObserver wywołuje updateActiveHeader, ale to będzie często mało potrzebne
    const observer = new IntersectionObserver(
        () => {
            updateActiveHeader();
        },
        {
            root: null,
            rootMargin: "-40% 0px -40% 0px",
            threshold: [0, 0.1, 0.5, 1]
        }
    );

    sections.forEach(section => observer.observe(section));

    // Wywołujemy od razu i przy scroll/resize, żeby mieć zawsze aktualny stan
    updateActiveHeader();
    window.addEventListener("scroll", updateActiveHeader);
    window.addEventListener("resize", updateActiveHeader);
});
