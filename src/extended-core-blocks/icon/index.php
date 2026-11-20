<?php

/**
 * Modify core icon block
 * This hooks into and modifies the frontend of core icon block
 * It loops round the icons we have in the assets directory and adds them to the block
 */

add_action("init", function () {
	if (!function_exists("wp_register_icon_collection")) {
		return;
	}

	$variants = [
		["materialicons", ""],
		["materialiconsoutlined", " (outline)"],
		["materialiconsround", " (rounded)"],
		["materialiconssharp", " (sharp)"],
		["materialiconstwotone", " (two-tone)"],
	];

	$level = plugin_dir_path(dirname(dirname(dirname(__FILE__))));
	$icon_root = $level . "assets/icons";

	foreach (glob($icon_root . "/*", GLOB_ONLYDIR) as $category_dir) {
		$cat = sanitize_title(basename($category_dir));
		$collection = "wb_blocks_{$cat}";

		wp_register_icon_collection($collection, [
			"label" => __("Google Icons ($cat)", "wb_blocks"),
		]);

		foreach (glob($category_dir . "/*", GLOB_ONLYDIR) as $icon_dir) {
			$icon_name = basename($icon_dir);

			foreach ($variants as $variant) {
				$svg = "$icon_dir/{$variant[0]}/24px.svg";

				if (!file_exists($svg)) {
					continue;
				}

				$name = $icon_name . $variant[1];
				$slug = $icon_name."_" . $variant[0];

				$result = wp_register_icon("{$collection}/{$slug}", [
					"label" => $name,
					"file_path" => $svg,
				]);

				if ( is_wp_error( $result ) ) {
					error_log( $result->get_error_message() );
				}
			}
		}
	}
});
