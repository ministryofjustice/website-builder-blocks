<?php

/**
 * Update the core query total block to support additional formats.
 *
 * - rangeFormatSingle (string): The format for the page range 
 *   when there is a single entry e.g. "Displaying %1$s of %2$s"
 * - rangeFormatMulti  (string): The format for the page range 
 *   when there are multiple results e.g. "Displaying %1$s – %2$s of %3$s"
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    if (($metadata['name'] ?? '') !== 'core/query-total') {
        return $settings;
    }

    $settings['attributes'] = array_merge($settings['attributes'] ?? [], [
        'rangeFormatSingle' => ['type' => 'string', 'default' => null],
        'rangeFormatMulti'  => ['type' => 'string',  'default' => null],
    ]);

    return $settings;
}, 10, 2);

/**
 * Swap render_callback for core/query-total with our wrapper.
 *
 * The idea is that we wrap wp_blocks_render_block_core_query_total
 * so that we can add a gettext filter immediately before it runs 
 * and remove the filter immediately after.
 *
 * The filter allows us to replace the default text of 
 * "Displaying x - y of z" with custom phrasing,
 * e.g. "Showing x - y of z"
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    // Only modify the query-total core block.
    if (($metadata['name'] ?? '') === 'core/query-total') {
        // Save the original for use inside our wrapper (by name).
        // WordPress calls this function in core: render_block_core_query_total()
        $settings['render_callback'] = 'wp_blocks_render_block_core_query_total';
    }
    return $settings;
}, 10, 2);

/**
 * Our wrapper around the Core renderer.
 * Attach gettext just for the duration of the render, then remove it.
 */
function wp_blocks_render_block_core_query_total(array $attributes, string $content, WP_Block $block): string
{
    // Currently, we only extend the range-display type.
    if(($attributes['displayType'] ?? '') !== 'range-display') {
        // Here, display type is not 'range-display', e.g. 'total-results', 
        //so return early, with the original WP Core renderer.
        return render_block_core_query_total($attributes, $content, $block);
    }

    // Build the formats, to pass into the gettext callback function.
    $ctx = [
        'single' => $attributes['rangeFormatSingle'] ?? null,
        'range'  => $attributes['rangeFormatMulti']  ?? null,
    ];

    // // Define the gettext callback that swaps Core’s own format strings.
    $cb = function (string $translation, string $text, string $domain) use ($ctx): string {
        if ($domain !== 'default') {
            return $translation;
        }

        // Exact strings used by Core’s renderer:
        //  - "Displaying %1$s of %2$s"
        //  - "Displaying %1$s – %2$s of %3$s"
        if ($text === 'Displaying %1$s of %2$s' && ! empty($ctx['single'])) {
            return wp_kses($ctx['single'], ['strong' => []]);
        }
        if ($text === 'Displaying %1$s – %2$s of %3$s' && ! empty($ctx['range'])) {
            return wp_kses($ctx['range'], ['strong' => []]);
        }

        return $translation;
    };


    // Attach the gettext filter for this render *only*.
    add_filter('gettext', $cb, 10, 3);
    try {
        // Call the original Core renderer.
        // See core's implementation at wordpress/wp-includes/blocks/query-total.php
        return render_block_core_query_total($attributes, $content, $block);
    } finally {
        // Always remove, even if an error occurs.
        remove_filter('gettext', $cb, 10);
    }
}
