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
} from "@wordpress/components";

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
  },
  edit: (props) => {
    const {
      setAttributes,
      attributes: {
        buttonText,
        buttonShowIcon,
        buttonClassName,
        buttonIconPosition,
      },
      className,
    } = props;

    // Set className attribute for PHP frontend to use
    setAttributes({ buttonClassName: className });

    const onChangeButtonText = (newText) => {
      setAttributes({ buttonText: newText });
    };

    return [
      <InspectorControls>
        <PanelBody title={__("Print icon", "wb_block")} initialOpen={true}>
          <PanelRow>
            <ToggleControl
              label={__("Show icon", "wb_block")}
              help=""
              checked={buttonShowIcon}
              onChange={(x) => {
                setAttributes({ buttonShowIcon: x });
              }}
            />
          </PanelRow>

          {buttonShowIcon && (
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
        </PanelBody>
      </InspectorControls>,

      <button
        className={`wb-print-button ${buttonClassName} wp-element-button ${
          buttonShowIcon ? "wb-print-button--has-icon" : ""
        }
        
          wb-print-button--icon-${buttonIconPosition}`}
      >
        <span className="wb-print-button__text">
          <RichText
            tagName="span"
            value={buttonText}
            placeholder={__("Add butoon text")}
            keepPlaceholderOnFocus
            onChange={onChangeButtonText}
          />
        </span>
      </button>,
    ];
  },

  save: () => null,
});
