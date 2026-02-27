///////// TO DO: We need to split this file up

/**
 * Functionality for the drawer nav,
 * This:
 * - adds listeners for both opening the menu and screen resize 
 * - collects initial dimensions to be restored upon submenu close
 * - function for opening a submenu, including extra padding to push page content down
 */

// The first nav with the class "drawer" there should be only one on a page
const drawerNavs = document.querySelectorAll("nav.is-style-drawer");

// It is reasonable to have more than one detached nav, so we apply functionality to all of them
const detachedNavs = document.querySelectorAll("nav.is-style-detached");


const headerInitialStyles = getComputedStyle(header);
const headerInitialMarginBottom = parseFloat(headerInitialStyles.marginBottom);

for (const [index, drawerNav] of drawerNavs.entries()) {
	const navInitialStyles = getComputedStyle(drawerNav);
	const navInitialPaddingBottom = parseFloat(navInitialStyles.paddingBottom);
	const subMenus = drawerNav.querySelectorAll("ul.wp-block-navigation-submenu");

	const resizeObserver = new ResizeObserver(entries => {
		makeMenuDrawer(drawerNav, subMenus, navInitialPaddingBottom, index);
	});

	/**
	 * The following sets the resize observer for all elements which resize
	 * The same function is triggered, and code in that function differentiates
	 * between the states.
	 */
	resizeObserver.observe(drawerNav);
	subMenus.forEach(subMenu => {
		resizeObserver.observe(subMenu);
	});

}

function makeMenuDrawer(drawerNav, subMenus, initialPadding, index) {
	const navBlockWidth = getComputedStyle(drawerNav).width;

	// Find the open submenu
	const subMenu =  Array.from(subMenus).find(subMenu => getComputedStyle(subMenu).visibility !== "hidden");

	if(subMenu) {
		let subMenuHeight = subMenu.offsetHeight;
		subMenu.style.width = navBlockWidth;
		subMenu.style.marginTop = initialPadding + "px";
		header.style.marginBottom = subMenuHeight + "px";
		header.setAttribute('data-margin-bottom-owner', `navigation-drawer-${index}`);

		// The default behaviour for this menu is that it is closed when the user clicks elsewhere.
		//   so, we don't need to listen for when the search drawer is opened here.
		// Send an opened event - so that other drawers can close. i.e. Search drawer.
		window.dispatchEvent(new CustomEvent('wb-drawer-opened', { detail: { source: `navigation-drawer-${index}` } }));
	} else {
		// No submenu is opened

		// Only clear the header margin bottom if the menu that is closing is the one that set the it.
		// This prevents a race condition where it's just been set elsewhere.
		if(header.getAttribute('data-margin-bottom-owner') === `navigation-drawer-${index}`) {
			header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
			header.removeAttribute('data-margin-bottom-owner');
		}

		drawerNav.style.paddingBottom = initialPadding + "px"; //Restore the bottom padding to original
		subMenus.forEach(subMenu => {
			subMenu.style.width = "";
			subMenu.style.marginTop = "";
		});
	}
}

for (const [index, detachedNav] of detachedNavs.entries()) {
	const popupMenu = detachedNav.querySelector(".wp-block-navigation__responsive-container");
	const button = detachedNav.querySelector(".wp-block-navigation__responsive-container-open");

	// Create a stable function for the close handler
	const closeMenu = () => {
		const openMenu = detachedNav.querySelector(".wp-block-navigation__responsive-container.is-menu-open");
		if (openMenu && button.getAttribute("aria-expanded") == "true") {
			// the menu is open, so we close it
			detachedNav.querySelector(".wp-block-navigation__responsive-container-close").click();
		}
	}

	// Initialise the nav, add event listeners once.
	initMenuDetached(detachedNav, closeMenu, index);

	const resizeObserver = new ResizeObserver(entries => {
		makeMenuDetached(detachedNav, popupMenu, button, closeMenu, index);
	});

	/**
	 * The following sets the resize observer for all elements which resize
	 * The same function is triggered, and code in that function differentiates
	 * between the states.
	 */
	resizeObserver.observe(popupMenu);
}

function initMenuDetached(detachedNav, closeMenu, index) {
	// Listen for open events - close this drawer if another one opens.
	window.addEventListener(
		'wb-drawer-opened',
		// closeMenu
		({ detail }) => detail.source !== `navigation-detached-${index}` && closeMenu()
	);

	/**
	 * WORK AROUND
	 *
	 * Issue: when a menu is clicked when a submenu above it is already open, that is closed
	 * before the click is registered, meaning that the link doesn't receive the mouse up event,
	 * so the click isn't completed (bad).
	 *
	 * Fix: we look for that state of affairs and trigger the click on the mousedown event.
	 */
	detachedNav.addEventListener("mousedown", function (e) {
		const openMenu = detachedNav.querySelector(".wp-block-navigation-submenu button[aria-expanded=true]");
		if (openMenu) {
			openMenu.parentNode.classList.add("temp-open-menu");
			if (e.target.matches(".temp-open-menu ~ .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle")) {
				//This is the link which would have been opened had the menu just not changed shape - so we trigger a click event.
				e.target.click();
			}
			openMenu.parentNode.classList.remove("temp-open-menu");
		}
	});
}

function makeMenuDetached(detachedNav, popupMenu, button, closeMenu, index) {
	if (getComputedStyle(popupMenu).display != "none") {
		// The menu has been opened

		// Send an opened event - so that other drawers can close. i.e. Search drawer.
		window.dispatchEvent(new CustomEvent('wb-drawer-opened', { detail: { source: `navigation-detached-${index}` } }));

		header.setAttribute('data-margin-bottom-owner', `navigation-detached-${index}`);
		header.style.marginBottom = (headerInitialMarginBottom + popupMenu.offsetHeight) + "px";

		button.setAttribute("aria-label", detachedNav.dataset.closeText);
		button.setAttribute("aria-expanded", "true");
		button.addEventListener('click', closeMenu, { once: true });
	} else {
		// Menu is not open

		// Only clear the header margin bottom if the menu that is closing is the one that set the it.
		// This prevents a race condition where it's just been set elsewhere.
		if(header.getAttribute('data-margin-bottom-owner') === `navigation-detached-${index}`) {
			header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
			header.removeAttribute('data-margin-bottom-owner');
		}

		button.setAttribute("aria-label", detachedNav.dataset.openText);
		button.setAttribute("aria-expanded", "false");
		button.removeEventListener('click', closeMenu);
	}
}
