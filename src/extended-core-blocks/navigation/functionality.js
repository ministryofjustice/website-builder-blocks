///////// TO DO: We need to split this file up

/**
 * Functionality for the drawer nav,
 * This:
 * - adds listeners for both opening the menu and screen resize 
 * - collects initial dimensions to be restored upon submenu close
 * - function for opening a submenu, including extra padding to push page content down
 */

// The first nav with the class "drawer"
const drawerNav = document.querySelector("nav.is-style-drawer"); 
///////// TO DO: We need to ensure that it is the first visible - hidden ones might come before!
const detachedNav = document.querySelector("nav.is-style-detached");
///////// TO DO: We need to ensure that it is the first visible - hidden ones might come before!

const headerInitialStyles = getComputedStyle(header);
const headerInitialMarginBottom = parseFloat(headerInitialStyles.marginBottom);

if (drawerNav) {
	const navInitialStyles = getComputedStyle(drawerNav);
	const navInitialPaddingBottom = parseFloat(navInitialStyles.paddingBottom);
	const subMenus = drawerNav.querySelectorAll("ul.wp-block-navigation-submenu");

	const resizeObserver = new ResizeObserver(entries => {
		makeMenuDrawer(drawerNav, subMenus, navInitialPaddingBottom);
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

function makeMenuDrawer(drawerNav, subMenus, initialPadding) {
	let subMenuOpen = false;
	const navBlockWidth = getComputedStyle(drawerNav).width;
	subMenus.forEach(subMenu => {
		if (getComputedStyle(subMenu).visibility != "hidden") {
			// The submenu has been opened
			subMenuOpen = true;
			let subMenuHeight = subMenu.offsetHeight;
			subMenu.style.width = navBlockWidth;
			subMenu.style.marginTop = initialPadding + "px";
			drawerNav.style.paddingBottom = (subMenuHeight + initialPadding) + "px";
		}
	});
	if (!subMenuOpen) {
		// No submenu is opened
		header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
		drawerNav.style.paddingBottom = initialPadding + "px"; //Restore the bottom padding to original
		subMenus.forEach(subMenu => {
			subMenu.style.width = "";
			subMenu.style.marginTop = "";
		});
	}
}

if (detachedNav) {
	const popupMenu = detachedNav.querySelector(".wp-block-navigation__responsive-container");
	const button = detachedNav.querySelector(".wp-block-navigation__responsive-container-open");

	const resizeObserver = new ResizeObserver(entries => {
		makeMenuDetached(detachedNav, popupMenu, button);
	});

	/**
	 * The following sets the resize observer for all elements which resize
	 * The same function is triggered, and code in that function differentiates
	 * between the states.
	 */
	resizeObserver.observe(popupMenu);
}

function makeMenuDetached(detachedNav, popupMenu, button) {
	if (getComputedStyle(popupMenu).display != "none") {
		// The menu has been opened
		header.style.marginBottom = (headerInitialMarginBottom + popupMenu.offsetHeight) + "px";
		button.setAttribute("aria-label", detachedNav.dataset.closeText);
		button.setAttribute("aria-expanded", "true");
	} else {
		// Menu is not opened
		header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
		button.setAttribute("aria-label", detachedNav.dataset.openText);
		button.setAttribute("aria-expanded", "false");
	}
}

document.addEventListener("click", function (e) {
	if(e.target.matches(".is-style-detached .wp-block-navigation__responsive-container-open")) {
		// adds the close functionality to the open button
		const openMenu = document.querySelector(".is-style-detached .wp-block-navigation__responsive-container.is-menu-open");

		if (openMenu) {
			// the menu is open, so we close it
			document.querySelector(".wp-block-navigation__responsive-container-close").click();
		}
	}
});
