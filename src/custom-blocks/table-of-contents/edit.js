import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	BaseControl,
	Button,
} from '@wordpress/components';
import { NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	MediaUpload,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ReactSelect from 'react-select';

const { Fragment } = wp.element;
const d = new Date();

const noItemSelectedText = "No item selected"; // Text in editor to shew that no item will be displayed

export default function filterableListingEdit({ attributes, setAttributes} ) {

	const {
		className,
	} = attributes;

	const inspectorControls = (
		<InspectorControls>
			<PanelBody
				title={__('Table of contents')}
				initialOpen={true}
			>
			</PanelBody>
		</InspectorControls>
	);


	return (
		<Fragment >
			{ inspectorControls }
			<div className={`wb-blocks-toc ${className}`}>
				<div className="">
					Table of contents 
				</div>
			</div>
		</Fragment>
	);
	
}
