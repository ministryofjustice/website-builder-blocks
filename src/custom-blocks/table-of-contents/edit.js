import {
	PanelBody,
	ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls
} from '@wordpress/block-editor';

const { Fragment } = wp.element;
const d = new Date();

export default function tocEdit({ attributes, setAttributes} ) {

	const {
		sticky,
		scrollSpy,
		tocClassName,
		className
	} = attributes;

	// Set className attribute for PHP frontend to use
    setAttributes({ tocClassName: className });

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
			</PanelBody>
		</InspectorControls>
	);


	return (
		<Fragment >
			{ inspectorControls }
			<div className={`wb-blocks-toc ${tocClassName} ${sticky ? 'toc-sticky' : ''}`}>
				<div className="">
					Table of contents 
				</div>
			</div>
		</Fragment>
	);
	
}
