const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks, InspectorControls, useSettings } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, SelectControl, RadioControl, ToggleControl } = wp.components;

const tailwind_open_all_basic = "cursor-pointer inline-flex items-center mb-2 !font-bold";
const tailwind_open_all_chevron = "pr-1 after:content-[''] after:inline-block after:w-1.5 after:h-1.5 after:ml-2 after:border-r-2 after:border-b-2 after:border-current after:rotate-[45deg] after:transition-transform after:duration-200 data-[state=open]:after:rotate-[-135deg]";
const tailwind_borders = "first-of-type:border-t border-b";

/**
 * Block: Accordion
 *
 * Display content in accordion layout.
 */
registerBlockType('wb-blocks/accordion', {
	title: 'Accordion',
	description: __( 'Display content in an accordion component.' ),
	icon: "list-view",
	category: 'wb-blocks',
	keywords: [ __( 'accordion' ), __( 'sections' ), __( 'lists' ) ],
	attributes: {
		openAll: {
			type: "text",
			default: "Expand all sections"
		},
		closeAll: {
			type: "text",
			default: "Collapse all sections"
		},
		headingLevel: {
			type: 'number',
			default: 3
		},
		headingFontSize: {
			type: 'string',
			default: 'base'
		},
		accordionClassName: {
			type: 'string'
		},
		enableShowHideAll: {
			type: 'boolean',
			default: true
		},
		accordionUniqueName: {
			type: 'string'
		}
	},
	// Provide context for child blocks
	providesContext: {
		'wb-blocks/accordionHeadingLevel': 'headingLevel',
		'wb-blocks/accordionHeadingFontSize': 'headingFontSize',
		'wb-blocks/accordionUniqueName': 'accordionUniqueName'
	},

	edit: props => {
		const {
			setAttributes,
			attributes: {
				openAll,
				closeAll,
				headingLevel,
				headingFontSize,
				enableShowHideAll,
				accordionUniqueName
			},
			clientId,
			className
		} = props;

		const [ fontSizes ] = useSettings('typography.fontSizes');
		const options = [
			...fontSizes.map((size) => ({
				label: size.name,
				value: size.slug
			}))
		];

		setAttributes({ accordionUniqueName: clientId });

		// Set className attribute for PHP frontend to use
		setAttributes({ accordionClassName: className });

		// Load allowed blocks on repeater
		const allowedBlocks = [ 'wb-blocks/accordion-section' ];

		// Load template/block when block is selected
		const templates = [
			[ 'wb-blocks/accordion-section', {},[
				[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ],
				[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ]
			]],
			[ 'wb-blocks/accordion-section', {},[
				[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ],
				[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ]
			] ]
		];

		return ([
			<InspectorControls>
				<PanelBody
						title="Heading level & size"
						initialOpen={true}
				>
					<PanelRow>
						<SelectControl
							label="Heading level"
							value={ headingLevel }
							options={[
								{ label: 'H2', value: 2 },
								{ label: 'H3', value: 3 },
								{ label: 'H4', value: 4 },
								{ label: 'H5', value: 5 },
								{ label: 'H6', value: 6 }
							]}
							onChange={ (newValue) =>
								setAttributes({ headingLevel: parseInt(newValue, 10) })
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label="Font size"
							value={headingFontSize}
							options={options}
							onChange={(newValue) => setAttributes({ headingFontSize: newValue })}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
						title="Open and close text"
						initialOpen={false}
				>
					<PanelRow>
						<ToggleControl
							label="Enable open/close all"
							checked={ enableShowHideAll }
							onChange={(newValue) => setAttributes({ enableShowHideAll: newValue })}
						/>
					</PanelRow>
					<PanelRow>
						{ enableShowHideAll && (
							<TextControl
								label="Open all text"
								value={ openAll }
								onChange={(newValue) => setAttributes({ openAll: newValue })}
							/>
						)}
					</PanelRow>
					<PanelRow>
						{ enableShowHideAll && (
							<TextControl
								label="Close all text"
								value={ closeAll }
								onChange={(newValue) => setAttributes({ closeAll: newValue })}
							/>
						)}
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<button className = {tailwind_open_all_basic + " " + tailwind_open_all_chevron} style={{ display: enableShowHideAll ? 'block' : 'none' }}>
				{ enableShowHideAll && (`${openAll}/${closeAll}`)}
			</button>,
			<div className={'wb-accordion ' + className} key="accordion-block">
				<InnerBlocks
					template={ templates }
					allowedBlocks={ allowedBlocks }
				/>
			</div>
		])
	},

	// When using InnerBlocks with dynamic blocks, you need to return the content.
	save: () => {
		return <InnerBlocks.Content />;
	}
});

/**
 * Block: Accordion section
 *
 * Inner-block. Displayed only in the parent accordion block.
 */
registerBlockType("wb-blocks/accordion-section", {
	title: "Accordion Section",
	category: 'wb-blocks',
	parent: [ 'wb-blocks/accordion' ],
	attributes: {
		sectionTitle: {
			type: "string"
		},
		accordionHeadingLevel: {
			type: "number"
		},
		accordionHeadingFontSize: {
			type: "string"
		},
		defaultOpen: {
			type: "boolean"
		},
		accordionSectionClassName: {
			type: "string"
		},
		accordionUniqueName: {
			type: "string"
		}
	},
	usesContext: ['wb-blocks/accordionHeadingLevel','wb-blocks/accordionHeadingFontSize'],
	edit: props => {

		const {
			attributes: {
				sectionTitle,
				defaultOpen,
				accordionHeadingLevel,
				accordionHeadingFontSize,
				accordionUniqueName
			},
			className,
			setAttributes,
			context
		} = props

		// Set className attribute for PHP frontend to use
		setAttributes({ accordionSectionClassName: className });

		// Load allowed blocks to be added to accordion section body
		const allowedBlocks = [ 'core/heading','core/list', 'core/paragraph', 'core/file', 'core/image' ];
		const templates = [
			[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ],
			[ 'core/paragraph', { placeholder: '[Accordion paragraph]' } ]
		];
		const onChangeAccordionTitle = newValue => {
			setAttributes({ sectionTitle: newValue })
		}

		// Set variables from parent
		const headingLevel = context['wb-blocks/accordionHeadingLevel'] || 3;
		const headingFontSize = context['wb-blocks/accordionHeadingFontSize'] || "base";
		const uniqueName = context['wb-blocks/accordionUniqueName'] || "";
		setAttributes({ accordionHeadingLevel: headingLevel });
		setAttributes({ accordionHeadingFontSize: headingFontSize });
		setAttributes({ accordionUniqueName: uniqueName });

		return ([
			<InspectorControls>
				<PanelBody
						title="Options"
						initialOpen={false}
				>
					<PanelRow>
						<RadioControl
							label="Open section by default"
							selected={defaultOpen ? 'yes' : 'no'}
							options={[
								{ label: 'Yes', value: 'yes' },
								{ label: 'No', value: 'no' },
							]}
							onChange={(value) => setAttributes({ defaultOpen: value === 'yes' })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<div className={`${className} accordion-section ` + tailwind_borders} key="accordion-block-section">
				<RichText
					tagName={`h${accordionHeadingLevel}`}
					className={`wp-block-heading inline-block has-${accordionHeadingFontSize}-font-size !my-4`}
					value={ sectionTitle }
					placeholder="Add accordion section title…"
					onChange={ onChangeAccordionTitle }
					allowedFormats={[]} // disable all format options
				/>
				<div className="accordion-section__content">
					<InnerBlocks
						template={ templates }
						allowedBlocks={ allowedBlocks }
					/>
				</div>
			</div>
		]);
	},

	// When using InnerBlocks with dynamic blocks, you need to return the content.
	save: () => {
		return <InnerBlocks.Content />;
	}
});
