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
    listingFilters: {
      type: "array",
      default: ""
    },
    listingDisplayFields: {
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

