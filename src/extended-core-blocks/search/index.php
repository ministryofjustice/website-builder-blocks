<?php

/**
 * Modify core Search block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */
function wb_extend_search_block( $block_content, $block ) {

    $site_name = get_bloginfo( 'name' );

    $block_content = str_replace( __('Search this site'), __('Search') . ' ' . $site_name, $block_content );

    $custom_svg = '<svg class="wb-search-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>';

    // Replace the default WordPress SVG with yours
    $block_content = preg_replace(
        '/<svg[^>]*>.*?<\/svg>/s',
        $custom_svg,
        $block_content
    );

    $block_content = '<div class="wb-search-form-wrapper">' . $block_content . '</div>';

    $block_content = '<div class="wb-search-toggle" aria-hidden="true"><button aria-label="Open search" class="wp-block-search-toggle-button wp-element-button" type="submit">' . $custom_svg . '<svg class="wb-close-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button></div>' . $block_content;

    $wrapper_classes = '';
    if(!empty($block['attrs']['className'])){
        $classes = explode(" ", $block['attrs']['className']);
        
        if(in_array('desktop-style-button', $classes)){
            $wrapper_classes = 'desktop-style-button';
        }
    }
    $block_content = '<div class="wb-search-block-wrapper ' . $wrapper_classes . '">' . $block_content . '</div>';


    return $block_content;

    
}


add_filter( 'render_block_core/search', 'wb_extend_search_block', 10, 2 );


?>
