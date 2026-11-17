<?php

/**
 * Adds suitable alt text to the site logo block
 *
 * If the logo links to the homepage, the image alt text will be
 * replaced with the value of the logoAltText attribute, or a
 * fallback based on the site name.
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 *
 */

add_filter(
	"render_block_core/site-logo",
	function ($block_content, $block) {
		$alt = trim((string) ($block["attrs"]["logoAltText"] ?? "")) !== ""
			? $block["attrs"]["logoAltText"]
			: (!empty(get_bloginfo("name"))
				? get_bloginfo("name") . " – homepage"
				: "Homepage");

		$processor = new WP_HTML_Tag_Processor($block_content);

		// We use the presence of rel="home" in the <a> tag to confirm this logo links to the homepage.
		if (
			!$processor->next_tag("a") ||
			!in_array("home", preg_split("/\s+/", trim((string) $processor->get_attribute("rel"))), true)
		) {
			return $block_content;
		}

		if ($processor->next_tag("img")) {
			$processor->set_attribute("alt", $alt);
		}

		return $processor->get_updated_html();
	},
	10,
	2,
);
