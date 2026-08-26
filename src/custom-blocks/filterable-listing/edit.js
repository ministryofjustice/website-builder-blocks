import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	RadioControl,
	BaseControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { InspectorControls, useSettings, PanelColorSettings } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import ReactSelect from "react-select";
import PreviewAuto from "./preview-auto.js";
import PreviewFilter from "./preview-filter.js";

const { Fragment } = wp.element;
const d = new Date();

const noItemSelectedText = "No item selected"; // Text in editor to shew that no item will be displayed

export default function filterableListingEdit({ attributes, setAttributes }) {
	const {
		listingPostType,
		listingSearchTextFilter,
		listingDisplayImage,
		listingImagePosition,
		listingFilters,
		listingDisplayFields,
		listingDisplayTerms,
		listingItemsPerPage,
		listingSortOrder,
		listingRestrictTaxonomies,
		listingRestrictTerms,
		stylesHideLabels,
		stylesTaxLinks,
		stylesFieldLayout,
		stylesLayout,
		stylesResultsShadedBackground,
		stylesResultsShadedColour,
		stylesResultsBorderColour,
		blockID,
		variant,
		className,
	} = attributes;

	if (!blockID) {
		setAttributes({
			blockID: crypto.randomUUID(),
		});
	}

	const { allPostTypes } = useSelect(select => {
		const { getPostTypes } = select(coreStore);
		const allPostTypeList = getPostTypes({ per_page: -1 });
		return {
			allPostTypes: allPostTypeList,
		};
	});

	// Sort Options used to sort the results
	let sortOptions = [
		{
			label: "Published Date (Newest to Oldest)",
			value: "published_date",
		},
		{
			label: "Title (Alphabetical)",
			value: "title",
		},
	];

	const allTaxonomies = useSelect(select => select(coreStore).getTaxonomies());

	const termsByTaxonomy = useSelect(
		select => {
			if (!allTaxonomies) return {};

			const map = {};
			allTaxonomies.forEach(tax => {
				map[tax.slug] = select(coreStore).getEntityRecords("taxonomy", tax.slug, { per_page: -1 });
			});
			return map;
		},
		[allTaxonomies],
	);

	let itemTypes = [
		{
			label: "-",
			value: "",
		},
	];

	const displayFieldsList = [
		{
			label: "Published date",
			value: "published_date",
		},
	];

	const filterOptionList = [
		{
			label: "Published date",
			value: "published_date",
		},
	];

	const taxOptionList = [];
	const restrictTermOptionList = [];
	const selectedListingFilters = [];
	const selectedDisplayFields = [];
	const selectedDisplayTerms = [];
	const selectedRestrictTaxonomies = [];
	const selectedRestrictTerms = [];

	if (allPostTypes) {
		allPostTypes.forEach(thisPostType => {
			if (
				thisPostType.name != "Posts" &&
				thisPostType.name != "Pages" &&
				thisPostType.name != "Media" &&
				thisPostType.viewable
			) {
				itemTypes.push({
					label: thisPostType.name,
					value: thisPostType.slug,
				});
			}

			if (thisPostType.slug == listingPostType && thisPostType.taxonomies.length && allTaxonomies) {
				//console.log(thisPostType);
				thisPostType.taxonomies.forEach(postTypeTaxKey => {
					allTaxonomies.forEach(taxonomy => {
						if (taxonomy.slug == postTypeTaxKey) {
							taxOptionList.push({
								label: taxonomy.name,
								value: taxonomy.slug,
							});

							filterOptionList.push({
								label: taxonomy.name,
								value: taxonomy.slug,
							});

							displayFieldsList.push({
								label: taxonomy.name,
								value: taxonomy.slug,
							});

							if (listingRestrictTaxonomies?.includes(taxonomy.slug) && termsByTaxonomy) {
								if (termsByTaxonomy[taxonomy.slug]) {
									termsByTaxonomy[taxonomy.slug].forEach(term => {
										restrictTermOptionList.push({
											label: term.name,
											value: term.id,
										});
									});
								}
							}
						}
					});
				});
			}
			//Add ACF Meta Fields
			if (thisPostType.slug == listingPostType && thisPostType.acfFields.length) {
				thisPostType.acfFields.forEach(acfField => {
					filterOptionList.push({
						label: acfField.label,
						value: acfField.key,
					});

					displayFieldsList.push({
						label: acfField.label,
						value: acfField.key,
					});
				});
			}
		});

		//Seperate loops to keep the selection order

		if (listingFilters.length > 0) {
			listingFilters.forEach(field => {
				for (const opt of filterOptionList) {
					if (field == opt.value) {
						selectedListingFilters.push(opt);
						break;
					}
				}
			});
		}

		if (listingDisplayTerms.length > 0) {
			listingDisplayTerms.forEach(field => {
				for (const opt of taxOptionList) {
					if (field == opt.value) {
						selectedDisplayTerms.push(opt);
						break;
					}
				}
			});
		}

		if (listingRestrictTaxonomies.length > 0) {
			listingRestrictTaxonomies.forEach(field => {
				for (const opt of taxOptionList) {
					if (field == opt.value) {
						selectedRestrictTaxonomies.push(opt);
						break;
					}
				}
			});
		}

		if (listingDisplayFields.length > 0) {
			listingDisplayFields.forEach(field => {
				for (const opt of displayFieldsList) {
					if (field == opt.value) {
						selectedDisplayFields.push(opt);
						break;
					}
				}
			});
		}

		if (listingRestrictTerms.length > 0) {
			listingRestrictTerms.forEach(field => {
				for (const opt of restrictTermOptionList) {
					if (field == opt.value) {
						selectedRestrictTerms.push(opt);
						break;
					}
				}
			});
		}
	}

	const setListingPostType = newPostType => {
		setAttributes({ listingPostType: newPostType });
		setAttributes({ listingFilters: [] });
		setAttributes({ listingDisplayFields: [] });
		setAttributes({ listingRestrictTaxonomies: [] });
		setAttributes({ listingRestrictTerms: [] });
	};

	const setListingSearchTextFilter = newSearchTextFilter => {
		setAttributes({ listingSearchTextFilter: newSearchTextFilter });
	};

	const setListingDisplayImage = setDisplayImage => {
		setAttributes({ listingDisplayImage: setDisplayImage });
	};

	const setListingImagePosition = setImagePosition => {
		setAttributes({ listingImagePosition: setImagePosition });
	};

	const setListingFilters = selectedItems => {
		const values = selectedItems ? selectedItems.map(item => item.value) : [];
		setAttributes({ listingFilters: values });
	};

	const setListingDisplayFields = selectedItems => {
		const values = selectedItems ? selectedItems.map(item => item.value) : [];
		setAttributes({ listingDisplayFields: values });
	};

	const setListingDisplayTerms = selectedItems => {
		const values = selectedItems ? selectedItems.map(item => item.value) : [];
		setAttributes({ listingDisplayTerms: values });
	};

	const setItemsPerPage = newItemsPerPage => {
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

	const setRestrictTaxonomies = selectedItems => {
		const values = selectedItems ? selectedItems.map(item => item.value) : [];
		setAttributes({ listingRestrictTaxonomies: values });
		setAttributes({ listingRestrictTerms: [] });
	};

	const setRestrictTerms = selectedItems => {
		const values = selectedItems ? selectedItems.map(item => item.value) : [];
		setAttributes({ listingRestrictTerms: values });
	};

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={__("Main settings")} initialOpen={true}>
				<SelectControl
					label="Select item type"
					value={listingPostType}
					options={itemTypes}
					onChange={setListingPostType}
				/>
			</PanelBody>
			{listingPostType.length > 0 && variant !== "auto-item-list" && (
				<PanelBody title={__("Filterable Listing settings")} initialOpen={true}>
					<ToggleControl
						label="Search Text Filter"
						checked={listingSearchTextFilter}
						onChange={setListingSearchTextFilter}
					/>
					{filterOptionList.length > 0 && (
						<BaseControl label="Listing Filters">
							<ReactSelect
								isMulti
								label="Filters"
								options={filterOptionList}
								value={selectedListingFilters}
								onChange={setListingFilters}
							/>
						</BaseControl>
					)}
				</PanelBody>
			)}

			{listingPostType.length > 0 && (
				<PanelBody title={__("Results display settings")} initialOpen={true}>
					{displayFieldsList.length > 0 && (
						<BaseControl label="Display Fields">
							<ReactSelect
								isMulti
								value={selectedDisplayFields}
								options={displayFieldsList}
								onChange={setListingDisplayFields}
							/>
						</BaseControl>
					)}

					{taxOptionList.length > 0 && (
						<BaseControl label="Display Terms">
							<ReactSelect
								isMulti
								value={selectedDisplayTerms}
								options={taxOptionList}
								onChange={setListingDisplayTerms}
							/>
						</BaseControl>
					)}
				</PanelBody>
			)}
			{listingPostType.length > 0 && (
				<PanelBody title={__("Results settings")} initialOpen={true}>
					<RangeControl
						label="Items per page"
						min={3}
						max={50}
						step={1}
						value={listingItemsPerPage}
						onChange={setItemsPerPage}
					/>

					<SelectControl label="Sort by" options={sortOptions} value={listingSortOrder} onChange={setSortOrder} />
				</PanelBody>
			)}
			{listingPostType.length > 0 && (
				<PanelBody title={__("Restrict results settings")} initialOpen={true}>
					{taxOptionList.length > 0 && (
						<BaseControl label="Restrict by">
							<ReactSelect
								isMulti
								options={taxOptionList}
								value={selectedRestrictTaxonomies}
								onChange={setRestrictTaxonomies}
							/>
						</BaseControl>
					)}

					{restrictTermOptionList.length > 0 && (
						<BaseControl label="Restrict terms">
							<ReactSelect
								isMulti
								options={restrictTermOptionList}
								value={selectedRestrictTerms}
								onChange={setRestrictTerms}
							/>
						</BaseControl>
					)}
				</PanelBody>
			)}
		</InspectorControls>
	);

	const setStylesFieldLayout = newStylesFieldLayout => {
		setAttributes({ stylesFieldLayout: newStylesFieldLayout });
	};

	const setStylesTaxLinks = newStylesTaxLinks => {
		setAttributes({ stylesTaxLinks: newStylesTaxLinks });
	};

	const setStylesHideLabels = newStylesHideLabels => {
		setAttributes({ stylesHideLabels: newStylesHideLabels });
	};

	const setStylesLayout = newStylesLayout => {
		setAttributes({ stylesLayout: newStylesLayout });
	};

	const setStylesResultsShadedBackground = newStylesResultsShadedBackground => {
		setAttributes({ stylesResultsShadedBackground: newStylesResultsShadedBackground });
	};

	const setStylesResultsShadedColour = newStylesResultsShadedColour => {
		setAttributes({ stylesResultsShadedColour: newStylesResultsShadedColour });
	};

	const setStylesResultsBorderColour = newStylesResultsBorderColour => {
		setAttributes({ stylesResultsBorderColour: newStylesResultsBorderColour });
	};

	const [colours] = useSettings("color.palette");

	return (
		<Fragment>
			{inspectorControls}
			<InspectorControls group="styles">
				<PanelBody title={__("Results styles")} initialOpen={true}>
					<ToggleControl
						label="Display featured image"
						checked={listingDisplayImage}
						onChange={setListingDisplayImage}
					/>
					{listingDisplayImage && (
						<RadioControl
							label="Layout of filters and results"
							selected={listingImagePosition ? listingImagePosition : "default"}
							options={[
								{ label: "Right", value: "right" },
								{ label: "Top", value: "top" },
								{ label: "Left", value: "left" },
							]}
							onChange={setListingImagePosition}
						/>
					)}
					<ToggleControl
						label="Shaded background"
						help="Item divider line will be hidden"
						checked={stylesResultsShadedBackground}
						onChange={setStylesResultsShadedBackground}
					/>
					{variant !== "auto-item-list" && (
						<RadioControl
							label="Layout of filters and results"
							selected={stylesLayout ? stylesLayout : "side-by-side"}
							options={[
								{ label: "Side-by-side", value: "side-by-side" },
								{ label: "Stacked", value: "stacked" },
							]}
							onChange={setStylesLayout}
						/>
					)}
					{variant === "auto-item-list" && (
						<RadioControl
							label="Layout of items"
							help="Layouts will stack on narrow displays such as mobile phones"
							selected={stylesLayout ? stylesLayout : "side-by-side"}
							options={[
								{ label: "4 wide (2 on large mobiles)", value: "side-by-side-4-2" },
								{ label: "4 wide", value: "side-by-side-4-1" },
								{ label: "3 wide", value: "side-by-side" },
								{ label: "2 wide", value: "side-by-side-2-1" },
								{ label: "Stacked", value: "stacked" },
							]}
							onChange={setStylesLayout}
						/>
					)}
					<RadioControl
						label="Layout of fields"
						selected={stylesFieldLayout ? stylesFieldLayout : "stacked"}
						options={[
							{ label: "Everything stacked", value: "stacked" },
							{ label: "Stacked, with inline values", value: "stacked-inline" },
							{ label: "Inline with stacked values", value: "inline-stacked" },
							{ label: "Everything inline", value: "inline" },
						]}
						onChange={setStylesFieldLayout}
					/>
					<ToggleControl
						label="Links for taxonomies"
						help={
							`Adds links for taxonomy values (` +
							listingDisplayTerms
								.map(term => taxOptionList.find(o => o.value === term)?.label)
								.filter(Boolean)
								.join("; ") +
							`)`
						}
						checked={stylesTaxLinks}
						onChange={setStylesTaxLinks}
					/>
					<ToggleControl
						label="Hide titles"
						help="Turn on if all taxonomies are self-explanatory"
						checked={stylesHideLabels}
						onChange={setStylesHideLabels}
					/>
				</PanelBody>
				<PanelBody title={"Colour options"} initialOpen={false}>
					{stylesResultsShadedBackground && (
						<>
							<PanelColorSettings
								title="Shading colour"
								help="leave blank for a semi-transparent shading to match the background"
								colorSettings={[
									{
										value: stylesResultsShadedColour,
										onChange: setStylesResultsShadedColour,
										label: "Colour",
										colors: colours,
									},
								]}
							/>
							<p className="components-base-control__help">
								Leave blank for a semi-transparent shading to match the background.
							</p>
						</>
					)}
					{(!stylesResultsShadedBackground || listingDisplayImage) && (
						<PanelColorSettings
							title="Border colour"
							colorSettings={[
								{
									value: stylesResultsBorderColour,
									onChange: setStylesResultsBorderColour,
									label: "Colour",
									colors: colours,
								},
							]}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<div className={`wb-blocks-filterable-listing ${className}`}>
				<div className={`wb-blocks-filterable-listing ${className} ${stylesResultsShadedBackground ? "" : "pt-4"}`}>
					<PreviewAuto
						attributes={attributes}
						acfFields={allPostTypes?.find(postType => postType.slug === attributes.listingPostType)?.acfFields || []}
						taxonomies={allTaxonomies || []}
					/>
					<PreviewFilter
						attributes={attributes}
						acfFields={allPostTypes?.find(postType => postType.slug === attributes.listingPostType)?.acfFields || []}
						taxonomies={allTaxonomies || []}
					/>
				</div>
			</div>
		</Fragment>
	);
}
