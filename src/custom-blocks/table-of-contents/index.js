const { registerBlockType, registerBlockStyle } = wp.blocks;
const { __ } = wp.i18n;

import { InnerBlocks } from "@wordpress/block-editor";

import edit from './edit';

registerBlockType("wb-blocks/table-of-contents", {
  title: __("Table of contents", "wb_block"),
  description: __('Table of contents'),
  category: "wb-blocks",
  icon: "id-alt",
  keywords: [__('contents')],

  attributes: {
    className: {
      type: "string"
    }
  },
  edit, 
  save: () => { return <InnerBlocks.Content />; }
});




