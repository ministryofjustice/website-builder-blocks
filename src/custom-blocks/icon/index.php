<?php

/**
 * Icon block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_render_callback_icon_block($attributes) {

	// Parse attributes found in index.js
	$attribute_icon_className = esc_attr($attributes['className']) ?? '';
	$attribute_icon_svg = esc_attr($attributes['icon']) ?? 'action/group_work';
	$attribute_icon_colour = esc_attr($attributes['colour']) ?? 'currentColor';
	$attribute_icon_size = esc_attr($attributes['size']) ?? "1";
	$attribute_icon_alt_text = esc_attr($attributes['alt']) ?? "";

	// Ensure that a alt text is set
	if (empty($attribute_icon_alt_text)) $attribute_icon_alt_text = str_replace("_"," ",ucfirst($attribute_icon_svg)). " icon";

	// Add on the rest of the path (now the alt text has been set)
	$attribute_icon_svg = $attribute_icon_svg . "/materialicons/24px.svg";

	$level = plugin_dir_url(dirname( dirname( dirname( __FILE__ ) )));
	$name = $level."assets/icons/$attribute_icon_svg";
	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>
	<div role="image" aria-label="<?php echo $attribute_icon_alt_text;?>" class="wb-icon" style="--icon-path:url(<?php echo $name;?>);--icon-size:<?php echo $attribute_icon_size;?>;background-color:<?php echo $attribute_icon_colour;?>;">
	</div>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}
