
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
	const popupMenu = drawerNav.querySelector(".wp-block-navigation__responsive-container");

	const resizeObserver = new ResizeObserver(entries => {
		makeSubMenuDrawer(drawerNav, subMenus, popupMenu, navInitialPaddingBottom);
	});

	resizeObserver.observe(drawerNav);

	const observer = new MutationObserver(mutations => {
		makeSubMenuDrawer(drawerNav, subMenus, popupMenu, navInitialPaddingBottom);
	});

	observer.observe(openToggle, {
		attributes: true
	});
}

function makeSubMenuDrawer(drawerNav, subMenus, popupMenu, initialPadding) {
	let subMenuOpen = false;
	tradNav = !drawerNav.querySelector(".is-menu-open");
	// tradNav = A traditional submenu has been opened rather than a popup
	const navBlockWidth = getComputedStyle(drawerNav).width;
	subMenus.forEach(subMenu => {
		if (getComputedStyle(subMenu).visibility != "hidden") {
			// The submenu has been opened
			subMenuOpen = true;
			let subMenuHeight = subMenu.offsetHeight;
			if (tradNav) {
				drawerNav.style.paddingBottom = (subMenuHeight + initialPadding) + "px";
				subMenu.style.marginTop = initialPadding + "px";
				subMenu.style.width = navBlockWidth;
			} else {
				popupMenu.style.top = initialPadding + "px";
				popupMenu.style.width = document.documentElement.clientWidth;
			}
		}
	});
	if (!subMenuOpen) {
		// No submenu is opened
		drawerNav.style.paddingBottom = initialPadding + "px"; //Restore the bottom padding to original
		subMenus.forEach(subMenu => {
			subMenu.style.width = "";
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
