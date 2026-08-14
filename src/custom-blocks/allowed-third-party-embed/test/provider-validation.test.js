import { findProvider, validateAllowedDomains, validateScriptTags, extractDomains } from "../provider-validation";

const testEmbedCode = `<script id="ss-embed-123456">
				(function(d,w){
					var s,ss;
					ss=d.createElement('script');
					ss.type='text/javascript';
					ss.async=true;
					ss.src=('https:'==d.location.protocol?'https://':'http://')
						+'www.smartsurvey.co.uk/s/embed/123456/js/';
					s=d.getElementsByTagName('script')[0];
					s.parentNode.insertBefore(ss, s);
				})(document,window);
			</script>`;

const testEmbedCode2 = `
    <!-- Ticket Tailor Widget. Paste this into your website where you want the widget to appear. Do not change the code or the widget may not work properly. -->
<div class="tt-widget"><div class="tt-widget-fallback"><p><a href=" https://www.tickettailor.com/all-tickets/insightstestingboxoffice/?ref=website_widget&srch=9wrk&show_search_filter=true&show_date_filter=true&show_sort=true" target="_blank">Click here to buy tickets</a><br /><small><a href=" https://www.tickettailor.com?rf=wdg_230924" class="tt-widget-powered">Sell tickets online with Ticket Tailor</a></small></p></div><script src=" https://cdn.tickettailor.com/js/widgets/min/widget.js" data-url=" https://www.tickettailor.com/all-tickets/insightstestingboxoffice/?ref=website_widget&srch=9wrk&show_search_filter=true&show_date_filter=true&show_sort=true" data-type="inline" data-inline-minimal="false" data-inline-show-logo="false" data-inline-bg-fill="false" data-inline-inherit-ref-from-url-param="" data-inline-ref="website_widget"></script></div><!-- End of Ticket Tailor Widget -->

`;

describe("findProvider", () => {
	it("returns the matching provider when the supplied code contains an approved domain", () => {
		//smart-survey
		const result = findProvider(testEmbedCode);
		expect(result.id).toBe("smart-survey");

		//ticket-tailor
		const result_tt = findProvider(testEmbedCode2);
		expect(result_tt.id).toBe("ticket-tailor");
	});

	it("returns undefined when no approved provider is found", () => {
		//generic test
		const testEmbedCode = `
         <script> const url = " https://drevil.com"</script>
        `;
		const result = findProvider(testEmbedCode);

		expect(result).toBeUndefined();
	});
});

describe("validateAllowedDomains", () => {
	it("returns true when one domain belongs to the provider", () => {
		const provider1 = {
			id: "smart-survey",
			name: "SmartSurvey",
			domains: ["smartsurvey.co.uk"],
		};

		const provider_tt = {
			id: "ticket-tailor",
			name: "Ticket Tailor",
			domains: ["cdn.tickettailor.com", "www.tickettailor.com"],
		};
		//smart-survey
		const result = validateAllowedDomains(testEmbedCode, provider1);
		expect(result).toBe(true);

		//ticket-tailor
		const result_tt = validateAllowedDomains(testEmbedCode2, provider_tt);
		expect(result_tt).toBe(true);
	});

	//
	it("returns true when the provider has one allowed domain", () => {
		const provider1 = {
			id: "smart-survey",
			name: "SmartSurvey",
			domains: ["smartsurvey.co.uk"],
		};

		//smart-survey
		const result = validateAllowedDomains(testEmbedCode, provider1);
		expect(result).toBe(true);
	});

	it("returns true when all domains belong to the provider", () => {
		const provider1 = {
			id: "smart-survey",
			name: "SmartSurvey",
			domains: ["smartsurvey.co.uk", "smartsurvey.cdn"],
		};

		const provider_tt = {
			id: "ticket-tailor",
			name: "Ticket Tailor",
			domains: ["cdn.tickettailor.com", "www.tickettailor.com"],
		};

		//smart-survey
		const result = validateAllowedDomains(testEmbedCode, provider1);
		expect(result).toBe(true);
		//ticket-tailor
		const result_tt = validateAllowedDomains(testEmbedCode2, provider_tt);
		expect(result_tt).toBe(true);
	});

	it("returns false when the embeded code contains an unapproved domain", () => {
		const provider1 = {
			id: "smart-survey",
			name: "SmartSurvey",
			domains: ["smartsurvey.co.uk"],
		};

		const provider_tt = {
			id: "ticket-tailor",
			name: "Ticket Tailor",
			domains: ["cdn.tickettailor.com", "www.tickettailor.com"],
		};

		const embedSuspect = `
            <script> 
                const approved = "https://www.smartsurvey.co.uk/s/embed/123456/js/"";
                const suspect = "https://dodgey.dealings/file.js";
            
            </script>
        
        `;
		//
		const result = validateAllowedDomains(embedSuspect, provider1);
		expect(result).toBe(false);

		//ticket-tailor
		const result_tt = validateAllowedDomains(embedSuspect, provider_tt);
		expect(result_tt).toBe(false);
	});

	it("returns false when no domains are extracted", () => {
		const provider = {
			id: "ticket-tailor",
			name: "Ticket Tailor",
			domains: ["cdn.tickettailor.com", "www.tickettailor.com"],
		};

		const embedCode = `
        <script>
            console.log("No third party domain found");
        </script>
        `;

		expect(validateAllowedDomains(embedCode, provider)).toBe(false);
	});
});

