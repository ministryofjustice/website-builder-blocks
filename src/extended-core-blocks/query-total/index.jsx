import { InspectorControls } from "@wordpress/block-editor";
import { registerBlockStyle } from "@wordpress/blocks";
import { PanelBody, PanelRow } from "@wordpress/components";
import { RawHTML } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";

import QueryRangeFormatPicker from "./FormatPicker";


/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Displaying %1$s – %2$s of %3$s
 *   -> Displaying <b>%1$s</b> – <b>%2$s</b> of <b>%3$s</b>
 */
registerBlockStyle("core/query-total", {
  name: "bold-numbers",
  label: __("Bold numbers", "wb_blocks"),
});


/**
 * Extend core/query-total with the attribute
 *
 * - rangeFormatSingle (string): The format for the page range
 *   when there is a single entry e.g. "Displaying %1$s of %2$s"
 * - rangeFormatMulti  (string): The format for the page range
 *   when there are multiple results e.g. "Displaying %1$s – %2$s of %3$s"
 */
const addAttributes = (settings, name) => {
  if (name !== "core/query-total") {
    return settings;
  }

  settings.attributes = {
    ...settings.attributes,
    rangeFormatSingle: { type: "string", default: null },
    rangeFormatMulti: { type: "string", default: null },
  };

  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "wb_blocks/query-total-extend-attributes",
  addAttributes,
);

/**
 * Filter the Query Total block
 * - Call the custom component that wraps the original BlockEdit.
 * - Render a toggle in the block sidebar.
 */
const addFormatControl = (BlockEdit) => (props) => {
  if (props.name !== "core/query-total") {
    return <BlockEdit {...props} />;
  }

  // We only want to customize the range-display type.
  if (props.attributes.displayType !== "range-display") {
    // Return early if other display type.
    return <BlockEdit {...props} />;
  }

  const {
    attributes: {
      rangeFormatSingle = null,
      rangeFormatMulti = null,
      className: blockClassName,
    },
    setAttributes,
  } = props;

  // Generate the string for the editor canvas preview.
  // Fallback to core's default format strings if attribute from block is empty.
  const formatRange = rangeFormatMulti
    ? sanitizeHtml(rangeFormatMulti, ["b"])
    : "Displaying %1$s – %2$s of %3$s";
  // Translate the phrase, before number substitution.
  let previewTranslation = __(formatRange, "wb_blocks");
  // Infer frm the className, should the numbers be bold.
  const isStyleBoldNumbers = blockClassName
    ?.split(" ")
    .includes("is-style-bold-numbers");
  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$s)/g, "<b>$1</b>");
  }
  // Substitute numbers into the string.
  const previewHtml = sprintf(previewTranslation, 1, 10, 12);

  return (
    <>
      <CustomBlockWrapper previewHtml={previewHtml}>
        <BlockEdit {...props} />
      </CustomBlockWrapper>

      <InspectorControls>
        <PanelBody title={__("Settings")}>
          <PanelRow>
            <QueryRangeFormatPicker
              rangeFormatSingle={rangeFormatSingle}
              rangeFormatMulti={rangeFormatMulti}
              defaultFormatSingle="Displaying %1$s of %2$s"
              defaultFormatRange="Displaying %1$s – %2$s of %3$s"
              onChange={({ rangeFormatSingle, rangeFormatMulti }) =>
                setAttributes({ rangeFormatSingle, rangeFormatMulti })
              }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

addFilter(
  "editor.BlockEdit",
  "wb_blocks/query-total-prefix-controls",
  addFormatControl,
);

/**
 * The block that is rendered in the editor canvas.
 *
 * A wrap around the original block that lets us show our own preview html,
 * without losing the original block's toolbar controls.
 *
 * This element is styled in editor.scss
 */
const CustomBlockWrapper = ({ children, previewHtml }) => {
  // Wrapper element, set initial opacity to 0, to avoid FOUC - the user seeing the original block.
  return (
    <div className="wb-query-total__editor-wrap" style={{ opacity: 0 }}>
      {/* Keep original edit output mounted for the block toolbar; hide it visually */}
      <div className="wb-query-total__orig" aria-hidden="true">
        {children}
      </div>

      {/* Custom client-rendered preview, overlayed */}
      <RawHTML
        className="wb-query-total__preview"
        // Properties from the original block
        aria-label="Block: Query Total"
        role="document"
      >
        {previewHtml}
      </RawHTML>
    </div>
  );
};

/**
 * Sanitize user input - for the preview of custom format option
 *
 * @param {string} input Unsanitized input
 * @param {string[]} allowedTags An array of allowed tags
 * @returns {string|null} The sanitized value
 */
const sanitizeHtml = (input, allowedTags = []) => {
  if (typeof input !== "string" && !input instanceof String) {
    return null;
  }

  // Normalize allowed tags to lowercase for easy comparison
  const allowed = new Set(
    Array.isArray(allowedTags)
      ? allowedTags.map((t) => t.toLowerCase())
      : [allowedTags.toLowerCase()],
  );

  const doc = new DOMParser().parseFromString(input, "text/html");

  function clean(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();

        if (!allowed.has(tag)) {
          // Replace the disallowed element with its text content
          const text = document.createTextNode(child.textContent);
          child.replaceWith(text);
        } else {
          // Recurse into allowed elements to clean their children
          clean(child);
        }
      }
    });
  }

  clean(doc.body);
  return doc.body.innerHTML;
};
