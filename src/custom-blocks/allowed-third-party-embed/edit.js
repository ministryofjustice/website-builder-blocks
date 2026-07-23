import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
  RichText,
  InspectorControls,
  BlockControls,
} from "@wordpress/block-editor";
import {
  SandBox,
  TextareaControl,
  ToolbarButton,
  ToolbarGroup,
} from "@wordpress/components";

import { useState } from "@wordpress/element";

export default function Edit(props) {
  const {
    setAttributes,
    attributes: { embedCode },
    className,
  } = props;

  const [isPreview, setIsPreview] = useState(false);

  const onChangeEmbedCode = (newEmbedCode) => {
    setAttributes({
      embedCode: newEmbedCode,
    });

    //reset to edit mode when code chnages so we don't display
    //an outdated prewiew
    setIsPreview(false);
  };

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            isPressed={!isPreview}
            onClick={() => {
              setIsPreview(false);
            }}
          >
            {__("Edit", "wb_block")}
          </ToolbarButton>

          <ToolbarButton
            isPressed={isPreview}
            disabled={!embedCode.trim()}
            onClick={() => {
              setIsPreview(true);
            }}
          >
            {__("Preview", "wb_block")}
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>
      
      <div className={`wb-allowed-third-party-embed ${className || ""}`}>
        {isPreview ? (
          <div className="wb-allowed-third-party-embed__preview">
            <SandBox
              key={embedCode}
              html={embedCode}
              title={__("Third-party embed preview", "wb_block")}
              type="embed"
            />
          </div>
        ) : (
          <div className="wb-allowed-third-party-embed__editor">
            <TextareaControl
              label={__("Third-party embed code", "wb_block")}
              help={__(
                "For now, paste some simple HTML to test the block.",
                "wb_block",
              )}
              value={embedCode}
              onChange={onChangeEmbedCode}
              rows={10}
            />
          </div>
        )}
      </div>
    </>
  );
}