describe("validateScriptTags", () => {
	it("returns true when there is one complete script element", () => {
		expect(validateScriptTags(testEmbedCode2)).toBe(true);
	});

	it("returns true when a complete script element is surrounded by other HTML", () => {
		const embedCode = `
        <div class="tt-widget">
            <p>Ticket Tailor widget</p>

            <script src="https://cdn.tickettailor.com/js/widgets/min/widget.js">
            </script>
        </div>
        `;

		expect(validateScriptTags(testEmbedCode)).toBe(true);
	});

	it("returns true when there are multiple complete script elements", () => {
		//generic test
		const embedCode = `
        <script src="https://testing1.com/hello.js"></script>
        <div>Widget content</div>
        <script src="https://testing2.com/goodbye.js"></script>
        `;

		expect(validateScriptTags(embedCode)).toBe(true);
	});

	it("returns false when there are no script elements", () => {
		//generic
		const embedCode = `
        <div>
            <p>No scripts here</p>
        </div>
        `;

		expect(validateScriptTags(embedCode)).toBe(false);
	});

	it("returns false when an opening script tag is missing", () => {
		//generic
		const embedCode = `
        console.log("test");
        </script>
        `;

		expect(validateScriptTags(embedCode)).toBe(false);
	});
	//generic
	it("returns false when an opening script tag is incomplete", () => {
		const embedCode = `
        <script id="ss-embed-123456"
            console.log("test");
        </script>
        `;

		expect(validateScriptTags(embedCode)).toBe(false);
	});

	it("returns false when the closing script tag is missing", () => {
		//generic
		const testEmbedCode = ` <script id="ss-embed-123456">  `;
		expect(validateScriptTags(testEmbedCode)).toBe(false);
	});

	it("returns false when the closing tag is incomplete", () => {
		//generic
		const testEmbedCode = ` script id="ss-embed-123456">  </script`;
		expect(validateScriptTags(testEmbedCode)).toBe(false);
	});

	it("returns false when there are more opening tags than closing tags", () => {
		//generic
		const embedCode = `
        <script src="https://example.com/first.js"></script>
        <script src="https://example.com/second.js">
        `;

		expect(validateScriptTags(embedCode)).toBe(false);
	});

	it("returns false when there are more closing tags than opening tags", () => {
		//generic
		const embedCode = `
        <script src="https://example.com/first.js"></script>
        </script>
        `;

		expect(validateScriptTags(embedCode)).toBe(false);
	});
});

describe("extractDomains", () => {
	it("extracts domains when URLs containing leading whitespace (catch tt)", () => {
		//generic
		const embedCode = `
                <script src=" https://cdn.tickettailor.com/js/widgets/min/widget.js"
                data-url=" https://www.tickettailor.com/all-tickets/test/" ></script>
            
            `;
		expect(extractDomains(embedCode)).toEqual(["cdn.tickettailor.com", "www.tickettailor.com"]);
	});
});
