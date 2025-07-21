<?php
// Server-side render callback for block-one

function myplugin_render_block_one( $attributes, $content ) {
    ob_start();
    ?>
    <div class="block-one">
        <p>Hello from Block One (PHP rendered)</p>
    </div>
    <?php
    return ob_get_clean();
}

echo myplugin_render_block_one( $attributes, $content );