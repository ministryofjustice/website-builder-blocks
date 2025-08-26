<?php

/**
 * Filterable Listing block - Part - Filters
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_filterable_listing_block_filters($block_id, $listing_settings, $active_filters){
    if(empty($listing_settings['filters'])){
       return;     
    }
    
    ?>

    <!-- Lefthand column with filters and search -->
    <div class="col-span-1 p-4">
    <form action="<?= esc_url(get_permalink()); ?>" method="GET">
    <?php
   
    wb_blocks_filterable_listing_block_search_text_filter($active_filters, $listing_settings);

    foreach($listing_settings['filters'] as $filter){

        if (taxonomy_exists($filter)) {
            wb_blocks_filterable_listing_block_taxonomy_filter($block_id, $filter, $active_filters, $listing_settings);
        }
        else if($filter == 'published_date'){

            wb_blocks_filterable_listing_block_date_filter("published_date", "", $active_filters);

        }
        else {
         
            $field_object = get_field_object($filter);

            if(!empty($field_object)){

                if($field_object['type'] == 'date_picker'){

                    wb_blocks_filterable_listing_block_date_filter($field_object['name'], $field_object['label'], $active_filters);
            
                }
                
            }
        }
    }
    ?>

    <div>
        <button class="bg-blue-600 text-white mr-1 px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <?php _e('Search', 'wb_blocks'); ?>
        </button>
      
            <a href="<?= esc_url(get_permalink()); ?>" class="">
                <?php _e('Clear', 'wb_blocks'); ?>
            </a>
      
    </div>
    </form>
    </div>
<?php
}

function wb_blocks_filterable_listing_block_search_text_filter($active_filters, $listing_settings){
    if($listing_settings['searchTextFilter']){ 
        $listing_search_text = wb_blocks_filterable_listing_block_get_active_filter_value($active_filters, "listing_search");

        ?>
        <div class="">
            <label class="block font-medium text-gray-700 mb-1" for="listing-search-field">
                <?php _e('Search', 'wb_blocks'); ?>
            </label>
            <input id="listing-search-field" name="listing_search" class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value="<?php echo $listing_search_text; ?>" type="search">
        </div>
        <br/>
    <?php
        
    }
}

function wb_blocks_filterable_listing_block_date_filter($filter_name, $filter_label, $active_filters){

    if(!empty($filter_label)){
        $from_date_label = $filter_label . " (from)";
        $to_date_label = $filter_label . " (to)";
    }
    else {
        $from_date_label = "Date from";
        $to_date_label = "Date to";
    }

    $from_date_name = $filter_name . "_from_date";
    $to_date_name = $filter_name . "_to_date";

    $from_date = wb_blocks_filterable_listing_block_get_active_filter_value($active_filters, $from_date_name);
    $to_date = wb_blocks_filterable_listing_block_get_active_filter_value($active_filters, $to_date_name);

?>

<div class="moj-datepicker" data-module="moj-date-picker">
    <div class="">
        <label class="block font-medium text-gray-700 mb-1" for="<?php echo $from_date_name; ?>">
            <?php echo esc_html($from_date_label); ?>
        </label>
        <div id="<?php echo $from_date_name; ?>_hint" class="block font-medium text-gray-700 mb-1">
            For example, 13/2/2024.
        </div>
        <input 
            class="govuk-input moj-js-datepicker-input" 
            id="<?php echo $from_date_name; ?>" 
            name="<?php echo $from_date_name; ?>" 
            type="text" 
            aria-describedby="<?php echo $from_date_name; ?>_hint" 
            autocomplete="off" 
            value="<?php echo esc_attr($from_date); ?>"
        >
    </div>
</div>
<br/>
<div class="moj-datepicker" data-module="moj-date-picker">
    <div class="">
        <label class="block font-medium text-gray-700 mb-1" for="<?php echo $to_date_name; ?>">
            <?php echo esc_html($to_date_label); ?>
        </label>
        <div id="<?php echo $to_date_name; ?>_hint" class="block font-medium text-gray-700 mb-1">
            For example, 13/2/2024.
        </div>
        <input 
            class="govuk-input moj-js-datepicker-input" 
            id="<?php echo $to_date_name; ?>" 
            name="<?php echo $to_date_name; ?>" 
            type="text" 
            aria-describedby="<?php echo $to_date_name; ?>_hint" 
            autocomplete="true" 
            value="<?php echo esc_attr($to_date); ?>"
        >
    </div>
</div>
<br/>
<?php
}
function wb_blocks_filterable_listing_block_taxonomy_filter($block_id, $taxonomy_name, $active_filters, $listing_settings){

$taxonomy = get_taxonomy($taxonomy_name);

$parent_class_name = str_replace(' ', '-', $taxonomy->name . '-filter-topic-' . $block_id);
$child_class_name = str_replace(' ', '-',  $taxonomy->name . '-filter-subtopic-' . $block_id);

// Get the selected parent topic
$selected_topic = wb_blocks_filterable_listing_block_get_active_filter_value($active_filters, $taxonomy->query_var);

// Use a unique query var for each genre_subtopic
$subtopic_query_var = $taxonomy->query_var . '_subtopic';
$selected_sub_topic = wb_blocks_filterable_listing_block_get_active_filter_value($active_filters, $subtopic_query_var);

$dropdown_exclude = "";
$restrict_terms = $listing_settings['restrictTerms'];

if(!empty($listing_settings['restrictTaxonomies']) && !empty($listing_settings['restrictTerms'])){
    if(in_array($taxonomy_name, $listing_settings['restrictTaxonomies'])){
      
        // Get an array of terms excluding the restricted ones
        $exclude_terms = get_terms([
            'taxonomy' => $taxonomy_name,
            'exclude' => $listing_settings['restrictTerms']
        ]);

        if (!empty($exclude_terms)) {
            // For all the terms left after excluding the restricted ones
            // get their ids into an array
            $dropdown_exclude = array_map(function($term) {
                return $term->term_id;
            }, $exclude_terms);
        }

        
    }
}

$dropdown_args = [
    "name" => $taxonomy->query_var,
    "id" => $parent_class_name,
    "class" => "wb-blocks-filterable-listing-bloc-tax-filter w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
    'taxonomy' => $taxonomy_name,
    'show_option_all' => "Select option",
    'depth' => 1,
    'orderby' => 'name',
    'order' => 'ASC',
    'hierarchical' => 1,
    'selected' => $selected_topic,
    'exclude' => $dropdown_exclude
];

$filter_label = $taxonomy->labels->singular_name;

if(isset($taxonomy->labels->listing_page_filter) && !empty($taxonomy->labels->listing_page_filter)){
    $filter_label = $taxonomy->labels->listing_page_filter;
}

if($taxonomy_name == "category"){
    $filter_label = "Topic";
}

echo '<label class="block font-medium text-gray-700 mb-1" for="' . esc_attr($parent_class_name) . '">' . esc_html($filter_label) . '</label>';
wp_dropdown_categories($dropdown_args);


$all_terms = get_terms(array(
    'taxonomy' => $taxonomy_name,
    'hide_empty' => false,
));


$has_subtopics = false;

foreach ($all_terms as $term) {
    if ($term->parent > 0) {
        $has_subtopics = true;
        break;
    }
}

if ($has_subtopics) {
    $disabled_subtopics = 'disabled="disabled"';
    $subtopic_wrapper_classes = 'hidden';

    $sub_topics = [];

    if (is_numeric($selected_topic) && $selected_topic > 0) {
        $sub_topics = get_terms(array(
            'taxonomy' => $taxonomy_name,
            'parent' => $selected_topic
        ));

        if (!empty($sub_topics)) {
            $disabled_subtopics = '';
            $subtopic_wrapper_classes = '';
        }
    }

    $subfilter_label = 'Sub ' . $taxonomy->labels->singular_name;

    if(isset($taxonomy->labels->listing_page_subfilter) && !empty($taxonomy->labels->listing_page_subfilter)){
        $subfilter_label = $taxonomy->labels->listing_page_subfilter;
    }

    if($taxonomy_name == "category"){
        $subfilter_label = "Sub-topic";
    }


    $wrapper_id = $child_class_name . '-wrapper';
    
    echo '<br/><br/>';
    echo '<div id="' . $wrapper_id . '" class="' . $subtopic_wrapper_classes . '">';
    echo '<label class="block font-medium text-gray-700 mb-1" for="' . esc_attr($child_class_name) . '">' . esc_html($subfilter_label) . '</label>';
    echo '<select name="' . esc_attr($subtopic_query_var) . '" id="' . esc_attr($child_class_name) . '" class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" ' . $disabled_subtopics . '>';
    echo '<option value="0"' . selected($selected_sub_topic, 0, false) . '>Select option</option>';

    foreach ($sub_topics as $sub_topic) {
        echo '<option value="' . esc_attr($sub_topic->term_id) . '"' . selected($selected_sub_topic, $sub_topic->term_id, false) . '>';
        echo esc_html($sub_topic->name);
        echo '</option>';
    }
    echo '</select>';
    echo '</div>';

}

echo '<br/><br/>';
}

    
?>
