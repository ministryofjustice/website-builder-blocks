import { registerBlockStyle } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

/**
 * Register our custom block style.
 */
registerBlockStyle("core/list", {
  name: "horizontal",
  label: __("Horizontal", "wb_blocks"),
});
