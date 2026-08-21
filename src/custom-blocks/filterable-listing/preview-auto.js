export default function Preview({ attributes, acfFields, taxonomies }) {
	if (attributes.variant !== "auto-item-list") return;

	const selectedAcfFields = acfFields.filter(field => attributes.listingDisplayFields.includes(field.key));

	const selectedTaxonomies = taxonomies.filter(taxonomy => attributes.listingDisplayFields.includes(taxonomy.slug));

	const fieldLabels = {
		title: {
			label: "Title",
			name: "title",
			key: "title",
			type: "field",
		},

		published_date: {
			label: "Published date",
			name: "date",
			key: "published_date",
			type: "field",
		},

		...Object.fromEntries(
			selectedTaxonomies.map(taxonomy => [
				taxonomy.slug,
				{
					label: taxonomy.name,
					name: taxonomy.slug,
					key: taxonomy.slug,
					type: "taxonomy",
				},
			]),
		),

		...Object.fromEntries(
			selectedAcfFields.map(field => [
				field.key,
				{
					label: field.label,
					name: field.name,
					key: field.key,
					type: "acf",
				},
			]),
		),
	};

	var overarchingClass = "grid ";
	var featuredImageClass = "float-right w-[125px] h-[125px] md:w-[152px] md:h-[152px]";
	switch (attributes.stylesLayout) {
		case "stacked":
			overarchingClass += "grid-cols-1";
			break;
		case "side-by-side-2-1":
			overarchingClass += "grid-cols-1 md:grid-cols-2";
			break;
		case "side-by-side": // 3-1
			overarchingClass += "grid-cols-1 md:grid-cols-3";
			featuredImageClass += " md:float-none";
			break;
		case "side-by-side-4-1":
			overarchingClass += "grid-cols-1 lg:grid-cols-4";
			featuredImageClass = "float-right lg:float-none w-[125px] h-[125px] lg:w-[152px] lg:h-[152px]";
			break;
		case "side-by-side-4-2":
			overarchingClass += "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
			featuredImageClass =
				"sm:float-right lg:float-none w-[125px] h-[125px] sm:w-[100px] sm:h-[100px] lg:w-[152px] lg:h-[152px]";
			break;
		default:
			overarchingClass += "grid-cols-1 md:grid-cols-3 ";
	}

	if (attributes.stylesResultsShadedBackground) overarchingClass += " gap-x-4";

	const image = attributes.listingDisplayImage ? (
		<div className={`${featuredImageClass} flex items-center justify-center`} style={{ background: "#8888" }}>
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
	console.log("X", attributes.stylesFieldLayout);
	switch (attributes.stylesFieldLayout) {
		case "inline":
			outerClass = "md:inline-flex gap-2 text-base";
			innerClass = "inline";
			break;
		case "inline-stacked":
			outerClass = "sm:inline-flex flex-col py-1 mr-4 sm:text-lg text-base";
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
	const repeatedContent = [];
	for (let i = 0; i < attributes.listingItemsPerPage; i++) {
		repeatedContent.push(
			<div
				key={i}
				className={`wb-listing mb-4 flow-root ${attributes.stylesResultsShadedBackground ? "wb-shaded p-4" : "border-b pb-2"}`}
			>
				{image}
				<h2 className="text-2xl font-bold">Title {i + 1}</h2>
				{attributes.listingDisplayFields.map(item => {
					const field = fieldLabels[item];
					const isSummary = field?.name === "post_summary";
					return (
					<div
						key={item}
						className={isSummary ? "mt-4 flex gap-2 pe-4 text-xl" : outerClass}
					>
						{isSummary && !attributes.stylesHideLabels && (
							<h3 className={`${innerClass} !my-0 text-base font-bold`}>
								{field?.label || item.replaceAll("_", " ")}
								<span className="colon">:</span>
							</h3>
						)}
						<div
							className={
								field?.name == "post_summary"
									? "inline"
									: `${innerClass} !my-0 before:content-['<'] after:content-['>']`
							}
						>
							{field?.type == "taxonomy" && attributes.stylesTaxLinks ? (
								<a href="#">{field?.label || item.replaceAll("_", " ")}</a>
							) : (
								field?.label || item.replaceAll("_", " ")
							)}
						</div>
					</div>
				)})}
			</div>,
		);
	}

	return (
		<>
			<div className={overarchingClass}>{repeatedContent}</div>
		</>
	);
}
