document.addEventListener("DOMContentLoaded", () => {
    const categoryCheckboxes = document.querySelectorAll("#category-checkboxes input[type='radio']");
    const postsContainer = document.getElementById("blog-posts");
    const paginationContainer = document.getElementById("blog-pagination");

    let selectedCategory = null;
    let currentPage = 1;
    let postsData = [];
    let loading = false;

    // ⬇️ Dodaj listener dla każdego radio
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener("change", handleCategoryChange);
    });

    function selectCategoryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("all")) {
            const allRadio = document.getElementById("cat-all");
            if (allRadio) {
                allRadio.checked = true;
                allRadio.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }

    function handleCategoryChange() {
        selectedCategory = Array.from(categoryCheckboxes)
            .find(cb => cb.checked)?.value;

        if (!selectedCategory) {
            postsContainer.innerHTML = "<p>Please select a category.</p>";
            paginationContainer.innerHTML = "";
            return;
        }

        // Obsługa kategorii "All"
        if (selectedCategory === "All") {
            loadCategoryData("All");
        } else {
            loadCategoryData(selectedCategory);
        }
    }


    function loadCategoryData(category) {
        let url;
        if (category === "All") {
            url = "/blog/categories/all.json";
        } else {
            url = `/blog/categories/${category.toLowerCase().replace(/\s+/g, "-")}.json`;
        }

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Category data not found");
                return res.json();
            })
            .then(data => {
                postsData = Array.isArray(data) ? data : [];
                sortPosts();
                currentPage = 1;
                renderPosts();
                setupLoadMore();
            })
            .catch(() => {
                postsContainer.innerHTML = "<p>Failed to load category data.</p>";
                paginationContainer.innerHTML = "";
            });
    }

    function renderPosts(forceRefresh = false) {
        const postsPerPage = 10; // lub Twoja wartość
        const startIndex = 0;
        const endIndex = currentPage * postsPerPage;

        const postsToRender = postsData.slice(startIndex, endIndex);

        if (postsToRender.length === 0) {
            postsContainer.innerHTML = "<p>No posts found.</p>";
            paginationContainer.innerHTML = "";
            return;
        }

        if (forceRefresh) {
            postsContainer.innerHTML = postsToRender.map(postHtml).join("");
        } else if (currentPage === 1) {
            postsContainer.innerHTML = postsToRender.map(postHtml).join("");
        } else {
            // Dodaj tylko nowe posty przy Load More
            const newPosts = postsData.slice(endIndex - postsPerPage, endIndex);
            postsContainer.insertAdjacentHTML("beforeend", newPosts.map(postHtml).join(""));
        }

        if (endIndex >= postsData.length) {
            paginationContainer.innerHTML = ""; // Ukryj przycisk, jeśli koniec
        }
    }

    function postHtml(post) {
        return `
    <div class="slider-item">
      <a href="${post.url}">
        <img src="${post.image || 'images/default.png'}" alt="${post.title || 'Untitled Post'}">
        <div>
          <h4>${post.title || 'Untitled Post'}</h4>
          <h4>${post.subcategory || 'Uncategorized'}</h4>
          <span>
            <p>${post.date || 'Unknown Date'}</p>
            <p>${post.readingTime || 'Unknown Read Time'}</p>
          </span>
        </div>
      </a>
    </div>
    `;
    }



    function setupLoadMore() {
        // Jeśli wszystkie posty już są wyświetlone, nie twórz przycisku
        const postsPerPage = 1;
        if (postsData.length <= postsPerPage) {
            paginationContainer.innerHTML = "";
            return;
        }

        paginationContainer.innerHTML = `<button id="load-more-btn">Load more</button>`;
        document.getElementById("load-more-btn").onclick = () => {
            currentPage++;
            renderPosts();
        };
    }

    categoryCheckboxes.forEach(cb => cb.addEventListener("change", handleCategoryChange));

    postsContainer.innerHTML = "<p>Please select a category.</p>";
    paginationContainer.innerHTML = "";


    const sortRadios = document.querySelectorAll("#sort-options input[type='radio']");
    let selectedSort = "newest"; // domyślnie newest

    // Nasłuchuj zmian
    sortRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            selectedSort = Array.from(sortRadios).find(r => r.checked)?.value || "newest";
            sortPosts();
            renderPosts(true); // ⬅️ tryb pełnego odświeżenia
        });
    });


    function sortPosts() {
        postsData.sort((a, b) => {
            // Upewnij się, że data jest typu Date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (selectedSort === "newest") {
                return dateB - dateA; // najnowsze najpierw
            }
            if (selectedSort === "oldest") {
                return dateA - dateB; // najstarsze najpierw
            }
            if (selectedSort === "reading-asc") {
                const timeA = parseReadingTime(a.readingTime);
                const timeB = parseReadingTime(b.readingTime);
                return timeA - timeB; // rosnąco
            }
            if (selectedSort === "reading-desc") {
                const timeA = parseReadingTime(a.readingTime);
                const timeB = parseReadingTime(b.readingTime);
                return timeB - timeA; // malejąco
            }
            return 0; // brak zmiany
        });
    }

    // Pomocnicza funkcja do readingTime: np. "5 min read" -> 5
    function parseReadingTime(str) {
        if (!str) return 0;
        const match = str.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }





    document.querySelectorAll('#category-checkboxes input[type="radio"]').forEach(cb => cb.checked = false);
    const allRadio = document.getElementById("cat-all");
    if (allRadio) {
        allRadio.checked = true;
        handleCategoryChange();
    }

    // Toggle filter options visibility, by pressing #filter>button
    const filterButton = document.querySelector("#filter > button");
    const filterOptions = document.querySelector("#filter-options");
    filterButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Zatrzymaj propagację!
        filterOptions.classList.toggle("visible");
        sortOptions.classList.remove("visible"); // Hide sort options
    });
    filterOptions.addEventListener("click", e => e.stopPropagation()); // Nie zamykaj po kliknięciu w panel

    // Toggle sort options visibility, by pressing #sort>button
    const sortButton = document.querySelector("#sort > button");
    const sortOptions = document.querySelector("#sort-options");
    sortButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Zatrzymaj propagację!
        sortOptions.classList.toggle("visible");
        filterOptions.classList.remove("visible"); // Hide filter options
    });
    sortOptions.addEventListener("click", e => e.stopPropagation()); // Nie zamykaj po kliknięciu w panel

    // ZAMYKANIE PO KLIKNIĘCIU POZA
    document.addEventListener("click", () => {
        filterOptions.classList.remove("visible");
        sortOptions.classList.remove("visible"); // Analogicznie dla sortOptions
    });

    // Change button image source based on sort-options visibility
    const sortButtonImg = sortButton.querySelector("img"); // Assuming there's an <img> element for the icon
    sortOptions.addEventListener("transitionend", () => {
        if (sortOptions.classList.contains("visible")) {
            sortButtonImg.src = "/images/arrow-up-off.png"; // Replace with the path to the visible icon
        } else {
            sortButtonImg.src = "/images/arrow-down-off.png"; // Replace with the path to the hidden icon
        }
    });

    // Change button image source based on filter-options visibility
    const filterButtonImg = filterButton.querySelector("img"); // Assuming there's an <img> element for the icon
    filterOptions.addEventListener("transitionend", () => {
        if (filterOptions.classList.contains("visible")) {
            filterButtonImg.src = "/images/close-off.png"; // Replace with the path to the visible icon
        } else {
            filterButtonImg.src = "/images/filter-off.png"; // Replace with the path to the hidden icon
        }
    }
    );



    let pagefind;
    import("/pagefind/pagefind.js").then(mod => {
        pagefind = mod;
        pagefind.init();

        // Move your search event listeners inside here
        const input = document.getElementById("search-input");
        const button = document.getElementById("search-button");
        const resultsContainer = document.getElementById("search-results");

        async function displayResults(query) {
            if (!query.trim()) {
                resultsContainer.innerHTML = "<p>Please enter a search query.</p>";
                return;
            }
            const search = await pagefind.search(query);
            if (search.results.length === 0) {
                resultsContainer.innerHTML = "<p>No results found.</p>";
                return;
            }
            const resultsData = await Promise.all(
                search.results.slice(0, 5).map(result => result.data())
            );
            resultsContainer.innerHTML = resultsData.map(r => `
            <div class="search-result-item">
                <a href="${r.url}">
                    <h3>${r.meta?.title || "No Title"}</h3>
                    <p>${r.excerpt || ""}</p>
                </a>
            </div>
        `).join("");
        }

        button.addEventListener("click", () => {
            displayResults(input.value);
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                displayResults(input.value);
            }
        });
    });


    // ...existing code...
    const searchResults = document.getElementById("search-results");
    let isDragging = false;
    let startX;
    let scrollLeft;

    searchResults.addEventListener("mousedown", (e) => {
        isDragging = true;
        searchResults.classList.add("dragging");
        startX = e.pageX - searchResults.offsetLeft;
        scrollLeft = searchResults.scrollLeft;
        e.preventDefault();
    });

    searchResults.addEventListener("mouseleave", () => {
        isDragging = false;
        searchResults.classList.remove("dragging");
    });

    searchResults.addEventListener("mouseup", () => {
        isDragging = false;
        searchResults.classList.remove("dragging");
    });

    searchResults.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - searchResults.offsetLeft;
        const walk = (x - startX) * 2;
        searchResults.scrollLeft = scrollLeft - walk;
    });

    selectCategoryFromUrl();
});
