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

function wb_blocks_filterable_listing_block_results($listing_settings, $active_filters)
{
	$filters = $listing_settings["variant"] !== "auto-item-list";
	$post_type_obj = get_post_type_object($listing_settings["postType"]);
	$flex_cpt_name = $post_type_obj->labels->singular_name;
	$flex_cpt_name_plural = $post_type_obj->labels->name;

	$listing_query = wb_blocks_filterable_listing_block_get_listing_query($listing_settings, $active_filters);

	if ($listing_query->have_posts()) {

		$display_fields = wb_blocks_filterable_listing_block_get_display_fields($listing_settings["displayFields"]);

		$item_count_text = "";

		if ($listing_query->found_posts > 1 && $filters) {
			$item_count_text = $listing_query->found_posts . " " . strtolower($flex_cpt_name_plural);
		} elseif ($listing_query->found_posts == 1 && $filters) {
			$item_count_text = "1 " . strtolower($flex_cpt_name);
		}
		?>
		<div class="wb-listing mb-4 pb-2
			<?php if (!$listing_settings["styles"]["stylesResultsShadedBackground"]) {
   	echo "border-b";
   } ?>
		">
			<?php echo esc_html($item_count_text); ?>
		</div>
		
		<?php
  // There are a number of layout settings, the overarching class deals with the layout.
  // The featured image class deals with the image size and positioning, which might change when the layout adapts to breakpoints
  $overarching_class = "";
  $featured_image_class = "float-right w-[125px] h-[125px] md:w-[152px] md:h-[152px]";
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
  			$featured_image_class .= " md:float-none";
  			break;
  		case "side-by-side-4-1":
  			$overarching_class .= "grid-cols-1 lg:grid-cols-4";
  			$featured_image_class = "float-right lg:float-none w-[125px] h-[125px] lg:w-[152px] lg:h-[152px]";
  			break;
  		case "side-by-side-4-2":
  			$overarching_class .= "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  			$featured_image_class =
  				"sm:float-right lg:float-none w-[125px] h-[125px] sm:w-[100px] sm:h-[100px] lg:w-[152px] lg:h-[152px]";
  			break;
  		default:
  			$overarching_class .= "grid-cols-1 md:grid-cols-3 ";
  	}
  }
  if ($listing_settings["styles"]["stylesResultsShadedBackground"] == true) {
  	$overarching_class .= " gap-x-4";
  }
  ?>
		<div class="<?php echo esc_attr($overarching_class); ?>">
			<?php while ($listing_query->have_posts()) {

   	$listing_query->the_post();

   	$list_item_classes = "wb-listing mb-4 flow-root ";

   	if ($listing_settings["styles"]["stylesResultsShadedBackground"] == true) {
   		$list_item_classes .= "wb-shaded p-4";
   	} else {
   		$list_item_classes .= "border-b pb-2";
   	}
   	?>
			<div class="<?php echo $list_item_classes; ?>">
				<?php if ($listing_settings["displayImage"]) {
    	// if there is a post thumbnail, and the listing page has it set to display, we echo it out here
    	$thumb_id = get_post_thumbnail_id(get_the_ID());
    	$thumb_url = get_the_post_thumbnail_url(get_the_ID(), "thumbnail");
    	if (!empty($thumb_url)) {
    		$thumb_url = esc_url($thumb_url);
    		$thumb_class =
    			$featured_image_class . " wb-listing-thumbnail bg-no-repeat bg-center ml-[5px] mb-[2px] border";
    		$alt_text = esc_attr__(get_post_meta($thumb_id, "_wp_attachment_image_alt", true), "wb_blocks");

    		echo "<div class='$thumb_class' style=\"background-image:url('$thumb_url');\"></div>";
    	}
    } ?>
				<h2 class="font-bold text-2xl">
					<a href="<?php echo esc_url(get_permalink()); ?>">
						<?php echo esc_html(get_the_title()); ?>
					</a>
				</h2>
				<?php $tax_url_array = wb_blocks_filterable_listing_item_terms($listing_settings); ?>
				<?php wb_blocks_filterable_listing_item_details($display_fields, $listing_settings, $tax_url_array); ?>
			</div>
			<?php
   } ?>
		</div>

	<?php if ($filters) {
 	wb_blocks_filterable_listing_pagination($listing_query);
 }
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

