document.querySelectorAll(".wb-accordion").forEach(accordion => {
	const button = accordion.querySelector(".accordion-toggle-all");
	const openText = button.dataset.opentext || "Expand all sections";
	const closeText = button.dataset.closetext || "Collapse all sections";
	const sections = accordion.querySelectorAll("details");

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			const openSections = accordion.querySelectorAll("details[open]");
			const allSectionsOpen = sections.length == openSections.length;
			if (mutation.target.closest(".accordion-toggle-all")) return;
			if (allSectionsOpen) {
				// all sections open - set button to close all
				button.dataset.state = "open";
				button.innerText = closeText;
				return;
			} else {
				// at least one section shut - set button to open all
				button.dataset.state = "closed";
				button.innerText = openText;
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
