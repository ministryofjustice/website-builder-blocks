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

    $post_type_obj = get_post_type_object( $listing_settings['postType'] );
    $flex_cpt_name = $post_type_obj->labels->singular_name;
    $flex_cpt_name_plural = $post_type_obj->labels->name;
    
    $listing_query = wb_blocks_filterable_listing_block_get_listing_query($listing_settings, $active_filters);

    if ($listing_query->have_posts()) { 

        $display_fields = wb_blocks_filterable_listing_block_get_display_fields($listing_settings['displayFields']);


        $item_count_text = '';

        if ($listing_query->found_posts > 1) {
            $item_count_text = $listing_query->found_posts . ' ' . strtolower($flex_cpt_name_plural);
        } elseif ($listing_query->found_posts == 1) {
            $item_count_text = '1 ' . strtolower($flex_cpt_name);
        }
        ?>
        <div class="border-b border-gray-300 mb-4 pb-2">
            <?php echo esc_html($item_count_text); ?>
        </div>
        
        <div class="">
            <?php
            while ($listing_query->have_posts()) {
                $listing_query->the_post();
                
                $list_item_classes = "";

                if($listing_settings['styles']['stylesResultsShadedBackground'] == true){
                    $list_item_classes = "bg-gray-100 p-4";
                }
                else {
                    $list_item_classes = "border-b border-gray-300 pb-2";
                }
                
                ?>
            <div class="<?php echo $list_item_classes; ?> mb-4">
                <h2 class="">
                        <a href="<?php echo get_permalink(); ?>">
                            <?php echo get_the_title(); ?>
                        </a>
                </h2>
                <?php 
                   wb_blocks_filterable_listing_item_terms($listing_settings['displayTerms']);
                ?>
                <?php 
                   wb_blocks_filterable_listing_item_details($display_fields);
                ?>
            </div>
            <?php    
            } ?>
        </div>

    <?php
        wb_blocks_filterable_listing_pagination($listing_query);
    }
    else { ?>
        <h2 class="">
            <?php _e('Your search matched no ' . strtolower($flex_cpt_name_plural), 'hale'); ?>
        </h2>
        <p class="">
            <?php _e('Try searching again with expanded criteria.', 'hale'); ?>
        </p>
        <?php
    }
    ?>
  
    <?php
}

  
function wb_blocks_filterable_listing_item_details($display_fields){ 
    
    if(empty($display_fields)){
        return;     
    }

    foreach($display_fields as $display_field){

        $field_label = $display_field['label'];
        $field_value = "";
    
        if ($display_field['type'] == 'taxonomy') {
            
            $tax_terms = get_the_terms( get_the_ID(), $display_field['name']);

            if(!empty($tax_terms)){

                $term_names = [];
                foreach ($tax_terms as $term) {
                    $term_names[] = $term->name;
                }

                if(!empty($term_names)){
                    $field_value = implode("," , $term_names);
                }
            }
        }
        else if($display_field['type'] =='published_date'){
        
            $field_value =  '<time class="entry-date" datetime="' . get_the_date( DATE_W3C ) . '">' . get_the_date() . '</time>';
        }
        else if($display_field['type'] == 'meta'){
            $field_value = get_field($display_field['name']);
        }
     
        if(!empty( $field_value )){ 
    ?>
        <div class="flex gap-2">
            <?php if(!empty( $field_label )){ ?>
                <div class="font-semibold">
                    <?php echo __($field_label,'wb_blocks'); ?>:
                </div>
            <?php }?>
            <?php echo $field_value; ?>
        </div>
        <br/>
<?php
        }
    }
}

function  wb_blocks_filterable_listing_item_terms($taxonomies) {
    
    $taxTermsArray = [];
    if(empty($taxonomies)){
        return;     
    }

    foreach($taxonomies as $tax){

        $tax_terms = get_the_terms( get_the_ID(), $tax);

        if(!empty($tax_terms)){

            $taxTermsArray[] = [
                'taxonomy' => $tax,
                'terms' => $tax_terms
            ];
        }

    }

    if(empty($taxTermsArray)){
        return;     
    }
    ?>

<div class="">
        <ul class="flex flex-wrap gap-2 p-0 m-0 list-none"> 
            <?php
                foreach($taxTermsArray as $tax){
                    foreach ($tax['terms'] as $term) { ?>
                    <li class="">
                        <a href="<?php echo get_term_link($term); ?>"
                            class="wp-element-button inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"">
                            <?php echo $term->name; ?>
                        </a>
                    </li>
                <?php 
                    }
                } ?>
        </ul>

    </div>
    <br/>
<?php
}

function wb_blocks_filterable_listing_pagination($custom_query)
{

    $query_to_paginate = $custom_query;
    
    $max_pages = $query_to_paginate->max_num_pages;

    $current_page_number = (get_query_var('paged')) ? get_query_var('paged') : 1;

    if ($max_pages > 1) {
        ?>
        <nav class="" aria-label="pagination">
            <ul class="flex gap-4 list-none p-0 m-0">
                <?php
                    if ($current_page_number > "1") {
                        echo "<li class='inline-flex items-center gap-1 font-medium px-3 py-1.5'>";
                        previous_posts_link('
                        <span class="">'.__('Previous<span class="hidden sm:inline"> page</span>',"wb_blocks").'
                        </span>
                        ', $max_pages);
                        echo "</li>";
                    }

                ?>
                <li class="">
                    <?php
                    printf(__('Page %s of %s','wb_blocks'),$current_page_number,$max_pages);
                    ?>

                </li>
                <?php
                    if ($current_page_number < $max_pages) {
                        echo "<li class='archive-pagination-next-btn'>";
                        next_posts_link('
                        <span class="inline-flex items-center gap-1 font-medium px-3 py-1.5">'.__('Next<span class="hidden sm:inline"> page</span>',"wb_blocks").'</span>
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
