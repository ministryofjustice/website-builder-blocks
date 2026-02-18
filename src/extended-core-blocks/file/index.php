<?php

/**
 * Modify core file block in Hale
 * This hooks into and modifies the frontend of core
 *
 * @package   Hale
 * @copyright Ministry Of Justice
 * Adapted from version from NHS Leadership Academy, Tony Blacker
 * @version   2.0
 */

add_filter('render_block', 'wb_filter_file_block', 10, 2);

/**
 * Filter the file block through our own method.
 *
 * @param array $block_content the contents of the block itself.
 * @param array $block         information about block being modified.
 *
 * @return function hale_block_renderer to send back the modified block content.
 */
function wb_filter_file_block($block_content, $block)
{

    if ('core/file' !== $block['blockName']) {
        return $block_content;
    }

   return wb_file_block_renderer($block['blockName'], $block['attrs'], $block_content);

}

/**
 * Render the modified file block with our own method.
 *
 * @param string $name       the name of the block itself.
 * @param array  $attributes information about block being modified.
 *
 * @return string $object.
 */
function wb_file_block_renderer($name, $attributes, $block_content)
{

      // Add class to the first wrapper div
    $block_content = preg_replace(
        '/class="([^"]*wp-block-file[^"]*)"/',
        'class="$1 wb-file"',
        $block_content,
        1
    );
    
    $file = get_attached_file($attributes["id"]);
    $filesize = file_exists($file) ? "&#44; " . size_format(filesize($file)) : null;

    $filetype = wp_check_filetype($attributes["href"]);
    $extention = strtoupper($filetype["ext"]);

    $metadata = '<span>&#40;</span>'.esc_attr($extention).esc_attr($filesize).'<span>&#41;</span>';

    $block_content = preg_replace(
    '/<\/div>\s*$/',
    ' <div class="wb-file__extension" aria-hidden="true">' . $metadata . '</div></div>',
    $block_content
    );

    return $block_content;
}
function wb_disable_file_block_settings() {
    wp_add_inline_script(
        'wp-blocks',
        "
        wp.hooks.addFilter(
            'blocks.registerBlockType',
            'custom/disable-file-block-settings',
            function(settings, name) {
                if (name === 'core/file') {

                    // Ensure attributes exists
                    settings.attributes = settings.attributes || {};

                    // Disable preview by default
                    settings.attributes.displayPreview = {
                        type: 'boolean',
                        default: false
                    };

                    // Disable download button by default
                    settings.attributes.showDownloadButton = {
                        type: 'boolean',
                        default: false
                    };
                }
                return settings;
            }
        );
        "
    );
}
add_action('enqueue_block_editor_assets', 'wb_disable_file_block_settings');
