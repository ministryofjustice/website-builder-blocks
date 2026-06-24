/**
 * Print button
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType('wb-blocks/print-button', {
	title: __('Print button', 'wb_block'),
	description: __("Button to print page"),
	category: 'wb-blocks',
	icon: 'controls-play',
	keywords: [__('print'),__('click')],
	attributes: {
		buttonText: {
			type: 'string',
			default:'Print this page'
		},
		buttonShowIcon: {
			type: 'boolean',
			default: false
		},
		buttonClassName: {
			type: 'string'
		}
	},
	edit: props => {

		const {
			setAttributes,
			attributes: {
				buttonText,
				buttonShowIcon
			},
			className
		} = props;


		// Set className attribute for PHP frontend to use
		setAttributes({ buttonClassName: className });

		const onChangeButtonText = newText => {
			setAttributes({ buttonText: newText });
		};

		return ([
			<div className={`buttonClassName`}>
				button
				
			</div>
		]);
	},

	save: () => null
});

