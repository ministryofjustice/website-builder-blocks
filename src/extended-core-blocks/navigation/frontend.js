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
		// Position the open submenu so that the left edge of one of its columns lines up with
		// the left edge of the toggle that opened it.
		//
		// The submenu band spans the full width of the header; only its padding-left is changed.
		// We prefer the first column under the toggle. If the menu would then run off the page
		// we try the second column, then the third, and so on. Only if no column fits do we fall
		// back to simply keeping the menu on the page.
		//
		// Nothing here depends on the number of items or on the orientation - the grid in CSS
		// decides the columns, and we measure what it rendered.
		snapSubMenuToControl(subMenu, drawerNav);
		const subMenuHeight = subMenu.offsetHeight;

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
			subMenu.style.paddingLeft = "";
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

function snapSubMenuToControl(subMenu, drawerNav) {
	// Reset to the stylesheet padding so we can read the page padding and measure a clean layout
	subMenu.style.paddingLeft = "";
	const subMenuStyles = getComputedStyle(subMenu);
	const pagePaddingLeft = parseFloat(subMenuStyles.paddingLeft) || 0;
	const pagePaddingRight = parseFloat(subMenuStyles.paddingRight) || 0;

	const page = drawerNav.closest("header").getBoundingClientRect();
	const band = subMenu.getBoundingClientRect();
	const control = subMenu.closest("li.wp-block-navigation-item");

	const items = Array.from(subMenu.children);
	if (items.length === 0) {
		return;
	}

	// We align text with text (the label inside the toggle with the label inside a child link),
	// because the toggle and the child links have different internal padding.
	const textLeft = item => {
		const label = item.querySelector(":scope > .wp-block-navigation-item__content .wp-block-navigation-item__label");
		return (label || item).getBoundingClientRect().left;
	};
	const anchor = textLeft(control);

	const boxes = items.map(item => item.getBoundingClientRect());
	const texts = items.map(textLeft);
	const contentLeft = Math.min(...boxes.map(box => box.left));
	const contentWidth = Math.max(...boxes.map(box => box.right)) - contentLeft;
	const firstText = Math.min(...texts);
	const textInset = firstText - contentLeft; // from the edge of the content to the first label

	// Distances from the first label to the label at the start of each column (grid tracks are
	// max-content, so these do not change when the padding changes)
	const columnOffsets = [...new Set(texts.map(text => Math.round(text - firstText)))].sort((a, b) => a - b);

	const minLeft = page.left + pagePaddingLeft;
	const maxLeft = page.right - pagePaddingRight - contentWidth;

	// Prefer the first column under the toggle; if the menu would leave the page, try the next column
	let left = columnOffsets.map(offset => anchor - offset - textInset).find(x => x >= minLeft && x <= maxLeft);
	if (left === undefined) {
		// No column can line up with the control without leaving the page - just keep it on the page
		left = Math.min(Math.max(anchor - textInset, minLeft), maxLeft);
	}

	subMenu.style.paddingLeft = `${left - band.left}px`;
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
