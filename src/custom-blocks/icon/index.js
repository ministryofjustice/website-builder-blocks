/**
 * Icon
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useSettings, PanelColorSettings } from '@wordpress/block-editor';
import { SelectControl, RangeControl, TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { useState } from '@wordpress/element';


const iconCatPaths = PHPData.iconDirectories;
const iconCategories = PHPData.iconCategories;

const icons = [];
const catOptions = []; //category options
const iconOptions = [];
const iconButtons = {};
iconCatPaths.forEach(path => {
	const catName = path.split('/').reverse()[0];

	// Create category options
	catOptions.push({ label: catName.charAt(0).toUpperCase() + catName.slice(1), value: catName })

	icons[catName] = [];
	icons[catName]["path"] = path;
	icons[catName]["options"] = iconCategories[catName];
	icons[catName]["options"].forEach(option => {
		iconOptions.push({ label: (option.charAt(0).toUpperCase() + option.slice(1)).replaceAll("_", " "), value: option });
		iconButtons[option] = `${path}/${option}/materialicons/24px.svg`;
	});
});

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
			default: 'star'
		},
		category: {
			type: 'string',
			default: 'toggle'
		},
		size: {
			type: 'number',
			default: 1
		},
		colour: {
			type: 'string'
		},
		className: {
			type: 'string'
		}
	},
	edit: props => {

		const {
			setAttributes,
			attributes: {
				colour,
				icon,
				size,
				category
			},
			className
		} = props;

		const [searchTerm, setSearchTerm] = useState('');
		// Filter icons based on search input
		const filteredIcons = Object.entries(iconButtons).filter(([name]) =>
			name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		// Grab newLogo, set the value of logo to newLogo.
		const onChangeIcon = value => {
			setAttributes({ icon: value });
		};
		const onChangeCategory = value => {
			setAttributes({ category: value });
		};
		const onChangeSize = value => {
			setAttributes({ size: value });
		};
		const onChangeColour = value => {
			setAttributes({ colour: value });
		};


		const [colorPalette] = useSettings('color.palette');
		const extraIconColours = [
			{name: 'Red',color: 'var(--colour-red)'},
			{name: 'Green',color: 'var(--colour-green)'},
			{name: 'Blue',color: 'var(--colour-blue)'}
		]
		const allColours = [...colorPalette,...extraIconColours];
		const iconPathURL = `url('${icons[category]["path"]}/${icon}/materialicons/24px.svg')`;
		return ([
			<InspectorControls group="settings">
				<PanelBody title="Icon picker (buttons)" initialOpen={ true } >
					<TextControl
						label="Search icons"
						placeholder="Type to filter"
						value={searchTerm}
						onChange={(value) => setSearchTerm(value)}
						style={{ marginBottom: '8px' }}
					/>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: '10px'
					}}>
						{filteredIcons.map(([name, url]) => (
							<button
								key={name}
								onClick={
									() => setAttributes({ icon: name })
								}
								style={{
									border: icon === name ? '8px solid #0ff' : '1px solid #ccc',
									filter: icon === name ? 'invert(1)' : 'none',
									padding: '10px',
									background: 'white',
									cursor: 'pointer',
								}}
							>
								<img src={url} width={24} height={24} alt="" />
							</button>
						))}
						{filteredIcons.length === 0 && (
							<p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
								No icons found.
							</p>
						)}
					</div>
				</PanelBody>
				<PanelBody title="Icon selector (drop-downs)" initialOpen={true}>
					<PanelRow>
						<SelectControl
							label="Icon category"
							value={category}
							options={ catOptions }
							onChange={ onChangeCategory }
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label="Icon"
							value={icon}
							options={ iconOptions }
							onChange={ onChangeIcon }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<InspectorControls group="styles">
				<PanelBody >
					<RangeControl
						label="Size"
						value={ size }
						onChange={ onChangeSize }
						min={ 1 }
						max={ 12 }
						step={ 0.5 }
					/>
					<PanelColorSettings
						title='Icon colour'
						colorSettings={[
							{
								value: colour,
								onChange: onChangeColour,
								label: 'Colour',
								colors: allColours
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>,
			<div
				className={`wb-icon ${className || ''}`}
				style={{
					backgroundColor: colour,
					'--icon-path': iconPathURL,
					'--icon-size': size,
				}}>
			</div>

		]);
	},

	// return null as frontend output is done via PHP
	save: () => null
});
