<?php

/**
 * Update the core post date block to support an optional prefix.
 * 
 * TODO update docblock
 * - hasPrefix (boolean): Whether to show a prefix before the date.
 * - prefix (string): The prefix text to show before the date.
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    if (($metadata['name'] ?? '') !== 'core/post-date') {
        return $settings;
    }

    $settings['attributes'] = array_merge($settings['attributes'] ?? [], [
        'wbFormatSingle' => ['type' => 'string', 'default' => null],
        'wbFormatRange'  => ['type' => 'string',  'default' => null],
    ]);

    return $settings;
}, 10, 2);

/**
 * Swap render_callback for core/query-total with our wrapper.
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    // Only touch the query-total core block.
    if (isset($metadata['name']) && $metadata['name'] === 'core/query-total') {
        // Save the original for use inside our wrapper (by name).
        // WordPress calls this function in core: render_block_core_query_total()
        $settings['render_callback'] = 'my_wrap_render_block_core_query_total';
    }
    return $settings;
}, 10, 2);

/**
 * Our wrapper around the Core renderer.
 * Attach gettext just for the duration of the render, then remove it.
 */
function my_wrap_render_block_core_query_total(array $attributes, string $content, WP_Block $block): string
{
    // Currently, we only extend the range-display type.
    if(($attributes['displayType'] ?? '') !== 'range-display') {
        // Here, display type is 'total-results', so
        // Return early, with the original Core renderer.
        return render_block_core_query_total($attributes, $content, $block);
    }

    // Build the formats, to pass into the gettext callback function.
    $ctx = [
        'single' => $attributes['wbFormatSingle'] ?? null,
        'range'  => $attributes['wbFormatRange']  ?? null,
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
