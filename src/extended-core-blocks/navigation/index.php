<?php

/**
 * Modify core Navigation block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */
function wb_extend_nav_block( $block_content, $block ) {

	if (empty($block['attrs']['className'])) {
		return $block_content;
	}

	$block_class_array = explode(" ", $block['attrs']['className']);

	if (in_array("is-style-drawer",$block_class_array)) {
		/**
		 * Here we override WP functionality which aren't designed for these navigation styles
		 */
		$block['attrs']['openSubmenusOnClick'] = true; // these only work if click to open is enabled.
		$block['attrs']['overlayMenu'] = "never"; // these only work if they are NOT opened by a button.
	}

	if(in_array("is-style-detached",$block_class_array)) {
		$dom = new DOMDocument();
		$dom->loadHTML($block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

		$root = $dom->documentElement;
		$xpath = new DOMXPath( $dom );

		//Here we add the translated versions of open and close to be used by the JS when amending the button
		$root->setAttribute("data-open-text", __("Open menu"));
		$root->setAttribute("data-close-text", __("Close menu"));

		//Add the button class to the menu control which appears in the header
		//Target: button.wp-block-navigation__responsive-container-open
		$button = $xpath->query(
			'./button[contains(concat(" ", normalize-space(@class), " "), "wp-block-navigation__responsive-container-open")]',
			$root
		)[0];

		//Gets the ID of the menu container
		//Target: div.wp-block-navigation__responsive-container
		$menu_container = $xpath->query(
			'./div[contains(concat(" ", normalize-space(@class), " "), "wp-block-navigation__responsive-container")]',
			$root
		)[0];

		$menu_popup_id = $menu_container->getAttribute('id');
		$button->setAttribute('aria-expanded', 'false'); //default state is not expanded
		$button->setAttribute('aria-controls', $menu_popup_id);
		$button->removeAttribute('aria-haspopup'); //it is no longer a modal window
		wb_add_class($button,"wp-element-button"); //button styling

		//Add the close SVG
		$svg = $dom->createElementNS('http://www.w3.org/2000/svg', 'svg');
		$svg->setAttribute('class', 'wb-close-icon');
		$svg->setAttribute('width', '24');
		$svg->setAttribute('height', '24');
		$svg->setAttribute('aria-hidden', 'true'); //string
		$svg->setAttribute('focusable', 'false'); //string
		$svg->setAttribute('viewBox', '0 0 24 24');
		$svg->setAttribute('stroke', 'currentColor');

		$line1 = $dom->createElementNS('http://www.w3.org/2000/svg', 'line');
		$line2 = $dom->createElementNS('http://www.w3.org/2000/svg', 'line');
		$line1->setAttribute('x1', '4');
		$line1->setAttribute('y1', '4');
		$line1->setAttribute('x2', '20');
		$line1->setAttribute('y2', '20');
		$line1->setAttribute('stroke-width', '4');
		$line2->setAttribute('x1', '20');
		$line2->setAttribute('y1', '4');
		$line2->setAttribute('x2', '4');
		$line2->setAttribute('y2', '20');
		$line2->setAttribute('stroke-width', '4');

		$svg->appendChild($line1);
		$svg->appendChild($line2);
		$button->appendChild($svg);

		$block_content = $dom->saveHTML();

		/**
		 * Here we override WP functionality which aren't designed for these navigation styles
		 */
		$block['attrs']['openSubmenusOnClick'] = true; // these only work if click to open is enabled.
		$block['attrs']['overlayMenu'] = "always"; // these only work if they are opened by a button.
	}
	// We need to add something to identify every drawer type element, so it can be closed when another is opened
	return $block_content;
}

add_filter( 'render_block_core/navigation', 'wb_extend_nav_block', 10, 2 );

function wb_add_class( DOMElement $el, string $class ): void {
    $existing = $el->getAttribute( 'class' );

    $classes = array_filter( explode( ' ', $existing ) );

    if ( ! in_array( $class, $classes, true ) ) {
        $classes[] = $class;
        $el->setAttribute( 'class', implode( ' ', $classes ) );
    }
}
?>
