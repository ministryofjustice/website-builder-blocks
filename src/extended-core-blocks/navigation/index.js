/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockStyle } from '@wordpress/blocks';

registerBlockStyle( 'core/navigation', {
    name: 'drawer',
    label: 'Drawer',
});
