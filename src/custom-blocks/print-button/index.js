/**
 * Print button
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { RichText, InspectorControls } from "@wordpress/block-editor";
import {
  ToggleControl,
  RadioControl,
  PanelBody,
  PanelRow,
  RangeControl,
  TextControl,
} from "@wordpress/components";

const iconRootDirectory = IconData.rootDirectory + "/action/print/";
console.log(IconData);
const iconPathSuffix = "/24px.svg";
const iconStyles = [
  "materialicons",
  "materialiconsoutlined",
  "materialiconsround",
  "materialiconssharp",
  "materialiconstwotone",
];

registerBlockType("wb-blocks/print-button", {
  title: __("Print button", "wb_block"),
  description: __("Button to print page"),
  category: "wb-blocks",
  icon: "printer",
  keywords: [__("print"), __("click")],
  attributes: {
    buttonText: {
      type: "string",
      default: "Print this page",
    },
    buttonShowIcon: {
      type: "boolean",
      default: false,
    },
    buttonClassName: {
      type: "string",
    },
    buttonIconPosition: {
      type: "string",
      default: "right",
    },
    buttonIconStyle: {
      type: "string",
      default: "materialicons",
    },
    buttonShowText: {
      type: "boolean",
      default: true,
    },
    buttonIconSize: {
      type: "number",
      default: 1,
    },
  },
  edit: (props) => {
    const {
      setAttributes,
      attributes: {
        buttonText,
        buttonShowText,
        buttonShowIcon,
        buttonClassName,
        buttonIconPosition,
        buttonIconStyle,
        buttonIconSize,
      },
      className,
    } = props;

    // Set className attribute for PHP frontend to use
    // setAttributes({ buttonClassName: className });

    // const onChangeButtonText = (newText) => {
    //   setAttributes({ buttonText: newText });
    // };
    const onChangeButtonText = (newText) => {
      const trimmedText = newText.trim();

      setAttributes({
        buttonText: trimmedText === "" ? "" : newText,
      });
    };

    const selectedIconUrl =
      iconRootDirectory + buttonIconStyle + iconPathSuffix;

    const mask = `url('${selectedIconUrl}')`;

    const chooseIconStyle = (iconStyle) => {
      setAttributes({
        buttonIconStyle:
          buttonIconStyle === iconStyle ? "materialicons" : iconStyle, //toggle
      });
    };

    const onChangeSize = (value) => {
      setAttributes({ buttonIconSize: value });
    };

    const onBlurButtonText = () => {
      if (buttonShowText && buttonText.trim() === "") {
        setAttributes({ buttonText: "Print this page" });
      }
    };

    return [
      <InspectorControls group="settings">
        <PanelBody title={__("Print icon", "wb_block")} initialOpen={true}>
          <PanelRow>
            <ToggleControl
              label={__("Show text", "wb_block")}
              help="Remove button text"
              checked={buttonShowText}
              onChange={(value) => {
                setAttributes({
                  buttonShowText: value,
                  buttonIconSize: value ? 1 : buttonIconSize,
                  buttonText:
                    value && buttonText.trim() === ""
                      ? "Print this page"
                      : buttonText,
                });
              }}
            />
          </PanelRow>

          <PanelRow>
            <ToggleControl
              label={__("Show icon", "wb_block")}
              help={
                !buttonShowText
                  ? __("Edit icon size in the Styles panel", "wb_block")
                  : __("Remove icon", "wb_block")
              }
              checked={buttonShowIcon}
              onChange={(value) => {
                setAttributes({ buttonShowIcon: value });
              }}
            />
          </PanelRow>

          {buttonShowIcon && buttonShowText && (
            <PanelRow>
              <RadioControl
                label={__("Icon position", "wb_block")}
                help="Position icon left or right of the button text"
                selected={buttonIconPosition}
                options={[
                  { label: __("Left", "wb_block"), value: "left" },
                  { label: __("Right", "wb_block"), value: "right" },
                ]}
                onChange={(value) => {
                  setAttributes({ buttonIconPosition: value });
                }}
              ></RadioControl>
            </PanelRow>
          )}

          {!buttonShowText && (
            <PanelRow>
              <TextControl
                label={__("Alt text", "wb_block")}
                help="Add button description"
                value={buttonText}
                onChange={onChangeButtonText}
              ></TextControl>
            </PanelRow>
          )}

          {buttonShowIcon && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {iconStyles.map((iconStyle) => (
                <button
                  key={iconStyle}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    chooseIconStyle(iconStyle);
                  }}
                  style={{
                    outline:
                      buttonIconStyle === iconStyle
                        ? "8px solid #0ff"
                        : "1px solid #ccc",
                    filter:
                      buttonIconStyle === iconStyle ? "invert(1)" : "none",
                    padding: "10px",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={`${iconRootDirectory}${iconStyle}${iconPathSuffix}`}
                    width={24}
                    height={24}
                    alt={iconStyle}
                    loading="lazy"
                    style={{ display: "inline" }}
                  />
                </button>
              ))}
            </div>
          )}
        </PanelBody>
      </InspectorControls>,

      <InspectorControls group="styles">
        <PanelBody
          title={__("Print button styles", "wb_block")}
          initialOpen={true}
        >
          {!buttonShowText && buttonShowIcon && (
            <RangeControl
              label="Size"
              value={buttonIconSize}
              onChange={onChangeSize}
              min={1}
              max={12}
              step={0.5}
            />
          )}
        </PanelBody>
      </InspectorControls>,

      <button
        className={`wb-print-button ${className || ""} wp-element-button
          ${buttonShowIcon ? "wb-print-button--has-icon" : ""}
          ${buttonShowText ? "wb-print-button--has-text" : "wb-print-button--icon-only"}
          ${buttonShowText ? `wb-print-button--icon-${buttonIconPosition}` : ""}`}
        style={{
          "--icon": mask,
          "--icon-size": buttonShowText ? 1 : buttonIconSize,
        }}
      >
        {buttonShowText && (
          <span className="wb-print-button__text">
            <RichText
              tagName="span"
              value={buttonText}
              placeholder={__("Add button text")}
              keepPlaceholderOnFocus
              onChange={onChangeButtonText}
              onBlur={onBlurButtonText}
            />
          </span>
        )}
      </button>,
    ];
  },

  save: () => null,
});
