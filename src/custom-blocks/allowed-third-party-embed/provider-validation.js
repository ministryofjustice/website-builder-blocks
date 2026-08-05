import { PROVIDERS } from "./third-party-providers";

export const findProvider = (embedCode) => {
  return PROVIDERS.find((provider) =>
    provider.domains.some((domain) => embedCode.includes(domain)),
  );
};

export const extractDomains = (embedCode) => {
  const stringPattern = /(['"`])((?:\\.|(?!\1).)*)\1/g;
  const domains = [];

  for (const match of embedCode.matchAll(stringPattern)) {
    const stringValue = match[2].trim();

    const domainMatch = stringValue.match(
      /^(?:https?:\/\/|\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?=[:/?#]|$)/i,
    );

    if (domainMatch) {
      domains.push(domainMatch[1].toLowerCase());
    }
  }
  
  return domains;
};

export const validateAllowedDomains = (embedCode, provider) => {
  //regex match 
  const domains = extractDomains(embedCode);

  //case when no domains identified
  if (domains.length === 0) return false;

  //  for every domain found, check whether it appears in the allowed list
  //  if a domain is not matched return false
  return domains.every((domain) =>
    provider.domains.some(
      (approvedDomain) =>
        domain === approvedDomain || domain.endsWith(`.${approvedDomain}`),
    ),
  );
};

export const validateScriptTags = (embedCode) => {
  const openingTags = embedCode.match(/<script\b[^<>]*>/gi) || [];

  const closingTags = embedCode.match(/<\/script\s*>/gi) || [];
 
  return openingTags.length > 0 && openingTags.length === closingTags.length;
};

export const validateEmbedCode = (embedCode) => {
  const scriptTagsValid = validateScriptTags(embedCode);
  const provider = findProvider(embedCode);
  const domains = extractDomains(embedCode);

  /**
   * Keep for debugging domain name matching
   * ***
    console.log({
    scriptTagsValid: validateScriptTags(embedCode),
    extractedDomains: extractDomains(embedCode),
    provider: findProvider(embedCode),
    });
   * 
   */

  if (!scriptTagsValid) {
    return {
      isValid: false,
      message:
        "Embed code must contain at least one complete script element with matching opening and closing tags.",
      provider: null,
    };
  }

  if (!provider) {
    return {
      isValid: false,
      message: "The embed provider is not approved, please contact the website builder team.",
      provider: null,
    };
  }

  if (domains.length === 0) {
    return{
      isValid: false,
      message: "No third party provider domains could be identified.",
      provider: provider,
    }
  }

  if (!validateAllowedDomains(embedCode, provider)) {
    return {
      isValid: false,
      message:
        "Embed code contains a domain that is not approved for this provider.",
      provider: provider,
    };
  }

  return {
    isValid: true,
    message: "Embed code has been validated successfully",
    provider: provider,
  };
};
