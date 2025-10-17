const { registerBlockType, registerBlockStyle } = wp.blocks;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import edit from './edit';

registerBlockType("wb-blocks/table-of-contents", {
  title: "Table of contents",
  description: 'Table of contents',
  category: "wb-blocks",
  icon: "id-alt",
  keywords: ['contents','toc','table of contents','side navigation'],

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
