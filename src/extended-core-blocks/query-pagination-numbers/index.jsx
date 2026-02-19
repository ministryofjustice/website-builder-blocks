import { registerBlockStyle, registerBlockVariation } from "@wordpress/blocks";
import { RawHTML } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Page %1$d of %2$d
 *   -> Page <b>%1$d</b> of <b>%2$d</b>
 */
registerBlockStyle("core/query-pagination-numbers", {
  name: "bold-numbers",
  label: __("Bold numbers", "wb_blocks"),
});

/**
 * Extend core/query-total with the attribute displayType
 *
 * displayType (string)
 * - 'page-links' is the default & original display type
 *   where there are numbers for each page, and they are links.
 * - 'current-of-total' is a custom display type
 *   where the phrase 'Page X of Y' is shown, without any links.
 */
const addAttributes = (settings, name) => {
  if (name !== "core/query-pagination-numbers") {
    return settings;
  }

  settings.attributes = {
    ...settings.attributes,
    displayType: { type: "string", default: "page-links" },
  };

  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "wb_blocks/query-total-extend-attributes",
  addAttributes,
);

/**
 * Register block variations
 *
 * Since we don't have any variations, create a default one too.
 */
registerBlockVariation("core/query-pagination-numbers", {
  name: "page-links-query-pagination-numbers",
  title: "WordPress page numbers",
  description: "Default WordPress page numbers",
  attributes: { displayType: "page-links" },
  scope: ["transform"],
  isDefault: true,
  isActive: (blockAttributes) =>
    blockAttributes?.displayType !== "current-of-total",
});

registerBlockVariation("core/query-pagination-numbers", {
  name: "current-of-total-query-pagination-numbers",
  title: "Simple page numbers",
  description: "Page numbers in the format of: Page x of y",
  attributes: { displayType: "current-of-total" },
  scope: ["transform"],
  isActive: (blockAttributes) =>
    blockAttributes?.displayType === "current-of-total",
});

const changeMe = (BlockEdit) => (props) => {
  if (props.name !== "core/query-pagination-numbers") {
    return <BlockEdit {...props} />;
  }

  const attributes = props.attributes || {};

  // Check the display type
  if (attributes.displayType !== "current-of-total") {
    // Do nothing if it is set to anything other than current-of-total
    return <BlockEdit {...props} />;
  }

  // Here, the displayType is set to current-of-total

  // Infer from the className, should the numbers be bold?
  const classArray = attributes?.className?.split(" ") ?? [];
  const isStyleBoldNumbers = classArray.includes("is-style-bold-numbers");

  // Start to build the string for the preview.
  let previewTranslation = __("Page %1$d of %2$d");

  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$d)/g, "<b>$1</b>");
  }

  return (
    <WbPreviewWrapper
      blockName={props.name}
      label="Block: Simple page numbers"
      previewHtml={sprintf(previewTranslation, 1, 2)}
    >
      <BlockEdit {...props} ariaHidden={true} />
    </WbPreviewWrapper>
  );
};

addFilter(
  "editor.BlockEdit",
  "website-builder-blocks/query-pagination-numbers",
  changeMe,
);

/**
 * The block that is rendered in the editor canvas.
 *
 * A wrap around the original block that lets us show our own preview html,
 * without losing the original block's toolbar controls.
 *
 * This element is styled in editor.scss
 *
 * NOTE: This function is very similar to CustomBlockWrapper in
 * src/extended-core-blocks/query-total/index.jsx
 * If another extended core block needs this functionality, then consider:
 * - moving WbPreviewWrapper into it's own file
 * - using it as an abstraction that's compatible with all blocks
 */
export const WbPreviewWrapper = ({
  blockName,
  children,
  label,
  previewHtml,
}) => {
  const variant = blockName.replace(/\//g, "-").replace(/^core-/, "");

  // Wrapper element, set initial opacity to 0, to avoid FOUC - the user seeing the original block.
  return (
    <div
      className={`wb-preview-wrap wb-preview-wrap--${variant}`}
      style={{ opacity: 0 }}
    >
      {/* Keep original edit output mounted for the block toolbar; hide it visually */}
      {children}

      {/* Custom client-rendered preview, overlayed */}
      <RawHTML
        className="wb-preview-wrap__preview"
        // Properties from the original block
        aria-label={label}
        role="document"
        // Set initial display to none, to avoid layout shift, when css loads.
        style={{ display: "none" }}
      >
        {previewHtml}
      </RawHTML>
    </div>
  );
};
