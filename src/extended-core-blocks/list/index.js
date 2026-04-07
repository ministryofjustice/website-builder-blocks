/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockStyle } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
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
			customListLayout: {
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

		const isHorizontal = attributes.className?.includes('is-style-horizontal');

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
						{isHorizontal && (
							<SelectControl
								label="Horizontal layout"
								value={ props.attributes.customListLayout }
								options={ [
									{ label: 'Flow', value: '' },
									{ label: 'Loose grid', value: 'grid--loose' },
									{ label: 'Tight grid', value: 'grid--tight' },
								] }
								onChange={ ( value ) => setAttributes({ customListLayout: value }) }
							/>
						)}
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

		const { customBulletColour, customBulletIcon, customListLayout } = props.attributes;
		const maskURL = "url('" + iconRootDirectory + customBulletIcon + iconPathSuffix + "')";
		const colour = customBulletColour
			? customBulletColour
			: 'currentColor';

		let className = "edit-screen-container";
		// we use "with-" here to avoid circular references
		if (customBulletIcon) {
			className += " with-style-icon-list";
		}
		if (customListLayout) {
			className += ` with-horizontal-layout-grid with-horizontal-layout-${customListLayout}`;
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
		if (attributes.customListLayout) {
			props = {
				...props,
				className: classnames(props.className, 'has-horizontal-layout-grid',`has-horizontal-layout-${attributes.customListLayout}`)
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
