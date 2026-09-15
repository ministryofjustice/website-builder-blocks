<?php

/**
 * Table of contents block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

require_once "inc/functions.php";

function wb_blocks_render_callback_toc_block($attributes, $content)
{
	// Parse attributes found in block.json
	$attribute_title = $attributes["tocTitle"] ?? "Table of contents";
	$attribute_backToTopText = $attributes["backToTopText"] ?? "Back to top";
	$attribute_sticky = $attributes["sticky"] ?? false;

	// This block deliberately does NOT use get_block_wrapper_attributes().
	//
	// That function has to be echoed onto a wrapper element, and this block has
	// none: wb_table_of_contents() returns #table-of-contents directly. Adding a
	// wrapper would break the sticky variant — #table-of-contents.toc-sticky is
	// position: sticky, which is bounded by its containing block, so a div that
	// shrinks to the table's own height would stop it moving at all.
	//
	// The classes that function would have produced are built here instead, so
	// the markup is unchanged: the generated block class (via core's own helper
	// rather than a hardcoded string) plus whatever custom classes the user set.
	// The legacy tocClassName attribute is no longer read — it held the same
	// generated + custom classes, copied out of the editor by edit().
	$attribute_className = wp_get_block_default_classname("wb-blocks/table-of-contents");

	if (!empty($attributes["className"])) {
		$attribute_className .= " " . $attributes["className"];
	}
	$attribute_scrollSpy = $attributes["scrollSpy"] ?? false;
	$attribute_both_levels = $attributes["dualLevel"] ?? false;
	$attribute_nesting = $attributes["customNesting"] ?? "";

	if ($attribute_sticky) {
		$attribute_className .= " toc-sticky";
	}
	if ($attribute_scrollSpy) {
		$attribute_className .= " toc-scrollspy";
	}
	if (!$attribute_nesting) {
		$attribute_className .= " toc-no-marker";
	} elseif ($attribute_nesting == "|") {
		$attribute_className .= " toc-border";
	}
	$attribute_className = trim($attribute_className);

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	// Echo out the table of contents returned by the function
	echo wb_table_of_contents(
		get_the_content(),
		$class = $attribute_className,
		$title = $attribute_title,
		$top = esc_html($attribute_backToTopText),
		$both_levels = $attribute_both_levels,
		$nesting_icon = $attribute_nesting,
	);

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}

function wb_block_enqueue_frontend_assets()
{
	wp_enqueue_script("table-of-contents-frontend", plugins_url("frontend.js", __FILE__), [], "1.0", true);
}
add_action("enqueue_block_assets", "wb_block_enqueue_frontend_assets");

?>
