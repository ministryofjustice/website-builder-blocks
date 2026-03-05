const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.blockEditor;
const { InnerBlocks } = wp.blockEditor;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, SelectControl, RadioControl } = wp.components;

const tailwind_open_all_basic = "cursor-pointer inline-flex items-center mb-2";
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
		accordionClassName: {
			type: 'string'
		}
	},
	// Provide context for child blocks
	providesContext: {
		'wb-blocks/accordionHeadingLevel': 'headingLevel'
	},

	edit: props => {
		const {
			setAttributes,
			attributes: {
				openAll,
				closeAll,
				headingLevel
			},
			className
		} = props;

		// Set className attribute for PHP frontend to use
		setAttributes({ accordionClassName: className });

		// Load allowed blocks on repeater
		const allowedBlocks = [ 'wb-blocks/accordion-section' ];

		// Load template/block when block is selected
		const templates = [
			[ 'wb-blocks/accordion-section', {},[
				[ 'core/paragraph', { placeholder: '[Accordion item 1, paragraph 1]' } ],
				[ 'core/paragraph', { placeholder: '[Accordion item 1, paragraph 2]' } ]
			]],
			[ 'wb-blocks/accordion-section', {},[
				[ 'core/paragraph', { placeholder: '[Accordion item 2, paragraph 1]' } ],
				[ 'core/paragraph', { placeholder: '[Accordion item 2, paragraph 2]' } ]
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
							onChange={ (newLevel) =>
								setAttributes({ headingLevel: parseInt(newLevel, 10) })
							}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
						title="Open and close text"
						initialOpen={false}
				>
					<PanelRow>
						<TextControl
							label="Open all text"
							value={ openAll }
							onChange={(newValue) => setAttributes({ openAll: newValue })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label="Close all text"
							value={ closeAll }
							onChange={(newValue) => setAttributes({ closeAll: newValue })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<p className = {tailwind_open_all_basic + tailwind_open_all_chevron}>{openAll}/{closeAll}</p>,
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
		defaultOpen: {
			type: "boolean"
		},
		accordionSectionClassName: {
			type: "string"
		}
	},
	usesContext: ['wb-blocks/accordionHeadingLevel'],
	edit: props => {

		const {
			attributes: {
				sectionTitle,
				defaultOpen,
				accordionHeadingLevel
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
			[ 'core/paragraph', { placeholder: '[Paragraph 1]' } ],
			[ 'core/paragraph', { placeholder: '[Paragraph 2]' } ]
		];
		const onChangeAccordionTitle = newValue => {
			setAttributes({ sectionTitle: newValue })
		}

		const headingLevel = context['wb-blocks/accordionHeadingLevel'] || 3;
		setAttributes({ accordionHeadingLevel: headingLevel });

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
					className="wp-block-heading inline-block"
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
