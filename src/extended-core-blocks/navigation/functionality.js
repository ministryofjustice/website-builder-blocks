/**
 * Functionality for the drawer nav,
 * This:
 * - adds listeners for both opening the menu and screen resize 
 * - collects initial dimensions to be restored upon submenu close
 * - function for opening a submenu, including extra padding to push page content down
 */

// The first nav with the class "drawer"
const drawerNav = document.querySelector("nav.is-style-drawer");
const headerInitialStyles = getComputedStyle(header);
const headerInitialMarginBottom = parseFloat(headerInitialStyles.marginBottom);

if (drawerNav) {
	const navInitialStyles = getComputedStyle(drawerNav);
	const navInitialPaddingBottom = parseFloat(navInitialStyles.paddingBottom);
	const subMenus = drawerNav.querySelectorAll("ul.wp-block-navigation-submenu");
	const openToggle = drawerNav.querySelector(".wp-block-navigation-submenu__toggle");
	const popupMenu = drawerNav.querySelector(".wp-block-navigation__responsive-container");

	const resizeObserver = new ResizeObserver(entries => {
		makeMenuDrawer(drawerNav, subMenus, popupMenu, navInitialPaddingBottom);
	});

	/**
	 * The following sets the resize observer for all elements which resize
	 * The same function is triggered, and code in that function differentiates
	 * between the states.
	 */
	resizeObserver.observe(drawerNav);
	resizeObserver.observe(popupMenu);
	subMenus.forEach(subMenu => {
		resizeObserver.observe(subMenu);
	});
}

function makeMenuDrawer(drawerNav, subMenus, popupMenu, initialPadding) {
	let subMenuOpen = false;
	let tradNav = !drawerNav.querySelector(".is-menu-open");
	// tradNav = A traditional submenu has been opened rather than a popup
	const navBlockWidth = getComputedStyle(drawerNav).width;
	subMenus.forEach(subMenu => {
		if (getComputedStyle(subMenu).visibility != "hidden") {
			// The submenu has been opened
			subMenuOpen = true;
			let subMenuHeight = subMenu.offsetHeight;
			if (tradNav) {
				//desktop only
				subMenu.style.width = navBlockWidth;
				subMenu.style.marginTop = initialPadding + "px";
				drawerNav.style.paddingBottom = (subMenuHeight + initialPadding) + "px";
			} else {
				//popup nav (like mobile)
				const popupMenuHeight = popupMenu.offsetHeight;
				header.style.marginBottom = (headerInitialMarginBottom + popupMenuHeight) + "px";
			}
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

document.addEventListener("click", function (e) {
	if(e.target.matches(".wp-block-navigation__responsive-container-open")) {
		// adds the close functionality to the open button, changes the aria-label accordingly
		let openMenu = document.querySelector(".wp-block-navigation__responsive-container.is-menu-open");
		let button = document.querySelector(".wp-block-navigation__responsive-container-open");
		if (openMenu) {
			// the menu is open, so we close it
			button.setAttribute("aria-label", "Open menu");
			document.querySelector(".wp-block-navigation__responsive-container-close").click();
		} else {
			// the menu is not open
			button.setAttribute("aria-label", "Close menu");
		}
	}
});
