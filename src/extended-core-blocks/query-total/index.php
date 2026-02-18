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
 * e.g. "Showing x to y of z results"
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
 * Attach ngettext or gettext filters just for the duration of the render, then remove them.
 */
function wp_blocks_render_block_core_query_total(array $attributes, string $content, WP_Block $block): string
{
    $bold_numbers = in_array('is-style-bold-numbers', explode(' ', ($attributes['className'] ?? '')), true);

    /**
     * Total Results display type.
     */
    if (($attributes['displayType'] ?? '') === 'total-results') {

        // Define the ngettext callback that swaps Core’s own format strings.
        $ngettext_callback = function (string $translation) use ($bold_numbers): string {
            // Here, we are using the default formatting, but still may need bold numbers.
            if ($bold_numbers) {
                // Wrap %1$s, %2$s and %3$s in b tags.
                $translation = preg_replace('/(%d)/', '<b>$1</b>', $translation);
            }
            return $translation;
        };

        // Attach the gettext filter for this render *only*.
        add_filter('ngettext_default', $ngettext_callback, 10, 1);
        try {
            // Call the original Core renderer.
            // See core's implementation at wordpress/wp-includes/blocks/query-total.php
            return render_block_core_query_total($attributes, $content, $block);
        } finally {
            // Always remove, even if an error occurs.
            remove_filter('ngettext_default', $ngettext_callback, 10);
        }
    }

    /**
     * Range Display display type.
     */
    if (($attributes['displayType'] ?? '') === 'range-display') {

        $ctx = [
            'bold_numbers' => $bold_numbers,
            'single' => $attributes['rangeFormatSingle'] ?? null,
            'range'  => $attributes['rangeFormatMulti'] ?? null,
        ];

        // Define the gettext callback that swaps Core’s own format strings.
        $gettext_callback = function (string $translation, string $text) use ($ctx): string {
            // Exact strings used by Core’s renderer:
            //  - "Displaying %1$s of %2$s"
            //  - "Displaying %1$s – %2$s of %3$s"
            if ($text === 'Displaying %1$s of %2$s' && ! empty($ctx['single'])) {
                // Get the translation, before applying html for bold numbers.
                $translation = __($ctx['single'], "wb_blocks");
            }

            if ($text === 'Displaying %1$s – %2$s of %3$s' && ! empty($ctx['range'])) {
                // Get the translation, before applying html for bold numbers.
                $translation = __($ctx['range'], "wb_blocks");
            }

            if ($ctx['bold_numbers']) {
                // Wrap %1$s, %2$s and %3$s in b tags.
                $translation = preg_replace('/(%\d+\$s)/', '<b>$1</b>', $translation);
            }

            // Ensure the only html tags are b tags.
            return wp_kses($translation, ['b' => []]);
        };

        // Attach the gettext filter for this render *only*.
        add_filter('gettext_default', $gettext_callback, 10, 2);
        try {
            // Call the original Core renderer.
            // See core's implementation at wordpress/wp-includes/blocks/query-total.php
            return render_block_core_query_total($attributes, $content, $block);
        } finally {
            // Always remove, even if an error occurs.
            remove_filter('gettext_default', $gettext_callback, 10);
        }
    }

    /**
     * Any other display type
     *
     * If WP introduces additional display types in the future,
     * then return the original renderer un-modified.
     */
    return render_block_core_query_total($attributes, $content, $block);
}
