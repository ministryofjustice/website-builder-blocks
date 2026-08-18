/**
 * Allowed third party embed
 */

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";

registerBlockType("wb-blocks/allowed-third-party-embed", {
	title: __("Allowed third party embed", "wb_block"),
	description: __("Add code from an allowed third party provider", "wb_block"),
	category: "wb-blocks",
	icon: "embed-generic",
	keywords: [
		__("html", "wb_blocks"),
		__("third party embed", "wb_blocks"),
		__("smart survey", "wb_blocks"),
		__("ticket tailor", "wb_blocks"),
		__("script", "wb_blocks"),
	],
	supports: {
		html: false,
	},
	attributes: {
		embedCode: {
			type: "string",
			default: "",
		},
		provider: {
			type: "string",
			default: "",
		},
		validationStatus: {
			type: "string",
			default: "not-validated",
		},
		validationMessage: {
			type: "string",
			default: "",
		},
	},
	edit: Edit,
	save: () => null,
});
