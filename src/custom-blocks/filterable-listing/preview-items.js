export default function PreviewItems({ index, attributes, fieldLabels, featuredImagePreviewClass }) {
	// Create a placeholder image
	const image = attributes.listingDisplayImage ? (
		<div
			className={`${featuredImagePreviewClass} wb-listing-thumbnail flex items-center justify-center border`}
			style={{ background: "#8888", borderColor: attributes.stylesResultsBorderColour }}
		>
			<svg
				className="h-[50%] w-[50%] text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
				<circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
				<path d="M21 15l-5-5L5 21" strokeWidth="2" />
			</svg>
		</div>
	) : (
		""
	);

	var outerClass = "";
	var innerClass = "";
	switch (attributes.stylesFieldLayout) {
		case "inline":
			outerClass = "md:inline-flex gap-2 text-base";
			innerClass = "inline";
			break;
		case "inline-stacked":
			outerClass = "sm:inline-flex flex-col py-1 mr-4 text-base";
			innerClass = "sm:text-base [&_span.colon]:hidden";
			break;
		case "stacked-inline":
			outerClass = "flex gap-2 text-base";
			innerClass = "inline";
			break;
		default:
			outerClass = "flex gap-2 text-base flex-col";
			innerClass = "";
	}
	outerClass += " mt-4 pe-4";

	return (
		<div
			className={`wb-listing mb-4 flow-root ${
				attributes.stylesResultsShadedBackground ? "wb-shaded p-4" : "border-b pb-2"
			}`}
			style={{
				...(attributes.stylesResultsShadedBackground && attributes.stylesResultsShadedColour
					? { backgroundColor: attributes.stylesResultsShadedColour }
					: undefined),
				...(attributes.stylesResultsBorderColour ? { borderColor: attributes.stylesResultsBorderColour } : undefined),
			}}
		>
			{image}

			<h2 className="!mt-0 text-2xl font-bold">
				<a>Title {index + 1}</a>
			</h2>

			{attributes.listingDisplayFields.map(item => {
				const field = fieldLabels[item];
				const isSummary = field?.name === "post_summary";

				return (
					<div key={item} className={isSummary ? "mt-4 flex gap-2 pe-4 text-xl" : outerClass}>
						{!isSummary && !attributes.stylesHideLabels && (
							<h3 className={`${innerClass} !my-0 text-base font-bold`}>
								{field?.label || item.replaceAll("_", " ")}
								<span className="colon">:</span>
							</h3>
						)}

						<div className={isSummary ? "inline" : `${innerClass} !my-0 before:content-['<'] after:content-['>']`}>
							{field?.type === "taxonomy" && attributes.stylesTaxLinks ? (
								<a href="#">{field?.label || item.replaceAll("_", " ")}</a>
							) : (
								field?.label || item.replaceAll("_", " ")
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
