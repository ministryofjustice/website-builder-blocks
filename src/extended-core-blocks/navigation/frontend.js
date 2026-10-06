import "./frontend-keyboard.js";
///////// TO DO: We need to split this file up

/**
 * Functionality for the drawer nav,
 * This:
 * - adds listeners for both opening the menu and screen resize
 * - collects initial dimensions to be restored upon submenu close
 * - function for opening a submenu, including extra padding to push page content down
 */

// There should be only one on a page
const drawerNavs = document.querySelectorAll("nav.is-style-drawer");

// It is reasonable to have more than one detached nav, so we apply functionality to all of them
const detachedNavs = document.querySelectorAll("nav.is-style-detached");

const header = document.querySelector("header");
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
	// Find the open submenu
	const subMenu = Array.from(subMenus).find(subMenu => getComputedStyle(subMenu).visibility !== "hidden");

	if (subMenu) {
		// headers span the whole width of the page, so we can use header left and right to be the bounds of the page

		const headerPositions = drawerNav.closest("header").getBoundingClientRect();
		const subMenuHeight = subMenu.offsetHeight;
		const subMenuItems = subMenu.children.length;
		const headerQuarter = headerPositions.right / 4; // one quarter of the width

		// this is the button which opened the submenu
		const controlPositions = subMenu.closest("li.wp-block-navigation-item").getBoundingClientRect();
		const controlWidth = subMenu.closest("li.wp-block-navigation-item").offsetWidth;

		const horizontalSubMenu = drawerNav.classList.contains("has-submenu-orientation-horizontal");

		if (horizontalSubMenu) {
			if (
				subMenuItems === 1 || // 1 item only
				controlPositions.left < headerQuarter || // first quarter
				controlPositions.right > headerQuarter * 3 // last quarter
			) {
				// 1 item or in first/last quarter, we align with the control
				if (controlPositions.left < headerPositions.right / 2) {
					// control is not fully on the right of the page
					subMenu.style.paddingLeft = controlPositions.left + "px";
					subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
					subMenu.classList.add("wbb-left-aligned-submenu");
					subMenu.classList.remove("wbb-centre-aligned-submenu");
					subMenu.classList.remove("wbb-right-aligned-submenu");
				} else {
					// control is fully on the right of the page
					subMenu.style.paddingLeft = "var(--wp--style--root--padding-left, 0)";
					subMenu.style.paddingRight = headerPositions.right - controlPositions.right + "px";
					subMenu.classList.remove("wbb-left-aligned-submenu");
					subMenu.classList.remove("wbb-centre-aligned-submenu");
					subMenu.classList.add("wbb-right-aligned-submenu");
					subMenu.style.setProperty("--control-item-width", `${controlWidth}px`);
				}
			} else if (subMenuItems < 4) {
				// 2 or 3 items (not in first or last quarter) - we centre them around the control
				subMenu.classList.remove("wbb-left-aligned-submenu");
				subMenu.classList.add("wbb-centre-aligned-submenu");
				subMenu.classList.remove("wbb-right-aligned-submenu");

				const roomToRight = headerPositions.right - controlPositions.right;
				const roomToLeft = controlPositions.left;

				if (roomToRight < roomToLeft) {
					// control is further to the right than the left
					// adjust padding to centre around control
					subMenu.style.paddingLeft = `${roomToLeft - roomToRight}px`;
					subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
				} else {
					// control is further to the left than the right
					subMenu.style.paddingRight = `${roomToRight - roomToLeft}px`;
					subMenu.style.paddingLeft = "var(--wp--style--root--padding-left, 0)";
				}
			} else {
				subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
				subMenu.style.paddingLeft = "var(--wp--style--root--padding-left, 0)";
				subMenu.classList.remove("wbb-left-aligned-submenu");
				subMenu.classList.remove("wbb-centre-aligned-submenu");
				subMenu.classList.remove("wbb-right-aligned-submenu");
			}
		} else {
			// not horizontal (i.e. vertical, although maybe we'll have diagonal one day...)
			if (subMenuItems < 9 && controlPositions.right < headerPositions.right / 2) {
				// the menu is on the left of the page
				// submenu is absolutely positioned and spans the whole viewport (100vw)
				// we add padding to position the content
				subMenu.style.paddingLeft = controlPositions.left + "px";
				subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
				subMenu.classList.add("wbb-left-aligned-submenu");
				subMenu.classList.remove("wbb-centre-aligned-submenu");
				subMenu.classList.remove("wbb-right-aligned-submenu");
			} else if (subMenuItems < 9 && controlPositions.left > headerPositions.right / 2) {
				// the menu is on the right of the page
				// we align with the control by giving its first child a minimum width in CSS
				subMenu.style.paddingLeft = "var(--wp--style--root--padding-left, 0)";
				subMenu.style.paddingRight = headerPositions.right - controlPositions.right + "px";
				subMenu.classList.remove("wbb-left-aligned-submenu");
				subMenu.classList.remove("wbb-centre-aligned-submenu");
				subMenu.classList.add("wbb-right-aligned-submenu");
				subMenu.style.setProperty("--control-item-width", `${controlWidth}px`);
			} else if (subMenuItems < 5) {
				// the menu is in the middle of the page and only has one column
				// of items, so we align with its control - like left aligned ones
				subMenu.style.paddingLeft = controlPositions.left + "px";
				subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
				subMenu.classList.add("wbb-left-aligned-submenu");
				subMenu.classList.remove("wbb-right-aligned-submenu");
				subMenu.classList.remove("wbb-centre-aligned-submenu");
			} else {
				// the menu is in the middle of the page
				// or there are loads of items so we need space
				subMenu.style.paddingLeft = "var(--wp--style--root--padding-left, 0)";
				subMenu.style.paddingRight = "var(--wp--style--root--padding-right, 0)";
				subMenu.classList.remove("wbb-left-aligned-submenu");
				subMenu.classList.add("wbb-centre-aligned-submenu");
				subMenu.classList.remove("wbb-right-aligned-submenu");
			}
		}

		// Set this attribute, as a marker to know that we updated the margin bottom most recently.
		header.setAttribute("data-margin-bottom-owner", `navigation-drawer-${index}`);
		header.style.marginBottom = subMenuHeight + "px";

		// The default behaviour for this menu is that it is closed when the user clicks elsewhere.
		//   so, we don't need to listen for when the search drawer is opened here.
		// Send an opened event - so that other drawers can close. i.e. Search drawer.
		window.dispatchEvent(
			new CustomEvent("wb-drawer-opened", {
				detail: { source: `navigation-drawer-${index}` },
			}),
		);
	} else {
		// No submenu is opened

		// Only clear the header margin bottom if the menu that is closing is the one that set the it.
		// This prevents a race condition where it's just been set elsewhere.
		if (header.getAttribute("data-margin-bottom-owner") === `navigation-drawer-${index}`) {
			header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
			header.removeAttribute("data-margin-bottom-owner");
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
	};

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
		"wb-drawer-opened",
		({ detail }) => detail.source !== `navigation-detached-${index}` && closeMenu(),
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
		window.dispatchEvent(
			new CustomEvent("wb-drawer-opened", {
				detail: { source: `navigation-detached-${index}` },
			}),
		);

		// Set this attribute, as a marker to know that we updated the margin bottom most recently.
		header.setAttribute("data-margin-bottom-owner", `navigation-detached-${index}`);
		header.style.marginBottom = headerInitialMarginBottom + popupMenu.offsetHeight + "px";

		button.setAttribute("aria-label", detachedNav.dataset.closeText);
		button.setAttribute("aria-expanded", "true");
		button.addEventListener("click", closeMenu, { once: true });
	} else {
		// Menu is not open

		// Only clear the header margin bottom if the menu that is closing is the one that set the it.
		// This prevents a race condition where it's just been set elsewhere.
		if (header.getAttribute("data-margin-bottom-owner") === `navigation-detached-${index}`) {
			header.style.marginBottom = headerInitialMarginBottom + "px"; //Restore header margin to initial value
			header.removeAttribute("data-margin-bottom-owner");
		}

		button.setAttribute("aria-label", detachedNav.dataset.openText);
		button.setAttribute("aria-expanded", "false");
		button.removeEventListener("click", closeMenu);
	}
}
