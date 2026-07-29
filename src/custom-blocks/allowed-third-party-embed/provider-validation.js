import { PROVIDERS } from "./third-party-providers";

export const findProvider = (embedCode) => {
  return PROVIDERS.find((provider) =>
    provider.domains.some((domain) => embedCode.includes(domain)),
  );
};

const extractDomains = (embedCode) => {
  const stringPattern = /(['"`])((?:\\.|(?!\1).)*)\1/g;
  const domains = [];

  for (const match of embedCode.matchAll(stringPattern)) {
    const stringValue = match[2];

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
  //regex match for http(s)://text
  const domains = extractDomains(embedCode);
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
    const openingTag = /^<script\b[^>]*>/i;
    const closingTag = /<\/script>\s*$/i;

    const trimEmbedCode = embedCode.trim();

    return (openingTag.test(trimEmbedCode) && closingTag.test(trimEmbedCode));
	
};

export const validateEmbedCode = (embedCode) => {
    const provider = findProvider(embedCode);

    if (!validateScriptTags(embedCode)) {
		return {
			isValid: false,
			message:
				"The embed code must start with an opening script tag and end with a closing script tag.",
      provider: null,
		};
	}

    if(!provider){
        return {
          isValid: false,
          message:
              "The embed provider is not approved.",
          provider:null,
          };

    }
    
    if (
        provider &&
        validateScriptTags(embedCode) &&
        validateAllowedDomains(embedCode, provider)
    ) return {
        isValid: true,
        message: "Embed code has been validated",
        provider:provider,
    }

}