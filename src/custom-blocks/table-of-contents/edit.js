import {
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls
} from '@wordpress/block-editor';

const { Fragment } = wp.element;
const d = new Date();

export default function filterableListingEdit({ attributes, setAttributes} ) {

	const {
		sticky,
		tocClassName,
	} = attributes;

	// Set className attribute for PHP frontend to use
    //setAttributes({ tocClassName: className });

	const setSticky = newSticky => {
		setAttributes({ sticky: newSticky });
		/*
		if (newSticky) {
			setAttributes({stickyClass: "toc-sticky"})
		} else {
			setAttributes({stickyClass: ""})
		}*/
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
