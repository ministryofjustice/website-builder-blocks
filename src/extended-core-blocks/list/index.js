/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockVariation, registerBlockStyle } from '@wordpress/blocks';
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls, useSettings } = wp.blockEditor;
const { PanelBody, SelectControl } = wp.components;
const {	PanelColorSettings } = wp.editor;

registerBlockStyle( 'core/list', {
	name: 'tick-list',
	label: 'Tick list',
} );

registerBlockVariation('core/list', {
	// This is the out-of-the-box WordPress style, no special stuff
	name: 'vertical-list',
	title: 'Vertical list',
	description: 'The default list style',
	attributes: {
		className: ''
	},
	scope: ['transform'],
	isActive: (blockAttributes) =>
		!blockAttributes?.className?.includes('is-variant-horizontal'),
});

registerBlockVariation('core/list', {
	// This is the out-of-the-box WordPress style, no special stuff
	name: 'horizontal-list',
	title: 'Horizontal list',
	description: 'A list which goes sideways instead of down',
	attributes: {
		className: 'is-variant-horizontal'
	},
	scope: ['transform'],
	isActive: (blockAttributes) =>
		blockAttributes?.className?.includes('is-variant-horizontal'),
});

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
			{name: 'Red',color: '#B22222'},
			{name: 'Green',color: '#008000'},
			{name: 'Blue',color: '#0077BB'}
		]
		const allColours = [...colorPalette,...extraBulletColours];
		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls group="styles">
					<PanelBody title="Custom Bullets">
						<PanelColorSettings
							title='Colour Settings'
							colorSettings={[
								{
									value: props.attributes.customBulletColour,
									onChange: (color) => props.setAttributes({ customBulletColour: color }),
									label: 'Bullet colour',
									colors: allColours
								}
							]}
						/>
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



const selectCustomBulletColour = wp.compose.createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (props.name !== 'core/list') {
			return <BlockEdit {...props} />;
		}

		const { customBulletColour } = props.attributes;

		const style = customBulletColour
			? { '--bullet-colour': customBulletColour }
			: {};

		return (
			<div style={style}>
				<BlockEdit {...props} />
			</div>
		);
	},
	'selectCustomBulletColour'
);

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/custom-bullet-colour',
	selectCustomBulletColour
);


// Save our custom attribute

const saveCustomBulletColour = ( extraProps, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( blockType.name == "core/list" ) {
	//	console.log("Attr A", attributes);
		const { customBulletColour } = attributes;
	//	console.log("Attr B", customBulletColour);
		if ( customBulletColour ) {
			extraProps.style = {
				...extraProps.style,
				'--bullet-colour': customBulletColour,
			};
		}
	}

	return extraProps;

};
wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'wb-blocks/save-custom-bullet-colour',
	saveCustomBulletColour
);




/**
 * Save the colour choice
 *
const saveChosenBulletColour = ( extraProps, blockType, attributes ) => {
// Do nothing if it's another block than our defined ones.
	if (blockType.name !== 'core/list') return extraProps;

	const bulletColour = attributes.customBulletColour || 'currentColor';
	extraProps.className = [
		extraProps.className,
		'has-custom-bullet-colour'
	].filter(Boolean).join(' ');
	extraProps.style = {
		...extraProps.style,
		'--bullet-colour': bulletColour,
	};
	
	return extraProps;
}

wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'wb-blocks/save-bullet-colour',
	saveChosenBulletColour
);
/**/