function wb_blocks_filterable_listing_item_details($display_fields, $listing_settings, $tax_url_array = [])
{
	if (empty($display_fields)) {
		return;
	}

	foreach ($display_fields as $display_field) {
		$field_label = $display_field["label"];
		$field_name = $display_field["name"];
		$field_value = "";
		$tax_joiner = "<br />"; // This joins the tax list together
		if (
			$listing_settings["styles"]["stylesFieldLayout"] == "inline" ||
			$listing_settings["styles"]["stylesFieldLayout"] == "stacked-inline"
		) {
			$tax_joiner = "; "; // This joins the tax list together
		}

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

			// Style fields as per settings
			$field_layout = $listing_settings["styles"]["stylesFieldLayout"];
			switch ($field_layout) {
				case "inline":
					$outerClass = "md:inline-flex gap-2 ";
					$innerClass = "inline";
					break;
				case "inline-stacked":
					$outerClass = "sm:inline-flex flex-col py-1 mr-4 sm:text-lg";
					$innerClass = "sm:text-base [&_span.colon]:hidden";
					break;
				case "stacked-inline":
					$outerClass = "flex gap-2";
					$innerClass = "inline";
					break;
				default:
					$outerClass = "flex gap-2 flex-col";
					$innerClass = "";
			}
			if ($field_name == "post_summary") {
				$outerClass = "flex gap-2 text-xl";
				$innerClass = "inline";
			} else {
				$outerClass .= " text-base";
			}
			$labelClass = "";
			if ($listing_settings["styles"]["stylesHideLabels"]) {
				$labelClass = " sr-only";
			}
			?>
		<div class="<?php echo $outerClass; ?> mt-4 pe-4">
			<?php if (!empty($field_label) && $field_name != "post_summary") { ?>
				<h3 class="<?php echo $innerClass . $labelClass; ?> font-bold">
					<?php echo esc_html(__($field_label, "wb_blocks")); ?><span class="colon">:</span>
				</h3>
			<?php } ?>
			<div class="<?php echo $innerClass; ?>">
				<?php echo wp_kses_post($field_value); ?>
			</div>
		</div>
<?php
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
	$query_to_paginate = $custom_query;

	$max_pages = $query_to_paginate->max_num_pages;

	$current_page_number = get_query_var("paged") ? get_query_var("paged") : 1;

	if ($max_pages > 1) { ?>
		<nav class="" aria-label="pagination">
			<ul class="flex gap-4 list-none p-0 m-0">
				<?php if ($current_page_number > "1") {
    	echo "<li class='inline-flex items-center gap-1 font-medium px-3 py-1.5'>";
    	previous_posts_link(
    		'
						<span class="">' .
    			__('Previous<span class="hidden sm:inline"> page</span>', "wb_blocks") .
    			'
						</span>
						',
    		$max_pages,
    	);
    	echo "</li>";
    } ?>
				<li class="">
					<?php printf(__("Page %s of %s", "wb_blocks"), $current_page_number, $max_pages); ?>

				</li>
				<?php if ($current_page_number < $max_pages) {
    	echo "<li class='archive-pagination-next-btn'>";
    	next_posts_link(
    		'
						<span class="inline-flex items-center gap-1 font-medium px-3 py-1.5">' .
    			__('Next<span class="hidden sm:inline"> page</span>', "wb_blocks") .
    			'</span>
						',
    		$max_pages,
    	);
    	echo "</li>";
    } ?>
			</ul>
		</nav>
		<?php }
}

?>
