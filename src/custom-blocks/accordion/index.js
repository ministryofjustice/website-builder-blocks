/**
 * Accordion and Accordion Section
 *
 * Block metadata for both blocks — name, title, category, attributes, and the
 * providesContext/usesContext pair that links them — lives in block.json and is
 * registered server-side from website-builder-blocks.php. This file only
 * supplies the editor behaviour.
 *
 * The section's metadata sits in ../accordion-section/block.json because
 * register_block_type() reads one block.json per directory, so the two blocks
 * need a directory each. Both editor implementations stay here, since they are
 * a matched pair and the section is meaningless outside its parent; only the
 * metadata had to move.
 *
 * The accordionClassName and accordionSectionClassName attributes are legacy:
 * edit() used to copy the editor's generated className into them so the render
 * callbacks could read it back. apiVersion 3 no longer passes className to
 * edit(), and both callbacks now use get_block_wrapper_attributes(), so nothing
 * reads or writes them. They stay registered only so they aren't stripped from
 * content saved before this change.
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { RichText, InnerBlocks, InspectorControls, useBlockProps, useSettings } from "@wordpress/block-editor";
import { PanelBody, PanelRow, TextControl, SelectControl, RadioControl } from "@wordpress/components";
import { Fragment, useEffect } from "@wordpress/element";

import metadata from "./block.json";
import sectionMetadata from "../accordion-section/block.json";

const tailwind_open_all_basic = "cursor-pointer inline-flex items-center mb-2 !font-bold";
const tailwind_open_all_chevron =
	"pr-1 after:content-[''] after:inline-block after:w-1.5 after:h-1.5 after:ml-2 after:border-r-2 after:border-b-2 after:border-current after:rotate-[45deg] after:transition-transform after:duration-200 data-[state=open]:after:rotate-[-135deg]";
const tailwind_borders = "first-of-type:border-t border-b";

/**
 * Block: Accordion
 *
 * Display content in accordion layout.
 */
registerBlockType(metadata.name, {
	edit: props => {
		const {
			setAttributes,
			attributes: { openAll, closeAll, headingLevel, headingFontSize },
		} = props;

		const [fontSizes] = useSettings("typography.fontSizes");
		const options = [
			...fontSizes.map(size => ({
				label: size.name,
				value: size.slug,
			})),
		];

		// apiVersion 3: the wrapper element must carry the props returned by
		// useBlockProps, and className is no longer passed to edit() — the
		// generated block class and any custom classes come back in blockProps.
		//
		// This replaces a setAttributes({ accordionClassName: className }) call
		// made during render, which wrote to the store on every render pass.
		// React state must not be updated while rendering, and it is no longer
		// needed now that PHP reads the class from
		// get_block_wrapper_attributes().
		//
		// The "expand all" button also moves inside this wrapper. The render
		// callback has always emitted it inside the .wb-accordion div, and
		// frontend.js relies on that — it looks the button up with
		// accordion.querySelector(".wb-accordion-toggle-all"). The editor
		// previously rendered it as a sibling, so the two disagreed.
		const blockProps = useBlockProps({
			className: "wb-accordion",
		});

		// Load allowed blocks on repeater
		const allowedBlocks = [sectionMetadata.name];

		// Load template/block when block is selected
		const templates = [
			[
				sectionMetadata.name,
				{},
				[
					["core/paragraph", { placeholder: "[Accordion paragraph]" }],
					["core/paragraph", { placeholder: "[Accordion paragraph]" }],
				],
			],
			[
				sectionMetadata.name,
				{},
				[
					["core/paragraph", { placeholder: "[Accordion paragraph]" }],
					["core/paragraph", { placeholder: "[Accordion paragraph]" }],
				],
			],
		];

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title="Heading level & size" initialOpen={true}>
						<PanelRow>
							<SelectControl
								label="Heading level"
								value={headingLevel}
								options={[
									{ label: "H2", value: 2 },
									{ label: "H3", value: 3 },
									{ label: "H4", value: 4 },
									{ label: "H5", value: 5 },
									{ label: "H6", value: 6 },
								]}
								onChange={newValue => setAttributes({ headingLevel: parseInt(newValue, 10) })}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label="Font size"
								value={headingFontSize}
								options={options}
								onChange={newValue => setAttributes({ headingFontSize: newValue })}
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody title="Open and close text" initialOpen={false}>
						<PanelRow>
							<TextControl
								label="Open all text"
								value={openAll}
								onChange={newValue => setAttributes({ openAll: newValue })}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label="Close all text"
								value={closeAll}
								onChange={newValue => setAttributes({ closeAll: newValue })}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<button className={tailwind_open_all_basic + " " + tailwind_open_all_chevron}>
						{openAll}/{closeAll}
					</button>
					<InnerBlocks template={templates} allowedBlocks={allowedBlocks} />
				</div>
			</Fragment>
		);
	},

	// When using InnerBlocks with dynamic blocks, you need to return the content.
	save: () => {
		return <InnerBlocks.Content />;
	},
});

