/**
 *  Extend core WP navigation block
 *  https://wordpress.org/documentation/article/navigation-block/
 *
 */
import { registerBlockVariation } from '@wordpress/blocks';
const { createHigherOrderComponent } = wp.compose;
const { useEffect } = wp.element;

registerBlockVariation('core/navigation', {
	// This is the out-of-the-box WordPress style, no special stuff
	name: 'original-navigation',
	title: 'WordPress navigation',
	description: 'Navigation used as default by WordPress',
	attributes: {
		className: 'is-style-wordpress'
	},
	scope: ['transform'],
	isActive: (blockAttributes) =>
	(!blockAttributes?.className?.includes('is-style-drawer') && !blockAttributes?.className?.includes('is-style-detached')),
});
registerBlockVariation('core/navigation', {
	name: 'drawer-navigation',
	title: 'Drawer navigation',
	description: 'Navigation where the submenu opens in a drawer',
	attributes: {
		openSubmenusOnClick: true,
		overlayMenu: 'never',
		className: 'is-style-drawer'
	},
	scope: ['transform'],
	isActive: (blockAttributes) =>
		blockAttributes?.className?.includes('is-style-drawer'),
});
registerBlockVariation('core/navigation', {
	name: 'detached-navigation',
	title: 'Detached navigation',
	description: 'Navigation opened and closed by a button',
	attributes: {
		openSubmenusOnClick: true,
		overlayMenu: 'always',
		className: 'is-style-detached'
	},
	scope: ['transform'],
	isActive: (blockAttributes) =>
		blockAttributes?.className?.includes('is-style-detached'),
});

/**
 * The following functions deal with the navigation settings which are incompatible with the new styles
 * overlayMenu must be "never" for drawer, and "always" for detached
 * openSubmenusOnClick must be TRUE for both
 */
const syncOptionsWithClass = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/navigation') {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const { className, overlayMenu, openSubmenusOnClick } = attributes;

		const hasDrawerStyle = className?.includes('is-style-drawer');
		const hasDetachedStyle = className?.includes('is-style-detached');
		useEffect(() => {
			// Upon selecting either of these styles, the relevant options are selected
			if (hasDrawerStyle) {
				setAttributes({ openSubmenusOnClick: true });
				setAttributes({ overlayMenu: "never" });
			}

			if (hasDetachedStyle) {
				setAttributes({ openSubmenusOnClick: true });
				setAttributes({ overlayMenu: "always" });
			}
		}, [hasDrawerStyle,hasDetachedStyle]);

		useEffect(() => {
			//Upon changing the submenu behaviour once one of the styles has been selected
			if (!openSubmenusOnClick && (hasDrawerStyle || hasDetachedStyle)) {
				// Revert toggle
				setAttributes({ openSubmenusOnClick: true });
			}

			//Upon changing the overlay
			if (hasDrawerStyle && overlayMenu != "never") {
				setAttributes({ overlayMenu: "never" });
			}
			if (hasDetachedStyle && overlayMenu != "always") {
				setAttributes({ overlayMenu: "always" });
			}

		}, [overlayMenu, openSubmenusOnClick]);

		return <BlockEdit {...props} />;
	};
}, 'syncOptionsWithClass');

wp.hooks.addFilter(
	'editor.BlockEdit',
	'website-builder-blocks/sync-toggle',
	syncOptionsWithClass
);
