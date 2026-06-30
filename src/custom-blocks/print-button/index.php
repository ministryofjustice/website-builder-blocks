<?php

/**
 * Print button block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_render_callback_print_button_block($attributes, $content)
{

	// Parse attributes found in index.js
	$attribute_print_button_className = $attributes['buttonClassName'] ?? '';
	$attribute_print_button_text = $attributes['buttonText'] ?? 'Print this page';
	$attribute_show_button_icon = $attributes['buttonShowIcon'] ?? false;
	$attribute_button_icon_position = $attributes['buttonIconPosition'] ?? 'right';

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<button 
		hidden
		class="wb-print-button wp-element-button <?php echo esc_attr($attribute_print_button_className); ?> <?php echo $attribute_show_button_icon ? 'wb-print-button--has-icon' : ''; ?> wb-print-button--icon-<?php echo esc_attr($attribute_button_icon_position); ?>"
		onclick="event.preventDefault(); window.print();"
	>
		<span class="wb-print-button__text">
			<?php echo esc_html($attribute_print_button_text); ?>
		</span>
	</button>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	// Decode the output in case editors want to add in hyperlinks or other markup
	$output = html_entity_decode($output);

	ob_end_clean();

	return $output;
}
