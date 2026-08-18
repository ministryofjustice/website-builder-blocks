import { validateEmbedCode } from "../provider-validation";

const validEmbedCode = `<script id="ss-embed-123456">
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

const validEmbedCode_tt = `<!-- Ticket Tailor Widget. Paste this into your website where you want the widget to appear. Do not change the code or the widget may not work properly. -->
<div class="tt-widget"><div class="tt-widget-fallback"><p><a href=" https://www.tickettailor.com/events/websitebuilder/1547812/select-date?show_search_filter=true&show_date_filter=true&show_sort=true" target="_blank">Click here to buy tickets</a><br /><small><a href=" https://www.tickettailor.com?rf=wdg_230189" class="tt-widget-powered">Sell tickets online with Ticket Tailor</a></small></p></div><script src=" https://cdn.tickettailor.com/js/widgets/min/widget.js" data-url=" https://www.tickettailor.com/events/websitebuilder/1547812/select-date?show_search_filter=true&show_date_filter=true&show_sort=true" data-type="inline" data-inline-minimal="false" data-inline-show-logo="true" data-inline-bg-fill="true" data-inline-inherit-ref-from-url-param="" data-inline-ref=""></script></div><!-- End of Ticket Tailor Widget -->`;

describe("validateEmbedCode", () => {
	it("returns a valid status and message for allowed embed code", () => {
		const result = validateEmbedCode(validEmbedCode);
		const result_tt = validateEmbedCode(validEmbedCode_tt);

		const returnObj = {
			isValid: true,
			message: "Embed code has been validated successfully",
		};
		//smart survey
		expect(result).toMatchObject(returnObj);
		expect(result.provider).not.toBeNull();
		expect(result.provider.name).toBe("SmartSurvey");

		//tt
		expect(result_tt).toMatchObject(returnObj);
		expect(result_tt.provider).not.toBeNull();
		expect(result_tt.provider.name).toBe("Ticket Tailor");
	});

	it("returns an invalid result when the script tags are not found or incomplete", () => {
		const returnObj = {
			isValid: false,
			message: "Embed code must contain at least one complete script element with matching opening and closing tags.",
			provider: null,
		};

		//smart survey
		const invalidEmbed = validEmbedCode.replace("</script>", "");

		expect(validateEmbedCode(invalidEmbed)).toEqual(returnObj);

		//tt
		const invalidEmbed_tt = validEmbedCode_tt.replace("</script>", "");

		expect(validateEmbedCode(invalidEmbed_tt)).toEqual(returnObj);
	});

	it("returns an error when the provider is not approved", () => {
		const invalidEmbed = validEmbedCode.replace("www.smartsurvey.co.uk", "www.not-trusted.com");

		expect(validateEmbedCode(invalidEmbed)).toEqual({
			isValid: false,
			message: "The embed provider is not approved, please contact the website builder team.",
			provider: null,
		});
	});
});
