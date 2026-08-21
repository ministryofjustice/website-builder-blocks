export default function Preview({ attributes, acfFields, taxonomies }) {
	if (attributes.variant !== "default") return;

	const selectedAcfFields = acfFields.filter(field => attributes.listingDisplayFields.includes(field.key));

	const selectedTaxonomies = taxonomies.filter(taxonomy => attributes.listingDisplayFields.includes(taxonomy.slug));

	const fieldLabels = {
		title: {
			label: "Title",
			name: "title",
			key: "title",
		},

		published_date: {
			label: "Published date",
			name: "date",
			key: "published_date",
		},

		...Object.fromEntries(
			selectedTaxonomies.map(taxonomy => [
				taxonomy.slug,
				{
					label: taxonomy.name,
					name: taxonomy.slug,
					key: taxonomy.slug,
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
				},
			]),
		),
	};

	var layoutClass = "grid grid-cols-1 sm:grid-cols-3 gap-4";
	//default, side-by-side - if converted from an auto-list, other values might be here
	if (attributes.stylesLayout === "stacked") {
		layoutClass = "wb-item-listing-is-stacked grid grid-cols-1 sm:grid-cols-1 gap-4";
		//wb-item-listing-is-stacked used to shew full day names if wide - see date-picker.js
	}

	const featuredImagePreviewClass =
		"float-right w-[125px] h-[125px] md:w-[152px] md:h-[152px] flex items-center justify-center";
	const image = attributes.listingDisplayImage ? (
		<div className={featuredImagePreviewClass} style={{ background: "#8888" }}>
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
	const repeatedContent = [
		<div className={`wb-listing mb-4 pb-2 ${attributes.stylesResultsShadedBackground ? "" : "border-b"}`}>
			There are 123456789 items
		</div>,
	];
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
						<div key={item} className={isSummary ? "mt-4 flex gap-2 pe-4 text-xl" : outerClass}>
							{!isSummary && !attributes.stylesHideLabels && (
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
					);
				})}
			</div>,
		);
	}

	return (
		<>
			Filterable listing
			<div className={`${attributes.className} wb-block-filterable-listing`}>
				<div className={layoutClass}>
					<div className="col-span-1 pr-[var(--prose-max-width-padding)]">
						{attributes.listingSearchTextFilter && <div>Search box</div>}
						{attributes.listingFilters.map(filter => {
							const field = fieldLabels[filter];
							const label = field?.name !== "category" ? field?.label || filter.replaceAll("_", " ") : "Topic";
							return <div key={filter}>{label}</div>;
						})}
						{attributes.listingFilters.map(filter => {
							if (attributes.listingDisplayFields.includes(filter) || attributes.listingDisplayTerms.includes(filter)) {
								return <div key={filter}>X {filter}</div>;
							}

							return <div key={filter}>{filter}</div>;
						})}
					</div>
					<div className="col-span-2">{repeatedContent}</div>
				</div>
			</div>
		</>
	);
}
