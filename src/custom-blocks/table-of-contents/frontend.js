
/**
 *
 * Table of contents "scrollspy", highlight current scroll location
 *
 */

( function() {
	indicateCurrentLocation();
	addSubmenuControl();
})();

document.addEventListener('scroll', function() {
	indicateCurrentLocation();
}, false);

function indicateCurrentLocation(){
	if (!document.querySelector("#table-of-contents.toc-scrollspy")) {
		return;
	}
	let toc = document.querySelector("#table-of-contents");
	let sectionHeadings = document.querySelectorAll(".wb-toc-heading:not(.wb-toc-ignore)"); //list of all headings which are indexed in the Toc
	let contents = toc.querySelectorAll("li"); //list of all items in the ToC
	if (contents.length === 0 || sectionHeadings.length === 0) return; //guard against empty lists
	let i;
	for (i=0; i+1<sectionHeadings.length; i++) {
		let nextPosition = sectionHeadings[i+1].getBoundingClientRect().top;
		if (nextPosition > 150) break; //we stop counting when the next one is above 150 as we are on the current item
	}
	// A small bit of code to ensure the last item is always "current" when at the very bottom of the page.
	const documentHeight = Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.clientHeight,
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight
	);
	const windowHeight = window.innerHeight;
	const maxScroll = documentHeight - windowHeight;

	if (window.scrollY >= maxScroll) i = sectionHeadings.length - 1;

	// We set the "current" class as per the current location
	contents.forEach(item => {
		item.classList.remove("wb-table-of-contents__item--current");
	});
	contents[i].classList.add("wb-table-of-contents__item--current");
}

function addSubmenuControl() {
	if (!document.querySelector("#table-of-contents>.dual-level")) {
		// We don't add the controls if we're in a single-level ToC
		return;
	}
	let toc = document.querySelector("#table-of-contents");
	let topLevelItems = toc.querySelectorAll(".wb-table-of-contents__item:has(.wb-table-of-contents__sub-list)");

	if (!topLevelItems.length) {
		// If no items with sub-list, end here
		return;
	}

	let subMenuControl = document.createElement("button");
	subMenuControl.classList.add("toc-sub-menu-control");
	subMenuControl.classList.add("wp-element-button");
	subMenuControl.setAttribute('aria-label', 'Expand submenu');
	subMenuControl.setAttribute('aria-expanded', 'false');
	subMenuControl.innerHTML = "<span class='toc-sub-menu-control__text'></span>";
	topLevelItems.forEach(element => {
		element.classList.add("has-sub-toc");
	});
	topLevelItems.forEach(e => {
		if (e.querySelector(".toc-sub-menu-control")) return;
		const link = e.querySelector('a');
		const control = subMenuControl.cloneNode(true);
		if (!link || !control) return;

		link.after(control);

		control.addEventListener('click', function() {
			if (control.getAttribute('aria-expanded') == "true" ) {
				control.setAttribute('aria-label', 'Collapse submenu');
				control.setAttribute('aria-expanded', 'false');
			} else {
				document.querySelectorAll('.toc-sub-menu-control').forEach(otherControl => {
					otherControl.setAttribute('aria-label', 'Collapse submenu');
					otherControl.setAttribute('aria-expanded', 'false');
				});
				control.setAttribute('aria-label', 'Expand submenu');
				control.setAttribute('aria-expanded', 'true');
			}
		});
	})
}
