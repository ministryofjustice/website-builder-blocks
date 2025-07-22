import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
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
		listingPostType,
		listingFilters,
		listingDisplayFields,
		listingItemsPerPage,
		listingSortOrder,
		listingRestrictTaxonomies,
		listingRestrictTerms,
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

	// Sort Options used to sort the results
	let sortOptions = [
		{
			label: "Published Date (Newest to Oldest)",
			value: "published_date"
		},
		{
			label: "Title (Alphabetical)",
			value: "title"
		},
	]

	const allTaxonomies = useSelect((select) => 
		select(coreStore).getTaxonomies()
	);

	const termsByTaxonomy = useSelect(
		( select ) => {
			if ( ! allTaxonomies ) return {};

			const map = {};
			allTaxonomies.forEach( ( tax ) => {
				map[ tax.slug ] = select( coreStore ).getEntityRecords(
					'taxonomy',
					tax.slug,
					{ per_page: -1 }
				);
			} );
			return map;
		},
		[ allTaxonomies ]
	);


	let itemTypes = [{
		label: "-",
		value: ""
	}]

	const taxOptionList = [];
	const restrictTermOptionList = [];
	const selectedListingFilters = [];
	const selectedDisplayFields = [];
	const selectedRestrictTaxonomies = [];
	const selectedRestrictTerms = [];

	if (allPostTypes) {

		console.log(allPostTypes);
		
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

							if (listingRestrictTaxonomies?.includes(taxonomy.slug) && termsByTaxonomy) {
								if (termsByTaxonomy[taxonomy.slug]) {
									
									termsByTaxonomy[taxonomy.slug].forEach(term => {
										restrictTermOptionList.push({
											label: term.name,
											value: term.id
										})			
									});
								}
							}
						}
					});
				});
			}
		});

		taxOptionList.forEach((opt) => {

			if (listingFilters?.includes(opt.value)) {
				selectedListingFilters.push(opt);
			}
			if (listingDisplayFields?.includes(opt.value)) {
				selectedDisplayFields.push(opt);
			}
			if (listingRestrictTaxonomies?.includes(opt.value)) {
				selectedRestrictTaxonomies.push(opt);
			}
		  });

		restrictTermOptionList.forEach((opt) => {

			if (listingRestrictTerms?.includes(opt.value)) {
				selectedRestrictTerms.push(opt);
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

	const setListingDisplayFields = (selectedItems) => {
		const values = selectedItems ? selectedItems.map((item) => item.value) : [];
		setAttributes({ listingDisplayFields: values });
	};

	const setItemsPerPage = (newItemsPerPage) => {
		const parsedValue = parseInt(newItemsPerPage, 10);
	
		if (!isNaN(parsedValue)) {
			setAttributes({ listingItemsPerPage: parsedValue });
		} else {
			// Fallback to a default (optional)
			setAttributes({ listingItemsPerPage: 10 });
		}
	};

	const setSortOrder = newSortOrder => {
		setAttributes({ listingSortOrder: newSortOrder });
	};

	const setRestrictTaxonomies = (selectedItems) => {
		const values = selectedItems ? selectedItems.map((item) => item.value) : [];
		setAttributes({ listingRestrictTaxonomies: values });
	};

	const setRestrictTerms = (selectedItems) => {
		const values = selectedItems ? selectedItems.map((item) => item.value) : [];
		setAttributes({ listingRestrictTerms: values });
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
							label="Filters"
							options={taxOptionList}
							value={ selectedListingFilters }
							onChange={ setListingFilters }
							/>	
						</BaseControl>
					)
            	}
				</PanelBody>
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
				<PanelBody
				title={__('Results display settings')}
				initialOpen={true}
				>
				{
					(taxOptionList.length > 1) && (
						<BaseControl label="Display Fields">
							<ReactSelect
							isMulti
							label="Display Fields"
							value={ selectedDisplayFields }
							options={ taxOptionList }
							onChange={ setListingDisplayFields }
							/>
						</BaseControl>
					)
            	}
					
					
			</PanelBody>
			<PanelBody
				title={__('Results settings')}
				initialOpen={true}
			>
				<RangeControl
					label="Items per page"
					min={5}
					max={50}
					value={ listingItemsPerPage }
					onChange={ setItemsPerPage }
				/>

				<SelectControl
						
					label="Sort by"
					options={ sortOptions }
					value={ listingSortOrder }
					onChange={ setSortOrder }
					
				/>	
			</PanelBody>
			<PanelBody
				title={__('Restrict results settings')}
				initialOpen={true}
			>

			{
				(taxOptionList.length > 1) && (
					<BaseControl label="Restrict by">
						<ReactSelect
						isMulti
						options={taxOptionList}
						value={ selectedRestrictTaxonomies }
						onChange={ setRestrictTaxonomies }
						/>	
					</BaseControl>
				)
            }

			{
				(restrictTermOptionList.length > 1) && (
					<BaseControl label="Restrict terms">
						<ReactSelect
						isMulti
						options={restrictTermOptionList}
						value={ selectedRestrictTerms }
						onChange={ setRestrictTerms }
						/>	
					</BaseControl>
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
