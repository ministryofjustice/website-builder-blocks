/**
 * HMG logo SVG
 *
 * Block metadata — name, title, category, keywords, attributes — lives in
 * block.json and is registered server-side from website-builder-blocks.php.
 * This file only supplies the editor behaviour.
 *
 * The xclassName attribute in block.json is legacy: it was registered
 * server-side but never read or written by either the editor or the render
 * callback. It stays registered only so it isn't stripped from any content that
 * happens to carry it.
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
// "@wordpress/block-editor", not "@wordpress/blockEditor". The camelCase form
// has no matching package on disk; webpack's dependency-extraction plugin was
// externalising it to window.wp.blockEditor by coincidence of its own
// camelCase-to-kebab handle conversion, so it happened to work at runtime while
// being unresolvable to anything that actually reads the import path.
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { SelectControl, PanelBody, PanelRow } from "@wordpress/components";
import { Fragment, RawHTML } from "@wordpress/element";
import crest from "./svg/crest.svg";
import govuk from "./svg/govuk.svg";
import ogl from "./svg/ogl.svg";
import crown from "./svg/crown.svg";

import metadata from "./block.json";

registerBlockType(metadata.name, {
	// The SVG icon stays here rather than in block.json, which can only carry a
	// Dashicon name or a serialisable object.
	icon: (
		<svg
			focusable="false"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 60"
			height="30"
			width="32"
			fill="currentcolor"
			aria-label="GOV.UK"
		>
			<title>GOV.UK</title>
			<g>
				<circle cx="20" cy="17.6" r="3.7"></circle>
				<circle cx="10.2" cy="23.5" r="3.7"></circle>
				<circle cx="3.7" cy="33.2" r="3.7"></circle>
				<circle cx="31.7" cy="30.6" r="3.7"></circle>
				<circle cx="43.3" cy="17.6" r="3.7"></circle>
				<circle cx="53.2" cy="23.5" r="3.7"></circle>
				<circle cx="59.7" cy="33.2" r="3.7"></circle>
				<circle cx="31.7" cy="30.6" r="3.7"></circle>
				<path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
			</g>
		</svg>
	),
	edit: props => {
		const {
			setAttributes,
			attributes: { logo },
		} = props;

		// Grab newLogo, set the value of logo to newLogo.
		const onChangeLogo = newLogo => {
			setAttributes({ logo: newLogo });
		};
		const logoOptions = [
			{ label: "Government coat-of-arms", value: "crest" },
			{ label: "Crown", value: "crown" },
			{ label: "GOV.UK logo", value: "govuk" },
			{ label: "Open Government Licence Logo", value: "ogl" },
		];

		// apiVersion 3: the visible wrapper must carry the props returned by
		// useBlockProps, and className is no longer passed to edit() — the
		// generated block class and any custom classes come back in blockProps.
		//
		// The logo name is still appended as a class, matching what this block
		// rendered in the editor before. Note the render callback does not emit
		// it, so editor and frontend markup differ here; that predates the
		// apiVersion 3 work and is left alone rather than resolved silently in
		// either direction.
		const blockProps = useBlockProps({
			className: `wb-hmg-svg ${logo}`,
		});

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__("Government identity", "wb_block")} initialOpen={true}>
						<PanelRow>
							<SelectControl
								label={__("Identity mark", "wb_block")}
								help=""
								value={logo}
								options={logoOptions}
								onChange={onChangeLogo}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<RawHTML>
						{logo == "crest"
							? decodeBase64Svg(crest)
							: logo == "crown"
								? decodeBase64Svg(crown)
								: logo == "govuk"
									? decodeBase64Svg(govuk)
									: logo == "ogl"
										? decodeBase64Svg(ogl)
										: ""}
					</RawHTML>
				</div>
			</Fragment>
		);
	},

	// return null as frontend output is done via PHP
	save: () => null,
});

function decodeBase64Svg(base64) {
	// Remove data URL prefix if present
	const clean = base64.replace(/^data:image\/svg\+xml;base64,/, "").replace(/\s/g, "");

	// Decode Base64 → UTF-8
	return decodeURIComponent(Array.from(atob(clean), c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
}
