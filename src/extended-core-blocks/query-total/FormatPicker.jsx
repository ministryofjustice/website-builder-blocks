import {
  TextareaControl,
  VisuallyHidden,
  ToggleControl,
  __experimentalVStack as VStack,
  CustomSelectControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

/**
 * This component takes strong influence from WordPress's DateFormatPicker component.
 *
 * The `QueryRangeFormatPicker` component renders controls that let the user choose a
 * _phrase format_. That is, how they want their query range to be formatted.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/date-format-picker/index.js
 */
export default function QueryRangeFormatPicker({
  rangeFormatSingle,
  rangeFormatMulti,
  defaultFormatSingle,
  defaultFormatRange,
  onChange,
}) {
  const checked = rangeFormatSingle === null && rangeFormatMulti === null;
  return (
    <VStack as="fieldset" spacing={4}>
      <VisuallyHidden as="legend">{__("Query range format")}</VisuallyHidden>
      <ToggleControl
        label={__("Default format")}
        help={`${__("Example:")}  ${sprintf(defaultFormatRange, 1, 10, 12)}`}
        checked={checked}
        onChange={(checked) =>
          onChange({
            rangeFormatSingle: checked ? null : defaultFormatSingle,
            rangeFormatMulti: checked ? null : defaultFormatRange,
          })
        }
      />
      {!checked && (
        <NonDefaultControls
          rangeFormatSingle={rangeFormatSingle}
          rangeFormatMulti={rangeFormatMulti}
          onChange={onChange}
        />
      )}
    </VStack>
  );
}

function NonDefaultControls({ rangeFormatSingle, rangeFormatMulti, onChange }) {
  const defaultOptions = [
    {
      key: 1,
      formatSingle: "Displaying %1$s of %2$s",
      formatRange: "Displaying %1$s – %2$s of %3$s",
      name: sprintf(
        __("Displaying %1$s – %2$s of %3$s", "wb_blocks"),
        "1",
        "10",
        12,
      ),
      hint: __("Default"),
    },
    {
      key: 2,
      formatSingle: "Displaying <strong>%1$s</strong> of <strong>%2$s</strong>",
      formatRange:
        "Displaying <strong>%1$s</strong> – <strong>%2$s</strong> of <strong>%3$s</strong>",
      name: sprintf(
        __("Displaying %1$s – %2$s of %3$s", "wb_blocks"),
        "1",
        "10",
        "12*",
      ),
      hint: __("Default - with bold numbers", "wb_blocks"),
    },
    {
      key: 3,
      formatSingle: "Showing %1$s of %2$s",
      formatRange: "Showing %1$s – %2$s of %3$s",
      name: sprintf(
        __("Showing %1$s – %2$s of %3$s", "wb_blocks"),
        "1",
        "10",
        12,
      ),
      hint: __('"Showing" prefix', "wb_blocks"),
    },
    {
      key: 4,
      formatSingle: "Showing <strong>%1$s</strong> of <strong>%2$s</strong>",
      formatRange:
        "Showing <strong>%1$s</strong> – <strong>%2$s</strong> of <strong>%3$s</strong>",
      name: sprintf(
        __("Showing %1$s – %2$s of %3$s", "wb_blocks"),
        "1",
        "10",
        "12*",
      ),
      hint: __('"Showing" prefix - with bold numbers', "wb_blocks"),
    },
  ];

  // Filter out duplicates based on name
  const suggestedOptions = defaultOptions.filter(
    (obj1, i, arr) => arr.findIndex((obj2) => obj2.name === obj1.name) === i,
  );

  const customOption = {
    key: "custom",
    name: __("Custom"),
    style: { borderTop: "1px solid #ddd" },
    hint: __("Enter your own phrase format", "wb_blocks"),
  };

  const [isCustom, setIsCustom] = useState(
    () =>
      !!rangeFormatSingle &&
      !!rangeFormatMulti &&
      !suggestedOptions.some(
        (o) =>
          o.formatSingle === rangeFormatSingle &&
          o.formatRange === rangeFormatMulti,
      ),
  );

  return (
    <VStack>
      <CustomSelectControl
        __next40pxDefaultSize
        label={__("Choose a format")}
        options={[...suggestedOptions, customOption]}
        value={
          isCustom
            ? customOption
            : suggestedOptions.find(
                (option) =>
                  option.formatSingle === rangeFormatSingle &&
                  option.formatRange === rangeFormatMulti,
              ) ?? customOption
        }
        onChange={({ selectedItem }) => {
          if (selectedItem === customOption) {
            setIsCustom(true);
          } else {
            setIsCustom(false);
            onChange({
              rangeFormatSingle: selectedItem.formatSingle,
              rangeFormatMulti: selectedItem.formatRange,
            });
          }
        }}
      />
      {isCustom && (
        <>
          <TextareaControl
            label={__("Single item format", "wb_blocks")}
            help={__(
              "Use placeholders: %1$s (index), %2$s (total).",
              "wb_blocks",
            )}
            placeholder={__("Displaying %1$s of %2$s", "wb_blocks")}
            value={__(rangeFormatSingle, "wb_blocks")}
            onChange={(value) =>
              onChange({ rangeFormatSingle: value, rangeFormatMulti })
            }
            rows={3}
          />
          <TextareaControl
            label={__("Range format", "wb_blocks")}
            help={__(
              "Use placeholders: %1$s (start), %2$s (end), %3$s (total).",
              "wb_blocks",
            )}
            placeholder={__("Displaying %1$s – %2$s of %3$s", "wb_blocks")}
            value={__(rangeFormatMulti, "wb_blocks")}
            onChange={(value) =>
              onChange({ rangeFormatSingle, rangeFormatMulti: value })
            }
            rows={3}
          />
        </>
      )}
    </VStack>
  );
}
