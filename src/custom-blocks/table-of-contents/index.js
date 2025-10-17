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
  keywords: [__('contents'),__('toc'),__('table of contents'),__('side navigation'),__('side nav')],

  attributes: {
    tocTitle: {
      type: "string",
      default: "Table of contents"
    },
    backToTopText: {
      type: "string",
      default: "Back to top"
    },
    sticky: {
      type: "boolean",
      default: false
    },
    scrollSpy: {
      type: "boolean",
      default: false
    },
    tocClassName: {
      type: "string"
    }
  },
  edit,
  // return null as frontend output is done via PHP
  save: () => null
});
