import { PanelBody, ToggleControl, TextControl } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { useRefEffect } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { RichText, InspectorControls, useBlockProps } from "@wordpress/block-editor";

export default function tocEdit({ attributes, setAttributes }) {
	const { tocTitle, backToTopText, sticky, scrollSpy, dualLevel, customNesting } = attributes;

	// This block reads the editor's DOM to build a live preview of the contents
	// list, which is what made it apiVersion 3's headline problem: once the post
	// editor is iframed, the post content is in a *different document*, so the
	// old code's document.querySelector(".editor-visual-editor") and
	// document.getElementById("table-of-contents-contents-list") both looked in
	// the parent page and found nothing.
	//
	// useRefEffect hands us the block's own DOM node, so everything is resolved
	// relative to it instead of a global document:
	//
	//   node.ownerDocument — the canvas document, whether or not it is an iframe
	//   node.querySelector — this block's own contents list, no id lookup needed
	//
	// It also gives a cleanup function, which the old useEffect had no way to
	// provide: the observers below were previously created and never
	// disconnected, one per heading per rebuild.
	const tocRef = useRefEffect(
		node => {
			const doc = node.ownerDocument;

			// .editor-styles-wrapper exists in both the iframed and non-iframed
			// canvas; body is a last resort.
			const contentArea = doc.querySelector(".editor-styles-wrapper") ?? doc.body;
			const contentsList = node.querySelector("#table-of-contents-contents-list");

			if (!contentArea || !contentsList) {
				return;
			}

			// The original selector was scoped to "main". That element is not
			// guaranteed to exist in the iframed canvas, so fall back to the
			// content area itself — headings the block should skip are excluded
			// by .wb-toc-ignore either way.
			const scope = contentArea.querySelector("main") ?? contentArea;

			const headingObservers = new Set();

			const rebuildContentsList = () => {
				const headingItems = scope.querySelectorAll("h2:not(.wb-toc-ignore), h3:not(.wb-toc-ignore)");
				const contentItems = contentsList.querySelectorAll("li");

				if (headingItems.length === contentItems.length) {
					return;
				}

				contentsList.innerHTML = "";

				for (let i = 0; i < headingItems.length; i++) {
					if (headingItems[i].innerHTML.includes(tocTitle)) continue;

					let hasSubMenuButton = false;
					if (i < headingItems.length - 1 && headingItems[i].tagName == "H2" && headingItems[i + 1].tagName == "H3") {
						// Not last item, is H2 before an H3
						hasSubMenuButton = true;
					}

					// Live updating of contents item if content is changed without re-writing the entire table of contents
					headingObservers.add(onClassChange(headingItems[i], contentsList));
					contentsList.innerHTML += createContentItem(headingItems[i], hasSubMenuButton);
				}
			};

			const mutationObserver = new MutationObserver(rebuildContentsList);
			mutationObserver.observe(contentArea, { childList: true, subtree: true });

			// Populate immediately rather than waiting for the first edit.
			rebuildContentsList();

			return () => {
				mutationObserver.disconnect();
				headingObservers.forEach(observer => observer.disconnect());
				headingObservers.clear();
			};
		},
		[tocTitle],
	);

	// apiVersion 3: the wrapper element must carry the props returned by
	// useBlockProps, and className is no longer passed to edit(). This also
	// replaces a setAttributes({ tocClassName: className }) call made during
	// render, which wrote to the store on every render pass.
	const blockProps = useBlockProps({
		ref: tocRef,
		className: `wb-blocks-toc ${sticky ? "toc-sticky" : ""} ${customNesting ? "" : "toc-no-marker"} ${
			customNesting == "|" ? "toc-border" : ""
		} ${dualLevel ? "dual-level" : ""}`,
		style: { "--bullet-icon": "'" + customNesting + "'" },
	});

	const allowedBullets = [
		"-", // hyphen
		"–", // en dash (longer than hyphen)
		"•", // normal bullet
		"∘", // hollow circle
		"▪", // little square
		"▫", // hollow square
		"▸", // little triangle
		"▹", // hollow triangle
		"➤", // slick triangle
		"|", // pipe (special case - denotes a left border)
	];

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
	const setDualLevel = newDualLevel => {
		setAttributes({ dualLevel: newDualLevel });
	};
	const setCustomNesting = data => {
		setAttributes({
			customNesting: attributes.customNesting === data ? "" : data, //toggle
		});
	};
	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={__("Table of contents")} initialOpen={true}>
				<ToggleControl
					label="Contents tracks down the page"
					help="Designed for the ToC to be in its own column"
					checked={sticky}
					onChange={setSticky}
				/>
				<ToggleControl
					label="Highlight the current position"
					help="Marks the current ToC item as you scroll down the page, designed to be used with the above where the ToC is always visible on Desktop displays."
					checked={scrollSpy}
					onChange={setScrollSpy}
				/>
				<ToggleControl
					label="Dual-level table of contents"
					help="If enabled, H3 headings will included as well as H2 headings"
					checked={dualLevel}
					onChange={setDualLevel}
				/>
				<TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label="Back to top link text"
					help="What text should be used for the link to skip back to the table of contents"
					value={backToTopText}
					onChange={setBackToTopText}
				/>
			</PanelBody>
			{dualLevel && (
				<PanelBody title="Nested style">
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: "10px",
						}}
					>
						<button
							onClick={() => setCustomNesting("")}
							style={{
								outline: attributes.customNesting === "" ? "8px solid #0ff" : "1px solid #ccc",
								filter: attributes.customNesting === "" ? "invert(1)" : "none",
								padding: "10px",
								background: "white",
								cursor: "pointer",
								textAlign: "center",
								fontWeight: "700",
								gridColumn: "span 2",
							}}
						>
							None
						</button>
						{allowedBullets.map(data => (
							<button
								key={data}
								onClick={() => setCustomNesting(data)}
								style={{
									outline: attributes.customNesting === data ? "8px solid #0ff" : "1px solid #ccc",
									filter: attributes.customNesting === data ? "invert(1)" : "none",
									padding: "10px",
									background: "white",
									cursor: "pointer",
									textAlign: "center",
								}}
							>
								{data}
							</button>
						))}
					</div>
				</PanelBody>
			)}
		</InspectorControls>
	);

	return (
		<Fragment>
			{inspectorControls}
			<div {...blockProps}>
				{/* These three were `class` rather than `className`, which React does not
				    apply to the DOM — so none of the wb-table-of-contents styling was
				    reaching the editor preview. */}
				<div id="table-of-contents" className="wb-table-of-contents">
					<h2 className="wb-table-of-contents__heading wb-toc-ignore" id="table-of-contents-heading">
						<RichText value={tocTitle} onChange={setTocTitle} />
					</h2>
					<ol id="table-of-contents-contents-list" className="wb-table-of-contents__list"></ol>
				</div>
			</div>
		</Fragment>
	);
}

