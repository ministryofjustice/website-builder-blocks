import { registerBlockStyle } from "@wordpress/blocks";
import { addFilter } from "@wordpress/hooks";
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
const { PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { __experimentalUnitControl: UnitControl } = wp.components;

const withQueryPaginationGapControl = createHigherOrderComponent(
    (BlockEdit) => {
        return (props) => {

            if (props.name !== "core/query-pagination") {
                return <BlockEdit {...props} />;
            }

            const currentGap =
                props.attributes.style?.spacing?.blockGap || "0";

            const updateGap = (newValue) => {
                props.setAttributes({
                    style: {
                        ...props.attributes.style,
                        spacing: {
                            ...props.attributes.style?.spacing,
                            blockGap: newValue,
                        },
                    },
                });
            };

            return (
                <Fragment>
                    <BlockEdit {...props} />

                    <InspectorControls group="styles">
                        <PanelBody title="Dimensions">
                            <UnitControl
                                label="Gap"
                                value={currentGap}
                                onChange={updateGap}
                                units={[
                                    { value: 'px', label: 'px', default: '0' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                            />
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        };
    },
    "withQueryPaginationGapControl"
);

addFilter(
    "editor.BlockEdit",
    "my-plugin/query-pagination-gap-control",
    withQueryPaginationGapControl
);