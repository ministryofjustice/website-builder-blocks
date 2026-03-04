document.querySelectorAll(".accordion-toggle-all").forEach(button => {
	button.addEventListener("click", function(e) {
		const isOpen = this.dataset.state === "open";
		const openText = this.dataset.opentext || "Expand all sections";
		const closeText = this.dataset.closetext || "Collapse all sections";
		const parent = this.parentElement;
		const sections = parent.querySelectorAll("details");
		if (isOpen) {
			//close all sections
			sections.forEach(section => {
				section.open = false;
			});
			//change text
			this.innerText = closeText;
		} else {
			//open all sections
			sections.forEach(section => {
				section.open = true;
			});
			this.innerText = openText;
		}
		
    	this.dataset.state = isOpen ? "closed" : "open";
		e.stopPropagation();
	});
});