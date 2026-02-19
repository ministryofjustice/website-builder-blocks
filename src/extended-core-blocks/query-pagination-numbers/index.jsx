import {
  getBlockDefaultClassName,
  registerBlockStyle,
  registerBlockVariation,
} from "@wordpress/blocks";
// import { getBlockDefaultClassName } from "@wordpress/block-editor";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";
import { RawHTML } from "@wordpress/element";
import { cleanForSlug } from "@wordpress/url";

/**
 * Register our custom block style.
 *
 * When this style is selected, we'll wrap <b> tags around the number placeholders.
 * e.g. Displaying %1$s - %2$s of %3$s
 *   -> Displaying <b>%1$s</b> - <b>%2$s</b> of <b>%3$s</b>
 *
 * TODO update comment
 * TODO update translation comment
 */
registerBlockStyle("core/query-pagination-numbers", {
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
 *
 * TODO update comment
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

registerBlockVariation("core/query-pagination-numbers", {
  // This is the out-of-the-box WordPress style, no special stuff
  name: "original-query-pagination-numbers",
  title: "WordPress page numbers",
  // description: 'Navigation used as default by WordPress',
  attributes: {
    displayType: "page-links",
  },
  scope: ["transform"],
  isDefault: true,
  isActive: (blockAttributes) =>
    blockAttributes?.displayType !== "current-of-total",
});

registerBlockVariation("core/query-pagination-numbers", {
  // This is the out-of-the-box WordPress style, no special stuff
  name: "simple-query-pagination-numbers",
  title: "Simple page numbers",
  // description: 'Navigation used as default by WordPress',
  attributes: {
    displayType: "current-of-total",
  },
  scope: ["transform"],
  isActive: (blockAttributes) =>
    blockAttributes?.displayType === "current-of-total",
});

const changeMe = (BlockEdit) => (props) => {
  if (props.name !== "core/query-pagination-numbers") {
    return <BlockEdit {...props} />;
  }

  const attributes = props.attributes || {};

  const classArray = attributes?.className?.split(" ") ?? [];

  // Infer from the className, should the numbers be bold.
  const isStyleBoldNumbers = classArray.includes("is-style-bold-numbers");

  if (attributes.displayType !== "current-of-total") {
    return <BlockEdit {...props} />;
  }

  let previewTranslation = __("Page %1$d of %2$d");

  if (isStyleBoldNumbers) {
    // Lets add some b tags round the number placeholders.
    previewTranslation = previewTranslation.replace(/(%\d+\$d)/g, "<b>$1</b>");
  }

  console.log(props);

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
    <div className={`wb-preview-wrap wb-preview-wrap--${variant}`} style={{opacity: 0}}>

      {/* Keep original edit output mounted for the block toolbar; hide it visually */}
      {children}

      {/* Custom client-rendered preview, overlayed */}
      <RawHTML
        className="wb-preview-wrap__preview"
        // Properties from the original block
        aria-label={label}
        role="document"
        // Set initial display to none, to avoid layout shift, when css loads.
        style={{display: 'none'}}
      >
        {previewHtml}
      </RawHTML>
    </div>
  );
};
