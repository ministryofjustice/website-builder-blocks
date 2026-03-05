document.querySelectorAll(".wb-accordion").forEach(accordion => {
	const button = accordion.querySelector(".accordion-toggle-all");
	const sections = accordion.querySelectorAll("details");
	let openSections = accordion.querySelectorAll("details[open]");
	let allSectionsOpen = sections.length == openSections.length;
	if (allSectionsOpen) setAccordionState(button, "open"); //initial state is all open, button changed to close all

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			openSections = accordion.querySelectorAll("details[open]");
			allSectionsOpen = sections.length == openSections.length;
			if (mutation.target.closest(".accordion-toggle-all")) return;
			if (allSectionsOpen) {
				setAccordionState(button, "open"); //state is open, button will now close all
				return;
			} else {
				setAccordionState(button, "closed"); //state is closed, button will now open all
				return;
			}
		});
	});

	observer.observe(accordion, {
	  subtree: true,     // watch all children
	  attributes: true,  // detect attribute changes
	});

	button.addEventListener("click", function(e) {
		e.preventDefault();
		console.log("Clicked",this.dataset.state);
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
