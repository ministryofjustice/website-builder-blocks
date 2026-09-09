/**
 * Reveal
 *
 * Block metadata — name, title, category, icon, keywords, attributes — lives in
 * block.json and is registered server-side from website-builder-blocks.php.
 * This file only supplies the editor behaviour.
 *
 * The revealClassName attribute in block.json is legacy: edit() used to copy the
 * editor's generated className into it so the render callback could read it back.
 * apiVersion 3 no longer passes className to edit(), and the render callback now
 * uses get_block_wrapper_attributes(), so nothing reads or writes it. It stays
 * registered only so it isn't stripped from content saved before this change.
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";

import metadata from "./block.json";

// Load allowed blocks to be added to content
const allowedBlocks = ["core/heading", "core/paragraph", "core/list"];

registerBlockType(metadata.name, {
	edit: props => {
		const {
			setAttributes,
			attributes: { revealTitle },
		} = props;

		// apiVersion 3: the wrapper element must carry the props returned by
		// useBlockProps, and className is no longer passed to edit() — the
		// generated block class and any custom classes come back in blockProps.
		//
		// This replaces two things. The first was a call to
		// setAttributes({ revealClassName: className }) made during render, which
		// wrote to the store on every render pass; React state must not be
		// updated while rendering, and it is no longer needed now that PHP reads
		// the class from get_block_wrapper_attributes().
		//
		// The second was `className={`revealClassName`}` on the wrapper — a
		// template literal around the *name* of the variable rather than the
		// variable itself, so the editor rendered a literal class of
		// "revealClassName" and never the wb-blocks-reveal class that the
		// frontend emits. The two now match.
		const blockProps = useBlockProps({
			className: "wb-blocks-reveal",
		});

		// Grab newRevealTitle, set the value of revealTitle to newRevealTitle.
		const onChangeRevealTitle = newRevealTitle => {
			setAttributes({ revealTitle: newRevealTitle });
		};

		return (
			<div {...blockProps}>
				<details className="wb-details" open>
					<summary className="wb-details__summary">
						<a className="wb-details__summary-text">
							<RichText
								value={revealTitle}
								placeholder={__("Add reveal title")}
								keepPlaceholderOnFocus
								onChange={onChangeRevealTitle}
							/>
						</a>
					</summary>
					<div className="wb-details__text">
						<InnerBlocks allowedBlocks={allowedBlocks} />
					</div>
				</details>
			</div>
		);
	},

	// The inner blocks are saved to post content; the surrounding markup is
	// produced by the render callback in index.php.
	save: () => {
		return <InnerBlocks.Content />;
	},
});
