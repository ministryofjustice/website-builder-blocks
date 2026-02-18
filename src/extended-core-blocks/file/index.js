/**
 *  Extend core WP file block
 *  https://wordpress.org/support/article/file-block/
 *
 * This makes use of WP Blocks extention filters
 * https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 *
 */

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, createElement } = wp.element;
const { useSelect } = wp.data;

function getFileExtension(file = '') {
    return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
}

const addFileExtension = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== 'core/file') {
            return createElement(BlockEdit, props);
        }

        const extText = '(' + getFileExtension(props.attributes.href).toUpperCase() + ')';

        return createElement(
            Fragment,
            {},
            createElement(BlockEdit, props),
            createElement(
                'style',
                {},
                `.wp-block-file .wp-block-file__content-wrapper::after { 
                    content: "${extText}";
                    color: #000;
                    margin-left: 4px;
                }`
            )
        );
    };
}, 'addFileExtension');

addFilter(
    'editor.BlockEdit',
    'my-plugin/file-link-after-text',
    addFileExtension
);
