const { registerBlockType, registerBlockVariation } = wp.blocks;
const { __ } = wp.i18n;

import { InnerBlocks } from "@wordpress/block-editor";
import edit from "./edit";

registerBlockType("wb-blocks/filterable-listing", {
	title: "Filterable Listing",
	description: "Listing block",
	category: "wb-blocks",
	icon: "id-alt",
	keywords: ["listing", "latest", "items"],

	attributes: {
		listingPostType: {
			type: "string",
			default: "",
		},
		listingSearchTextFilter: {
			type: "boolean",
			default: true,
		},
		listingDisplayImage: {
			type: "boolean",
			default: true,
		},
		listingImagePosition: {
			type: "string",
			default: "default",
		},
		listingFilters: {
			type: "array",
			default: "",
		},
		listingDisplayFields: {
			type: "array",
			default: "",
		},
		listingDisplayTerms: {
			type: "array",
			default: [],
		},
		listingItemsPerPage: {
			type: "number",
			default: 10,
		},
		listingSortOrder: {
			type: "string",
			default: "published_date",
		},
		listingRestrictTaxonomies: {
			type: "array",
			default: "",
		},
		listingRestrictTerms: {
			type: "array",
			default: "",
		},
		stylesTaxLinks: {
			type: "boolean",
			default: false,
		},
		stylesHideLabels: {
			type: "boolean",
			default: false,
		},
		stylesFieldLayout: {
			type: "string",
			default: "stacked-inline",
		},
		stylesLayout: {
			type: "string",
			default: "side-by-side",
		},
		stylesResultsShadedBackground: {
			type: "boolean",
			default: false,
		},
		stylesResultsShadedColour: {
			type: "string",
		},
		stylesResultsBorderColour: {
			type: "string",
		},
		variant: {
			type: "string",
			default: "default",
		},
		blockID: {
			type: "string",
		},
		className: {
			type: "string",
		},
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});

registerBlockVariation("wb-blocks/filterable-listing", {
	name: "default",
	title: "Filterable Listing",
	attributes: {
		variant: "default",
	},
	icon: "id-alt",
	isActive: attributes => attributes.variant === "default",

	scope: ["transform"],
});

registerBlockVariation("wb-blocks/filterable-listing", {
	name: "auto-item-list",
	title: "Item Listing",
	description: "Automatically pull through items",
	icon: "list-view",
	attributes: {
		variant: "auto-item-list",
	},
	isActive: attributes => attributes.variant === "auto-item-list",
	scope: ["inserter", "transform"],
});
