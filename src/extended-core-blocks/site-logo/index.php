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
		$alt = !empty($block["attrs"]["logoAltText"])
			? $block["attrs"]["logoAltText"]
			: (!empty(get_bloginfo("name"))
				? get_bloginfo("name") . " – homepage"
				: "Homepage");

		// We use the presence of rel="home" to confirm this logo links to the homepage.
		if (!str_contains($block_content, 'rel="home"')) {
			return $block_content;
		}

		$processor = new WP_HTML_Tag_Processor($block_content);

		if ($processor->next_tag("img")) {
			$processor->set_attribute("alt", $alt);
		}

		return $processor->get_updated_html();
	},
	10,
	2,
);
