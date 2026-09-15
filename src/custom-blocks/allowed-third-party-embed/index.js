/**
 * Allowed third party embed
 *
 * Block metadata — name, title, category, icon, keywords, supports, attributes —
 * lives in block.json and is registered server-side from
 * website-builder-blocks.php. This file only supplies the editor behaviour.
 */

import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: Edit,
	save: () => null,
});
