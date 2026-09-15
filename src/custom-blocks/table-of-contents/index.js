/**
 * Table of contents
 *
 * Block metadata — name, title, category, icon, keywords, attributes — lives in
 * block.json and is registered server-side from website-builder-blocks.php.
 * This file only supplies the editor behaviour.
 *
 * The tocClassName attribute in block.json is legacy: edit() used to copy the
 * editor's generated className into it so the render callback could read it
 * back. apiVersion 3 no longer passes className to edit(), and the render
 * callback now derives the same classes itself. It stays registered only so it
 * isn't stripped from content saved before this change.
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import edit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit,
	// return null as frontend output is done via PHP
	save: () => null,
});
