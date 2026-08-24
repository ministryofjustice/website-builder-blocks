export default function Preview({ attributes, acfFields, taxonomies }) {
	if (attributes.variant !== "default") return;

	const selectedAcfFields = acfFields.filter(field => attributes.listingDisplayFields.includes(field.key));

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
			type: "date_field",
		},

		...Object.fromEntries(
			taxonomies.map(taxonomy => [
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

	var layoutClass = "grid grid-cols-1 sm:grid-cols-3 gap-4";
	//default, side-by-side - if converted from an auto-list, other values might be here
	if (attributes.stylesLayout === "stacked") {
		layoutClass = "wb-item-listing-is-stacked grid grid-cols-1 sm:grid-cols-1 gap-4";
		//wb-item-listing-is-stacked used to shew full day names if wide - see date-picker.js
	}

	const featuredImagePreviewClass =
		"float-right w-[125px] h-[125px] md:w-[152px] md:h-[152px] flex items-center justify-center border";
	const image = attributes.listingDisplayImage ? (
		<div
			className={featuredImagePreviewClass}
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
	const repeatedContent = [];
	for (let i = 0; i < attributes.listingItemsPerPage; i++) {
		repeatedContent.push(
			<div
				key={i}
				className={`wb-listing mb-4 flow-root ${attributes.stylesResultsShadedBackground ? "wb-shaded p-4" : "border-b pb-2"}`}
				style={{
					...(attributes.stylesResultsShadedBackground && attributes.stylesResultsShadedColour
						? { backgroundColor: attributes.stylesResultsShadedColour }
						: {}),
					...(attributes.stylesResultsBorderColour ? { borderColor: attributes.stylesResultsBorderColour } : {}),
				}}
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
		<div className={`${attributes.className} wb-block-filterable-listing`}>
			<div className={layoutClass}>
				<div className="col-span-1 pr-[var(--prose-max-width-padding)]">
					{attributes.listingSearchTextFilter && (
						<>
							<div>
								<label className="mb-1 block font-medium">Search</label>
								<input
									disabled
									id="listing-search-field"
									name="listing_search"
									className="w-full border px-3 py-2"
									type="search"
								/>
							</div>
							<br />
						</>
					)}
					{attributes.listingFilters.map(filter => {
						const field = fieldLabels[filter];
						const label = field?.name !== "category" ? field?.label || filter.replaceAll("_", " ") : "Topic";
						if (field?.type == "taxonomy") {
							return (
								<>
									<div key={filter}>
										<label className="mb-1 block font-medium">{label}</label>
										<select disabled className="wb-blocks-filterable-listing-bloc-tax-filter w-full border px-3 py-2">
											<option value="0">Select option</option>
										</select>
									</div>
									<br />
								</>
							);
						} else if (field?.type == "date_field") {
							return (
								<>
									<div className="wb-datepicker">
										<label className="mb-1 block font-medium">Date from</label>
										<div className="mb-1 block font-medium">For example, 29/2/2024.</div>
										<div className="wb-datepicker__wrapper">
											<div className="flex">
												<input
													disabled
													className="wb-js-datepicker-input w-full px-3 py-2"
													id="published_date_from_date"
													name="published_date_from_date"
													type="text"
													aria-describedby="published_date_from_date_hint"
													autocomplete="off"
													value=""
												/>
												<button
													disabled
													className="wp-element-button wb-datepicker__toggle wb-js-datepicker-toggle px-1"
													type="button"
												>
													<svg
														width="32"
														height="24"
														focusable="false"
														className="wb-datepicker-icon"
														aria-hidden="true"
														role="img"
														viewBox="0 0 22 22"
													>
														<path
															fill="currentColor"
															fill-rule="evenodd"
															clip-rule="evenodd"
															d="M16.1333 2.93333H5.86668V4.4C5.86668 5.21002 5.21003 5.86667 4.40002 5.86667C3.59 5.86667 2.93335 5.21002 2.93335 4.4V2.93333H2C0.895431 2.93333 0 3.82877 0 4.93334V19.2667C0 20.3712 0.89543 21.2667 2 21.2667H20C21.1046 21.2667 22 20.3712 22 19.2667V4.93333C22 3.82876 21.1046 2.93333 20 2.93333H19.0667V4.4C19.0667 5.21002 18.41 5.86667 17.6 5.86667C16.79 5.86667 16.1333 5.21002 16.1333 4.4V2.93333ZM20.5333 8.06667H1.46665V18.8C1.46665 19.3523 1.91436 19.8 2.46665 19.8H19.5333C20.0856 19.8 20.5333 19.3523 20.5333 18.8V8.06667Z"
														></path>
														<rect x="3.66669" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
														<rect x="16.8667" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
													</svg>
												</button>
											</div>
										</div>
										<label className="mb-1 block font-medium">Date to</label>
										<div className="mb-1 block font-medium">For example, 29/2/2024.</div>
										<div className="wb-datepicker__wrapper">
											<div className="flex">
												<input
													disabled
													className="wb-js-datepicker-input w-full px-3 py-2"
													id="published_date_from_date"
													name="published_date_from_date"
													type="text"
													aria-describedby="published_date_from_date_hint"
													autocomplete="off"
													value=""
												/>
												<button
													disabled
													className="wp-element-button wb-datepicker__toggle wb-js-datepicker-toggle px-1"
													type="button"
												>
													<svg
														width="32"
														height="24"
														focusable="false"
														className="wb-datepicker-icon"
														aria-hidden="true"
														role="img"
														viewBox="0 0 22 22"
													>
														<path
															fill="currentColor"
															fill-rule="evenodd"
															clip-rule="evenodd"
															d="M16.1333 2.93333H5.86668V4.4C5.86668 5.21002 5.21003 5.86667 4.40002 5.86667C3.59 5.86667 2.93335 5.21002 2.93335 4.4V2.93333H2C0.895431 2.93333 0 3.82877 0 4.93334V19.2667C0 20.3712 0.89543 21.2667 2 21.2667H20C21.1046 21.2667 22 20.3712 22 19.2667V4.93333C22 3.82876 21.1046 2.93333 20 2.93333H19.0667V4.4C19.0667 5.21002 18.41 5.86667 17.6 5.86667C16.79 5.86667 16.1333 5.21002 16.1333 4.4V2.93333ZM20.5333 8.06667H1.46665V18.8C1.46665 19.3523 1.91436 19.8 2.46665 19.8H19.5333C20.0856 19.8 20.5333 19.3523 20.5333 18.8V8.06667Z"
														></path>
														<rect x="3.66669" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
														<rect x="16.8667" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
													</svg>
												</button>
											</div>
										</div>
									</div>
									<br />
								</>
							);
						}
					})}
				</div>
				<div className="col-span-2">
					<div
						className={`wb-listing mb-4 pb-2 ${attributes.stylesResultsShadedBackground ? "" : "border-b"}`}
						style={{ borderColor: attributes.stylesResultsBorderColour }}
					>
						𝑥 items
					</div>
					{repeatedContent}
				</div>
			</div>
			<div className="m-0 flex list-none items-center justify-center gap-4 p-0">
				<div className="inline-block">{`Page 1 of  ⌈𝑥÷${attributes.listingItemsPerPage}⌉`}</div>
				<div className="inline-block">
					<a href="#">
						<span className="inline-flex items-center gap-1">Next</span>
					</a>
				</div>
			</div>
		</div>
	);
}
