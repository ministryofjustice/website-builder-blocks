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
    listingSearchTextFilter: {
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
    className: {
      type: "string"
    }
  },
  edit, 
  save: () => { return <InnerBlocks.Content />; }
});

