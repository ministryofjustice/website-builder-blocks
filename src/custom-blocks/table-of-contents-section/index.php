<?php

/**
 * Filterable Listing block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

require_once('inc/functions.php');

function wb_blocks_render_callback_toc_section_block($attributes, $content)
{

	$content_data = wb_toc_section_index_headings($content);

	$attribute_className = $attributes['className'] ?? '';
	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>
		<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
			<div class="<?php _e($attribute_className);?> wb-toc-table-section wp-block-column is-layout-flow wp-block-column-is-layout-flow">
				<?php echo wb_toc_section_make_table_of_contents($content_data["index"]); ?>
			</div>
			<div class="wb-toc-content-section wp-block-column is-layout-flow wp-block-column-is-layout-flow">
				<?php echo $content_data["content"]; ?>
			</div>
		</div>
	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	// Decode the output in case editors want to add in hyperlinks or other markup
	$output = html_entity_decode($output);

	ob_end_clean();

	return $output;
}


?>
