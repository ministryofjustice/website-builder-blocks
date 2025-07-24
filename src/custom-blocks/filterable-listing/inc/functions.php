<?php

/**
 * Filterable Listing block - Functions
 *
 */

function wb_blocks_filterable_listing_validate_active_filters($listing_filters){
    $active_filters = [];

    foreach ($listing_filters as $filter) {

        if (taxonomy_exists($filter)) {
            // Create an array of what taxonomies have been selected in dropdown
            wb_blocks_filterable_listing_block_validate_tax_filter($filter, $active_filters);
        
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
        }
    }

    if (!empty($tax_qry_ary)) {
        $listing_args['tax_query'] = $tax_qry_ary;
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
?>


