/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockVariation, registerBlockStyle } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import classnames from 'classnames';

const iconRootDirectory = IconData.rootDirectory + "/";
const iconPathSuffix = "/materialicons/24px.svg";
const allowedIcons = [
	"content/remove",
	"navigation/check",
	"action/check_circle",
	"action/check_circle_outline",
	"action/info",
	"action/info_outline",
	"navigation/chevron_right",
	"av/play_arrow",
	"action/help",
	"action/help_outline",
	"alert/error",
	"alert/error_outline",
	"toggle/star",
	"action/label_important",
	"action/label_important_outline",
	"action/arrow_right_alt",
];

registerBlockStyle( 'core/list', {
	name: 'horizontal',
	label: 'Horizontal',
} );

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'wb-blocks/list-custom-bullet-attribute',
	function (settings, name) {
		if (name !== 'core/list') return settings;

		settings.attributes = {
			...settings.attributes,
			customBulletColour: {
				type: 'string',
			},
			customBulletStyle: {
				type: 'string',
			},
			customBulletIcon: {
				type: 'string',
			},
		};

		return settings;
	}
);

const customBulletPicker = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/list') {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const [colorPalette] = useSettings('color.palette');
		const extraBulletColours = [
			{name: 'Red',color: 'var(--colour-red)'},
			{name: 'Green',color: 'var(--colour-green)'},
			{name: 'Blue',color: 'var(--colour-blue)'}
		]
		const allColours = [...colorPalette,...extraBulletColours];
		const chooseIcon = (data) => {
			setAttributes({
				customBulletIcon: attributes.customBulletIcon === data ? "" : data //toggle
			});
		};

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls group="styles">
					<PanelBody title={attributes.ordered ? `Marker colouring` : `Custom bullets`}>
						<PanelColorSettings
							title='Colour'
							colorSettings={[
								{
									value: props.attributes.customBulletColour,
									onChange: (colour) => props.setAttributes({ customBulletColour: colour }),
									label: 'Bullet colour',
									colors: allColours
								}
							]}
						/>
						{!attributes.ordered && (
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(4, 1fr)',
								gap: '10px'
							}}>
								<button
									onClick={() => chooseIcon("")}
									style={{
										outline: attributes.customBulletIcon === "" ? '8px solid #0ff' : '1px solid #ccc',
										filter: attributes.customBulletIcon === "" ? 'invert(1)' : 'none',
										padding: '10px',
										background: 'white',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: '700',
										gridColumn: 'span 4'
									}}
								>
									Default (no special icon)
								</button>
								{allowedIcons.map((data) => (
									<button
										key={data}
										onClick={() => chooseIcon(data)}
										style={{
											outline: attributes.customBulletIcon === data ? '8px solid #0ff' : '1px solid #ccc',
											filter: attributes.customBulletIcon === data ? 'invert(1)' : 'none',
											padding: '10px',
											background: 'white',
											cursor: 'pointer',
											textAlign: 'center'
										}}
									>
										<img src={iconRootDirectory + data + iconPathSuffix} width={24} height={24} alt={data} loading="lazy" style={{display: "inline"}} />
									</button>
								))}
							</div>
						)}
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'customBulletPicker');

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/list-custom-bullet-control',
	customBulletPicker
);



const selectCustomBullet = wp.compose.createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (props.name !== 'core/list') {
			return <BlockEdit {...props} />;
		}

		const { customBulletColour, customBulletIcon } = props.attributes;
		const maskURL = "url('" + iconRootDirectory + customBulletIcon + iconPathSuffix + "')";
		const colour = customBulletColour
			? customBulletColour
			: 'currentColor';

		let className = "edit-screen-container";
		if (customBulletIcon) {
			className += " is-style-icon-list";
		}

		return (
			<div className={className} style={{'--bullet-icon': maskURL, '--bullet-colour': colour}}>
				<BlockEdit {...props} />
			</div>
		);
	},
	'selectCustomBullet'
);

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/custom-bullet-colour',
	selectCustomBullet
);


// Save our custom attribute

const saveCustomBullet = ( props, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( blockType.name == "core/list" ) {
		const { customBulletColour, customBulletIcon } = attributes;
		const maskURL = "url('" + iconRootDirectory + customBulletIcon + iconPathSuffix + "')";
		if ( customBulletColour ) {
			props.style = {
				...props.style,
				'--bullet-colour': customBulletColour,
			};
		}
		if (customBulletIcon) {
			props = {
				...props,
				className: classnames(props.className, "is-style-icon-list")
			};
			props.style = {
				...props.style,
				'--bullet-icon': maskURL,
			};
		}
	}

	return props;

};
wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'wb-blocks/save-custom-bullet-colour',
	saveCustomBullet
);
