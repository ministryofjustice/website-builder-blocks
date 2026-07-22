/**
 * Allowed third party embed
 */

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";

registerBlockType("wb-blocks/allowed-third-party-embed", {
  title: __("allowed third party embed", "wb_block", "wb_block"),
  description: __("Add code from an allowed third party provider", "wb_block"),
  category: "wb-blocks",
  icon: "embed-generic",
  keywords: [
    __("html", "wb_block"),
    __("third party embed", "wb_block"),
    __("smart survey", "wb_block"),
  ],
  attributes: {
    embedCode: {
      type: "string",
      default: "",
    },
  },
  edit: Edit,
  save: () => null,
});
