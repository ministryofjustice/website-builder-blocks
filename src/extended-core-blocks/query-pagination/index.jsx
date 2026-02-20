import { registerBlockStyle } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

/**
 * Register our custom block style.
 *
 * When this style is selected, we'll centre the pagination numbers on mobile,
 * even when pervious and/or next links are not present.
 */
registerBlockStyle("core/query-pagination", {
  name: "centred-on-mobile",
  label: __("Centred on mobile", "wb_blocks"),
});