function createContentItem(heading, hasSubMenuButton = false) {
	// This function creates the entries for the table of contents.
	let additionalClass = "";
	let hintText = "";
	let subMenuButton = "";
	if (hasSubMenuButton)
		subMenuButton =
			'<button class="toc-sub-menu-control wp-element-button"><span class="toc-sub-menu-control__text"></span></button>';
	if (heading.innerText.trim() == "") {
		additionalClass += "empty ";
		hintText = "Empty item";
	}
	if (heading.tagName == "H3") {
		additionalClass += "sub-heading ";
	}
	return (
		'<li id="toc-link-for_' +
		heading.id +
		'" class="wb-table-of-contents__item ' +
		additionalClass +
		'"><a href="#' +
		heading.id +
		'">' +
		heading.innerText +
		hintText +
		"</a> " +
		subMenuButton +
		"</li>"
	);
}

// contentsList is threaded through these helpers rather than looked up from a
// global document: in an iframed editor the contents list lives in the canvas
// document, so document.getElementById() in the parent page finds nothing.
function onClassChange(node, contentsList) {
	// Class change happens when any editing is done, so we look for a class change
	// If a class change is detected we run the alterHeading function

	let lastClassString = node.classList.toString();

	const mutationObserver = new MutationObserver(mutationList => {
		for (const item of mutationList) {
			if (item.attributeName === "class") {
				const classString = node.classList.toString();
				if (classString !== lastClassString) {
					applyButtonFunctionality(contentsList);
					alterHeading(node, contentsList);
					lastClassString = classString;
					break;
				}
			}
		}
	});

	mutationObserver.observe(node, { attributes: true });

	return mutationObserver;
}
function alterHeading(heading, contentsList) {
	if (!heading) return;
	// The heading and the contents list share a document, so resolve the lookup
	// against the heading's own document rather than the global one.
	let headingContentItem = heading.ownerDocument.getElementById("toc-link-for_" + heading.id);
	if (!headingContentItem) return; // The function will run before the contents list has been created so this is important

	// Check: has the text changed
	if (heading.innerText != headingContentItem.innerText) {
		if (headingContentItem.innerHTML.includes("<button")) {
			headingContentItem.outerHTML = createContentItem(heading, true);
		} else {
			headingContentItem.outerHTML = createContentItem(heading, false);
		}
	}
}

function applyButtonFunctionality(toc) {
	// Function to duplicate the open close functionality of the frontend
	// The backend list is a series of non-nested list-items, for reasons
	if (!toc) return;

	// Scan for buttons, but targetting the button's list item
	const controllingListItems = toc.querySelectorAll(".wb-table-of-contents__item:has(button)");

	controllingListItems.forEach(item => {
		const button = item.querySelector("button");

		const openCloseSubordinates = e => {
			// Scan for subordinates - these are all the "sub-headings" until the next non-sub-heading.
			// Only difference in the HTML is "sub-heading" class
			// So we continue scanning until a non-sub-heading class is found or the list ends
			const thisItem = e.target.closest("li");
			let nextItem = thisItem.nextElementSibling;
			if (nextItem && nextItem.classList.contains("sub-heading")) {
				for (let i = 0; i < 1000; i++) {
					if (nextItem && nextItem.classList.contains("sub-heading")) {
						nextItem.classList.toggle("expanded");
						nextItem = nextItem.nextElementSibling;
					} else {
						break;
					}
				}
				thisItem.querySelector("button").classList.toggle("opened");
			}
		};

		// Add the click handler, making sure it is only added once
		if (!button._hasClickHandler) {
			button.addEventListener("click", openCloseSubordinates);
			button._hasClickHandler = true;
		}
	});
}
