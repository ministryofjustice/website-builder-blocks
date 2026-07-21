<?php
/**
 * Allowed third-party embed block
 * Frontend PHP code
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 */


/**
 * Phase 1: render simple html without validation
 * Phase 2: Validate provider
 * Phase 3: Validate provider
 * Phase 4: Return only provider user and validated code
 */
function wb_blocks_render_callback_allowed_third_party_embed( $attributes ) {
	$attribute_embed_code = $attributes['embedCode'] ?? '';

	if ( empty( $attribute_embed_code ) ) {
		return '';
	}

	return $attribute_embed_code;
}