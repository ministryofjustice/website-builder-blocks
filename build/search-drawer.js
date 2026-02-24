
/**
 * Functionality for the search drawer
 */

const header = document.querySelector("header");
const headerSearchBlockWrapper = header.querySelector(".wb-search-block-wrapper");
const headerSearchToggle = header.querySelector(".wb-search-toggle");
const headerSearchToggleButton = header.querySelector(".wb-search-toggle .wp-block-search-toggle-button");
const headerSearchFormWrapper = header.querySelector(".wb-search-form-wrapper");
const headerSearchForm = header.querySelector(".wb-search-form-wrapper .wp-block-search");
const headerSearchLabel = header.querySelector(".wb-search-form-wrapper .wp-block-search__label");
const headerSearchInsideWrapper = header.querySelector(".wb-search-form-wrapper .wp-block-search__inside-wrapper");

// store original inline width (if any) as this is set by block settings
const originaSearchWidth = headerSearchInsideWrapper ? headerSearchInsideWrapper.style.width : "";

if (headerSearchToggle && headerSearchBlockWrapper && headerSearchFormWrapper) {
	headerSearchToggle.addEventListener("click", () => {
		toggleSearchDrawer();
	});

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                //close search draw if toggle hidden
                if (!entry.isIntersecting) {
                    closeSearchDrawer();
                } 
            },
            {
                threshold: 0
            }
        );

        observer.observe(headerSearchToggle);
    }
}

function toggleSearchDrawer() {
    const isOpen = headerSearchBlockWrapper.classList.toggle("search-drawer-open");
        
    if (isOpen) {
        openSearchDrawer();
    } else {
        closeSearchDrawer();
    }
}

function openSearchDrawer() {
    headerSearchFormWrapper.classList.add("is-layout-constrained");
    headerSearchLabel.classList.remove("screen-reader-text");
    headerSearchForm.classList.remove("wp-block-search__button-inside");
    headerSearchForm.classList.add("wp-block-search__button-outside");
    headerSearchInsideWrapper.style.width = "";
    headerSearchToggleButton.setAttribute("aria-label", "Close search");
    
    const height = headerSearchFormWrapper.offsetHeight;
    header.style.marginBottom = `${height}px`;

    // Send an opened event - so that other drawers can close. i.e.navigation.
    window.dispatchEvent(new CustomEvent('wb-drawer-opened', { detail: { source: 'search' } }));
    // Listen for open events - close this drawer if another one opens.
    window.addEventListener('wb-drawer-opened', closeSearchDrawer, { once: true });
}

function closeSearchDrawer() {
    header.style.marginBottom = "";
    headerSearchFormWrapper.classList.remove("is-layout-constrained");
    headerSearchLabel.classList.add("screen-reader-text");
    headerSearchForm.classList.add("wp-block-search__button-inside");
    headerSearchForm.classList.remove("wp-block-search__button-outside");
    headerSearchInsideWrapper.style.width = originaSearchWidth;
    headerSearchToggleButton.setAttribute("aria-label", "Open search");
    headerSearchBlockWrapper.classList.remove("search-drawer-open");

    // Stop listening for drawer events.
    window.removeEventListener('wb-drawer-opened', closeSearchDrawer, { once: true });
}