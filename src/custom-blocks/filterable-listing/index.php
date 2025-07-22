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

function wb_blocks_render_callback_filterable_listing_block($attributes, $content)
{

    // Parse attributes found in index.js
    $attribute_box_listingPostType = esc_html($attributes['listingPostType'] ?? '');
    $attribute_box_listingFilters = $attributes['listingFilters'] ?? [];
    $attribute_box_listingDisplayFields = $attributes['listingDisplayFields'] ?? [];
    $attribute_box_listingItemsPerPage = $attributes['listingItemsPerPage'] ?? 10;
    $attribute_box_listingSortOrder = $attributes['listingSortOrder'] ?? 'published_date';
    $attribute_box_listingRestrictTaxonomies = $attributes['listingRestrictTaxonomies'] ?? [];
    $attribute_box_listingRestrictTerms = $attributes['listingRestrictTerms'] ?? [];
    $attribute_box_className = esc_html($attributes['className'] ?? '');

   
    // Turn on buffering so we can collect all the html markup below and load it via the return
    // This is an alternative method to using sprintf(). By using buffering you can write your
    // code below as you would in any other PHP file rather then having to use the sprintf() syntax
    ob_start();

    var_dump($attribute_box_listingRestrictTaxonomies);
    var_dump($attribute_box_listingRestrictTerms);
    if(!empty($attribute_box_listingPostType)){ ?>

    <div class="grid grid-cols-3 gap-4">

    <?php

        wb_blocks_filterable_listing_block_filters($attribute_box_listingFilters);

    ?>

    <div class="col-span-2 p-4"> 

    <?php

    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

    $listing_active_filters = [];
    $tax_qry_ary = [];
    
    $listing_args = [
        'post_type' => $attribute_box_listingPostType,
        'posts_per_page' => $attribute_box_listingItemsPerPage,
        'relevanssi' => true,
        'paged' => $paged
    ];



    foreach ($attribute_box_listingFilters as $filter) {

        if (taxonomy_exists($filter)) {
            // Create an array of what taxonomies have been selected in dropdown
            wb_blocks_filterable_listing_block_add_filter_term_if_exists($filter, $listing_active_filters);
        
        }
    }

     //Filters
     if(!empty($listing_active_filters)){

        foreach($listing_active_filters as $active_filter){
            $tax_qry_ary[] = array(
                'taxonomy' => $active_filter['taxonomy'],
                'field' => 'term_id',
                'terms' => $active_filter['value']
            );
        }
    }

    if (!empty($tax_qry_ary)) {
        $listing_args['tax_query'] = $tax_qry_ary;
    }

    if ($attribute_box_listingSortOrder == 'title') {
        $listing_args['orderby'] = 'title';
        $listing_args['order'] = 'ASC';
    } else {
        $listing_args['orderby'] = 'post_date';
        $listing_args['order'] = 'DESC';
    }

    $listing_query = new WP_Query($listing_args);

    if ($listing_query->have_posts()) { 

        ?>
        
        <div class="flexible-post-type-list">
            <?php
            while ($listing_query->have_posts()) {
                $listing_query->the_post();?>
            <div class="list-item">
                <h2 class="list-item-title">
                        <a href="<?php echo get_permalink(); ?>">
                            <?php echo get_the_title(); ?>
                        </a>
                </h2>
                <div class="list-item-detail detail-<?php echo $field['name']; ?>">
                    <div class="list-item-detail-label">
                        Published:
                    </div>
                    <?php echo '<time class="entry-date published-date" datetime="' . get_the_date( DATE_W3C ) . '">' . get_the_date() . '</time>'; ?>
                </div>
                <br/>
                <?php 
                   wb_blocks_filterable_listing_display_fields($attribute_box_listingDisplayFields);
                ?>
            </div>
            <?php    
            } ?>
        </div>

    <?php
        wb_blocks_filterable_listing_pagination($listing_query);
    }
    ?>
    </div>
    </div>
    <?php
    }

    // Get all the html/content that has been captured in the buffer and output via return
    $output = ob_get_contents();

    // Decode the output in case editors want to add in hyperlinks or other markup
    $output = html_entity_decode($output);

    ob_end_clean();

    return $output;
}


