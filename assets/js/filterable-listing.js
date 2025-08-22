document.addEventListener("DOMContentLoaded", function () {

  // Get the taxonomies and their terms from the localized script object
  const taxonomies = filterable_listing_object.taxonomies;

  // Function to handle changes in the parent topic dropdown
  function handleTopicChange(parentClass, childClass, selected_topic) {
    if (selected_topic > 0) {
      const termsWithParents = getTermsWithMatchingParents(selected_topic);

      // Update subtopics dropdown based on whether any matching subtopics were found
      if (termsWithParents.length > 0) {
        populateSubTopics(childClass, termsWithParents);
        const childEl = document.querySelector(childClass);
        if (childEl) {
          childEl.disabled = false;
        }
        
        const wrapper = document.querySelector(childClass + "-wrapper");
        if (wrapper) {
          wrapper.classList.remove("hidden");
        }
      } else {
        resetSubTopics(childClass);
      }
    } else {
      resetSubTopics(childClass);
    }
  }

  // Function to find terms with parents matching the selected topic
  function getTermsWithMatchingParents(selected_topic) {
    const termsWithParents = [];

    // Loop through each taxonomy and its terms
    Object.keys(taxonomies).forEach(taxonomy => {
      if (Array.isArray(taxonomies[taxonomy])) { // Ensure the terms are in array form
        taxonomies[taxonomy].forEach(termData => {
          if (termData.parent && termData.parent == selected_topic) {
            termsWithParents.push(termData);
          }
        });
      }
    });

    return termsWithParents;
  }

  // Populate subtopics dropdown with matching terms
  function populateSubTopics(childClass, termsWithParents) {
    resetSubTopics(childClass);

    termsWithParents.forEach(term => {
      const childEl = document.querySelector(childClass);
      if (childEl) {
        childEl.appendChild(new Option(term.name, term.term_id));
      }
    });
  }

  // Reset the subtopics dropdown
  function resetSubTopics(childClass) {
    const childEl = document.querySelector(childClass);
    if (!childEl) return;

    // Clear existing options
    childEl.innerHTML = "";

    // Add default option
    const option = new Option("Select option", "");
    childEl.appendChild(option);

    // Disable dropdown
    childEl.disabled = true;

    // Add class to wrapper
    const wrapper = document.querySelector(childClass + "-wrapper");
    if (wrapper) {
      wrapper.classList.add("hidden");
    }
  }

  const blocks = document.querySelectorAll('div.wb-block-filterable-listing');

  blocks.forEach(block => {
    const blockId = block.getAttribute('data-block-id');
    const taxFilters = block.getAttribute('data-tax-filters');

    if (taxFilters && taxFilters !== '') {
      const taxFilterArray = taxFilters.split(',');
      
      taxFilterArray.forEach(taxonomy => {
      
        const parentClass = `#${taxonomy}-filter-topic-${blockId}`;
        const childClass = `#${taxonomy}-filter-subtopic-${blockId}`;

        const parentEl = document.querySelector(parentClass);
        const childEl = document.querySelector(childClass);

        if (parentEl && childEl) {
          parentEl.addEventListener("change", function () {
            const selected_topic = this.value;
            handleTopicChange(parentClass, childClass, selected_topic);
          });
        }

      });
    }

  });

});
