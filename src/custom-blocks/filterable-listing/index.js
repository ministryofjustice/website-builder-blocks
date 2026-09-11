/**
 * Filterable Listing
 *
 * Block metadata — name, title, category, icon, keywords, attributes — lives in
 * block.json and is registered server-side from website-builder-blocks.php.
 * This file supplies the editor behaviour and the block variations.
 *
 * The variations stay here rather than moving into block.json: isActive is a
 * function, which JSON cannot express.
 */
import { registerBlockType, registerBlockVariation } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import edit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});

registerBlockVariation(metadata.name, {
	name: "default",
	title: "Filterable Listing",
	attributes: {
		variant: "default",
	},
	icon: "id-alt",
	isActive: attributes => attributes.variant === "default",

	scope: ["transform"],
});

registerBlockVariation(metadata.name, {
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
