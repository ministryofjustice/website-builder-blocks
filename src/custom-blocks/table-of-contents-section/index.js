import {URLInputButton} from "@wordpress/block-editor";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor;

registerBlockType("wb-blocks/table-of-contents-section", {
    title: __("Table of contents", "wb_block"),
    description: __('Table of contents section'),
    category: "wb-blocks",
    icon: "id-alt",
    keywords: [__('contents')],

    attributes: {
      className: {
        type: "string"
      }
    },
    edit: props => {
        const {
            setAttributes,
            attributes: {
            },
            className
        } = props;

        // Load allowed blocks to be added to banner content
        const allowedBlocks = [ 'core/heading', 'core/paragraph' ];

        return ([
          <div className={"wp-block-columns is-layout-flex wp-block-columns-is-layout-flex"}>
            <div className={`${className} wb-toc-table-section wp-block-column is-layout-flow wp-block-column-is-layout-flow`}>
              Table of contents
            </div>
            <div className={"wb-toc-content-section wp-block-column is-layout-flow wp-block-column-is-layout-flow"}>
              <InnerBlocks />
            </div>
          </div>
        ])

    },
    // return null as frontend output is done via PHP
    save: () => {
        return <InnerBlocks.Content />;
    }
});
