import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { useEffect, useLayoutEffect, useRef, RawHTML } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";
import FormatPicker from './FormatPicker'

/**
 * Extend core/query-total with the attribute
 *
 * - format: allows for custom string format, similar to on the post-date block.
 */
const addAttributes = (settings, name) => {
    if (name !== "core/query-total") {
        return settings;
    }

    settings.attributes = {
        ...settings.attributes,
        // TODO - do we need to do anything special for this to be nullable?
        wbFormatSingle: { type: "string", default: null },
        wbFormatRange: { type: "string", default: null },
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
    if (props.attributes.displayType !== 'range-display') {
        // Return early if other display type.
        return <BlockEdit {...props} />;
    }

    // console.log(props);

    const {
        attributes: {
            wbFormatSingle = null,
            wbFormatRange = null
        },
        setAttributes,
    } = props;



    // Fallbacks to core’s default format strings if user fields are empty
    const formatSingle = wbFormatSingle || __('Displaying %1$s of %2$s');
    const formatRange = wbFormatRange || __('Displaying %1$s – %2$s of %3$s');

    // Demo numbers for the editor preview (you can make these dynamic later)
    const previewHtml = sprintf(formatRange, 1, 10, 12);

    const blockProps = useBlockProps();

    console.log(BlockEdit);

    return <>
        {/* Using this means i have the toolbar, but text is not updated to reflect the user's choice */}
        <BlockEdit {...props} />

        {/* Using this means I do not have the toolbar, but text is updated to reflect the user's choice  */}
        {/* <div {...blockProps}>
            <RawHTML>{previewHtml}</RawHTML>
        </div> */}

        <InspectorControls>
            <PanelBody title={__('Settings')} >
                <PanelRow>
                    <FormatPicker
                        wbFormatSingle={wbFormatSingle}
                        wbFormatRange={wbFormatRange}
                        defaultFormatSingle='Displaying %1$s of %2$s'
                        defaultFormatRange='Displaying %1$s – %2$s of %3$s'
                        onChange={({ wbFormatSingle, wbFormatRange }) =>
                            setAttributes({ wbFormatSingle, wbFormatRange })
                        }
                    />
                </PanelRow>
            </PanelBody>
        </InspectorControls>
    </>;
};

addFilter(
    "editor.BlockEdit",
    "wb_blocks/query-total-prefix-controls",
    addFormatControl
);