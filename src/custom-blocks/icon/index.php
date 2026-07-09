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
	$attribute_icon_className = esc_attr($attributes['className'] ?? '');
	$attribute_icon_svg = esc_attr($attributes['icon'] ?? 'action/group_work');
	$attribute_icon_style = esc_attr($attributes['iconStyle'] ?? '');
	$attribute_icon_colour = esc_attr($attributes['colour'] ?? 'currentColor');
	$attribute_icon_size = esc_attr($attributes['size'] ?? "1");
	$attribute_icon_alt_text = esc_attr($attributes['alt'] ?? "");

	// Styles can be:
	// materialicons
	// materialiconsoutlined
	// materialiconsround
	// materialiconssharp
	// materialiconstwotone

	// If no alt text, aria-hidden=true
	if (empty($attribute_icon_alt_text)) {
		$aria_attributes = 'aria-hidden="true"';
	} else {
		$aria_attributes = "aria-label='$attribute_icon_alt_text'";
	}

	$level = plugin_dir_url(dirname( dirname( dirname( __FILE__ ) )));

	$standard_file_name = "assets/icons/".$attribute_icon_svg . "/materialicons/24px.svg";
	$outlined_file_name = "assets/icons/".$attribute_icon_svg . "/materialiconsoutlined/24px.svg";
	$round_file_name    = "assets/icons/".$attribute_icon_svg . "/materialiconsround/24px.svg";
	$sharp_file_name    = "assets/icons/".$attribute_icon_svg . "/materialiconssharp/24px.svg";
	$twotone_file_name  = "assets/icons/".$attribute_icon_svg . "/materialiconstwotone/24px.svg";

	// If an alternative style has been selected, it is used if it exists
	// If it doesn't exist, the standard file name is used

	if ($attribute_icon_style == "outlined" && is_file(WB_BLOCKS_DIR.$outlined_file_name)) {
		$name = $level.$outlined_file_name;
	} elseif ($attribute_icon_style == "round" && is_file(WB_BLOCKS_DIR.$round_file_name)) {
		$name = $level.$round_file_name;
	} elseif ($attribute_icon_style == "sharp" && is_file(WB_BLOCKS_DIR.$sharp_file_name)) {
		$name = $level.$sharp_file_name;
	} elseif ($attribute_icon_style == "twotone" && is_file(WB_BLOCKS_DIR.$twotone_file_name)) {
		$name = $level.$twotone_file_name;
	} else {
		$name = $level.$standard_file_name;
	}

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>
	<div role="image" <?php echo $aria_attributes;?> class="wb-icon wb-icon--<?php echo $attribute_icon_style;?>" style="--icon-path:url(<?php echo $name;?>);--icon-size:<?php echo $attribute_icon_size;?>;background-color:<?php echo $attribute_icon_colour;?>;">
	</div>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}
