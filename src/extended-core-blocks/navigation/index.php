<?php

/**
 * Modify core Navigation block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */

 // Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

function wb_extend_nav_block( $block_content, $block ) {

	if (empty($block['attrs']['className'])) {
		return $block_content;
	}

	$block_class_array = explode(" ", $block['attrs']['className']);

	if(in_array("is-style-detached",$block_class_array)) {

		$dom = new DOMDocument();
		// block_content will be in HTML5, DOMDocument defaults to XML rules and isn’t HTML5-aware.
		// so we handle the erros to prevent them from appearing anywhere.
		libxml_use_internal_errors(true);
		$dom->loadHTML($block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		libxml_clear_errors();

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

		$fragment = $dom->createDocumentFragment();
		$closeSVG = '<svg xmlns="http://www.w3.org/2000/svg" class="wb-close-icon" width="24" height="24" aria-hidden="true" focusable="false" viewBox="0 0 24 24" stroke="currentColor"><line x1="4" y1="4" x2="20" y2="20" stroke-width="4"></line><line x1="20" y1="4" x2="4" y2="20" stroke-width="4"></line></svg>';
		$fragment->appendXML($closeSVG);

		$button->appendChild($fragment);

		$block_content = $dom->saveHTML();
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
