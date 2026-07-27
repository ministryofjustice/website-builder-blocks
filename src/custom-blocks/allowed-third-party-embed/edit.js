import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
  RichText,
  InspectorControls,
  BlockControls,
} from "@wordpress/block-editor";
import {
  Button,
  Placeholder,
  SandBox,
  TextareaControl,
  ToolbarButton,
  ToolbarGroup,
} from "@wordpress/components";

const MODES = {
  PLACEHOLDER: "placeholder",
  EDIT: "edit",
  PREVIEW: "preview",
};

import { useState, useEffect } from "@wordpress/element";

export default function Edit(props) {
  const {
    setAttributes,
    attributes: { embedCode },
    className,
    isSelected,
  } = props;

  const [mode, setMode] = useState(
    embedCode ? MODES.PREVIEW : MODES.PLACEHOLDER,
  );

  //Mode should be Edit when the block is selected
  //When block is no longer in focus chnage the state of MODES to edit
  useEffect(() => {
    if (!isSelected && embedCode) {
      setMode(MODES.EDIT);
    }
  }, [isSelected, embedCode]);

  //Block initially added to the page
  if (mode === MODES.PLACEHOLDER) {
    return (
      <Placeholder
        label={__("Third-party Embed", "wb_blocks")}
        instructions={__(
          "Paste embed code from an approved provider.",
          "wb_blocks",
        )}
      >
        <Button variant="primary" onClick={() => setMode(MODES.EDIT)}>
          {__("Edit embed", "wb_blocks")}
        </Button>
      </Placeholder>
    );
  }

  //Placeholder displayed in the page when not in focus
  //Additional info will be inluded here suh as third
  //party provider after validatonhas been implemented   
  if (!isSelected && embedCode) {
    return (
      <Placeholder label={__("Third-party Embed", "wb_blocks")}>
        <p>{__("Embed configured", "wb_blocks")}</p>
      </Placeholder>
    );
  }

  //Display status when in focus and editing/previewing
  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          {mode === MODES.EDIT && (
            <ToolbarButton
              onClick={() => setMode(MODES.PREVIEW)}
              disabled={!embedCode.trim()}
            >
              {__("Preview", "wb_blocks")}
            </ToolbarButton>
          )}

          {mode === MODES.PREVIEW && (
            <ToolbarButton
              onClick={() => {
                setMode(MODES.EDIT);
              }}
            >
              {__("Edit", "wb_block")}
            </ToolbarButton>
          )}
        </ToolbarGroup>
      </BlockControls>

      <div className={`wb-allowed-third-party-embed ${className || ""}`}>
        {mode === MODES.EDIT && (
          <TextareaControl
            label={__("Third-party embed code", "wb_blocks")}
            value={embedCode}
            onChange={(value) =>
              setAttributes({
                embedCode: value,
              })
            }
          />
        )}

        {mode === MODES.PREVIEW && (
          <SandBox
            html={embedCode}
            title={__("Third-party embed preview", "wb_blocks")}
            type="embed"
          />
        )}
      </div>
    </>
  );
}
