<?php
/**
 * Accordion block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package mojblocks
 *
 */

function render_callback_accordion_block($attributes, $content)
{
	$tailwind_open_all_basic = "
	cursor-pointer
	inline-flex
	items-center
	mb-2
	";
	$tailwind_open_all_chevron = "
	pr-1
	after:content-['']
	after:inline-block
	after:w-1.5
	after:h-1.5
	after:ml-2
	after:border-r-2
	after:border-b-2
	after:border-current
	after:rotate-[45deg]
	after:transition-transform
	after:duration-200
	data-[state=open]:after:rotate-[-135deg]";
	
	$tailwind_open_all = "$tailwind_open_all_basic $tailwind_open_all_chevron";


	$welshControls = $attributes['controlLanguageWelsh'] ?? false;
	$accordionClassName = $attributes['accordionClassName'] ?? "";

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<div
		class="wb-accordion <?php _e(esc_html($accordionClassName)); ?> "
		id="accordion-default"
		<?php
			// Translations taken from https://covid19.public-inquiry.uk/cy/materion-pob-stori/
			if ($welshControls) {
		?>
			data-i18n.hide-all-sections="Cuddio pob adran"
			data-i18n.show-all-sections="Dangos pob adran"
			data-i18n.hide-section="Dangos"
			data-i18n.show-section="Cuddio"
			data-i18n.hide-section-aria-label="dangos yr adran hon"
			data-i18n.show-section-aria-label="cuddio'r adran hon"
		<?php } ?>
	>

	<a href="#" class="accordion-toggle-all <?php echo $tailwind_open_all;?>" role="button" data-state="closed" data-opentext="Expand all sections" data-closetext="Collapse all sections">Expand all sections</a>
	<?php echo $content; ?>

	</div>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();
	ob_end_clean();

	return $output;
}

/**
 * Accordion block section
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package mojblocks
 *
 */

function render_callback_accordion_block_section($attributes, $content)
{
	$tailwind_borders = "first-of-type:border-t border-b";
	$tailwind_remove_marker = "flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden";
	$tailwind_chevron = "w-2 h-2 ml-4 border-r-2 border-b-2 border-current rotate-[45deg] transition-transform duration-200 group-open:rotate-[225deg]";
	

	// Parse attributes found in index.js
	$attribute_accordion_section_className = $attributes['accordionSectionClassName'] ?? '';
	$attribute_accordion_headingLevel = $attributes['accordionHeadingLevel'] ?? '3';
	$attribute_accordion_section_Title = $attributes['accordionSectionTitle'] ?? '';

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<details class="<?php _e(esc_html($attribute_accordion_section_className)); echo " $tailwind_borders"; ?> wb-accordion__section group ">
		<summary class="<?php echo $tailwind_remove_marker; ?>">
			<h<?php echo $attribute_accordion_headingLevel; ?> class="wp-block-heading inline-block cursor-pointer">
				<?php _e(esc_html($attribute_accordion_section_Title)) ; ?>
			</h<?php echo $attribute_accordion_headingLevel; ?>>
			<span
				class="wb-accordion__section-chevron <?php echo $tailwind_chevron;?>">
			</span>
		</summary>
		<div id="accordion-default-content-1" class="wb-accordion__section-content">
			<?php
				_e(esc_html($content));
			?>
		</div>
	</details>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	// decode escaped html so users can add markup to content
	$output = html_entity_decode($output);

	ob_end_clean();

	return $output;
}
