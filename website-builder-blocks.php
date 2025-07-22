<?php

/**
 * @package wb_blocks
 *
 * Plugin name: Website Builder Blocks
 * Plugin URI:  https://github.com/ministryofjustice/website-builder-blocks
 * Description: Introduces new Wordpress blocks
 * Version:     1.0.0
 * Author:      Ministry of Justice
 * Text domain: wb_blocks
 * Author URI:  https://github.com/ministryofjustice
 * License:     MIT Licence
 * License URI: https://opensource.org/licenses/MIT
 * Copyright:   Crown Copyright (c) Ministry of Justice
 **/

defined('ABSPATH') || exit;

/**
 * Load translations (if any) for the plugin from the /languages/ folder.
 *
 * @link https://developer.wordpress.org/reference/functions/load_plugin_textdomain/
 */
add_action('init', 'wb_blocks_load_textdomain');

/**
 * Set the domain to be used for translations
 */
function wb_blocks_load_textdomain()
{
    load_plugin_textdomain('wb_blocks', false, basename(__DIR__) . '/languages');
}

/**
 * Add custom "wb_blocks" block category
 *
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/filters/block-filters/#managing-block-categories
 */
add_filter('block_categories_all', 'wb_blocks_block_categories', 10, 2);

/**
 * Create the category.
 *
 * @param array $categories the details of added categories (in this case an array of 1 item).
 * @param integer $post Unused variable, intended for future expansion of function.
 *
 * @return array
 */
function wb_blocks_block_categories($categories, $post)
{
    return array_merge(
        $categories,
        [
            [
                'slug' => 'wb-blocks',
                'title' => __('Website Builder Blocks', 'wb_blocks'),
                'icon' => 'screen',
            ],
        ]
    );
}

/**
 * Registers all block assets so that they can be enqueued through the Block Editor in
 * the corresponding context.
 *
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-registration/
 */
add_action('init', 'wb_blocks_register_blocks');

/**
 * Function to initiate the Gutenberg blocks in this theme.
 */
function wb_blocks_register_blocks()
{
    // If Block Editor is not active, bail.
    if (!function_exists('register_block_type')) {
        return;
    }

    // Check if build file hasn't been generated and is missing
    $file_exists = file_exists(plugin_dir_path(__FILE__) . 'build/index.asset.php');

    if ($file_exists) {
        $meta = require_once('build/index.asset.php');
    } else {
        $meta = [
            'dependencies' => array('wp-data', 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-hooks'),
            'version' => '20211006'
        ];

        trigger_error(
            'Build file does not exist, run NPM run build',
            E_USER_WARNING
        );
    }

    // Register the block editor script.
    wp_register_script(
        'wb-blocks-editor-script',
        plugins_url('/build/index.js', __FILE__),
        $meta['dependencies'] ?? [],
        $meta['version'] ?? '20200723',
        true
    );

    register_block_type(
        'wb-blocks/filterable-listing',
        [
            'editor_script' => 'wb-blocks-editor-script',
            'render_callback' => 'wb_blocks_render_callback_filterable_listing_block',
            'attributes' => [
                'listingPostType' => [
                    'type' => 'string'
                ],
                'listingFilters' => [
                    'type' => 'array'
                ]
            ]
        ]
    );
}

/**
 * Load PHP code for each custom MoJ block
 */

include plugin_dir_path(__FILE__) . 'src/custom-blocks/filterable-listing/index.php';


/**
 * Load PHP extended core blocks
 */
//include plugin_dir_path(__FILE__) . 'src/extended-core-blocks/file/index.php';

/**
 * Queues up the gutenberg editor style
 */
function wb_blocks_gutenberg_editor_styles()
{
    wp_enqueue_style(
        'wb-blocks-block-editor-styles',
        plugins_url('build/main-gutenberg.min.css', __FILE__),
        false,
        '1.2',
        'all'
    );
}

// Pulls the enqueued file in to standard wp process.
add_action('enqueue_block_editor_assets', 'wb_blocks_gutenberg_editor_styles');

/**
 * Queues up the blocks styling for frontend
 */
function wb_blocks_register_style()
{
    
    wp_register_style('wb-blocks', plugins_url('build/main.min.css', __FILE__));
    
}

add_action('init', 'wb_blocks_register_style');

function wb_blocks_enqueue_style()
{
    // Make Dashicons available on the frontend
    wp_enqueue_style('dashicons');

    // Load Tailwind styles
    wp_enqueue_style('wb-blocks-tailwind');

    // Load WB block styles
    wp_enqueue_style('wb-blocks');
}

add_action('wp_enqueue_scripts', 'wb_blocks_enqueue_style'); 

