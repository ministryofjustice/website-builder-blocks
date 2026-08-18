//Test allowed third party embed block is registered in the editor side

//mock the function call
jest.mock("@wordpress/blocks", () => ({
	registerBlockType: jest.fn(),
}));

//Mock the Edit component - only need to know it is present
// Not testing it renders anything so return null in this instance

jest.mock("../edit", () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

describe("Confirms allowed third-party embed block registration", () => {
	//clear mock history and clear node cache
	// Importing modules so need to clear cache each time the test runs
	//required in this instance because registerBlockType() happens when the module is loaded
	beforeEach(() => {
		jest.resetModules();
	});

	it("registers the block with the expected settings", () => {
		const { registerBlockType } = require("@wordpress/blocks");

		require("../index");

		expect(registerBlockType).toHaveBeenCalledTimes(1);

		expect(registerBlockType).toHaveBeenCalledWith(
			"wb-blocks/allowed-third-party-embed",
			expect.objectContaining({
				title: "Allowed third party embed",
				description: "Add code from an allowed third party provider",
				category: "wb-blocks",
				icon: "embed-generic",
				keywords: ["html", "third party embed", "smart survey", "ticket tailor", "script"],
				supports: {
					html: false,
				},
				attributes: {
					embedCode: {
						type: "string",
						default: "",
					},
					provider: {
						type: "string",
						default: "",
					},
					validationStatus: {
						type: "string",
						default: "not-validated",
					},
					validationMessage: {
						type: "string",
						default: "",
					},
				},
				edit: expect.any(Function),
				save: expect.any(Function),
			}),
		);
	});
});
