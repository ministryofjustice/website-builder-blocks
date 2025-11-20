import {
	PanelBody,
	ToggleControl,
	TextControl
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls
} from '@wordpress/block-editor';

const { Fragment } = wp.element;

export default function tocEdit({ attributes, setAttributes} ) {

	useEffect(() => {
		let contentArea = document.querySelector('.editor-visual-editor');
		if (!contentArea) {
			return;
		}
		let contentsList = document.getElementById("table-of-contents-contents-list");
		const mutationObserver = new MutationObserver((mutationList) => {
			let headingItems = contentArea.querySelectorAll("h2:not(.wb-toc-ignore)");
			let contentItems = contentsList.querySelectorAll("li");
			if (headingItems.length != contentItems.length) {
				contentsList.innerHTML = "";
				for(let i=0;i<headingItems.length;i++) {
					if (headingItems[i].innerHTML.includes(tocTitle)) continue;
					onClassChange(headingItems[i]); // Live updating of contents item if content is changed without re-writing the entire table of contents
					contentsList.innerHTML += createContentItem(headingItems[i]);
				}
			}

		});
		mutationObserver.observe(contentArea, { childList: true, subtree: true });
	}, []);

	const {
		tocTitle,
		backToTopText,
		sticky,
		scrollSpy,
		tocClassName,
		className
	} = attributes;

	// Set className attribute for PHP frontend to use
	setAttributes({ tocClassName: className });

	const setTocTitle = newTocTitle => {
		setAttributes({ tocTitle: newTocTitle });
	};
	const setBackToTopText = newBackToTopText => {
		setAttributes({ backToTopText: newBackToTopText });
	};
	const setSticky = newSticky => {
		setAttributes({ sticky: newSticky });
	};
	const setScrollSpy = newScrollSpy => {
		setAttributes({ scrollSpy: newScrollSpy });
	};
	const inspectorControls = (
		<InspectorControls>
			<PanelBody
				title={__('Table of contents')}
				initialOpen={true}
			>
				<ToggleControl
					label="Contents tracks down the page"
					help="Designed for the ToC to be in its own column"
					checked={ sticky }
					onChange={ setSticky }
				/>
				<ToggleControl
					label="Highlight the current position"
					help="Marks the current ToC item as you scroll down the page, designed to be used with the above where the ToC is always visible on Desktop displays."
					checked={ scrollSpy }
					onChange={ setScrollSpy }
				/>
				<TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label="Back to top link text"
					help="What text should be used for the link to skip back to the table of contents"
					value={ backToTopText }
					onChange={ setBackToTopText }
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<Fragment >
			{ inspectorControls }
			<div className={`wb-blocks-toc ${tocClassName} ${sticky ? 'toc-sticky' : ''}`}>
				<div id="table-of-contents" class="wb-table-of-contents toc-sticky toc-scrollspy">
					<h2 class="wb-table-of-contents__heading wb-toc-ignore" id="table-of-contents-heading">
						<RichText
							value={tocTitle}
							onChange={ setTocTitle }
						/>
					</h2>
					<ol id="table-of-contents-contents-list" class="wb-table-of-contents__list">
					</ol>
				</div>
			</div>
		</Fragment>
	);
	
}

function createContentItem(heading) {
	// This function creates the entries for the table of contents.
	let additionalClass = "";
	let hintText = "";
	if (heading.innerText.trim() == "") {
		additionalClass = "empty";
		hintText = "Empty item";
	}
	return '<li id="toc-link-for_'+heading.id+'" class="wb-table-of-contents__item '+additionalClass+'"><a href="#'+heading.id+'">'+heading.innerText+hintText+'</a></li>';
}

function onClassChange(node) {
	// Class change happens when any editing is done, so we look for a class change
	// If a class change is detected we run the alterHeading function

	let lastClassString = node.classList.toString();

	const mutationObserver = new MutationObserver((mutationList) => {
		for (const item of mutationList) {
			if (item.attributeName === "class") {
				const classString = node.classList.toString();
				if (classString !== lastClassString) {
					alterHeading(node);
					lastClassString = classString;
					break;
				}
			}
		}
	});

	mutationObserver.observe(node, { attributes: true });

	return mutationObserver;
}
function alterHeading(heading) {
	if (!heading) return;
	let headingContentItem = document.getElementById("toc-link-for_"+heading.id)
	if (!headingContentItem) return; // The function will run before the contents list has been created so this is important

	// Check: has the text changed
	if (heading.innerText != headingContentItem.innerText) {
		headingContentItem.outerHTML = createContentItem(heading);
	}
}
