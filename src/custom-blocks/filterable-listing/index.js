import { registerBlockType } from '@wordpress/blocks';
import { createElement } from '@wordpress/element';

registerBlockType('website-builder-blocks/filterable-listing', {
    edit: () => createElement('p', null, 'Hello from Block One (Editor)'),
    save: () => createElement('p', null, 'Hello from Block One')
});