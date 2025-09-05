<?php

/**
 * Table of contents block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

require_once('inc/functions.php');

function wb_blocks_render_callback_toc_block($attributes, $content)
{
    $toc_class="";
    if ($attributes['sticky']) $toc_class="toc-sticky";

    add_filter( 'the_content', 'wb_filter_add_index_for_h2_elements', 1 );
    
    // Turn on buffering so we can collect all the html markup below and load it via the return
    // This is an alternative method to using sprintf(). By using buffering you can write your
    // code below as you would in any other PHP file rather then having to use the sprintf() syntax
    ob_start();

    echo wb_table_of_contents(get_the_content(),$class=$toc_class); //This creates the table of contents

    // Get all the html/content that has been captured in the buffer and output via return
    $output = ob_get_contents();

    // Decode the output in case editors want to add in hyperlinks or other markup
    $output = html_entity_decode($output);

    ob_end_clean();

    return $output;
}


?>
