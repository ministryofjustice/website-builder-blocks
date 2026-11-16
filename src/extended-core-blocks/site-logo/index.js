/**
 *  Extend core WP Site Logo block
 *  https://wordpress.org/documentation/article/site-logo-block/
 *
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";

/**
 * Add attribute.
 */
addFilter("blocks.registerBlockType", "govwind/site-logo-alt-text", (settings, name) => {
	if (name !== "core/site-logo") {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			logoAltText: {
				type: "string",
			},
		},
	};
});

const withLogoAltText = createHigherOrderComponent(BlockEdit => {
	return props => {
		if (props.name !== "core/site-logo") {
			return <BlockEdit {...props} />;
		}

		const siteTitle = useSelect(select => select("core").getSite()?.title, []);
		const defaultAlt = siteTitle ? `${siteTitle} – homepage` : "Homepage";

		const { logoAltText } = props.attributes;


		return (
			<>
				<BlockEdit {...props} />

				<InspectorControls group="settings">
					<PanelBody title={__("Accessibility", "wb_blocks")}>
						<TextControl
							label={__("Homepage link alt text", "wb_blocks")}
							help={__("Used when the logo links to the homepage.", "wb_blocks")}
							value={logoAltText ?? defaultAlt}
							onChange={value =>
								props.setAttributes({
									logoAltText: value,
								})
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, "withLogoAltText");

addFilter("editor.BlockEdit", "wb_blocks/site-logo-alt-text", withLogoAltText);
