/**
 * WordPress dependencies
 */
import { _x, __, sprintf } from '@wordpress/i18n';
import { useState, createInterpolateElement } from '@wordpress/element';
import {
    TextareaControl,
    TextControl,
    ExternalLink,
    VisuallyHidden,
    ToggleControl,
    __experimentalVStack as VStack,
    CustomSelectControl,
} from '@wordpress/components';

// So that we illustrate the different formats in the dropdown properly, show a date that is
// somewhat recent, has a day greater than 12, and a month with more than three letters.
const exampleDate = new Date();
exampleDate.setDate(20);
exampleDate.setMonth(exampleDate.getMonth() - 3);
if (exampleDate.getMonth() === 4) {
    // May has three letters, so use March.
    exampleDate.setMonth(3);
}

/**
 * The `DateFormatPicker` component renders controls that let the user choose a
 * _date format_. That is, how they want their dates to be formatted.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/date-format-picker/README.md
 *
 * @param {Object}      props
 * @param {string|null} props.format        The selected date format. If `null`, _Default_ is selected.
 * @param {string}      props.defaultFormat The date format that will be used if the user selects 'Default'.
 * @param {Function}    props.onChange      Called when a selection is made. If `null`, _Default_ is selected.
 */
export default function DateFormatPicker({
    format,
    wbFormatSingle,
    wbFormatRange,
    defaultFormatSingle,
    defaultFormatRange,
    onChange,
}) {
    const checked = wbFormatSingle === null && wbFormatRange === null;
    return (
        <VStack
            as="fieldset"
            spacing={4}
            className="block-editor-date-format-picker"
        >
            <VisuallyHidden as="legend">{__('Date format')}</VisuallyHidden>
            <ToggleControl
                label={__('Default format')}
                help={`${__('Example:')}  ${sprintf(
                    defaultFormatRange,
                    1, 10, 12
                )}`}
                checked={checked}
                onChange={(checked) =>
                    onChange({
                        wbFormatSingle: checked ? null : defaultFormatSingle,
                        wbFormatRange: checked ? null : defaultFormatRange
                    })
                }
            />
            {!checked && (
                <NonDefaultControls wbFormatSingle={wbFormatSingle} wbFormatRange={wbFormatRange} onChange={onChange} />
            )}
        </VStack>
    );
}

function NonDefaultControls({ format, wbFormatSingle, wbFormatRange, onChange }) {
    // Suggest a short format, medium format, long format, and a standardised
    // (YYYY-MM-DD) format. The short, medium, and long formats are localised as
    // different languages have different ways of writing these. For example, 'F
    // j, Y' (April 20, 2022) in American English (en_US) is 'j. F Y' (20. April
    // 2022) in German (de). The resultant array is de-duplicated as some
    // languages will use the same format string for short, medium, and long
    // formats.
    const suggestedOptions = [
        {
            key: 1,
            formatSingle: 'Displaying %1$s of %3$s',
            formatRange: 'Displaying %1$s – %2$s of %3$s',
            name: sprintf(__('Displaying %1$s – %2$s of %3$s'), 1, 10, 12),
            hint: 'Default',
        },
        {
            key: 2,
            formatSingle: 'Displaying <strong>%1$s</strong> of <strong>%3$s</strong>',
            formatRange: 'Displaying <strong>%1$s</strong> – <strong>%2$s</strong> of <strong>%3$s</strong>',
            name: sprintf(__('Displaying *%1$s* – *%2$s* of *%3$s*'), 1, 10, 12),
            hint: 'Default - with bold numbers',
        },
        {
            key: 3,
            formatSingle: 'Showing %1$s of %3$s',
            formatRange: 'Showing %1$s – %2$s of %3$s',
            name: sprintf(__('Showing %1$s – %2$s of %3$s'), 1, 10, 12),
            hint: '"Showing" prefix',
        },
        {
            key: 4,
            formatSingle: 'Showing <strong>%1$s</strong> of <strong>%3$s</strong>',
            formatRange: 'Showing <strong>%1$s</strong> – <strong>%2$s</strong> of <strong>%3$s</strong>',
            name: sprintf(__('Showing *%1$s* – *%2$s* of *%3$s*'), 1, 10, 12),
            hint: '"Showing" prefix - with bold numbers',
        },
    ];

    const customOption = {
        key: 'custom',
        name: __('Custom'),
        className:
            'block-editor-date-format-picker__custom-format-select-control__custom-option',
        hint: __('Enter your own date format'),
    };

    const [isCustom, setIsCustom] = useState(
        () =>
            !!wbFormatSingle &&
            !!wbFormatRange &&
            !suggestedOptions.some((option) => option.formatSingle === wbFormatSingle && option.formatRange === wbFormatRange )
    );

    return (
        <VStack>
            <CustomSelectControl
                __next40pxDefaultSize
                label={__('Choose a format')}
                options={[...suggestedOptions, customOption]}
                value={
                    isCustom
                        ? customOption
                        : suggestedOptions.find(
                            (option) => option.formatSingle === wbFormatSingle && option.formatRange === wbFormatRange
                        ) ?? customOption
                }
                onChange={({ selectedItem }) => {
                    if (selectedItem === customOption) {
                        setIsCustom(true);
                    } else {
                        setIsCustom(false);
                        onChange({ 
                            wbFormatSingle: selectedItem.formatSingle,
                            wbFormatRange: selectedItem.formatRange
                        });
                    }
                }}
            />
            {isCustom && (
                <>
                {/* <TextControl
                    __next40pxDefaultSize
                    label={__('Custom format')}
                    hideLabelFromVision
                    help={createInterpolateElement(
                        __(
                            'Enter a date or time <Link>format string</Link>.'
                        ),
                        {
                            Link: (
                                <ExternalLink
                                    href={__(
                                        'https://wordpress.org/documentation/article/customize-date-and-time-format/'
                                    )}
                                />
                            ),
                        }
                    )}
                    value={format}
                    onChange={(value) => onChange(value)}
                /> */}
                <TextareaControl
                    label={ __( 'Single item format', 'your-text-domain' ) }
                    help={ __( 'Use placeholders: %1$s (index), %2$s (total).', 'your-text-domain' ) }
                    placeholder={ __( 'Displaying %1$s of %2$s', 'your-text-domain' ) }
                    value={ wbFormatSingle }
                    onChange={ (value) => onChange({ wbFormatSingle: value }) }
                    rows={2}
                />
                <TextareaControl
                    label={ __( 'Range format', 'your-text-domain' ) }
                    help={ __( 'Use placeholders: %1$s (start), %2$s (end), %3$s (total).', 'your-text-domain' ) }
                    placeholder={ __( 'Displaying %1$s – %2$s of %3$s', 'your-text-domain' ) }
                    value={ wbFormatRange }
                    onChange={ (value) => onChange({ wbFormatRange: value }) }
                    rows={2}
                />
                </>

            )}
        </VStack>
    );
}