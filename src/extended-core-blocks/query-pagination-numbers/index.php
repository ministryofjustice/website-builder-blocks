<?php

defined('ABSPATH') || exit;

/**
 * Update the core post date block to support an optional prefix.
 * 
 * - hasPrefix (boolean): Whether to show a prefix before the date.
 * - prefix (string): The prefix text to show before the date.
 */
add_filter('block_type_metadata_settings', function (array $settings, array $metadata) {
    if (($metadata['name'] ?? '') !== 'core/query-pagination-numbers') {
        return $settings;
    }

    $settings['attributes'] = array_merge($settings['attributes'] ?? [], [
        'className'    => ['type' => 'string',  'default' => ''],
    ]);

    return $settings;
}, 10, 2);

