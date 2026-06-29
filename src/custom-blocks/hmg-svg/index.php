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

function wb_blocks_render_callback_hmg_svg_block($attributes) {

	// Parse attributes found in index.js
	$attribute_hmgsvg_className = $attributes['className'] ?? '';
	// Default logo.
	$attribute_hmgsvg_logo = 'crest'; 
	
	// Use an allow list to prevent a malicious value from traversing the file system.
	$allowed_logos = ['crest', 'crown', 'govuk', 'ogl'];
	if (in_array($attributes['logo'], $allowed_logos, true)) {
		$attribute_hmgsvg_logo = $attributes['logo'];
	}

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<div class="wb-hmg-svg <?php _e(esc_html($attribute_hmgsvg_className)); ?>">
		<?php include __DIR__ . "/svg/{$attribute_hmgsvg_logo}.svg"; ?>
	</div>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	// Decode the output in case editors want to add in hyperlinks or other markup
	$output = html_entity_decode($output);

	ob_end_clean();

	return $output;
}
