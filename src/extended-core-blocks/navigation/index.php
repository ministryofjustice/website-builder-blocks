<?php

/**
 * Modify core Navigation block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */
function wb_extend_nav_block( $block_content, $block ) {

	$dom = new DOMDocument();
	$dom->loadHTML($block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
	
	$root = $dom->documentElement;
	
	$hasDetachedClass = in_array(
		'is-style-detached',
		explode(' ', $root->getAttribute('class'))
	);
	$hasDrawerClass = in_array(
		'is-style-drawer',
		explode(' ', $root->getAttribute('class'))
	);
	
	if ($hasDetachedClass) {

		$closeSVG = '<svg class="wb-close-icon" xmlns="http://www.w3.org/2000/svg" height="24px" aria-hidden="true" focusable="false" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg>';

		//Here we add the translated versions of open and close to be used by the JS when amending the button
		$root->setAttribute("data-open-text", __("Open menu"));
		$root->setAttribute("data-close-text", __("Close menu"));
		//Adds the button class to the nav control, so it uses button styling
		$block_content = $dom->saveHTML();
		
		$block_content = str_replace('aria-haspopup="dialog"','aria-expanded="false" aria-controls="main-menu-drawer"',$block_content);
		//TO DO - need to add the ID main-menu-drawer to the menu!!!
		$block_content = str_replace("wp-block-navigation__responsive-container-open","wp-element-button wp-block-navigation__responsive-container-open",$block_content);

		$block_content = str_replace("</svg>","</svg>$closeSVG",$block_content);
	}

	if ($hasDetachedClass || $hasDrawerClass) {
		// We need to add something to identify every drawer type element, so it can be closed when another is opened
	}
	return $block_content;
}

add_filter( 'render_block_core/navigation', 'wb_extend_nav_block', 10, 2 );

?>
