import {URLInputButton} from "@wordpress/block-editor";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor;
import { useSelect } from '@wordpress/data';

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

        // Load allowed blocks to be added to content
        const allowedBlocks = [ 'core/heading', 'core/paragraph' ];

        const { clientId } = props;
        const innerBlockCount = useSelect( ( select ) => select( 'core/block-editor' ).getBlock( clientId ).innerBlocks );
        let headingList = [];
        let removeHTML = input => {
          let tmp = document.createElement('div');
          tmp.innerHTML = input;
          return tmp.textContent || tmp.innerText || '';
        }
        innerBlockCount.forEach(element => {
          if (
            typeof element.name !== 'undefined' && element.name == "core/heading" && 
            typeof element.originalContent !== 'undefined' && element.originalContent.substring(0,3) == "<h2"
          ) {
            headingList.push("<li>"+removeHTML(element.originalContent)+"</li>");
          }
        });
        return ([
          <div className={"wp-block-columns is-layout-flex wp-block-columns-is-layout-flex"}>
            <div
              className={`${className} wb-toc-table-section wp-block-column is-layout-flow wp-block-column-is-layout-flow`}
              style={{
                flexBasis: '25%',
              }}
            >
              <h2>Table of contents</h2>
              <ol className="wb-table-of-contents__list" dangerouslySetInnerHTML={{__html: headingList.join("")}} />
            </div>
            <div
              className={"wb-toc-content-section wp-block-column is-layout-flow wp-block-column-is-layout-flow"}
              style={{
                flexBasis: '75%',
              }}
            >
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
