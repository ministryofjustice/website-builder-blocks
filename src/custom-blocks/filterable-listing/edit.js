import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	BaseControl,
	Button,
} from '@wordpress/components';
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
		listingPostType,
		listingFilters,
		listingDisplayFields,
		className,
	} = attributes;

	const {
		allPostTypes,
	} = useSelect(
		( select ) => {

			const { getPostTypes } = select(
				coreStore
			);
			const allPostTypeList = getPostTypes(
				{ per_page: -1 }
			);
			return {
				allPostTypes: allPostTypeList
			};
		}
	);

	const allTaxonomies = useSelect((select) => 
		select(coreStore).getTaxonomies()
	);

	let itemTypes = [{
		label: "-",
		value: ""
	}]

	const taxOptionList = [];
	const selectedListingFilters = [];

	if (allPostTypes) {
		allPostTypes.forEach(thisPostType => {
			if (thisPostType.name != "Posts" && thisPostType.name != "Pages" && thisPostType.name != "Media" && thisPostType.viewable) {
				itemTypes.push({
					label: thisPostType.name,
					value: thisPostType.slug
				});
			}

			if (thisPostType.slug == listingPostType && thisPostType.taxonomies.length && allTaxonomies) {

				thisPostType.taxonomies.forEach(postTypeTaxKey => {
					allTaxonomies.forEach(taxonomy => {
						if(taxonomy.slug == postTypeTaxKey){
							taxOptionList.push({
								label: taxonomy.name,
								value: taxonomy.slug
							})
						}
					});
				});
			}
		});

		taxOptionList.forEach((opt) => {
			if (listingFilters?.includes(opt.value)) {
				selectedListingFilters.push(opt);
			}
		  });
		
	}

	const setListingPostType = newPostType => {
		setAttributes({ listingPostType: newPostType });
	};

	/*
	const setListingFilters = newListingFilters => {
		setAttributes({ listingFilters: newListingFilters });

	};*/

	const setListingFilters = (selectedItems) => {
		const values = selectedItems ? selectedItems.map((item) => item.value) : [];
		setAttributes({ listingFilters: values });
	  };

	const setListingDisplayFields = newListingDisplayFields => {
		setAttributes({ listingDisplayFields: newListingDisplayFields });
	};


	const inspectorControls = (
		<InspectorControls>
			<PanelBody
				title={__('Filterable Listing settings')}
				initialOpen={true}
			>
				<SelectControl
					label="Select item type"
					value={ listingPostType }
					options={ itemTypes }
					onChange={ setListingPostType }
				/>

				{
					(taxOptionList.length > 1) && (
						<BaseControl label="Listing Filters">
							<ReactSelect
							isMulti
							label="Listing Filters"
							options={taxOptionList}
							value={ selectedListingFilters }
							onChange={ setListingFilters }
							/>	
						</BaseControl>
					)
            	}
				
				{/*
				{
					(taxOptionList.length > 1) && (
						<SelectControl
						multiple
						label="Listing Filters"
						value={ listingFilters }
						options={ taxOptionList }
						onChange={ setListingFilters }
						/>
					)
            	}
				*/}
				{
					(taxOptionList.length > 1) && (
						<SelectControl
						multiple
						label="Listing Display Fields"
						value={ listingDisplayFields }
						options={ taxOptionList }
						onChange={ setListingDisplayFields }
						/>
					)
            	}
					
					
			</PanelBody>
		</InspectorControls>
	);

	return (
		<Fragment >
			{ inspectorControls }
			<div className={`mojblocks-filterable-listing ${className}`}>
				<div className="govuk-width-container govuk-!-margin-0">
					Filterable Listing 
				</div>
			</div>
		</Fragment>
	);
	
}


function datify(x,d) {
	if (!x) return "Date";

	var month = new Array();
	month[1] = "January";
	month[2] = "February";
	month[3] = "March";
	month[4] = "April";
	month[5] = "May";
	month[6] = "June";
	month[7] = "July";
	month[8] = "August";
	month[9] = "September";
	month[10] = "October";
	month[11] = "November";
	month[12] = "December";

	var x = x.split("-");

	if (x.length != 3) {
	//wrong format, return today
	return d.toLocaleString('en-GB', {day: '2-digit', month: 'long' });
	}

	var day = x[2].substring(0, 2);
	var month = " " + month[parseInt(x[1])];
	var year = " " + x[0];

	return day + month + year;
}
