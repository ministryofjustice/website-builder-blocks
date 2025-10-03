const { registerBlockType, registerBlockStyle } = wp.blocks;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import edit from './edit';

registerBlockType("wb-blocks/table-of-contents", {
  title: __("Table of contents", "wb_block"),
  description: __('Table of contents'),
  category: "wb-blocks",
  icon: "id-alt",
  keywords: [__('contents')],

  attributes: {
    sticky: {
      type: "boolean"
    },
    scrollSpy: {
      type: "boolean"
    },
    tocClassName: {
      type: "string"
    }
  },
  edit,
  // return null as frontend output is done via PHP
  save: () => null
});
