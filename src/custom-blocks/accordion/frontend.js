document.querySelectorAll(".wb-accordion").forEach(accordion => {
	const button = accordion.querySelector(".accordion-toggle-all");
	const sections = accordion.querySelectorAll("details");
	let openSections = accordion.querySelectorAll("details[open]");
	let allSectionsOpen = sections.length == openSections.length;
	if (button) setAccordionState(button, allSectionsOpen ? "open" : "closed");

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			openSections = accordion.querySelectorAll("details[open]");
			allSectionsOpen = sections.length == openSections.length; // recalculate - it may have changed since page
			if (mutation.target.closest(".accordion-toggle-all")) return;
			setAccordionState(button, allSectionsOpen ? "open" : "closed");
		});
	});

	observer.observe(accordion, {
	  subtree: true,     // watch all children
	  attributes: true,  // detect attribute changes
	});

	button.addEventListener("click", function(e) {
		e.preventDefault();
		if (this.dataset.state === "open") {
			//close all sections
			sections.forEach(section => {
				section.open = false;
			});
		} else {
			//open all sections
			sections.forEach(section => {
				section.open = true;
			});
		}
		
		e.stopPropagation();
	});
});

function setAccordionState(button, state) {
	button.classList.remove("hidden");
	const openText = button.dataset.opentext || "Expand all sections";
	const closeText = button.dataset.closetext || "Collapse all sections";
	if (state == "open") {
		// all sections open - set button to close all
		button.dataset.state = "open";
		button.innerText = closeText;
	} else {
		// at least one section shut - set button to open all
		button.dataset.state = "closed";
		button.innerText = openText;
	}
}
