export default function PreviewItems({ index, attributes, fieldLabels, featuredImagePreviewClass }) {
	// Create a placeholder image
	const image = attributes.listingDisplayImage ? (
		<div
			className={`${featuredImagePreviewClass} wb-listing-thumbnail wbb:flex wbb:items-center wbb:justify-center wbb:border`}
			style={{ background: "#8888", borderColor: attributes.stylesResultsBorderColour }}
		>
			<svg
				className="wbb:h-[50%] wbb:w-[50%] wbb:text-gray-400"
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
			outerClass = "wbb:md:inline-flex wbb:gap-2 wbb:text-base";
			innerClass = "wbb:inline";
			break;
		case "inline-stacked":
			outerClass = "wbb:sm:inline-flex wbb:flex-col wbb:py-1 wbb:mr-4 wbb:text-base";
			innerClass = "wbb:sm:text-base wbb:[&_span.colon]:hidden";
			break;
		case "stacked-inline":
			outerClass = "wbb:flex wbb:gap-2 wbb:text-base";
			innerClass = "wbb:inline";
			break;
		default:
			outerClass = "wbb:flex wbb:gap-2 wbb:text-base wbb:flex-col";
			innerClass = "";
	}
	outerClass += " wbb:mt-4 wbb:pe-4";

	return (
		<div
			className={`wb-listing wbb:mb-4 wbb:flow-root ${
				attributes.stylesResultsShadedBackground ? "wb-shaded wbb:p-4" : "wbb:border-b wbb:pb-2"
			}`}
			style={{
				...(attributes.stylesResultsShadedBackground && attributes.stylesResultsShadedColour
					? { backgroundColor: attributes.stylesResultsShadedColour }
					: undefined),
				...(attributes.stylesResultsBorderColour ? { borderColor: attributes.stylesResultsBorderColour } : undefined),
			}}
		>
			{image}
			{attributes.variant === "auto-item-list" &&
			<h2 className="wbb:!mt-0 wbb:text-lg wbb:font-bold">
				<a>Title {index + 1}</a>
			</h2>
			}
			{attributes.variant !== "auto-item-list" &&
			<h2 className="wbb:!mt-0 wbb:text-2xl wbb:font-bold">
				<a>Title {index + 1}</a>
			</h2>
			}
			{attributes.listingDisplayFields.map(item => {
				const field = fieldLabels[item];
				const isSummary = field?.name === "post_summary";

				return (
					<div key={item} className={isSummary ? "wbb:mt-4 wbb:flex wbb:gap-2 wbb:pe-4" : outerClass}>
						{!isSummary && !attributes.stylesHideLabels && (
							<h3 className={`${innerClass} wbb:!my-0 wbb:text-base wbb:font-bold`}>
								{field?.label || item.replaceAll("_", " ")}
								<span className="colon">:</span>
							</h3>
						)}

						<div
							className={
								isSummary ? "wbb:inline" : `${innerClass} wbb:!my-0 wbb:before:content-['<'] wbb:after:content-['>']`
							}
						>
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
