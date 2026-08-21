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

require_once "inc/functions.php";
require_once "parts/filters.php";
require_once "parts/results.php";

function wb_blocks_render_callback_filterable_listing_block($attributes, $content)
{
	// Parse attributes found in index.js
	$postType = esc_html($attributes["listingPostType"] ?? "");

	$variant = $attributes["variant"] ?? "default";

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();

	if (!empty($postType)) {

		$listing_settings = [];
		$listing_settings["postType"] = $postType;
		$listing_settings["variant"] = $variant;
		$listing_settings["searchTextFilter"] = $attributes["listingSearchTextFilter"] ?? true;
		$listing_settings["displayImage"] = $attributes["listingDisplayImage"] ?? true;
		$listing_settings["filters"] = $attributes["listingFilters"] ?? [];
		$listing_settings["displayFields"] = $attributes["listingDisplayFields"] ?? [];
		$listing_settings["displayTerms"] = $attributes["listingDisplayTerms"] ?? [];
		$listing_settings["itemsPerPage"] =
			$attributes["listingItemsPerPage"] ?? ($variant === "auto-item-list" ? 3 : 10);
		$listing_settings["sortOrder"] = $attributes["listingSortOrder"] ?? "published_date";
		$listing_settings["restrictTaxonomies"] = $attributes["listingRestrictTaxonomies"] ?? [];
		$listing_settings["restrictTerms"] = $attributes["listingRestrictTerms"] ?? [];
		$listing_settings["styles"]["stylesResultsShadedBackground"] =
			$attributes["stylesResultsShadedBackground"] ?? false;
		$listing_settings["styles"]["stylesLayout"] = $attributes["stylesLayout"] ?? "side-by-side";
		$listing_settings["styles"]["stylesFieldLayout"] = $attributes["stylesFieldLayout"] ?? "stacked-inline";
		$listing_settings["styles"]["stylesTaxLinks"] = $attributes["stylesTaxLinks"] ?? false;
		$listing_settings["styles"]["stylesHideLabels"] = $attributes["stylesHideLabels"] ?? false;

		$block_classes = $attributes["className"] ?? "";

		$active_filters = [];
		$active_filters = wb_blocks_filterable_listing_validate_active_filters($listing_settings);

		$block_id = rand();
		$tax_filters = [];
		foreach ($listing_settings["filters"] as $filter) {
			if (taxonomy_exists($filter)) {
				$tax_filters[] = $filter;
			}
		}

		$layoutClass = "grid grid-cols-1 sm:grid-cols-3 gap-4"; //default, side-by-side - if converted from an auto-list, other values might be here
		if ($listing_settings["styles"]["stylesLayout"] == "stacked") {
			$layoutClass = "wb-item-listing-is-stacked grid grid-cols-1 sm:grid-cols-1 gap-4"; //wb-item-listing-is-stacked used to shew full day names if wide - see date-picker.js
		}
		if ($variant === "auto-item-list") {
			$layoutClass = "";
		}
		?>

    <div class="<?php echo esc_attr($block_classes); ?> wb-block-filterable-listing"
        data-block-id="<?php echo esc_attr($block_id); ?>"
        data-tax-filters="<?php echo esc_attr(is_array($tax_filters) ? implode(",", $tax_filters) : ""); ?>"
    >
        <div class='<?php echo esc_attr($layoutClass); ?>'>
			<?php if ($variant !== "auto-item-list") {
   	wb_blocks_filterable_listing_block_filters($block_id, $listing_settings, $active_filters);
   } ?>
			<div class="col-span-2"> 
				<?php wb_blocks_filterable_listing_block_results($listing_settings, $active_filters); ?> 
			</div>
        </div>
    </div>
    <?php
	}

	// Get all the html/content that has been captured in the buffer and output via return
	$output = ob_get_contents();

	ob_end_clean();

	return $output;
}

?>
