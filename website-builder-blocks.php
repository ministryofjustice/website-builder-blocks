<?php
/**
 * Plugin name: Website Builder Blocks
 * Plugin URI:  https://github.com/ministryofjustice/website-builder-blocks
 * Description: Introduces new Wordpress blocks
 * Version:     1.0.0
 * Author:      Ministry of Justice - Adam Brown, Malcolm Butler & Robert Lowe
 * Text domain: website-builder-blocks
 * Author URI:  https://github.com/ministryofjustice
 * License:     MIT Licence
 * License URI: https://opensource.org/licenses/MIT
 * Copyright:   Crown Copyright (c) Ministry of Justice
 */

function website_builder_blocks_register_blocks() {
    register_block_type( __DIR__ . '/filterable-listing' );
    //register_block_type( __DIR__ . '/block-two' );
}
add_action( 'init', 'website_builder_blocks_register_blocks' );