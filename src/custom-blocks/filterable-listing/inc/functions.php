<?php

/**
 * Filterable Listing block - Functions
 *
 */

function wb_blocks_filterable_listing_validate_active_filters($listing_settings){
    $active_filters = [];

    $listing_filters = $listing_settings['filters'];

    if($listing_settings['searchTextFilter']){ 
        $listing_search_text = get_query_var('listing_search');
        $listing_search_text = stripslashes(sanitize_text_field(esc_html($listing_search_text)));

        if(!empty($listing_search_text)){
            $active_filters[] = array(
                'filterType' => 'search_text',
                'queryVar' => 'listing_search',
                'value' => $listing_search_text 
            );
        }
    }

    foreach ($listing_filters as $filter) {

        if (taxonomy_exists($filter)) {
            // Create an array of what taxonomies have been selected in dropdown
            wb_blocks_filterable_listing_block_validate_tax_filter($filter, $active_filters);
        
        }
        else if($filter == 'published_date'){

            wb_blocks_filterable_listing_block_validate_date_filter($filter . "_from_date", "published_date_from_date", $active_filters);
            wb_blocks_filterable_listing_block_validate_date_filter($filter . "_to_date", "published_date_to_date", $active_filters);

        }
        else {
         
            $field_object = get_field_object($filter);

            if(!empty($field_object)){

                if($field_object['type'] == 'date_picker'){

                    wb_blocks_filterable_listing_block_validate_date_filter($field_object['name'] . "_from_date", "meta_from_date", $active_filters, $field_object['name']);
                    wb_blocks_filterable_listing_block_validate_date_filter($field_object['name'] . "_to_date", "meta_to_date", $active_filters, $field_object['name']);
            
                }
                
            }
        }
    }

    return $active_filters;
}

function wb_blocks_filterable_listing_block_validate_tax_filter($filter, &$listing_active_filters) {


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

    // Check if the main filter term ID is numeric and exists
    if (is_numeric($filter_terms['term_id'])) {
        $filter_terms['term_id'] = intval($filter_terms['term_id']);

        if (term_exists($filter_terms['term_id'], $filter)) {
            $listing_active_filters[] = array(
                'taxonomy' => $filter,
                'filterType' => 'taxonomy',
                'queryVar' => $taxonomy->query_var,
                'value' => $filter_terms['term_id']
            );
        }
    }
    

    // Check if the subtopic term ID is numeric and exists in the main taxonomy
    if (is_numeric($filter_terms['subtopic_term_id'])) {
        $filter_terms['subtopic_term_id'] = intval($filter_terms['subtopic_term_id']);

        if (term_exists($filter_terms['subtopic_term_id'], $filter)) {
            $listing_active_filters[] = array(
                'taxonomy' => $filter,
                'filterType' => 'taxonomy',
                'queryVar' => $filter_term_id_subtopic,
                'value' => $filter_terms['subtopic_term_id']
            );
        }
    }
}

function wb_blocks_filterable_listing_block_validate_date_filter($filter_query_var, $filter_type, &$listing_active_filters, $filter_meta_key="") {

    $date_filter_value = get_query_var($filter_query_var);
    $date_filter_value = sanitize_text_field(esc_html($date_filter_value));

    if(!empty($date_filter_value)){

        $active_date_filter = array(
            'filterType' => $filter_type,
            'queryVar' => $filter_query_var,
            'metaKey' => $filter_meta_key,
            'value' => $date_filter_value,
            'error' => false,
            'valueTimestamp' => 0
        );

        $date_filter_timestamp = wb_blocks_filterable_listing_block_validate_date($date_filter_value);

        if($date_filter_timestamp == false){
            $active_date_filter['error'] = true;
        }
        else {
            $active_date_filter['valueTimestamp'] = $date_filter_timestamp;
        }

        $listing_active_filters[] = $active_date_filter;
    }

}
    
function wb_blocks_filterable_listing_block_get_active_filter_value($listing_active_filters, $query_var) {
    $filter_value = '';

    if(!empty($listing_active_filters)){

        foreach ($listing_active_filters as $filter) {
            if (isset($filter['queryVar']) && $filter['queryVar'] == $query_var) {
                $filter_value = $filter['value'];
                break;
            }
        }
    }

    return $filter_value;
}

