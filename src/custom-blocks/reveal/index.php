<?php

/**
 * Reveal block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * @package wb_blocks
 *
 */

function wb_blocks_render_callback_reveal_block($attributes, $content)
{
	// Parse attributes found in block.json
	$attribute_reveal_revealTitle = $attributes["revealTitle"] ?? "";

	// apiVersion 3 pairs useBlockProps in the editor with
	// get_block_wrapper_attributes() here, so the two produce the same wrapper.
	//
	// The legacy revealClassName attribute is deliberately not read: custom
	// classes have always been saved separately in `className`, which this
	// function picks up on its own, so nothing is lost for reveals saved before
	// the apiVersion 3 upgrade.
	//
	// Note the function returns a complete class="..." pair, so the wb-blocks-reveal
	// class is passed in rather than written into the tag alongside it —
	// otherwise the element would carry two class attributes and the browser
	// would keep only the first.
	$reveal_wrapper_attributes = get_block_wrapper_attributes([
		"class" => "wb-blocks-reveal",
	]);

	// Turn on buffering so we can collect all the html markup below and load it via the return
	// This is an alternative method to using sprintf(). By using buffering you can write your
	// code below as you would in any other PHP file rather then having to use the sprintf() syntax
	ob_start();
	?>

    <div <?= $reveal_wrapper_attributes ?>>
        <details class="wb-details">
            <summary class="wb-details__summary">
                <?php /**
                     * We are using an anchor tag <a> without an href
                     * So link colouring is picked up without link behaviour
                     */
	?>
                <a class="wb-details__summary-text">
                    <?= esc_html($attribute_reveal_revealTitle) ?>
                </a>
            </summary>
            <div class="wb-details__text py-2 [&_p:first-child]:mt-0!">
                <?= wp_kses_post($content) ?>
            </div>
        </details>
    </div>

    <?php
    // Get all the html/content that has been captured in the buffer and output via return
    $output = ob_get_contents();

    ob_end_clean();

    return $output;
}
