/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockVariation, registerBlockStyle } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import classnames from 'classnames'

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
		};

		return settings;
	}
);

const bulletColourPicker = createHigherOrderComponent((BlockEdit) => {
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
							<SelectControl
								label="Special bullet"
								value={ props.attributes.customBulletStyle }
								options={ [
									{ label: '-', value: '' },
									{ label: 'Tick', value: 'tick' },
									{ label: 'Info', value: 'info' },
								] }
								onChange={ ( value ) => setAttributes({ customBulletStyle: value }) }
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'bulletColourPicker');

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/list-custom-bullet-control',
	bulletColourPicker
);



const selectCustomBullet = wp.compose.createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (props.name !== 'core/list') {
			return <BlockEdit {...props} />;
		}

		const { customBulletStyle, customBulletColour } = props.attributes;

		const style = customBulletColour
			? { '--bullet-colour': customBulletColour }
			: {};

		let className = "edit-screen-container";
		if (customBulletStyle) {
			className += " is-style-icon-list icon-style-"+customBulletStyle;
		}

		return (
			<div className={className} style={style}>
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

const saveCustomBulletColour = ( props, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( blockType.name == "core/list" ) {
		const { customBulletStyle, customBulletColour } = attributes;
		if ( customBulletColour ) {
			props.style = {
				...props.style,
				'--bullet-colour': customBulletColour,
			};
		}
		if (customBulletStyle) {
			props = {
				...props,
				className: classnames(props.className, "is-style-icon-list icon-style-"+customBulletStyle)
			};
		}
	}

	return props;

};
wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'wb-blocks/save-custom-bullet-colour',
	saveCustomBulletColour
);
