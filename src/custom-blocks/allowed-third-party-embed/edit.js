import { __ } from "@wordpress/i18n";
import { BlockControls, InspectorControls } from "@wordpress/block-editor";
import {
  Button,
  Notice,
  Placeholder,
  SandBox,
  TextareaControl,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
  PanelBody,
} from "@wordpress/components";
import { useState } from "@wordpress/element";

import { validateEmbedCode } from "./provider-validation";

const MODES = {
  PLACEHOLDER: "placeholder",
  EDIT: "edit",
  PREVIEW: "preview",
};

const VALIDATION_STATUSES = {
  NOT_VALIDATED: "not-validated",
  VALID: "valid",
  INVALID: "invalid",
};

export default function Edit({
  setAttributes,
  attributes: { embedCode, provider, validationStatus, validationMessage },
  className,
  isSelected,
}) {
  const [mode, setMode] = useState(embedCode ? MODES.EDIT : MODES.PLACEHOLDER);

  // This is temporary feedback shown while editing.
  const [validationNotice, setValidationNotice] = useState(null);

  const handleEditEmbed = () => {
    setValidationNotice(null);
    setMode(MODES.EDIT);
  };

  // Temporary debugging
  if (mode === MODES.PREVIEW) {
    console.count("Preview render");
  }

  const handleEmbedCodeChange = (value) => {
    /*
     * Any change to the embed code invalidates its previous validation.
     * Clear the saved provider and validation information.
     */
    setAttributes({
      embedCode: value,
      provider: "",
      validationStatus: VALIDATION_STATUSES.NOT_VALIDATED,
      validationMessage: "",
    });

    setValidationNotice(null);
    setMode(MODES.EDIT);
  };

  const handlePreview = () => {
    console.count("handlePreview");
    const result = validateEmbedCode(embedCode);

    if (!result.isValid) {
      setAttributes({
        provider: result.provider?.name ?? "",
        validationStatus: VALIDATION_STATUSES.INVALID,
        validationMessage: result.message,
      });

      setValidationNotice({
        status: "error",
        message: result.message,
      });

      setMode(MODES.EDIT);
      return;
    }

    setAttributes({
      provider: result.provider.name,
      validationStatus: VALIDATION_STATUSES.VALID,
      validationMessage: result.message,
    });

    setValidationNotice(null);
    setMode(MODES.PREVIEW);
  };

  const getStatusLabel = () => {
    switch (validationStatus) {
      case VALIDATION_STATUSES.VALID:
        return __("Validated", "wb_blocks");

      case VALIDATION_STATUSES.INVALID:
        return __("Validation failed", "wb_blocks");

      default:
        return __("Not validated", "wb_blocks");
    }
  };

  const getStatusMessage = () => {
    if (validationMessage) {
      return validationMessage;
    }

    return __("This embed has not yet been validated.", "wb_blocks");
  };

  /*
   * Initial placeholder shown before embed code has been entered.
   */
  if (mode === MODES.PLACEHOLDER && !embedCode) {
    return (
      <Placeholder
        label={__("Third-party Embed", "wb_blocks")}
        instructions={__(
          "Paste embed code from an approved provider.",
          "wb_blocks",
        )}
      >
        <Button variant="primary" onClick={handleEditEmbed}>
          {__("Add embed code", "wb_blocks")}
        </Button>
      </Placeholder>
    );
  }

  /*
   * Summary shown when the configured block is not selected.
   * The values are now saved in block attributes,
   *  so that they persist after reloading.
   */
  if (!isSelected && embedCode) {
    return (
      <Placeholder label={__("Third-party Embed", "wb_blocks")}>
        <div>
          <p>
            <strong>{__("Provider:", "wb_blocks")}</strong>{" "}
            {provider || __("Unknown", "wb_blocks")}
          </p>

          <p>
            <strong>{__("Status:", "wb_blocks")}</strong> {getStatusLabel()}
          </p>

          <p>{getStatusMessage()}</p>
        </div>
      </Placeholder>
    );
  }

  return (
    <>
      <InspectorControls>
        <PanelBody
          title={__("Third-party embed", "wb_blocks")}
          initialOpen={true}
        >
          <p>
            {__(
              "Use this block to add approved third-party embed code to the page. The code is checked before a preview is displayed.",
              "wb_blocks",
            )}
          </p>

          <p>
            {__(
              "Only embed code from approved providers can be used. This helps prevent unsupported or unsafe code from being added to the site.",
              "wb_blocks",
            )}
          </p>

          <Notice status="info" isDismissible={false}>
            <strong>{__("Need to use a new provider?", "wb_blocks")}</strong>

            <p>
              {__(
                "Message the Website Builder team and include the embed code and provider details for review.",
                "wb_blocks",
              )}
            </p>
            <ul>
              <li>
                <strong>{__("Email", "wb_blocks")}</strong>
                <br />
                <a href="mailto:wordpress@justice.gov.uk">
                  wordpress@justice.gov.uk
                </a>
              </li>
              <li>
                <strong>{__("Slack", "wb_blocks")}</strong>
                <br />
                #ask-website-builder
              </li>
            </ul>
          </Notice>
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          {mode === MODES.EDIT && (
            <Tooltip
              text={__(
                "The embed code will be validated before the preview is displayed.",
                "wb_blocks",
              )}
            >
              <ToolbarButton
                onClick={handlePreview}
                disabled={!embedCode.trim()}
                label={__("Preview embed", "wb_blocks")}
              >
                {__("Preview", "wb_blocks")}
              </ToolbarButton>
            </Tooltip>
          )}

          {mode === MODES.PREVIEW && (
            <ToolbarButton
              onClick={handleEditEmbed}
              label={__("Edit embed code", "wb_blocks")}
            >
              {__("Edit", "wb_blocks")}
            </ToolbarButton>
          )}
        </ToolbarGroup>
      </BlockControls>

      <div className={`wb-allowed-third-party-embed ${className || ""}`}>
        {mode === MODES.EDIT && (
          <>
            <TextareaControl
              label={__("Third-party embed code", "wb_blocks")}
              value={embedCode}
              onChange={handleEmbedCodeChange}
            />

            {validationNotice && (
              <Notice status={validationNotice.status} isDismissible={false}>
                <strong>{__("Preview unavailable.", "wb_blocks")}</strong>{" "}
                {validationNotice.message}
              </Notice>
            )}
          </>
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
