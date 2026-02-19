import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { useEffect, useLayoutEffect, useRef } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Extend core/post-date with the attributes
 *
 * - hasPrefix: a marker to identify if block should have prefix input,
 *   and if the block should render with the prefix class.
 * - prefix: the text to prefix the date with.
 */
const addAttributes = (settings, name) => {
  if (name !== "core/post-date") {
    return settings;
  }

  settings.attributes = {
    ...settings.attributes,
    hasPrefix: { type: "boolean", default: false },
    prefix: { type: "string", default: "" },
  };

  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "wb_blocks/post-date-extend-attributes",
  addAttributes,
);

/**
 * Inject inline editable prefix via BlockEdit.
 * Uses useBlockProps to become the block wrapper, containing both prefix and date.
 */
const BlockWithPrefix = (props) => {
  const {
    attributes: { hasPrefix = false, prefix = '' },
    setAttributes,
    variationIsModified = false,
  } = props;

  const wrapperRef = useRef(null);

  // Clean up the inner BlockEdit's wrapper element.
  // BlockEdit calls useBlockProps() internally, creating a nested block wrapper
  // with duplicate id, role, aria-label, data-block, and draggable attributes.
  // We strip these to produce valid HTML and prevent drag/selection conflicts.
  useLayoutEffect(() => {
    const inner = wrapperRef.current?.querySelector(":scope > [data-block]");
    if (inner) {
      // Remove the inner block attributes, they are now on the wrapper block.
      inner.removeAttribute("id");
      inner.removeAttribute("tabindex");
      inner.removeAttribute('role');
      inner.removeAttribute('aria-label');
      inner.setAttribute("draggable", "false");
    }
  }, []);

  // Keep track of initial value for variation.
  const prev = useRef(variationIsModified);
  useEffect(() => {
    // If the user changes the variation (e.g. from Post Date to Modified Date),
    // clear the prefix, otherwise we could end up with a misleading value.
    if (prev.current !== variationIsModified) {
      setAttributes({ prefix: '' });
      prev.current = variationIsModified;
    }
  }, [variationIsModified, setAttributes]);


  // Get block props - this makes our div the block wrapper
  const blockProps = useBlockProps({
    ref: wrapperRef,
    className: hasPrefix ? "wp-block-post-date--has-prefix" : undefined,
  });

  return <div {...blockProps}>
    {hasPrefix && (
      <RichText
        tagName="span"
        className="wp-block-post-date__prefix"
        value={prefix}
        onChange={(value) => setAttributes({ prefix: value })}
        placeholder={__("Prefix…", "wb_blocks")}
        allowedFormats={["core/bold", "core/italic"]}
        disableLineBreaks={true}
      />
    )}
    {props.children}
  </div>;
}

/**
 * Filter the Post Date block
 * - Call the custom component that wraps the original BlockEdit.
 * - Render a toggle in the block sidebar.
 */
const addPrefixControl = (BlockEdit) => (props) => {
  if (props.name !== "core/post-date") {
    return <BlockEdit {...props} />;
  }

  const {
    attributes: { hasPrefix = false },
    setAttributes,
  } = props;

  const variationIsModified = props.attributes?.metadata?.bindings?.datetime?.args?.field === 'modified';
  const examplePrefix = variationIsModified ? __('Updated', 'wb_blocks') : __('Published', 'wb_blocks');

  return <>
    {/* Render the custom component */}
    <BlockWithPrefix attributes={props.attributes} setAttributes={props.setAttributes} variationIsModified={variationIsModified}>
      <BlockEdit {...props} />
    </BlockWithPrefix>
    {/* Render the block inspector controls */}
    <InspectorControls>
      <PanelBody title={__('Date prefix', 'wb_blocks')} >
        <PanelRow>
          <ToggleControl
            label={__('Show prefix before date', 'wb_blocks')}
            checked={hasPrefix}
            onChange={() => setAttributes({ hasPrefix: !hasPrefix, })}
            help={
              hasPrefix
                ? sprintf(__('Type the prefix inline before the date (e.g., %s).', 'wb_blocks'), examplePrefix)
                :
                sprintf(__('Adds text (e.g. %s) before the post date.', 'wb_blocks'), examplePrefix)
            }
          />
        </PanelRow>
      </PanelBody>
    </InspectorControls>
  </>;
};

addFilter(
  "editor.BlockEdit",
  "wb_blocks/post-date-prefix-controls",
  addPrefixControl
);
