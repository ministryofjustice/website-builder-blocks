
/**
 * Functionality for the drawer nav,
 * This:
 * - adds listeners for both opening the menu and screen resize 
 * - collects initial dimensions to be restored upon submenu close
 * - function for opening a submenu, including extra padding to push page content down
 */

// The first nav with the class "drawer"
const drawerNav = document.querySelector("nav.is-style-drawer");

if (drawerNav) {
	const navInitialStyles = getComputedStyle(drawerNav);
	const navInitialPaddingBottom = parseFloat(navInitialStyles.paddingBottom);
	const subMenus = drawerNav.querySelectorAll("ul.wp-block-navigation-submenu");
	const openToggle = drawerNav.querySelector(".wp-block-navigation-submenu__toggle");

	window.addEventListener('resize', () => {
		makeSubMenuDrawer(drawerNav, subMenus, navInitialPaddingBottom);
	});

	const observer = new MutationObserver(mutations => {
		makeSubMenuDrawer(drawerNav, subMenus, navInitialPaddingBottom);
	});
	  
	observer.observe(openToggle, {
		attributes: true
	});
}

function makeSubMenuDrawer(drawerNav, subMenus, initialPadding) {
	let subMenuOpen = false;
	
	subMenus.forEach(subMenu => {
		if (getComputedStyle(subMenu).visibility != "hidden") {
			// The submenu has been opened
			subMenuOpen = true;
			let subMenuHeight = subMenu.offsetHeight;
			drawerNav.style.paddingBottom = (subMenuHeight + initialPadding) + "px";
			subMenu.style.marginTop = initialPadding + "px";
		}
	});
	if (!subMenuOpen) {
		// No submenu is opened
		drawerNav.style.paddingBottom = initialPadding + "px"; //Restore the bottom padding to original
	}
}
