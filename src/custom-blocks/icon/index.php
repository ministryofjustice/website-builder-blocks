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
	$attribute_icon_svg = esc_attr($attributes['icon']) ?? 'toggle';
	$attribute_icon_category = esc_attr($attributes['category']) ?? 'star';
	$attribute_icon_colour = esc_attr($attributes['colour']) ?? '';
	$attribute_icon_size = esc_attr($attributes['size']) ?? "1";

	$aria_label = ucfirst($attribute_icon_svg);

	$level = plugin_dir_url(dirname( dirname( dirname( __FILE__ ) )));
	$name = $level."assets/icons/$attribute_icon_category/$attribute_icon_svg/materialicons/24px.svg";
	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>
	<div aria-label="<?php echo str_replace("_"," ",$aria_label);?> icon" class="wb-icon" style="--icon-path:url(<?php echo $name;?>);--icon-size:<?php echo $attribute_icon_size;?>;background-color:<?php echo $attribute_icon_colour;?>;">
	</div>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}
