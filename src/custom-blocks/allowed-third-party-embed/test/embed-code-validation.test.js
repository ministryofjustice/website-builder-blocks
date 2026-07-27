import { validateEmbedCode } from "../provider-validation"

const validEmbedCode = 
    `<script id="ss-embed-123456">
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


describe("validateEmbedCode", () => {
    it("returns a valid status and message for allowed embed codeembed code", () =>{
        const result = validateEmbedCode(validEmbedCode);

        expect(result).toEqual({
            isValid: true,
            message: "Embed code has been validated",
        });
    });
    
    it("returns an invalid result when the script tags are incomplete", () => {
        const invalidEmbed = validEmbedCode.replace(
            "</script>",
            ""
        );

        expect(validateEmbedCode(invalidEmbed)).toEqual({
            isValid: false,
            message:
                "The embed code must start with an opening script tag and end with a closing script tag.",
        });
    });

    it("returns an error when the provider is not approved", () => {
        const invalidEmbed = validEmbedCode.replace(
            "www.smartsurvey.co.uk",
            "www.not-trusted.com",
        );

        expect(validateEmbedCode(invalidEmbed)).toEqual({
            isValid: false,
            message:
                "The embed provider is not approved.",
            });
        });


});