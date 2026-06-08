<?php
/**
 * Reveal block
 * Frontend PHP render callback + block registration via block.json
 *
 * @package wb_blocks
 * @link https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/
 */

function wb_blocks_render_callback_reveal_block( $attributes, $content ) {
	// className is saved automatically by WP.
	$class_name   = esc_attr( $attributes['className'] ?? '' );
	$reveal_title = esc_html( $attributes['revealTitle'] ?? '' );

	ob_start();
	?>
	<div class="wb-blocks-reveal <?php echo $class_name; ?>">
		<details class="wb-details">
			<summary class="wb-details__summary">
				<?php
				/*
				 * Using <a> without href so link colour is applied
				 * without adding link behaviour.
				 */
				?>
				<a class="wb-details__summary-text">
					<?php echo $reveal_title; ?>
				</a>
			</summary>
			<div class="wb-details__text py-2 [&_p:first-child]:mt-0!">
				<?php echo $content; // Inner block HTML, already escaped by WP. ?>
			</div>
		</details>
	</div>
	<?php
	return ob_get_clean();
}

register_block_type(
	__DIR__ . '/block.json',
	[
		'render_callback' => 'wb_blocks_render_callback_reveal_block',
	]
);
