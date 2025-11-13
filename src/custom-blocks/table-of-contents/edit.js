import {
	PanelBody,
	ToggleControl,
	TextControl
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls
} from '@wordpress/block-editor';

const { Fragment } = wp.element;

export default function tocEdit({ attributes, setAttributes} ) {

	const blockRef = useRef();
	useEffect(() => {
		let contentArea = document.querySelector('.editor-visual-editor');
		if (!contentArea) {
			return;
		}
		let headings = contentArea.querySelectorAll("h2");

		let contentsList = document.getElementById("table-of-contents-contents-list");

		for(let i=0;i<headings.length;i++) {
			if (headings[i].innerHTML.includes(tocTitle)) continue;
			contentsList.innerHTML += '<li class="wb-table-of-contents__item"><a href="#'+headings[i].id+'">'+headings[i].innerHTML+'</a></li>';
		}
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
					<h2 class="wb-table-of-contents__heading" id="table-of-contents-heading">
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
