//Test allowed third party embed block is registered in the editor side

import metadata from "../block.json";

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

	// Since the apiVersion 3 migration, index.js passes only the editor
	// behaviour to registerBlockType(). Everything else — title, category, icon,
	// keywords, supports, attributes — comes from block.json, which is registered
	// server-side and reaches the editor through WordPress' block bootstrap. So
	// this asserts the call shape, and the metadata is checked separately below.
	it("registers the block with the editor behaviour", () => {
		const { registerBlockType } = require("@wordpress/blocks");

		require("../index");

		expect(registerBlockType).toHaveBeenCalledTimes(1);

		expect(registerBlockType).toHaveBeenCalledWith(
			"wb-blocks/allowed-third-party-embed",
			expect.objectContaining({
				edit: expect.any(Function),
				save: expect.any(Function),
			}),
		);
	});

	it("declares the expected metadata in block.json", () => {
		expect(metadata).toMatchObject({
			apiVersion: 3,
			name: "wb-blocks/allowed-third-party-embed",
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
		});
	});
});
