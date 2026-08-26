<?php

/**
 * Filterable Listing block - Part - Results
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_filterable_listing_block_results($block_id, $listing_settings, $active_filters)
{
	$filters = $listing_settings["variant"] !== "auto-item-list";
	$post_type_obj = get_post_type_object($listing_settings["postType"]);
	$flex_cpt_name = $post_type_obj->labels->singular_name;
	$flex_cpt_name_plural = $post_type_obj->labels->name;

	$listing_query = wb_blocks_filterable_listing_block_get_listing_query(
		$block_id,
		$listing_settings,
		$active_filters,
	);

	$class_array = wb_blocks_filterable_listing_overarching_classes($listing_settings);

	$details_wrapper_class = $class_array["details_wrapper"];
	$border_class = $class_array["border"];
	$list_item_class = $class_array["list_item_class"];
	$set_border_style = $class_array["border_style"];
	$set_bg_colour_style = $class_array["bg_colour_style"];

	if ($listing_query->have_posts()) {

		$display_fields = wb_blocks_filterable_listing_block_get_display_fields($listing_settings["displayFields"]);

		$item_count_text = "";
		if ($listing_query->found_posts > 1 && $filters) {
			$item_count_text = $listing_query->found_posts . " " . strtolower($flex_cpt_name_plural);
		} elseif ($listing_query->found_posts == 1 && $filters) {
			$item_count_text = "1 " . strtolower($flex_cpt_name);
		}

		$item_count_text = esc_html($item_count_text);
		echo "
			<div
				style='$set_border_style'
				class='wb-listing mb-4 pb-2 $border_class'>
				$item_count_text
			</div>
		";

		$overarching_class = esc_attr($class_array["top"]);
		?>

		<div class="<?php echo esc_attr($overarching_class); ?>">
			<?php while ($listing_query->have_posts()) {

   	$listing_query->the_post();

   	$thumb_id = get_post_thumbnail_id(get_the_ID());
   	$thumb_url = get_the_post_thumbnail_url(get_the_ID(), "thumbnail");
   	$image_html = wb_blocks_filterable_listing_image_html($listing_settings, $class_array, $thumb_id, $thumb_url);
   	?>
			<div class="<?php echo $list_item_class; ?>" style="<?php echo $set_bg_colour_style . $set_border_style; ?>">
				<?php echo $image_html; ?>
				<div class="<?= $details_wrapper_class ?>">
					<h2 class="font-bold text-2xl">
						<a href="<?php echo esc_url(get_permalink()); ?>">
							<?php echo esc_html(get_the_title()); ?>
						</a>
					</h2>
					<?php $tax_url_array = wb_blocks_filterable_listing_item_terms($listing_settings); ?>
					<?php wb_blocks_filterable_listing_item_details($display_fields, $listing_settings, $tax_url_array); ?>
				</div>
			</div>
			<?php
   } ?>
		</div>

	<?php if ($filters) {
 	wb_blocks_filterable_listing_pagination($listing_query);
 }

 // If there are no results, we add a placeholder to say so
 // The placeholder changes depending on the variant of the block
	} elseif ($filters) { ?>
		<h2 class="font-bold text-2xl">
			<?php printf(esc_html__("Your search matched no %s.", "wb_blocks"), strtolower($flex_cpt_name_plural)); ?>
		</h2>
		<p class="">
			<?php _e("Try searching again with expanded criteria.", "wb_blocks"); ?>
		</p>
		<?php } else { ?>
		<p class="font-bold text-2xl">
			<?php _e($flex_cpt_name_plural . " shall appear here.", "wb_blocks"); ?>
		</p>
<?php }
}

function wb_blocks_filterable_listing_image_html($listing_settings, $class_array, $thumb_id, $thumb_url)
{
	if (!$listing_settings["displayImage"] || empty($thumb_url)) {
		return;
	}

	$set_border_style = $class_array["border_style"];
	$thumb_class = esc_attr($class_array["image"]);
	if (!empty($thumb_url)) {
		$thumb_url = esc_url($thumb_url);
		$alt_text = "";
		if (!empty(get_post_meta($thumb_id, "_wp_attachment_image_alt", true))) {
			$alt_text = __("Thumbnail image", "wb_blocks");
			$alt_text .= esc_attr__(get_post_meta($thumb_id, "_wp_attachment_image_alt", true), "wb_blocks");
			$alt_text = "aria-label='$alt_text' ";
		}
		return "<div $alt_text class='$thumb_class' style=\"background-image:url('$thumb_url');$set_border_style\"></div>";
	}
}

function wb_blocks_filterable_listing_overarching_classes($listing_settings)
{
	$filters = $listing_settings["variant"] !== "auto-item-list";
	// There are a number of layout settings, the overarching class deals with the layout.
	// The featured image class deals with the image size and positioning, which might change when the layout adapts to breakpoints

	$image_position = $listing_settings["styles"]["imagePosition"];
	$list_item_image_layout_class = $details_position_class = $image_position_class = "";
	switch ($image_position) {
		case "right":
			$image_position_class = "sm:float-right sm:ml-[5px]"; // The image is floated right
			$list_item_image_layout_class = "flow-root ";
			break;
		case "left":
			$details_position_class = "flex-1 ml-3";
			$list_item_image_layout_class = "flex ";
			break;
	}

	// Overarching top class (layout of results and filters)
	// Featured image class (the sizes and the float of the image)
	$overarching_class = "";
	$featured_image_class = "$image_position_class w-[125px] h-[125px] md:w-[152px] md:h-[152px]";
	if (!$filters) {
		$layout = $listing_settings["styles"]["stylesLayout"];

		$overarching_class .= "grid ";
		switch ($layout) {
			case "stacked":
				$overarching_class .= "grid-cols-1";
				break;
			case "side-by-side-2-1":
				$overarching_class .= "grid-cols-1 md:grid-cols-2";
				break;
			case "side-by-side": // 3-1
				$overarching_class .= "grid-cols-1 md:grid-cols-3";
				$featured_image_class .= " md:block md:float-none";
				$list_item_image_layout_class .= "md:block ";
				break;
			case "side-by-side-4-1":
				$overarching_class .= "grid-cols-1 lg:grid-cols-4";
				$featured_image_class = "$image_position_class lg:block lg:float-none w-[125px] h-[125px] lg:w-[152px] lg:h-[152px]";
				$list_item_image_layout_class .= "lg:block ";
				break;
			case "side-by-side-4-2":
				$overarching_class .= "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
				$featured_image_class = "$image_position_class lg:block lg:float-none w-[125px] h-[125px] sm:w-[100px] sm:h-[100px] lg:w-[152px] lg:h-[152px]";
				$list_item_image_layout_class .= "lg:block ";
				break;
			default:
				$overarching_class .= "grid-cols-1 md:grid-cols-3";
		}
	}
	// Adds common Tailwind to the featured image.
	$featured_image_class .= " wb-listing-thumbnail bg-no-repeat bg-center mb-[2px] border";
	if ($listing_settings["styles"]["stylesResultsShadedBackground"] == true) {
		$overarching_class .= " gap-x-4";
	}

	// set border style - inline style for border colour
	// border class - the bottom border for non-shaded
	$set_border_style = "";
	$border_class = "";
	if (!$listing_settings["styles"]["stylesResultsShadedBackground"]) {
		$border_class = "border-b";
		if (!empty($listing_settings["styles"]["stylesResultsBorderColour"])) {
			$set_border_style =
				"border-color:" . esc_attr($listing_settings["styles"]["stylesResultsBorderColour"]) . ";";
		}
	}

	// set bg colour style - if shaded and a colour is specified - inline style
	$set_bg_colour_style = "";
	if (
		$listing_settings["styles"]["stylesResultsShadedBackground"] === true &&
		$listing_settings["styles"]["stylesResultsShadedColour"] !== false
	) {
		$set_bg_colour_style =
			"background-color:" . esc_attr($listing_settings["styles"]["stylesResultsShadedColour"]) . ";";
	}

	// List item classes - classes for each individual item in the list
	$list_item_class = "wb-listing mb-4 " . $list_item_image_layout_class;
	if ($listing_settings["styles"]["stylesResultsShadedBackground"] === true) {
		$list_item_class .= "wb-shaded p-4";
	} else {
		$list_item_class .= $border_class . " pb-2";
	}

	$class_array = [
		"details_wrapper" => $details_position_class,
		"top" => $overarching_class,
		"image" => $featured_image_class,
		"border_style" => $set_border_style,
		"bg_colour_style" => $set_bg_colour_style,
		"border" => $border_class,
		"list_item_class" => $list_item_class,
	];

	return $class_array;
}
function wb_blocks_filterable_listing_field_display_classes($listing_settings)
{
	// Style fields as per settings
	$field_layout = $listing_settings["styles"]["stylesFieldLayout"];
	switch ($field_layout) {
		case "inline":
			$outer_class = "md:inline-flex gap-2 ";
			$inner_class = "inline";
			break;
		case "inline-stacked":
			$outer_class = "sm:inline-flex flex-col py-1 mr-4";
			$inner_class = "sm:text-base [&_span.colon]:hidden";
			break;
		case "stacked-inline":
			$outer_class = "flex gap-2";
			$inner_class = "inline";
			break;
		default:
			$outer_class = "flex gap-2 flex-col";
			$inner_class = "";
	}
	$label_class = "";
	if ($listing_settings["styles"]["stylesHideLabels"]) {
		$label_class = " sr-only";
	}

	// $tax_joiner joins the values in the array together, (if it is <br />, they will be stacked)
	$tax_joiner = "<br />"; // This joins the tax list together
	if (
		$listing_settings["styles"]["stylesFieldLayout"] == "inline" ||
		$listing_settings["styles"]["stylesFieldLayout"] == "stacked-inline"
	) {
		$tax_joiner = "; "; // This joins the tax list together
	}

	$field_styling_array = [
		"inner" => $inner_class,
		"outer" => $outer_class,
		"label" => $label_class,
		"joiner" => $tax_joiner,
	];
	return $field_styling_array;
}

function wb_blocks_filterable_listing_item_details($display_fields, $listing_settings, $tax_url_array = [])
{
	if (empty($display_fields)) {
		return;
	}

	$field_styling_array = wb_blocks_filterable_listing_field_display_classes($listing_settings);
	$inner_class = $field_styling_array["inner"];
	$outer_class = $field_styling_array["outer"];
	$label_class = $field_styling_array["label"];
	$tax_joiner = $field_styling_array["joiner"];

	foreach ($display_fields as $display_field) {
		$field_label = $display_field["label"];
		$field_name = $display_field["name"];
		$field_value = "";

		if ($display_field["type"] == "taxonomy") {
			$tax_terms = get_the_terms(get_the_ID(), $field_name);

			if (!empty($tax_terms)) {
				$term_names = [];
				foreach ($tax_terms as $term) {
					$term_names[] = $term->name;
				}

				if (!empty($term_names)) {
					$tax_array = [];
					foreach ($term_names as $name) {
						$tax_url = "";
						$tax_url_index = array_search($name, array_column($tax_url_array, "tax_name"));
						$tax_url = $tax_url_index !== false ? $tax_url_array[$tax_url_index]["tax_url"] : "";
						$tax_url = esc_attr($tax_url);
						$name = esc_html($name);

						if ($tax_url && $listing_settings["styles"]["stylesTaxLinks"]) {
							$tax_array[] = "<a href='$tax_url'>$name</a>";
						} else {
							$tax_array[] = "$name";
						}
					}
					if (count($tax_array) > 1 && !empty($display_field["label_plural"])) {
						$field_label = $display_field["label_plural"];
					}
					$field_value = implode($tax_joiner, $tax_array);
				}
			}
		} elseif ($display_field["type"] == "published_date") {
			$field_value =
				'<time class="entry-date" datetime="' . get_the_date(DATE_W3C) . '">' . get_the_date() . "</time>";
		} elseif ($display_field["type"] == "meta") {
			$field_value = get_field($field_name);
		}

		if (!empty($field_value)) {
			// Summary has a few different classes as it never has its own label
			// so we override the classes set in the function with these
			if ($field_name == "post_summary") {
				$outer_class = "flex gap-2";
				$inner_class = "inline";
			}

			$field_label_html = "";
			if (!empty($field_label) && $field_name != "post_summary") {
				$field_label_html =
					"
					<h3 class='$inner_class $label_class font-bold'>
						" .
					esc_html(__($field_label, "wb_blocks")) .
					"<span class='colon'>:</span>
					</h3>
				";
			}

			echo "
				<div class='$outer_class mt-4 pe-4'>
					$field_label_html
					<div class='$inner_class'>
						" .
				wp_kses_post($field_value) .
				"
					</div>
				</div>
			";
		}
	}
}

function wb_blocks_filterable_listing_item_terms($listing_settings)
{
	$taxonomies = $listing_settings["displayTerms"];
	$taxTermsArray = [];
	if (empty($taxonomies)) {
		return [];
	}

	foreach ($taxonomies as $tax) {
		$tax_terms = get_the_terms(get_the_ID(), $tax);

		if (!empty($tax_terms)) {
			$taxTermsArray[] = [
				"taxonomy" => $tax,
				"terms" => $tax_terms,
			];
		}
	}

	if (empty($taxTermsArray)) {
		return [];
	}
	$taxonomy_links = [];
	foreach ($taxTermsArray as $tax) {
		foreach ($tax["terms"] as $term) {
			$tax_name = $term->name;
			$tax_url = get_term_link($term);

			$taxonomy_links[] = [
				"tax_name" => $tax_name,
				"tax_url" => $tax_url,
			];
		}
	}
	return $taxonomy_links;
}

function wb_blocks_filterable_listing_pagination($custom_query)
{
	$block_id = $custom_query->query["block_id"];

	$param_name = "listing_{$block_id}_page";

	$current_page_number = array_key_exists($param_name, $_GET) ? absint($_GET[$param_name]) : 1;
	$current_page_number = max(1, $current_page_number);

	$next_page_number = $current_page_number + 1;
	$prev_page_number = $current_page_number - 1;

	$next_page_text = __('Next<span class="hidden sm:inline"> page</span>', "wb_blocks");
	$prev_page_text = __('Previous<span class="hidden sm:inline"> page</span>', "wb_blocks");

	$next_url = add_query_arg($param_name, $next_page_number);
	$prev_url = add_query_arg($param_name, $prev_page_number);

	$query_to_paginate = $custom_query;

	$max_pages = $query_to_paginate->max_num_pages;

	if ($max_pages > 1) { ?>
		<nav class="" aria-label="pagination">
			<ul class="flex gap-4 list-none py-1.5 px-0 m-0">
			<?php if ($current_page_number > "1") { ?>
				<li>
					<a href='<?php echo esc_url($prev_url); ?>'>
						<span class='inline-flex items-center gap-1 font-medium pe-3 py-1.5'>
							<?php echo $prev_page_text; ?>
						</span>
					</a>
				</li>
			<?php } ?>
				<li class="ps-3 pe-3 py-1.5 first:ps-0">
					<?php printf(__("Page %s of %s", "wb_blocks"), $current_page_number, $max_pages); ?>
				</li>
			<?php if ($current_page_number < $max_pages) { ?>
				<li>
					<a href='<?php echo esc_url($next_url); ?>'>
						<span class='inline-flex items-center gap-1 font-medium ps-3 py-1.5'>
							<?php echo $next_page_text; ?>
						</span>
					</a>
				</li>
			<?php } ?>
			</ul>
		</nav>
		<?php }
}

?>
