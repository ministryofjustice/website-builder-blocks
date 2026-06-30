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

$tailwind_state_colours = "
hover:bg-[var(--wb-accordion-hover-bg)]
focus:text-(--wb-accordion-focus-text)
focus:bg-[var(--wb-accordion-focus-bg)]
focus-visible:bg-[var(--wb-accordion-focus-visible-bg)]
focus-visible:shadow-[0_0_0_2px_var(--wb-accordion-focus-visible-outline)]
outline-none
";

function wb_render_callback_accordion_block($attributes, $content)
{
	global $tailwind_state_colours;

	$tailwind_open_all_basic = "
	cursor-pointer
	inline-flex
	items-center
	font-bold
	";
	$tailwind_open_all_chevron = "
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


	$openAllText = esc_html($attributes['openAll'] ?? "Expand all sections");
	$closeAllText = esc_html($attributes['closeAll'] ?? "Collapse all sections");
	$accordionClassName = esc_html($attributes['accordionClassName']) ?? "";

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<div
		class="wb-accordion <?= $accordionClassName; ?> "
	>
	<?php
		// The Tailwind class "hidden" is removed by JS - which is needed for this to work
		// This is a check to ensure that without JS, the JS dependent button isn't shewn
	?>
	<button href="#" class="wb-accordion-toggle-all hidden p-2 -ml-2 <?php echo $tailwind_open_all.$tailwind_state_colours; ?>" data-state="" data-opentext="<?php echo $openAllText;?>" data-closetext="<?php echo $closeAllText;?>"></button>
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

function wb_render_callback_accordion_block_section($attributes, $content)
{
	global $tailwind_state_colours;

	$tailwind_remove_marker = "flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden";
	$tailwind_chevron = "w-2 h-2 mx-4 shrink-0 border-r-2 border-b-2 border-current rotate-[45deg] transition-transform duration-200 group-open:rotate-[225deg]";
	

	// Parse attributes found in index.js
	$attribute_accordion_section_className = esc_attr($attributes['accordionSectionClassName']) ?? '';
	$attribute_accordion_heading_size = esc_html($attributes['accordionHeadingFontSize'] ?? 'base');
	$attribute_accordion_section_title = esc_html($attributes['sectionTitle'] ?? '');
	$attribute_accordion_section_open_by_default = $attributes['defaultOpen'] ?? false;
	$attribute_accordion_heading_level = (int) ($attributes['accordionHeadingLevel'] ?? 3);
	if ($attribute_accordion_heading_level < 2 || $attribute_accordion_heading_level > 6) {
		$attribute_accordion_heading_level = 3;
	}

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	?>

	<details
		class="<?= $attribute_accordion_section_className; ?> wb-accordion__section group mt-4"
		<?php if ($attribute_accordion_section_open_by_default) echo "open"; ?>
	>
		<summary class="<?php echo $tailwind_remove_marker.$tailwind_state_colours; ?> cursor-pointer py-4 px-2 my-1 -ml-2">
			<h<?php echo $attribute_accordion_heading_level; ?> class="<?php echo "has-$attribute_accordion_heading_size-font-size";?> wp-block-heading inline-block !m-0">
				<?= $attribute_accordion_section_title; ?>
			</h<?php echo $attribute_accordion_heading_level; ?>>
			<span
				class="wb-accordion__section-chevron <?php echo $tailwind_chevron;?>">
			</span>
		</summary>
		<div class="wb-accordion__section-content mt-1 [&_p:first-child]:mt-0! ">
			<?= wp_kses_post($content); ?>
		</div>
	</details>

	<?php

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}
