<?php

/**
 * Modify core separator block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */

// The following filter aria-hides all separator blocks.
// We had found that screen readers sometimes read this out in an unhelpful way, whilst others hid it entirely.
// The decision was taken to always hide them so the experience is consistent and doesn't clutter the page with unhelpful noise.

add_filter( 'render_block', function( $block_content, $block ) {
	if ( 'core/separator' === $block['blockName'] ) {
		$block_content = str_replace(
			'<hr',
			'<hr aria-hidden="true"',
			$block_content
		);
	}

	return $block_content;
}, 10, 2 );
