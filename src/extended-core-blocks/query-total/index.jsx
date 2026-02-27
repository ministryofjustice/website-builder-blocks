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

import QueryRangeFormatPicker from "./FormatPicker";

/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Displaying %1$s - %2$s of %3$s
 *   -> Displaying <b>%1$s</b> - <b>%2$s</b> of <b>%3$s</b>
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
    showWhenNoResults: { type: "boolean", default: false },
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
 * Custom TotalResults component for preview
 *
 * This is a minor change from the original block,
 * all we do here is wrap the number in b tags
 * if the bold-numbers style is active.
 */
const TotalResults = ({
  showWhenNoResults,
  isStyleBoldNumbers,
  setAttributes,
  children,
}) => {
  // Translate the phrase with the number, that's what WP does.
  let previewHtml = __("12 results found");

  if (isStyleBoldNumbers) {
    // Lets add b tags round the number.
    previewHtml = previewHtml.replace("12", "<b>12</b>");
  }

  return (
    <>
      <CustomBlockWrapper previewHtml={previewHtml}>
        {children}
      </CustomBlockWrapper>

      <InspectorControls>
        <PanelBody title={__("Settings")}>
          <PanelRow>
            <ToggleControl
              label={__("Show when no results", "wb_blocks")}
              help={__(
                "Display this block when a query returns no results",
                "wb_blocks",
              )}
              checked={showWhenNoResults}
              onChange={(showWhenNoResults) =>
                setAttributes({ showWhenNoResults })
              }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

/**
 * Custom RangeDisplay component
 *
 * This component:
 * 1. Lets us preview the changes to custom format or style
 * 2. Adds controls to the right side bar for the user to select from
 *    preset formats or a custom format.
 */
const RangeDisplay = ({
  showWhenNoResults,
  rangeFormatSingle,
  rangeFormatMulti,
  isStyleBoldNumbers,
  setAttributes,
  children,
}) => {
  // Generate the string for the editor canvas preview.
  // Fallback to core's default format strings if attribute from block is empty.
  const formatRange = rangeFormatMulti
    ? sanitizeHtml(rangeFormatMulti, ["b"])
    : "Displaying %1$s – %2$s of %3$s";
  // Translate the phrase, before number substitution.
  let previewTranslation = __(formatRange, "wb_blocks");

  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$s)/g, "<b>$1</b>");
  }

  // Substitute numbers into the string.
  const previewHtml = sprintf(previewTranslation, 1, 10, 12);

  return (
    <>
      <CustomBlockWrapper previewHtml={previewHtml}>
        {children}
      </CustomBlockWrapper>

      <InspectorControls>
        <PanelBody title={__("Settings")}>
          <PanelRow>
            <VStack spacing="10">
              <QueryRangeFormatPicker
                rangeFormatSingle={rangeFormatSingle}
                rangeFormatMulti={rangeFormatMulti}
                defaultFormatSingle="Displaying %1$s of %2$s"
                defaultFormatRange="Displaying %1$s – %2$s of %3$s"
                onChange={({ rangeFormatSingle, rangeFormatMulti }) =>
                  setAttributes({ rangeFormatSingle, rangeFormatMulti })
                }
              />
              <ToggleControl
                label={__("Show when no results", "wb_blocks")}
                help={__(
                  "Display this block when a query returns no results",
                  "wb_blocks",
                )}
                checked={showWhenNoResults}
                onChange={(showWhenNoResults) =>
                  setAttributes({ showWhenNoResults })
                }
              />
            </VStack>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

/**
 * Filter the Query Total block
 * - Call the custom component that wraps the original BlockEdit.
 * - Render a toggle in the block sidebar.
 */
const addFormatControl = (BlockEdit) => (props) => {
  if (props.name !== "core/query-total") {
    return <BlockEdit {...props} />;
  }

  // Infer from the className, should the numbers be bold.
  const isStyleBoldNumbers = props.attributes?.className
    ?.split(" ")
    .includes("is-style-bold-numbers");

  const showWhenNoResults = !!props.attributes?.showWhenNoResults;

  if (props.attributes.displayType === "total-results") {
    return (
      <TotalResults
        showWhenNoResults={showWhenNoResults}
        isStyleBoldNumbers={isStyleBoldNumbers}
        setAttributes={props.setAttributes}
      >
        <BlockEdit {...props} />
      </TotalResults>
    );
  }

  // We only want to customize the range-display type.
  if (props.attributes.displayType === "range-display") {
    return (
      <RangeDisplay
        showWhenNoResults={showWhenNoResults}
        isStyleBoldNumbers={isStyleBoldNumbers}
        rangeFormatSingle={props.attributes.rangeFormatSingle ?? null}
        rangeFormatMulti={props.attributes.rangeFormatMulti ?? null}
        setAttributes={props.setAttributes}
      >
        <BlockEdit {...props} />
      </RangeDisplay>
    );
  }

  // For some reason, the display type is not total-results or range-display, return BlockEdit, unmodified.
  return <BlockEdit {...props} />;
};

addFilter(
  "editor.BlockEdit",
  "wb_blocks/query-total-format-controls",
  addFormatControl,
);

/**
 * The block that is rendered in the editor canvas.
 *
 * A wrap around the original block that lets us show our own preview html,
 * without losing the original block's toolbar controls.
 *
 * This element is styled in editor.scss
 *
 * NOTE: This function is very similar to WbPreviewWrapper in
 * src/extended-core-blocks/query-pagination-numbers/index.jsx
 * If another extended core block needs this functionality, then consider:
 * - moving WbPreviewWrapper into it's own file
 * - using it as an abstraction that's compatible with all blocks
 */
const CustomBlockWrapper = ({ children, previewHtml }) => {
  // Wrapper element, set initial opacity to 0, to avoid FOUC - the user seeing the original block.
  return (
    <div className="wb-query-total__editor-wrap" style={{ opacity: 0 }}>
      {/* Keep original edit output mounted for the block toolbar; hide it visually */}
      {children}

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