function wb_blocks_filterable_listing_block_get_listing_query($listing_settings, $active_filters) {

    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

    $tax_qry_ary = [];
    $published_date_qry = [];
    $meta_qry = [];
    $meta_date_filters = [];
    
    $listing_args = [
        'post_type' => $listing_settings['postType'],
        'posts_per_page' => $listing_settings['itemsPerPage'],
        'relevanssi' => true,
        'paged' => $paged
    ];

    if(!empty($listing_settings['restrictTaxonomies']) && !empty($listing_settings['restrictTerms'])){
        foreach($listing_settings['restrictTerms'] as $restrict_term_id){
            $restrict_term = get_term( $restrict_term_id );

            if ( !is_wp_error( $restrict_term ) && $restrict_term && in_array($restrict_term->taxonomy, $listing_settings['restrictTaxonomies'])) {
                
                $tax_qry_ary[] = array(
                    'taxonomy' => $restrict_term->taxonomy,
                    'field' => 'term_id',
                    'terms' => $restrict_term->term_id
                );

            }
        }

    }

    if(!empty($active_filters)){
        foreach($active_filters as $active_filter){

            if($active_filter['filterType'] == 'taxonomy'){
                $tax_qry_ary[] = array(
                    'taxonomy' => $active_filter['taxonomy'],
                    'field' => 'term_id',
                    'terms' => $active_filter['value']
                );
            }
            else if($active_filter['filterType'] == 'search_text'){
                $listing_args['s'] = $active_filter['value'];
            }
            else if($active_filter['filterType'] == 'published_date_from_date'){
                if($active_filter['error'] == false){
                    $published_date_qry['after'] = $active_filter['valueTimestamp'];
                }
            }
            else if($active_filter['filterType'] == 'published_date_to_date'){
                if($active_filter['error'] == false){
                    $published_date_qry['before'] = $active_filter['valueTimestamp'];
                }
            }
            else if($active_filter['filterType'] == 'meta_from_date'){
                if($active_filter['error'] == false){
                    
                    $meta_date_filters[$active_filter['metaKey']]['fromDate'] = $active_filter['valueTimestamp'];
                }
            }
            else if($active_filter['filterType'] == 'meta_to_date'){
                if($active_filter['error'] == false){
                    
                    $meta_date_filters[$active_filter['metaKey']]['toDate'] = $active_filter['valueTimestamp'];
                }
            }

        }
    }

    if (!empty($tax_qry_ary)) {
        $listing_args['tax_query'] = $tax_qry_ary;
    }

    if (!empty($published_date_qry)) {

        if (array_key_exists('after', $published_date_qry) && array_key_exists('before', $published_date_qry) && $published_date_qry['before'] < $published_date_qry['after']) {
            // Swap dates if the end date is before the start date
            [$published_date_qry['after'], $published_date_qry['before']] = [$published_date_qry['before'], $published_date_qry['after']];
        }

        //convert start date timestamp to Y-M-D format which WP date query requires
        if (array_key_exists('after', $published_date_qry)){
            $published_date_qry['after'] = date('Y-m-d', $published_date_qry['after']);
        }

        //convert end date timestamp to Y-M-D format which WP date query requires
        if (array_key_exists('before', $published_date_qry)){
            $published_date_qry['before'] = date('Y-m-d', $published_date_qry['before']);
        }

        $published_date_qry['inclusive'] = true;
        $listing_args['date_query'] = $published_date_qry;
    }

    if (!empty($meta_date_filters)) {

        foreach($meta_date_filters as $meta_key => $meta_date_filter){
     
            if (array_key_exists('fromDate', $meta_date_filter) && array_key_exists('toDate', $meta_date_filter) && $meta_date_filter['toDate'] < $meta_date_filter['fromDate']) {
                // Swap dates if the end date is before the start date
                [$meta_date_filter['fromDate'], $meta_date_filter['toDate']] = [$meta_date_filter['toDate'], $meta_date_filter['fromDate']];
            }

            if (array_key_exists('fromDate', $meta_date_filter)){

                $meta_qry[] = [
                    'key'     => $meta_key,
                    'value'   => date('Ymd', $meta_date_filter['fromDate']),
                    'compare' => '>=',
                    'type'    => 'NUMERIC',
                ];
            }

            if (array_key_exists('toDate', $meta_date_filter)){

                $meta_qry[] = [
                    'key'     => $meta_key,
                    'value'   => date('Ymd', $meta_date_filter['toDate']),
                    'compare' => '<=',
                    'type'    => 'NUMERIC',
                ];
            }

        }
    }

    if (!empty($meta_qry)) {
        $listing_args['meta_query'] = $meta_qry;
    }

    if ($listing_settings['sortOrder'] == 'title') {
        $listing_args['orderby'] = 'title';
        $listing_args['order'] = 'ASC';
    } else {
        $listing_args['orderby'] = 'post_date';
        $listing_args['order'] = 'DESC';
    }

    return new WP_Query($listing_args);

}

