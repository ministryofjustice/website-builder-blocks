/**
 * Block: Reveal
 *
 * Arrow toggle to reveal content.
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

import blockJson from './block.json';

registerBlockType( blockJson.name, {
	...blockJson,

	edit( { attributes, setAttributes, className } ) {
		const { revealTitle } = attributes;

		const allowedBlocks = [ 'core/heading', 'core/paragraph', 'core/list' ];

		return (
			<>
				<div className={ className }>
					<details className="wb-details" open>
						<summary className="wb-details__summary">
							<a className="wb-details__summary-text">
								<RichText
									value={ revealTitle }
									placeholder={ __( 'Add reveal title', 'wb_blocks' ) }
									onChange={ ( newValue ) =>
										setAttributes( { revealTitle: newValue } )
									}
								/>
							</a>
						</summary>
						<div className="wb-details__text">
							<InnerBlocks allowedBlocks={ allowedBlocks } />
						</div>
					</details>
				</div>
			</>
		);
	},

	save() {
		return <InnerBlocks.Content />;
	},
} );
