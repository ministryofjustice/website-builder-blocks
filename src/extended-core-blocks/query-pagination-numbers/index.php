<?php

use Dom\HTMLDocument;

defined('ABSPATH') || exit;


/**
 * Update the core query pagination numbers block to support a simplified display type.
 * 
 * displayType (string)
 * - 'page-links' is the default & original display type
 *   where there are numbers for each page, and they are links.
 * - 'current-of-total' is a custom display type 
 *   where the phrase 'Page X of Y' is shown, without any links.
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    if (($metadata['name'] ?? '') !== 'core/query-pagination-numbers') {
        return $settings;
    }

    $settings['attributes'] = array_merge($settings['attributes'] ?? [], [
        'displayType'    => ['type' => 'string',  'default' => 'page-links'],
    ]);

    return $settings;
}, 10, 2);


/**
 * Filter the rendered HTML for core query pagination numbers block
 *
 * If the display type is 'current-of-total' then modify the returned HTML.
 */
function wb_blocks_extend_query_pagination_numbers(string $block_content, array $block)
{
    $bold_numbers = in_array('is-style-bold-numbers', explode(' ', ($block['attrs']['className'] ?? '')), true);

    /**
     * Current of Total display type.
     */
    if (($block['attrs']['displayType'] ?? '') === 'current-of-total') {

        // Let's extract current page and total pages from the original block's html.
        // Do it this way because there is complex logic in 
        // wordpress/wp-includes/blocks/query-pagination-numbers.php
        // that we don't want to replicate.
        $page_numbers = wb_extract_values_from_pagination_html($block_content);

        if (in_array(null, $page_numbers, true)) {
            // Extracting page numbers didn't work, revert to original block content
            return $block_content;
        }

        $translation = __('Page %1$d of %2$d', "wb_blocks");

        if ($bold_numbers) {
            // Wrap %1$d and %2$d in b tags.
            $translation = preg_replace('/(%\d+\$d)/', '<b>$1</b>', $translation);
        }

        $content = sprintf($translation, $page_numbers['current'], $page_numbers['last']);

        return sprintf(
            '<div %1$s>%2$s</div>',
            get_block_wrapper_attributes(),
            $content
        );
    }

    return $block_content;
}

add_filter('render_block_core/query-pagination-numbers', 'wb_blocks_extend_query_pagination_numbers', 10, 2);


/**
 * A utility class to extract page numbers from pagination HTML
 * 
 * @param string $html - The unmodified HTML from the core query pagination numbers block.
 * @return array - an associative array with keys for current and last page numbers.
 */
function wb_extract_values_from_pagination_html(string $html)
{
    $pages = ['current' => null, 'last' => null];

    // Parse the HTML
    $dom = HTMLDocument::createFromString($html);

    // Get the current page
    $current_node = $dom->querySelector('.page-numbers.current');
    if ($current_node) {
        $pages['current'] = (int)$current_node->textContent;
    }

    // Get the last page
    $all_page_nodes = $dom->querySelectorAll('.page-numbers');
    $all_page_numbers = [];

    foreach ($all_page_nodes as $node) {
        $text = trim($node->textContent);
        if (ctype_digit($text)) {
            $all_page_numbers[] = (int)$text;
        }
    }

    $pages['last'] = $all_page_numbers ? max($all_page_numbers) : $pages['current'];

    return $pages;
}
