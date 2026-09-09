/**
 * Print button
 *
 * Block metadata — name, title, category, icon, keywords, attributes — lives in
 * block.json and is registered server-side from website-builder-blocks.php.
 * This file only supplies the editor behaviour.
 *
 * The buttonClassName attribute in block.json is legacy: edit() used to copy the
 * editor's generated className into it so the render callback could read it back.
 * apiVersion 3 no longer passes className to edit(), and the render callback now
 * uses get_block_wrapper_attributes(), so nothing reads or writes it. It stays
 * registered only so it isn't stripped from content saved before this change.
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { RichText, InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { ToggleControl, RadioControl, PanelBody, PanelRow, RangeControl, TextControl } from "@wordpress/components";
import { Fragment } from "@wordpress/element";

import metadata from "./block.json";

const iconRootDirectory = IconData.rootDirectory + "/action/print/";
const iconPathSuffix = "/24px.svg";
const iconStyles = [
	"materialicons",
	"materialiconsoutlined",
	"materialiconsround",
	"materialiconssharp",
	"materialiconstwotone",
];

registerBlockType(metadata.name, {
	// block.json is the single source of truth for attributes, with one
	// exception: JSON cannot call __(), and WordPress' block.json i18n schema
	// covers title, description and keywords but not attribute defaults. Left in
	// block.json alone, a new print button would always be pre-filled with the
	// English "Print this page", whatever the editor's locale.
	//
	// So the metadata attributes are spread through unchanged and only this one
	// default is overridden, with the translated string. Client settings take
	// precedence over the server-side definition, so the editor sees the
	// translated default while PHP keeps the plain one as its fallback — which
	// is what we want, since the frontend renders whatever text was actually
	// saved into the post.
	attributes: {
		...metadata.attributes,
		buttonText: {
			...metadata.attributes.buttonText,
			default: __("Print this page", "wb_blocks"),
		},
	},

	edit: props => {
		const {
			setAttributes,
			attributes: { buttonText, buttonShowText, buttonShowIcon, buttonIconPosition, buttonIconStyle, buttonIconSize },
		} = props;

		// apiVersion 3: the wrapper element must carry the props returned by
		// useBlockProps, and className is no longer passed to edit() — the
		// generated block class and any custom classes come back in blockProps.
		//
		// This replaces a setAttributes({ buttonClassName: className }) call made
		// during render, which wrote to the store on every render pass. React
		// state must not be updated while rendering, and it is no longer needed
		// now that PHP reads the class from get_block_wrapper_attributes().
		//
		// The wrapper is a new element in the editor. The render callback has
		// always emitted an outer div around the button, and style.scss depends
		// on it: `main .wp-block-wb-blocks-print-button .wb-print-button` is a
		// descendant selector, so the generated block class has to sit on an
		// ancestor of the button rather than on the button itself. The editor
		// previously put it on the button, where that rule could never match.
		const blockProps = useBlockProps();

		const onChangeButtonText = newText => {
			const trimmedText = newText.trim();

			setAttributes({
				buttonText: trimmedText === "" ? "" : newText,
			});
		};

		const selectedIconUrl = iconRootDirectory + buttonIconStyle + iconPathSuffix;

		const mask = `url('${selectedIconUrl}')`;

		const chooseIconStyle = iconStyle => {
			setAttributes({
				buttonIconStyle: buttonIconStyle === iconStyle ? "materialicons" : iconStyle, //toggle
			});
		};

		const onChangeSize = value => {
			setAttributes({ buttonIconSize: value });
		};

		const onBlurButtonText = () => {
			if (buttonShowText && buttonText.trim() === "") {
				setAttributes({ buttonText: __("Print this page", "wb_blocks") });
			}
		};

		return (
			<Fragment>
				<InspectorControls group="settings">
					<PanelBody title={__("Print icon", "wb_blocks")} initialOpen={true}>
						<PanelRow>
							<ToggleControl
								label={__("Show text", "wb_blocks")}
								help={__("Remove button text", "wb_blocks")}
								checked={buttonShowText}
								onChange={value => {
									setAttributes({
										buttonShowText: value,
										buttonIconSize: value ? 1 : buttonIconSize,
										buttonText: value && buttonText.trim() === "" ? __("Print this page", "wb_blocks") : buttonText,
									});
								}}
							/>
						</PanelRow>

						<PanelRow>
							<ToggleControl
								label={__("Show icon", "wb_blocks")}
								help={
									!buttonShowText
										? __("Edit icon size in the Styles panel", "wb_blocks")
										: __("Remove icon", "wb_blocks")
								}
								checked={buttonShowIcon}
								onChange={value => {
									setAttributes({ buttonShowIcon: value });
								}}
							/>
						</PanelRow>

						{buttonShowIcon && buttonShowText && (
							<PanelRow>
								<RadioControl
									label={__("Icon position", "wb_blocks")}
									help={__("Position icon left or right of the button text", "wb_blocks")}
									selected={buttonIconPosition}
									options={[
										{ label: __("Left", "wb_blocks"), value: "left" },
										{ label: __("Right", "wb_blocks"), value: "right" },
									]}
									onChange={value => {
										setAttributes({ buttonIconPosition: value });
									}}
								></RadioControl>
							</PanelRow>
						)}

						{!buttonShowText && (
							<PanelRow>
								<TextControl
									label={__("Alt text", "wb_blocks")}
									help={__("Add button action description for screen readers", "wb_blocks", "wb_blocks")}
									value={buttonText}
									onChange={onChangeButtonText}
								></TextControl>
							</PanelRow>
						)}

						{buttonShowIcon && (
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(5, 1fr)",
									gap: "10px",
									marginTop: "16px",
								}}
							>
								{iconStyles.map(iconStyle => (
									<button
										key={iconStyle}
										type="button"
										onClick={event => {
											event.preventDefault();
											event.stopPropagation();
											chooseIconStyle(iconStyle);
										}}
										style={{
											outline: buttonIconStyle === iconStyle ? "8px solid #0ff" : "1px solid #ccc",
											filter: buttonIconStyle === iconStyle ? "invert(1)" : "none",
											padding: "10px",
											background: "white",
											cursor: "pointer",
											textAlign: "center",
										}}
									>
										<img
											src={`${iconRootDirectory}${iconStyle}${iconPathSuffix}`}
											width={24}
											height={24}
											alt={iconStyle}
											loading="lazy"
											style={{ display: "inline" }}
										/>
									</button>
								))}
							</div>
						)}
					</PanelBody>
				</InspectorControls>

				<InspectorControls group="styles">
					<PanelBody title={__("Print button styles", "wb_blocks")} initialOpen={true}>
						{!buttonShowText && buttonShowIcon ? (
							<RangeControl
								label={__("Adjust icon size", "wb_blocks")}
								value={buttonIconSize}
								onChange={onChangeSize}
								min={1}
								max={12}
								step={0.5}
							/>
						) : (
							<p>
								{__(
									"Style options are currently available only when displaying an icon-only print button.",
									"wb_blocks",
								)}
							</p>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<button
						className={`wb-print-button wp-element-button ${buttonShowIcon ? "wb-print-button--has-icon" : ""} ${
							buttonShowText ? "wb-print-button--has-text" : "wb-print-button--icon-only"
						} ${buttonShowText ? `wb-print-button--icon-${buttonIconPosition}` : ""}`}
						style={{
							"--icon": mask,
							"--icon-size": buttonShowText ? 1 : buttonIconSize,
						}}
					>
						{buttonShowText && (
							<span className="wb-print-button__text">
								<RichText
									tagName="span"
									value={buttonText}
									placeholder={__("Add button text", "wb_blocks")}
									keepPlaceholderOnFocus
									onChange={onChangeButtonText}
									onBlur={onBlurButtonText}
								/>
							</span>
						)}
					</button>
				</div>
			</Fragment>
		);
	},

	save: () => null,
});
