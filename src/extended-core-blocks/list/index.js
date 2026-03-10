import { InspectorControls } from "@wordpress/block-editor";
import { registerBlockStyle } from "@wordpress/blocks";
import {
  PanelBody,
  PanelRow,
  ToggleControl,
  __experimentalVStack as VStack,
} from "@wordpress/components";
import { RawHTML } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Register our custom block style.
 */
registerBlockStyle("core/list", {
  name: "horizontal",
  label: __("Horizontal", "wb_blocks"),
});