function wb_blocks_filterable_listing_block_filters($filters){
    if(empty($filters)){
       return;     
    }
    ?>

    <!-- Lefthand column with filters and search -->
    <div class="col-span-2 p-4">
    <form action="<?= esc_url(get_permalink()); ?>" method="GET">

    <?php
    foreach($filters as $filter){
        wb_blocks_filterable_listing_block_taxonomy_filter($filter);
    }
    ?>

    <div>
        <button class="">
            <?php _e('Search', 'hale'); ?>
        </button>
        <div class="">
            <a href="<?= esc_url(get_permalink()); ?>" class="">
                <?php _e('Clear', 'hale'); ?>
            </a>
        </div>
    </div>
    </form>
    </div>
<?php
}

function wb_blocks_filterable_listing_block_taxonomy_filter($taxonomy_name){

$taxonomy = get_taxonomy($taxonomy_name);

$parent_class_name = str_replace(' ', '-', $taxonomy->name . '-filter-topic');
$child_class_name = str_replace(' ', '-', $taxonomy->name . '-filter-subtopic');

// Get the selected parent topic
$selected_topic = get_query_var($taxonomy->query_var);

// Use a unique query var for each genre_subtopic
$subtopic_query_var = $taxonomy->query_var . '_subtopic';
$selected_sub_topic = get_query_var($subtopic_query_var);

// Construct the field name for the restriction based on the filter
$restrict_field = 'restrict_by_' . $taxonomy_name;

// ACF 'restrict_by_*' custom field is generated via code
// https://github.com/ministryofjustice/hale/blob/6d5ca3c9c6ddbcf27b23857223a54bcdf5778def/inc/flexible-cpts.php
$restrict_terms = get_field($restrict_field);

// todo: check if tax slug is restricted
//$taxonomy_term_ids = get_taxonomy_term_ids($restrict_taxonomies_array);

if (empty($restrict_terms)) {
    $dropdown_exclude = "";
}

if (is_array($restrict_terms) && !empty($restrict_terms)) {
    // Get an array of terms excluding the restricted ones
    $exclude_terms = get_terms([
        'taxonomy' => $taxonomy_name,
        'exclude' => $restrict_terms
    ]);

    if (!empty($exclude_terms)) {
        // For all the terms left after excluding the restricted ones
        // get their ids into an array
        $dropdown_exclude = array_map(function($term) {
            return $term->term_id;
        }, $exclude_terms);
    }
}

$dropdown_args = [
    "name" => $taxonomy->query_var,
    "id" => $parent_class_name,
    "class" => "",
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

echo '<label class="" for="' . esc_attr($parent_class_name) . '">' . esc_html($filter_label) . '</label>';
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
    $subtopic_wrapper_classes = '';

    $sub_topics = [];

    if (is_numeric($selected_topic) && $selected_topic > 0) {
        $sub_topics = get_terms(array(
            'taxonomy' => $taxonomy_name,
            'parent' => $selected_topic,
            'hide_empty' => false,
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
    
    echo '<div id="' . $wrapper_id . '" class="' . $subtopic_wrapper_classes . '">';
    echo '<label class="" for="' . esc_attr($child_class_name) . '">' . esc_html($subfilter_label) . '</label>';
    echo '<select name="' . esc_attr($subtopic_query_var) . '" id="' . esc_attr($child_class_name) . '" class="filter-subtopic" ' . $disabled_subtopics . '>';
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

function wb_blocks_filterable_listing_block_add_filter_term_if_exists($filter, &$listing_active_filters, $is_multiselect = false) {


    $taxonomy = get_taxonomy($filter);

    if (!$taxonomy) {
        return;
    }

    // Generate the subtopic filter key
    $filter_term_id_subtopic = $taxonomy->query_var . '_subtopic';

    // Retrieve the value of the main filter and subtopic query variables
    $filter_term_id = get_query_var($taxonomy->query_var);
    $filter_term_id_subtopic_value = get_query_var($filter_term_id_subtopic);

    // Combine them into an associative array
    $filter_terms = [
        'term_id' => $filter_term_id,
        'subtopic_term_id' => $filter_term_id_subtopic_value
    ];

    if($is_multiselect){
        $filter_term_ids = explode(",", $filter_term_id);

        $validated_term_ids = [];
        if(!empty($filter_term_ids)){
            foreach($filter_term_ids as $term_id){
                if(is_numeric($term_id) && term_exists($term_id, $filter)){
                    $validated_term_ids[] = $term_id;
                }
            }
        }

        if(!empty($validated_term_ids)){
            $listing_active_filters[] = array(
                'taxonomy' => $filter,
                'value' => $validated_term_ids
            );
        }
       
    }
    else  {
        // Check if the main filter term ID is numeric and exists
        if (is_numeric($filter_terms['term_id'])) {
            $filter_terms['term_id'] = intval($filter_terms['term_id']);

            if (term_exists($filter_terms['term_id'], $filter)) {
                $listing_active_filters[] = array(
                    'taxonomy' => $filter,
                    'value' => $filter_terms['term_id']
                );
            }
        }
    }

    if($filter == 'hearing-witness'){
        $listing_active_filters[] = array(
            'taxonomy' => $filter,
            'value' => explode(",",$filter_terms['term_id'])
        );
    }

    // Check if the subtopic term ID is numeric and exists in the main taxonomy
    if (is_numeric($filter_terms['subtopic_term_id'])) {
        $filter_terms['subtopic_term_id'] = intval($filter_terms['subtopic_term_id']);

        if (term_exists($filter_terms['subtopic_term_id'], $filter)) {
            $listing_active_filters[] = array(
                'taxonomy' => $filter,
                'value' => $filter_terms['subtopic_term_id']
            );
        }
    }
}


function wb_blocks_filterable_listing_display_fields($display_fields){ 
    
    foreach($display_fields as $display_field){

        $tax = get_taxonomy($display_field);
        $field = ["name" =>  $display_field, "label" =>  $tax->labels->singular_name, "type" => "taxonomy"];


        $field_value = "";

        $tax_terms = get_the_terms( get_the_ID(), $field['name'] );

        if(!empty($tax_terms)){

            $term_names = [];
            foreach ($tax_terms as $term) {
                $term_names[] = $term->name;
            }

            if(!empty($term_names)){
                $field_value = implode("," , $term_names);
            }
        }
    
    ?>
     <div class="list-item-detail detail-<?php echo $field['name']; ?>">
        <?php if(!empty($field['label'])){ ?>
            <div class="list-item-detail-label">
                <?php echo __($field['label'],'hale'); ?>:
            </div>
        <?php }?>
        <?php echo $field_value; ?>
    </div>
    <br/>
<?php
    }
}


function wb_blocks_filterable_listing_pagination($custom_query)
{

    $query_to_paginate = $custom_query;
    
    $max_pages = $query_to_paginate->max_num_pages;

   

        $current_page_number = (get_query_var('paged')) ? get_query_var('paged') : 1;

        if ($max_pages > 1) {
            ?>
            <nav class="archive-pagination-nav" aria-label="pagination">
                <ul class="archive-pagination">
                    <li class="archive-pagination-current-page">
                        <?php
                        printf(__('Page %s of %s','hale'),$current_page_number,$max_pages);
                        ?>

                    </li>
                    <?php
                        if ($current_page_number > "1") {
                            echo "<li class='archive-pagination-prev-btn'>";
                            previous_posts_link('
                            <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                                <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                            </svg><span class="govuk-pagination__link-title">'.__('Previous<span class="govuk-visually-hidden"> page</span>',"hale").'
                            </span>
                            ', $max_pages);
                            echo "</li>";
                        }
                        if ($current_page_number < $max_pages) {
                            echo "<li class='archive-pagination-next-btn'>";
                            next_posts_link('
                            <span class="govuk-pagination__link-title">'.__('Next<span class="govuk-visually-hidden"> page</span>',"hale").'</span><svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                                <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                            </svg>
                            ', $max_pages);
                            echo "</li>";
                        }
                    ?>
                </ul>
            </nav>
            <?php
        }

    
}
?>
