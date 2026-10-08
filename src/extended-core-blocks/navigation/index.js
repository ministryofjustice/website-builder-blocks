/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockVariation } from "@wordpress/blocks";
const { createHigherOrderComponent } = wp.compose;
const { useEffect } = wp.element;
import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from "@wordpress/components";
import { arrowRight, arrowDown } from "@wordpress/icons";

registerBlockVariation("core/navigation", {
	// This is the out-of-the-box WordPress style, no special stuff
	name: "original-navigation",
	title: "WordPress navigation",
	description: "Navigation used as default by WordPress",
	attributes: {
		className: "is-style-wordpress",
	},
	scope: ["transform"],
	isActive: blockAttributes =>
		!blockAttributes?.className?.includes("is-style-drawer") &&
		!blockAttributes?.className?.includes("is-style-detached"),
});
registerBlockVariation("core/navigation", {
	name: "drawer-navigation",
	title: "Drawer navigation",
	description: "Navigation where the submenu opens in a drawer",
	attributes: {
		submenuVisibility: "click",
		overlayMenu: "never",
		className: "is-style-drawer",
		layout: {
			type: "flex",
			orientation: "horizontal",
		},
	},
	scope: ["transform"],
	isActive: blockAttributes => blockAttributes?.className?.includes("is-style-drawer"),
});
registerBlockVariation("core/navigation", {
	name: "detached-navigation",
	title: "Detached navigation",
	description: "Navigation opened and closed by a button",
	attributes: {
		submenuVisibility: "click",
		overlayMenu: "always",
		className: "is-style-detached",
	},
	scope: ["transform"],
	isActive: blockAttributes => blockAttributes?.className?.includes("is-style-detached"),
});

const addNavigationAttributes = (settings, name) => {
	if (name !== "core/navigation") {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			submenuOrientation: {
				type: "string",
				default: "vertical",
			},
		},
	};
};

wp.hooks.addFilter("blocks.registerBlockType", "wb-blocks/navigation-attributes", addNavigationAttributes);

/**
 * The following functions deal with the navigation settings which are incompatible with the new styles
 * overlayMenu must be "never" for drawer, and "always" for detached
 * openSubmenusOnClick must be TRUE for both
 */
const enhanceNavigationBlockEdit = createHigherOrderComponent(BlockEdit => {
	return props => {
		if (props.name !== "core/navigation") {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const { className, overlayMenu, submenuVisibility, layout, submenuOrientation } = attributes;

		const hasDrawerStyle = className?.includes("is-style-drawer");
		const hasDetachedStyle = className?.includes("is-style-detached");

		useEffect(() => {
			// Upon selecting either of these styles, the relevant options are selected
			if (hasDrawerStyle) {
				setAttributes({
					submenuVisibility: "click",
					overlayMenu: "never",
					layout: {
						...layout,
						orientation: "horizontal",
					},
				});
			}

			if (hasDetachedStyle) {
				setAttributes({
					submenuVisibility: "click",
					overlayMenu: "always",
				});
			}
		}, [hasDrawerStyle, hasDetachedStyle]);

		useEffect(() => {
			if (!hasDrawerStyle && !hasDetachedStyle) {
				return;
			}
			//Upon changing the submenu behaviour once one of the styles has been selected
			if (submenuVisibility != "click") {
				// Revert toggle
				setAttributes({ submenuVisibility: "click" });
			}
			//Upon changing the orientation - ensure horizontal (might be undefined, so search for vertical)
			if (hasDrawerStyle && layout?.orientation !== "horizontal") {
				setAttributes({
					layout: {
						...layout,
						orientation: "horizontal",
					},
				});
			}

			//Upon changing the overlay
			if (hasDrawerStyle && overlayMenu != "never") {
				setAttributes({ overlayMenu: "never" });
			}
			if (hasDetachedStyle && overlayMenu != "always") {
				setAttributes({ overlayMenu: "always" });
			}
		}, [overlayMenu, submenuVisibility, layout]);

		// Add a class when the submenu orientation is changed
		useEffect(() => {
			if (!hasDrawerStyle && !hasDetachedStyle) {
				return;
			}
			const orientation = submenuOrientation === "horizontal" ? "horizontal" : "vertical";
			const orientationClass = `has-submenu-orientation-${orientation}`;

			const classes = (className ?? "")
				.split(/\s+/)
				.filter(Boolean)
				.filter(value => !value.startsWith("has-submenu-orientation-"));

			const refinedClassName = [...classes, orientationClass].join(" ");

			if (refinedClassName !== className) {
				setAttributes({
					className: refinedClassName,
				});
			}
		}, [submenuOrientation]);

		if (!hasDrawerStyle && !hasDetachedStyle) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<InspectorControls>
					<PanelBody title="Submenu layout">
						<ToggleGroupControl
							label="Orientation"
							value={submenuOrientation ?? "vertical"}
							onChange={value => {
								const orientation = ["horizontal", "vertical"].includes(value) ? value : "vertical";
								setAttributes({
									submenuOrientation: orientation,
								});
							}}
						>
							<ToggleGroupControlOptionIcon
								value="horizontal"
								label="Horizontal"
								aria-label="Horizontal"
								icon={arrowRight}
							/>

							<ToggleGroupControlOptionIcon value="vertical" label="Vertical" aria-label="Vertical" icon={arrowDown} />
						</ToggleGroupControl>
					</PanelBody>
				</InspectorControls>
				<BlockEdit {...props} />
			</>
		);
	};
}, "enhanceNavigationBlockEdit");

wp.hooks.addFilter("editor.BlockEdit", "website-builder-blocks/sync-toggle", enhanceNavigationBlockEdit);
