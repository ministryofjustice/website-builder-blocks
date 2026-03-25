/**
 * Icon
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/blockEditor';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';

registerBlockType('wb-blocks/icon', {
	title: __('Icon', 'wb_block'),
	description: __("Choose from a whole plethorah of icons"),
	category: 'wb-blocks',
	icon: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" width="200" height="200">
			<g transform="translate(60,60)">
				<circle cx="0" cy="0" r="50" stroke="black" stroke-width="10" fill="none"/>
				<path d="M -25 0 L -5 20 L 22 -20" stroke="black" stroke-width="10" fill="none"/>
			</g>
			<g transform="translate(140,60)">
				<circle cx="0" cy="0" r="50" stroke="black" stroke-width="10" fill="none"/>
				<line x1="-18" y1="-18" x2="18" y2="18" stroke="black" stroke-width="10"/>
				<line x1="-18" y1="18" x2="18" y2="-18" stroke="black" stroke-width="10"/>
			</g>
			<g transform="translate(100,130)">
				<circle cx="0" cy="0" r="50" stroke="black" stroke-width="10" fill="none"/>
				<line x1="0" y1="-8" x2="0" y2="28" stroke="black" stroke-width="10"/>
				<circle cx="0" cy="-18" r="6" fill="black"/>
			</g>
		</svg>
	),
	keywords: [__('icon')],
	attributes: {
		icon: {
			type: 'string',
			default: 'error'
		},
		className: {
			type: 'string'
		}
	},
	edit: props => {

		const {
			setAttributes,
			attributes: {
				icon
			},
			className
		} = props;

		// Grab newLogo, set the value of logo to newLogo.
		const onChangeIcon = value => {
			setAttributes({ icon: value });
		};
		return ([
			<InspectorControls>
				<PanelBody title={ __( 'Icon' ) } initialOpen={true} >
					<PanelRow>
						<TextControl
							label="Icon"
							value={icon}
							onChange={ onChangeIcon }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<div
				className={`wb-icon ${className || ''}`}
				style={{
                    backgroundColor: "blue",
                //    '--icon-path': iconPathURL,
                }}> 
			</div>

		]);
	},

	// return null as frontend output is done via PHP
	save: () => null
});
