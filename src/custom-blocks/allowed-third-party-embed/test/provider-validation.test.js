import { findProvider, validateAllowedDomains, validateScriptTags } from "../provider-validation";
import { Providers } from "../third-party-providers"

const testEmbedCode = 
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





describe("findProvider", () => {
    it("returns the matching proivder when the supplied code contains an approved domain", () => {
        const result = findProvider(testEmbedCode);
        expect(result.id).toBe("smart-survey");
    })

    it("returns undefined when no approved provider is found", () => {
        const testEmbedCode = `
         <script> const url = "https://drevil.com"</script>
        `;
        const result = findProvider(testEmbedCode);

        expect(result).toBeUndefined();
    });
});

describe("validateAllowedDomains", () => {
    it("returns true when one domain belongs to the provder", () => {
        const provider1 = {
            id:"smart-survey",
            name:"SmartSurvey",
            domains: ["smartsurvey.co.uk"],
        }

        const result = validateAllowedDomains(testEmbedCode, provider1);

        expect(result).toBe(true);
    });

    it("returns true when a domain belongs to the provder", () => {
        const provider1 = {
            id:"smart-survey",
            name:"SmartSurvey",
            domains: ["smartsurvey.co.uk"],
        }

        const result = validateAllowedDomains(testEmbedCode, provider1);

        expect(result).toBe(true);
    });

    it("returns true when all domains belong to the provder", () => {
        const provider1 = {
            id:"smart-survey",
            name:"SmartSurvey",
            domains: ["smartsurvey.co.uk", "smartsurvey.cdn"],
        }

        const result = validateAllowedDomains(testEmbedCode, provider1);

        expect(result).toBe(true);

    });

    it("returns false when the embeded code contains an unapproved domain", () =>{
        const provider1 = {
            id:"smart-survey",
            name:"SmartSurvey",
            domains: ["smartsurvey.co.uk"],
        }

        const embedSuspect = `
            <script> 
                const approved = "https://www.smartsurvey.co.uk/s/embed/123456/js/"";
                const suspect = "https://dodgey.dealings/file.js";
            
            </script>
        
        `

        const result = validateAllowedDomains(embedSuspect, provider1);

        expect(result).toBe(false);
    });

    describe("validateScriptTags", () => {

        it("returns true when the code starts with an opeining script tag and ends with a closing script tag", ()=> {

            expect(validateScriptTags(testEmbedCode)).toBe(true);

        });

        it("returns false when the opening script tage is missing", ()=> {
            const testEmbedCode = `id="ss-embed-123456">  </script`;
            expect(validateScriptTags(testEmbedCode)).toBe(false);

        });

        it("returns false when the opeining script tag is imcomplete", ()=> {
             const testEmbedCode = ` pt id="ss-embed-123456">  </script`;
            expect(validateScriptTags(testEmbedCode)).toBe(false);

        });

        it("returns false when the closing script tag script tag is missing", ()=> {
            const testEmbedCode = ` <script id="ss-embed-123456">  `;
            expect(validateScriptTags(testEmbedCode)).toBe(false);

        })

        it("returns false when the closing tag is imcomplete", ()=> {
             const testEmbedCode = ` script id="ss-embed-123456">  </script`;
            expect(validateScriptTags(testEmbedCode)).toBe(false );

        });
     })


    
})