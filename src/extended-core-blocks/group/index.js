/**
 *  Extend core WP group block
 *
 */
import { registerBlockStyle } from "@wordpress/blocks";

registerBlockStyle("core/group", {
	name: "sticky",
	label: "Sticky",
});
