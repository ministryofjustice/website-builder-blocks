/**
 * Reveal
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
const { InnerBlocks } = wp.blockEditor;

registerBlockType('wb-blocks/reveal', {
    title: __('Reveal', 'wb_block'),
    description: __("Arrow toggle to reveal text"),
    category: 'wb-blocks',
    icon: 'controls-play',
    keywords: [__('show'),__('hide')],
    attributes: {
        revealTitle: {
            type: 'string'
        },
        revealClassName: {
            type: 'string'
        }
    },
    edit: props => {

        const {
            setAttributes,
            attributes: {
                revealTitle
            },
            className
        } = props;

        // Load allowed blocks to be added to content
        const allowedBlocks = [ 'core/heading', 'core/paragraph' , 'core/list' ];

        // Set className attribute for PHP frontend to use
        setAttributes({ revealClassName: className });

        // Grab newRevealTitle, set the value of revealTitle to newRevealTitle.
        const onChangeRevealTitle = newRevealTitle => {
            setAttributes({ revealTitle: newRevealTitle });
        };

        return ([
            <div className={`mojblocks-reveal`}>
                <details className="wb-details" open>
                    <summary className="wb-details__summary">
                        <span className="wb-details__summary-text">
                            <RichText
                            value={ revealTitle }
                            placeholder={ __('Add reveal title', 'mojblocks') }
                            keepPlaceholderOnFocus
                            onChange={ onChangeRevealTitle }
                            />
                        </span>
                    </summary>
                    <div className="wb-details__text">
                        <InnerBlocks
                            allowedBlocks={allowedBlocks}
                        />
                    </div>
                </details>
            </div>
        ]);
    },

    save: () => {
        return <InnerBlocks.Content />;
    }
});