function wb_blocks_filterable_listing_block_get_display_fields($display_fields){
    
    $display_fields_arry = [];
    
    foreach($display_fields as $display_field){
        if (taxonomy_exists($display_field)) {
            
            $tax_name = $display_field;
            $tax = get_taxonomy($tax_name);
            
            $field = ["name" =>  $display_field, "label" =>  $tax->labels->singular_name, "type" => "taxonomy"];

            $display_fields_arry[] = $field;

        }
        else if($display_field == 'published_date'){

            $field = ["name" =>  $display_field, "label" =>  "Published", "type" => "published_date"];
            $display_fields_arry[] = $field;

        }
        else {
         
            $field_object = get_field_object($display_field);

            if(!empty($field_object)){

                $field = ["name" =>  $field_object['name'], "label" =>  $field_object['label'], "type" => "meta"];
                $display_fields_arry[] = $field;
                
            }
        }
    }

    return $display_fields_arry;
}

/**
 * Adds a custom query variables for listing block
 *
 * @param array $vars The existing query variables.
 * @return array The modified query variables.
 */
function wb_blocks_filterable_listing_block_add_query_vars($vars)
{
    $vars[] = "listing_search";
    $vars[] = "published_date_from_date";
    $vars[] = "published_date_to_date";

    $args = array(
        'public'   => true
    ); 

   $post_types = get_post_types($args, 'objects');

    foreach($post_types as $post_type) {

        $fields = wb_blocks_filterable_listing_block_get_post_type_date_fields($post_type->name);
        
        if (!empty($fields)) {
            foreach($fields as $field){
                if($field['type'] == "date_picker"){
                    $vars[] = $field['name'] . "_from_date";
                    $vars[] = $field['name'] . "_to_date";
                }
            }
        }

    }

    $taxonomies = get_taxonomies(array('public' => true), 'objects');

    foreach ($taxonomies as $taxonomy) {
        // Register the main taxonomy query var
        $vars[] = $taxonomy->query_var;

        // Register the subtopic query var
        $vars[] = $taxonomy->query_var . '_subtopic';
    }

    return $vars;
}

add_filter('query_vars', 'wb_blocks_filterable_listing_block_add_query_vars');

function wb_blocks_filterable_listing_block_get_post_type_date_fields($post_type_name){

    $date_fields = [];

    $groups = acf_get_field_groups(array('post_type' => $post_type_name)); 

    if(is_array($groups) && count($groups) > 0){
    
            foreach($groups as $group) {
    
                $fields = acf_get_fields($group['key']);
    
                if (empty($fields)) {
                    continue;
                }
    
                foreach($fields as $field){
                    
                    if($field['type'] == "date_picker"){
                        $date_fields[] = $field;
                    }
                }
            }
    }

    return $date_fields;
}


function wb_blocks_filterable_listing_block_validate_date($date) {

    $formats = ['d-m-Y', 'd/m/Y', 'd m Y'];
    
    // Loop through each format and check validity
    foreach ($formats as $format) {
        $dateCheck = DateTime::createFromFormat($format, $date);
        if ($dateCheck) {
            return $dateCheck->getTimestamp();
        }
    }

    return false; // Invalid date
}
?>


