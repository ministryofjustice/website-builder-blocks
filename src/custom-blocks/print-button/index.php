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
	// Parse attributes found in block.json
	$attribute_print_button_text = $attributes["buttonText"] ?? "Print this page";
	$attribute_show_button_text = $attributes["buttonShowText"] ?? true;
	$attribute_show_button_icon = $attributes["buttonShowIcon"] ?? false;
	$attribute_button_icon_position = $attributes["buttonIconPosition"] ?? "right";
	$attribute_button_icon_style = $attributes["buttonIconStyle"] ?? "materialicons";
	$attribute_button_icon_size = $attributes["buttonIconSize"] ?? 1;
	$frontend_icon_size = $attribute_show_button_text ? 1 : $attribute_button_icon_size;
	$button_aria_label =
		trim($attribute_print_button_text) !== "" ? trim($attribute_print_button_text) : "Print this page";

	$print_icon_url = plugins_url(
		"/assets/icons/action/print/" . $attribute_button_icon_style . "/24px.svg",
		dirname(__DIR__, 3) . "/website-builder-blocks.php",
	);

	// apiVersion 3 pairs useBlockProps in the editor with
	// get_block_wrapper_attributes() here, so the two produce the same wrapper.
	//
	// The legacy buttonClassName attribute is deliberately not read: custom
	// classes have always been saved separately in `className`, which this
	// function picks up on its own, so nothing is lost for buttons saved before
	// the apiVersion 3 upgrade. The generated wp-block-wb-blocks-print-button
	// class also now comes from here rather than from a value the editor wrote
	// into an attribute, which is what style.scss's mobile rules key off.
	$print_button_wrapper_attributes = get_block_wrapper_attributes();

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();
	?>

	<div <?php echo $print_button_wrapper_attributes; ?>>

		<button
			hidden
			class="wb-print-button wp-element-button
				<?php echo $attribute_show_button_icon ? "wb-print-button--has-icon" : ""; ?>
				<?php echo $attribute_show_button_text ? "wb-print-button--has-text" : "wb-print-button--icon-only"; ?>
				<?php if ($attribute_show_button_text): ?>
					wb-print-button--icon-<?php echo esc_attr($attribute_button_icon_position); ?>
				<?php endif; ?>"
			style="
				--icon: url('<?php echo esc_url($print_icon_url); ?>');
				--icon-size: <?php echo esc_attr($frontend_icon_size); ?>;
			"
			<?php if (!$attribute_show_button_text): ?>
				aria-label="<?php echo esc_attr($button_aria_label); ?>"
			<?php endif; ?>
			onclick="event.preventDefault(); window.print();"
		>
			<?php if ($attribute_show_button_text): ?>
				<span class="wb-print-button__text">
					<?php echo esc_html($attribute_print_button_text); ?>
				</span>
			<?php endif; ?>
		</button>

	</div>



	<?php
 // Get all the html/content that has been captured in the buffer and output via return
 $output = ob_get_contents();

 ob_end_clean();

 return $output;
}
