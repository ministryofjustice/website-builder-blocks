import {
  getBlockVariations,
  unregisterBlockVariation,
  registerBlockVariation,
} from "@wordpress/blocks";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import domReady from "@wordpress/dom-ready";
import { createElement as el, useEffect, useRef } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";

/* Override a core variation's isActive for core/post-date */
/* global wp */
(function () {
  const CORE_VARIATION_NAMES = ["post-date", "post-date-modified"];

  /**
   * Extend core/post-date with the attributes
   *
   * - hasPrefix: a marker to identify if the "with prefix" variation is selected.
   *   allows us to determine which variation `isActive`.
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
    "govwind/post-date-extend-attributes",
    addAttributes,
  );

  domReady(() => {
    const variations = getBlockVariations("core/post-date") || [];

    /**
     * For each of the core/post-date variations, we:
     * - Unregister the original variation.
     * - Re-register it with a modified isActive function dependent on hasPrefix.
     * - Register a new variation that adds the prefix, and is active when hasPrefix is true.
     */
    CORE_VARIATION_NAMES.forEach((variationName) => {
      const original = variations.find((v) => v.name === variationName);
      if (!original) {
        console.warn(`Original variation not found: ${variationName}`);
        return;
      }

      // Unregister the original variation so we can re-register it with a modified isActive.
      try {
        unregisterBlockVariation("core/post-date", variationName);
      } catch (e) {
        console.error(`Failed to unregister variation ${variationName}`, e);
      }

      const updatedOriginal = {
        ...original,

        // Make sure selecting this core variation clears the marker + prefix
        attributes: {
          ...(original.attributes || {}),
          hasPrefix: false, // clear marker so core variations can become active
          prefix: "", // optional: avoid leaving stale "Published:" label behind
        },

        // Run the original isActive function, but also check hasPrefix property.
        isActive: (attrs, ...rest) => {
          return (
            original.isActive?.(attrs, ...rest) && attrs.hasPrefix !== true
          );
        },
      };

      const isModified = variationName === "post-date-modified";
      const vTitle = sprintf(__("%s with Prefix", "wb_blocks"), original.title);
      const vDesc = isModified
        ? __("Display a post's last updated date with a label.", "wb_blocks")
        : __("Display a post's published date with a label.", "wb_blocks");
      const defaultPrefix = isModified
        ? __("Updated:", "wb_blocks")
        : __("Published:", "wb_blocks");

      const withPrefix = {
        ...original,
        name: `${original.name}-with-prefix`,
        title: vTitle,
        attributes: {
          ...(original.attributes || {}),
          hasPrefix: true, // our marker to identify the variation in the isActive of the original variations
          prefix: defaultPrefix, // default prefix value, can be changed by the user in the sidebar control
        },
        // Run the original isActive function, but also check hasPrefix property.
        isActive: (attrs, ...rest) => {
          return (
            original.isActive?.(attrs, ...rest) && attrs.hasPrefix === true
          );
        },
        description: vDesc,
      };

      try {
        registerBlockVariation("core/post-date", updatedOriginal);
        registerBlockVariation("core/post-date", withPrefix);
      } catch (e) {
        console.error(
          `Failed to register a block variation ${variationName}`,
          e,
        );
      }
    });
  });

  /**
   * Inject inline editable prefix via BlockEdit.
   * Uses useBlockProps to become the block wrapper, containing both prefix and date.
   */
  const addPrefixControl = (BlockEdit) => (props) => {
    if (props.name !== "core/post-date") {
      return el(BlockEdit, props);
    }

    const attributes = props.attributes || {};

    if (attributes.hasPrefix !== true) {
      return el(BlockEdit, props);
    }

    const wrapperRef = useRef(null);

    // Clean up the inner BlockEdit's wrapper element.
    // BlockEdit calls useBlockProps() internally, creating a nested block wrapper
    // with duplicate id, role, aria-label, data-block, and draggable attributes.
    // We strip these to produce valid HTML and prevent drag/selection conflicts.
    useEffect(() => {
      const inner = wrapperRef.current?.querySelector(":scope > [data-block]");
      if (inner) {
        inner.removeAttribute("id");
        inner.removeAttribute("tabindex");
        inner.setAttribute("draggable", "false");
      }
    }, []);

    // Get block props - this makes our div THE block wrapper
    const blockProps = useBlockProps({
      ref: wrapperRef,
      className: "wp-block-post-date--has-prefix",
    });

    return el(
      "div",
      blockProps,
      el(RichText, {
        tagName: "span",
        className: "wp-block-post-date__prefix",
        value: attributes.prefix || "",
        onChange: (value) => {
          props.setAttributes({ prefix: value });
        },
        placeholder: __("Prefix…", "wb_blocks"),
        allowedFormats: ["core/bold", "core/italic"],
        disableLineBreaks: true,
      }),
      el(BlockEdit, props),
    );
  };

  addFilter(
    "editor.BlockEdit",
    "govwind/post-date-prefix-controls",
    addPrefixControl,
  );
})();
