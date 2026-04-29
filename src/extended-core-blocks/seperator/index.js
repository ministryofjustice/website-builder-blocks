wp.hooks.addFilter(
	'blocks.registerBlockType',
	'wb-blocks/separator-side-margin',
	function (settings, name) {
		if (name !== 'core/separator') return settings; // target block

		return {
			...settings,
			supports: {
				...settings.supports,
				spacing: {
					...settings.supports?.spacing,
					margin: ['left', 'right','top', 'bottom'], // enable left/right as well
				},
			},
		};
	}
);
