
/**
 *
 * Table of contents "scrollspy", highlight current scroll location
 *
 */

( function() {
	indicateCurrentLocation();
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
