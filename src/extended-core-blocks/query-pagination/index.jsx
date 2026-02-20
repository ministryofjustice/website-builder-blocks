import {
  InspectorControls,
  __experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { registerBlockStyle } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";

/**
 * Register our custom block style.
 */
registerBlockStyle("core/query-pagination", {
  name: "centred-on-mobile",
  label: __("Centred on mobile", "wb_blocks"),
});


/**
 * Add gap control with spacing presets to query-pagination block
 */
const withQueryPaginationGapControl = createHigherOrderComponent(
  (BlockEdit) => {
    return (props) => {
      if (props.name !== "core/query-pagination") {
        return <BlockEdit {...props} />;
      }

      // Guard against missing component
      if (!SpacingSizesControl) {
        console.warn("SpacingSizesControl not available");
        return <BlockEdit {...props} />;
      }

      const currentGap = props.attributes.style?.spacing?.blockGap;

      const updateGap = (newValues) => {
        // SpacingSizesControl returns an object, extract the 'left' value as shorthand
        const newGap = newValues?.left || undefined;

        props.setAttributes({
          style: {
            ...props.attributes.style,
            spacing: {
              ...props.attributes.style?.spacing,
              blockGap: newGap,
            },
          },
        });
      };

      return (
        <Fragment>
          <BlockEdit {...props} />

          <InspectorControls group="styles">
            <PanelBody title={__("Dimensions")}>
              <SpacingSizesControl
                label={__("Block spacing")}
                values={{
                  left: currentGap,
                  right: currentGap,
                }}
                onChange={updateGap}
                sides={["horizontal"]}
                showSideInLabel={false}
                allowReset={true}
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      );
    };
  },
  "withQueryPaginationGapControl",
);

addFilter(
  "editor.BlockEdit",
  "wb_blocks/query-pagination-gap-control",
  withQueryPaginationGapControl,
);
