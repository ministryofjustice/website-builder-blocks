const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.blockEditor;
const { InnerBlocks } = wp.blockEditor;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, PanelRow, ToggleControl, SelectControl } = wp.components;
import { FontSizePicker } from '@wordpress/components';
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
	example: {
		attributes: {
			controlLanguageWelsh: false
		},
	},
	attributes: {
		controlLanguageWelsh: {
			type: 'boolean'
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
				controlLanguageWelsh,
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
						title="Welsh language controls"
						initialOpen={false}
				>
					<PanelRow>
						<ToggleControl
							label="Set controls to Welsh"
							help={
								controlLanguageWelsh
									? 'Controls are in Welsh'
									: 'Controls are in English'
							}
							checked={controlLanguageWelsh}
							onChange={newControlLanguageWelsh => setAttributes({ controlLanguageWelsh: newControlLanguageWelsh }) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<div className={'wb-accordion preview-welsh-' + controlLanguageWelsh + className} id="accordion-default" key="accordion-block">
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
		accordionSectionTitle: {
			type: "string"
		},
		accordionSectionClassName: {
			type: "string"
		}
	},
	usesContext: ['wb-blocks/accordionHeadingLevel'],
	edit: props => {

		const {
			attributes: {
				accordionSectionTitle
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
		const onChangeAccordionTitle = newAccordionTitle => {
			setAttributes({ accordionSectionTitle: newAccordionTitle })
		}

		const headingLevel = context['wb-blocks/accordionHeadingLevel'] || 3;

		return ([
			<div className={`${className} wb-accordion__section`} key="accordion-block-section">
				<h3 className="wb-accordion__section-heading">
					<span className="wb-accordion__section-button" id="accordion-default-heading-1">
						<RichText
							tagName={`h${headingLevel}`}
							className="accordion-section-heading"
							value={ accordionSectionTitle }
							placeholder="Add accordion section title…"
							onChange={ onChangeAccordionTitle }
							allowedFormats={[]} // disable all format options
						/>
					</span>
				</h3>
				<div id="accordion-default-content-1" className="wb-accordion__section-content">
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

/**
 * Internal dependencies
 */
import edit from './edit';
