<?php

/**
 * Government SVGs block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_render_callback_hmg_svg_block($attributes)
{
	// Parse attributes found in block.json
	// Default logo.
	$attribute_hmgsvg_logo = "crest";

	// Use an allow list to prevent a malicious value from traversing the file system.
	$allowed_logos = ["crest", "crown", "govuk", "ogl"];
	if (in_array($attributes["logo"] ?? "", $allowed_logos, true)) {
		$attribute_hmgsvg_logo = $attributes["logo"];
	}

	// apiVersion 3 pairs useBlockProps in the editor with
	// get_block_wrapper_attributes() here, so the two produce the same wrapper.
	//
	// className is no longer read by hand: this function already merges any
	// custom classes the user set. It returns a complete class="..." pair, so
	// wb-hmg-svg is passed in rather than written into the tag alongside it —
	// otherwise the element would carry two class attributes and the browser
	// would keep only the first.
	$hmgsvg_wrapper_attributes = get_block_wrapper_attributes([
		"class" => "wb-hmg-svg",
	]);

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();
	?>

	<div <?= $hmgsvg_wrapper_attributes ?>>
		<?php include __DIR__ . "/svg/{$attribute_hmgsvg_logo}.svg"; ?>
	</div>

	<?php
 // Get all the html/content that has been captured in the buffer and output via return
 $output = ob_get_contents();

 ob_end_clean();

 return $output;
}
