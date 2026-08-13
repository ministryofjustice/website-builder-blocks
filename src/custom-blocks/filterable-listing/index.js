const { registerBlockType, registerBlockStyle } = wp.blocks;
const { __ } = wp.i18n;

import { InnerBlocks } from "@wordpress/block-editor";
import edit from './edit';

registerBlockType("wb-blocks/filterable-listing", {
  title: __("Filterable Listing", "wb_block"),
  description: __('Listing block'),
  category: "wb-blocks",
  icon: "id-alt",
  keywords: [__('listing')],

  attributes: {
    listingPostType: {
      type: "string",
      default: ""
    },
    listingIncludeFilters: {
      type: "boolean",
      default: true
    },
    listingSearchTextFilter: {
      type: "boolean",
      default: true
    },
    listingDisplayImage: {
      type: "boolean",
      default: true
    },
    listingFilters: {
      type: "array",
      default: ""
    },
    listingDisplayFields: {
      type: "array",
      default: ""
    },
    listingDisplayTerms: {
      type: "array",
      default: ""
    },
    listingItemsPerPage: {
      type: "number",
      default: 10
    },
    listingSortOrder: {
      type: "string",
      default: "published_date"
    },
    listingRestrictTaxonomies: {
      type: "array",
      default: ""
    },
    listingRestrictTerms: {
      type: "array",
      default: ""
    },
    stylesTaxLinks: {
      type: "boolean",
      default: false
    },
    stylesHideTaxTitles: {
      type: "boolean",
      default: false
    },
    stylesFieldLayout: {
      type: "string",
      default: "stacked"
    },
    stylesLayout: {
      type: "string",
      default: "side-by-side"
    },
    stylesResultsShadedBackground: {
      type: "boolean",
      default: false
    },
    className: {
      type: "string"
    }
  },
  edit, 
  save: () => { return <InnerBlocks.Content />; }
});




