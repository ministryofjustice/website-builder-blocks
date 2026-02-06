<?php

/**
 * @package wb_blocks
 *
 * Plugin name: Website Builder Blocks
 * Plugin URI:  https://github.com/ministryofjustice/website-builder-blocks
 * Description: Introduces new Wordpress blocks
 * Version:     1.1.3
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
        'wb-blocks/hmg-svg',
        [
            'editor_script' => 'wb-blocks-editor-script',
            'render_callback' => 'wb_blocks_render_callback_hmg_svg_block',
            'attributes' => [
                'xclassName' => [
                    'type' => 'string'
                ],
                'logo' => [
                    'type' => 'string'
                ]
            ]
        ]
    );

    register_block_type(
        'wb-blocks/reveal',
        [
            'editor_script' => 'wb-blocks-editor-script',
            'render_callback' => 'wb_blocks_render_callback_reveal_block',
            'attributes' => [
                'revealClassName' => [
                    'type' => 'string'
                ],
                'revealTitle' => [
                    'type' => 'string'
                ]
            ]
        ]
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
                'listingSearchTextFilter' => [
                    'type' => 'boolean'
                ],
                'listingFilters' => [
                    'type' => 'array'
                ],
                'listingDisplayFields' => [
                    'type' => 'array'
                ],
                'listingDisplayTerms' => [
                    'type' => 'array'
                ],
                'listingItemsPerPage' => [
                    'type' => 'number'
                ],
                'listingSortOrder' => [
                    'type' => 'string'
                ],
                'listingRestrictTaxonomies' => [
                    'type' => 'array'
                ],
                'listingRestrictTerms' => [
                    'type' => 'array'
                ],
                'stylesResultsShadedBackground' => [
                    'type' => 'boolean'
                ],

            ]
        ]
    );
    register_block_type(
        'wb-blocks/table-of-contents',
        [
            'editor_script' => 'wb-blocks-editor-script',
            'render_callback' => 'wb_blocks_render_callback_toc_block',
            'attributes' => [
                'tocTitle' => [
                    'type' => 'string'
                ],
                'backToTopText' => [
                    'type' => 'string'
                ],
                'sticky' => [
                    'type' => 'boolean'
                ],
                'scrollSpy' => [
                    'type' => 'boolean'
                ],
                'tocClassName' => [
                    'type' => 'string'
                ]
            ]
        ]
    );
}

/**
 * Load PHP code for each custom block
 * Goes through the custom blocks directory and pulls in all blocks' index.php file
 * 
 */
$dir_path = plugin_dir_path(__FILE__) . 'src/custom-blocks/';
$dir_listing = scandir($dir_path);
foreach($dir_listing as $file) {
    if(
        !str_contains($file, ".") &&
        is_dir($dir_path.$file) &&
        file_exists($dir_path.$file."/index.php")
    ) {
        include $dir_path.$file."/index.php";
    }
}

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

    // Load WB block styles
    wp_enqueue_style('wb-blocks');

    if ( is_singular() ) {
        global $post;

        // Check for the block in the post content
        if ( has_block( 'wb-blocks/filterable-listing', $post ) ) {
            wp_enqueue_script(
                'moj-frontend-js',
                plugins_url('/build/moj-frontend.js', __FILE__),
                array(),
                '1.0',
                true
            );
            
            wp_register_script('filterable-listing-js', plugins_url('/build/filterable-listing.js', __FILE__), array(), '1.0', true);

            $taxonomies = get_taxonomies(array('public' => true));

            if (!empty($taxonomies) && is_array($taxonomies)) {
    
                $all_terms = [];
    
                foreach ($taxonomies as $tax_name) {
    
                    $terms = get_terms(array(
                        'taxonomy' => $tax_name,
                        'hide_empty' => false,
                    ));
                    
                    if (!is_wp_error($terms)) {
                        $all_terms[$tax_name] = $terms;
                    }
                }
            } else {
                $all_terms = [];
            }
    
            wp_localize_script(
                'filterable-listing-js',
                'filterable_listing_object',
                array(
                    'taxonomies' => $all_terms
                )
            );

            wp_enqueue_script('filterable-listing-js');
        }
    }


    wp_enqueue_script(
        'search-drawer',
        plugins_url('/build/search-drawer.js', __FILE__),
        [ 'wp-dom-ready'],
        false,
        true
    );

    /**
     * Enqueue functionality for navigation block
     */

    wp_enqueue_script(
        'drawer-menu',
        plugins_url('src/extended-core-blocks/navigation/functionality.js', __FILE__),
        [ 'wp-dom-ready'],
        false,
        true
    );
}

function wb_blocks_footer_scripts(){ 
	
	if ( is_singular() ) {
        global $post;

        // Check for the block in the post content
        if ( has_block( 'wb-blocks/filterable-listing', $post ) ) {
	?>

		<script type="module">
			window.MOJFrontend.initAll();
		</script>

<?php 
	    }
    }
} 

add_action('wp_footer', 'wb_blocks_footer_scripts'); 

add_action('wp_enqueue_scripts', 'wb_blocks_enqueue_style'); 

add_action('rest_api_init', function () {
    register_rest_field('type', 'acfFields', [
        'get_callback'    => 'wb_blocks_add_acf_fields_to_post_type',
        'schema'          => null,
    ]);
});


function wb_blocks_add_acf_fields_to_post_type($object, $field_name, $request) {
    // Only apply to GET requests to /wp/v2/types (not individual post types)
    $route = $request->get_route();
    $method = $request->get_method();

    if ($method !== 'GET' || $route !== '/wp/v2/types') {
        return null;
    }

    if (!function_exists('acf_get_field_groups')) {
        return null;
    }

    $post_type = $object['slug'];
    $groups = acf_get_field_groups(['post_type' => $post_type]);

    $fields = [];

    foreach ($groups as $group) {
        $group_fields = acf_get_fields($group['key']);
        if ($group_fields) {
            foreach ($group_fields as $field) {
                $fields[] = [
                    'key' => $field['key'],
                    'label' => $field['label'],
                    'name'  => $field['name'],
                    'type'  => $field['type'],
                ];
            }
        }
    }

    return $fields;
}

/**
 * Load PHP extended core blocks
 */
include plugin_dir_path(__FILE__) . 'src/extended-core-blocks/post-date/index.php';
include plugin_dir_path(__FILE__) . 'src/extended-core-blocks/search/index.php';