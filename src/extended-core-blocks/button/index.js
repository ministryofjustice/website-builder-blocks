/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import classnames from 'classnames';

const iconRootDirectory = IconData.rootDirectory + "/";
const iconPathSuffix = "/materialicons/24px.svg";
// These two arrays should to be in synch
const allowedArrowsLeft = [
	"hardware/keyboard_arrow_left",
	"navigation/arrow_back",
	"navigation/chevron_left",
	"navigation/arrow_back_ios",
];
const allowedArrowsRight = [
	"hardware/keyboard_arrow_right",
	"navigation/arrow_forward",
	"navigation/chevron_right",
	"navigation/arrow_forward_ios",
];
const allowedIcons = [
	"action/arrow_right_alt",
	"av/play_arrow",
	"navigation/check",
	"action/check_circle",
	"action/check_circle_outline",
	"action/info",
	"action/info_outline",
	"action/help",
	"action/help_outline",
	"alert/error",
	"alert/error_outline",
	"toggle/star",
	"action/label_important",
	"action/label_important_outline",
	"action/print",
];

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'wb-blocks/button-custom-arrow-attribute',
	function (settings, name) {
		if (name !== 'core/button') return settings;

		settings.attributes = {
			...settings.attributes,
			customArrowLeft: {
				type: 'string',
			},
			customArrowRight: {
				type: 'string',
			},
		};

		return settings;
	}
);

