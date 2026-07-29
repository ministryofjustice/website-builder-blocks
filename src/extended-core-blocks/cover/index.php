<?php

/**
 * Modify core cover block
 *
 * @param string $block_content HTML output of the block.
 * @param array  $block         Block data array.
 * @return string Modified HTML.
 */

// We had found that screen readers sometimes read this out in an unhelpful way, whilst others hid it entirely.
// The decision was taken to always hide them so the experience is consistent and doesn't clutter the page with unhelpful noise.

add_filter( 'render_block', function( $block_content, $block ) {
	if ( 'core/cover' === $block['blockName'] ) {

	//	Add an ID to the video tag so we can reference it in aria-controls
		$video_id = 'cover-video-' . uniqid();
		$block_content = str_replace(
            '<video',
            '<video id="' . esc_attr( $video_id ) . '"',
            $block_content
        );
	//	Add in a button to control the video
		$pause_button_text = __("Pause video","wb_blocks");
		$play_button_text = __("Play video","wb_blocks");
		$poster_exists = "no";
		if (str_contains($block_content,"poster=")) {
			$poster_exists = "yes";
			$pause_button_text = __("Stop video","wb_blocks");

		}
		$block_content = str_replace(
			'</video>',
			"</video><button type='button' data-poster-exists='$poster_exists' data-pause-text='$pause_button_text' data-play-text='$play_button_text' class='wp-element-button video-pause-button absolute bottom-4 left-4 z-10' aria-controls='" . esc_attr( $video_id ) . "' >$pause_button_text</button>",
			$block_content
		);
	}

	return $block_content;
}, 10, 2 );