/**
 * Block: Accordion section
 *
 * Inner-block. Displayed only in the parent accordion block.
 */
registerBlockType(sectionMetadata.name, {
	edit: props => {
		const {
			attributes: { sectionTitle, defaultOpen, accordionHeadingLevel, accordionHeadingFontSize },
			setAttributes,
			context,
		} = props;

		// apiVersion 3: see the note on the parent block above. The editor's
		// wrapper classes are kept exactly as they were, minus className, which
		// blockProps now supplies.
		const blockProps = useBlockProps({
			className: `accordion-section ${tailwind_borders}`,
		});

		// Load allowed blocks to be added to accordion section body
		const allowedBlocks = ["core/heading", "core/list", "core/paragraph", "core/file", "core/image"];
		const templates = [
			["core/paragraph", { placeholder: "[Accordion paragraph]" }],
			["core/paragraph", { placeholder: "[Accordion paragraph]" }],
		];
		const onChangeAccordionTitle = newValue => {
			setAttributes({ sectionTitle: newValue });
		};

		// Set variables from parent
		const headingLevel = context["wb-blocks/accordionHeadingLevel"] || 3;
		const headingFontSize = context["wb-blocks/accordionHeadingFontSize"] || "base";

		// The parent's heading settings reach this block through block context,
		// but context is an editor-side concept — the render callback only ever
		// sees saved attributes. So they are mirrored into attributes to persist
		// them for the frontend.
		//
		// That mirroring used to happen in the render body, which writes to the
		// store while React is rendering. It runs in an effect instead, guarded
		// so it only dispatches when a value has actually changed; without the
		// guard every mount would mark the post dirty.
		useEffect(() => {
			if (accordionHeadingLevel !== headingLevel || accordionHeadingFontSize !== headingFontSize) {
				setAttributes({
					accordionHeadingLevel: headingLevel,
					accordionHeadingFontSize: headingFontSize,
				});
			}
		}, [headingLevel, headingFontSize, accordionHeadingLevel, accordionHeadingFontSize]);

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title="Options" initialOpen={false}>
						<PanelRow>
							<RadioControl
								label="Open section by default"
								selected={defaultOpen ? "yes" : "no"}
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
								onChange={value => setAttributes({ defaultOpen: value === "yes" })}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<RichText
						tagName={`h${headingLevel}`}
						className={`wp-block-heading inline-block has-${headingFontSize}-font-size !my-4`}
						value={sectionTitle}
						placeholder="Add accordion section title…"
						onChange={onChangeAccordionTitle}
						allowedFormats={[]} // disable all format options
					/>
					<div className="accordion-section__content">
						<InnerBlocks template={templates} allowedBlocks={allowedBlocks} />
					</div>
				</div>
			</Fragment>
		);
	},

	// When using InnerBlocks with dynamic blocks, you need to return the content.
	save: () => {
		return <InnerBlocks.Content />;
	},
});