const arrowPicker = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/button') {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const chooseArrowLeft = (data) => {
			setAttributes({
				customArrowLeft: attributes.customArrowLeft === data ? "" : data //toggle
			});
		};
		const chooseArrowRight = (data) => {
			setAttributes({
				customArrowRight: attributes.customArrowRight === data ? "" : data //toggle
			});
		};
		console.log("Left",attributes.customArrowLeft);
		console.log("Right",attributes.customArrowRight);
		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls group="styles">
					<PanelBody title="Button arrows" initialOpen={false}>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: '10px'
						}}>
							<button
								onClick={() => chooseArrowLeft("")}
								style={{
									outline: (!attributes.customArrowLeft || attributes.customArrowLeft === "") ? '8px solid #0ff' : '1px solid #ccc',
									filter: (!attributes.customArrowLeft || attributes.customArrowLeft === "") ? 'invert(1)' : 'none',
									padding: '10px',
									background: 'white',
									cursor: 'pointer',
									textAlign: 'center',
									fontWeight: '700',
									gridColumn: 'span 2'
								}}
							>
								No left-hand arrow
							</button>
							<button
								onClick={() => chooseArrowRight("")}
								style={{
									outline: (!attributes.customArrowRight || attributes.customArrowRight === "") ? '8px solid #0ff' : '1px solid #ccc',
									filter: (!attributes.customArrowRight || attributes.customArrowRight === "") ? 'invert(1)' : 'none',
									padding: '10px',
									background: 'white',
									cursor: 'pointer',
									textAlign: 'center',
									fontWeight: '700',
									gridColumn: 'span 2'
								}}
							>
								No right-hand arrow
							</button>
							{allowedArrowsLeft.map((data,index) => ([
								<button
									key={allowedArrowsLeft[index]}
									onClick={() => chooseArrowLeft(allowedArrowsLeft[index])}
									style={{
										outline: attributes.customArrowLeft === allowedArrowsLeft[index] ? '8px solid #0ff' : '1px solid #ccc',
										filter: attributes.customArrowLeft === allowedArrowsLeft[index] ? 'invert(1)' : 'none',
										padding: '10px',
										background: 'white',
										cursor: 'pointer',
										textAlign: 'center'
									}}
								>
									<img src={iconRootDirectory + allowedArrowsLeft[index] + iconPathSuffix} width={24} height={24} alt={allowedArrowsLeft[index]} loading="lazy" style={{display: "inline"}} />
								</button>,
								<button
									key={allowedArrowsRight[index]}
									onClick={() => chooseArrowRight(allowedArrowsRight[index])}
									style={{
										outline: attributes.customArrowRight === allowedArrowsRight[index] ? '8px solid #0ff' : '1px solid #ccc',
										filter: attributes.customArrowRight === allowedArrowsRight[index] ? 'invert(1)' : 'none',
										padding: '10px',
										background: 'white',
										cursor: 'pointer',
										textAlign: 'center'
									}}
								>
									<img src={iconRootDirectory + allowedArrowsRight[index] + iconPathSuffix} width={24} height={24} alt={allowedArrowsRight[index]} loading="lazy" style={{display: "inline"}} />
								</button>
							]
							))}
						</div>
					</PanelBody>
					<PanelBody title="Button icons (left)" initialOpen={false}>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: '10px'
						}}>
							<button
								onClick={() => chooseArrowLeft("")}
								style={{
									outline: !attributes.customArrowLeft || attributes.customArrowLeft === "" ? '8px solid #0ff' : '1px solid #ccc',
									filter: !attributes.customArrowLeft || attributes.customArrowLeft === "" ? 'invert(1)' : 'none',
									padding: '10px',
									background: 'white',
									cursor: 'pointer',
									textAlign: 'center',
									fontWeight: '700',
									gridColumn: 'span 4'
								}}
							>
								No left-hand icon
							</button>
							{allowedIcons.map((data) => (
								<button
									key={data}
									onClick={() => chooseArrowLeft(data)}
									style={{
										outline: attributes.customArrowLeft === data ? '8px solid #0ff' : '1px solid #ccc',
										filter: attributes.customArrowLeft === data ? 'invert(1)' : 'none',
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
					</PanelBody>
					<PanelBody title="Button icons (right)" initialOpen={false}>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: '10px'
						}}>
							<button
								onClick={() => chooseArrowRight("")}
								style={{
									outline: !attributes.customArrowRight || attributes.customArrowRight === "" ? '8px solid #0ff' : '1px solid #ccc',
									filter: !attributes.customArrowRight || attributes.customArrowRight === "" ? 'invert(1)' : 'none',
									padding: '10px',
									background: 'white',
									cursor: 'pointer',
									textAlign: 'center',
									fontWeight: '700',
									gridColumn: 'span 4'
								}}
							>
								No right-hand icon
							</button>
							{allowedIcons.map((data) => (
								<button
									key={data}
									onClick={() => chooseArrowRight(data)}
									style={{
										outline: attributes.customArrowRight === data ? '8px solid #0ff' : '1px solid #ccc',
										filter: attributes.customArrowRight === data ? 'invert(1)' : 'none',
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
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'arrowPicker');

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/custom-arrow-control',
	arrowPicker
);

const selectArrow = wp.compose.createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (props.name !== 'core/button') {
			return <BlockEdit {...props} />;
		}

		const { customArrowLeft, customArrowRight } = props.attributes;
		const maskLeft = "url('" + iconRootDirectory + customArrowLeft + iconPathSuffix + "')";
		const maskRight = "url('" + iconRootDirectory + customArrowRight + iconPathSuffix + "')";
		let className = "edit-screen-container";
		if (customArrowLeft) {
			className += " is-style-custom-arrow-left";
		}
		if (customArrowRight) {
			className += " is-style-custom-arrow-right";
		}

		return (
			<div className={className} style={{'--right-icon': maskRight, '--left-icon': maskLeft}}>
				<BlockEdit {...props} />
			</div>
		);
	},
	'selectArrow'
);

wp.hooks.addFilter(
	'editor.BlockEdit',
	'wb-blocks/button-arrows',
	selectArrow
);


// Save our custom attribute

const saveArrow = ( props, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( blockType.name == "core/button" ) {
		const { customArrowLeft, customArrowRight } = attributes;
		const maskLeft = "url('" + iconRootDirectory + customArrowLeft + iconPathSuffix + "')";
		const maskRight = "url('" + iconRootDirectory + customArrowRight + iconPathSuffix + "')";
		if (customArrowLeft) {
			props = {
				...props,
				className: classnames(props.className, "is-style-custom-arrow-left")
			};
			props.style = {
				...props.style,
				'--left-icon': maskLeft
			};
		}
		if (customArrowRight) {
			props = {
				...props,
				className: classnames(props.className, "is-style-custom-arrow-right")
			};
			props.style = {
				...props.style,
				'--right-icon': maskRight, 
			};
		}
	}

	return props;

};
wp.hooks.addFilter(
	'blocks.getSaveContent.extraProps',
	'wb-blocks/save-custom-arrow',
	saveArrow
);
/**/