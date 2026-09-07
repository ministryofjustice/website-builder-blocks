const { Fragment } = wp.element;
import PreviewItems from "./preview-items.js";

export default function Preview({ attributes, acfFields, taxonomies }) {
	if (attributes.variant !== "default") return null;

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
	const float = attributes.listingImagePosition;
	let imagePosition = float == "left" ? "sm:float-left mr-[5px]" : float == "right" ? "sm:float-right ml-3" : "";
	imagePosition += " mb-2";
	const featuredImagePreviewClass = `${imagePosition} w-[125px] h-[125px] md:w-[152px] md:h-[152px]`;

	return (
		<div className={`${attributes.className} wb-block-filterable-listing`}>
			<div className={layoutClass}>
				<div className="col-span-1 pr-[var(--prose-max-width-padding)]">
					{attributes.listingSearchTextFilter && (
						<>
							<div>
								<label className="mb-1 block font-medium">Search</label>
								<input disabled className="w-full border px-3 py-2" type="search" />
							</div>
							<br />
						</>
					)}
					{attributes.listingFilters &&
						attributes.listingFilters.map(filter => {
							const field = fieldLabels[filter];
							const label = field?.name !== "category" ? field?.label || filter.replaceAll("_", " ") : "Topic";
							if (field?.type == "taxonomy") {
								return (
									<Fragment key={filter}>
										<div>
											<label className="mb-1 block font-medium">{label}</label>
											<select disabled className="wb-blocks-filterable-listing-bloc-tax-filter w-full border px-3 py-2">
												<option value="0">Select option</option>
											</select>
										</div>
										<br />
									</Fragment>
								);
							} else if (field?.type == "date_field") {
								return (
									<Fragment key={filter}>
										<div className="wb-datepicker">
											<label className="mb-1 block font-medium">Date from</label>
											<div className="mb-1 block font-medium">For example, 29/2/2024.</div>
											<div className="wb-datepicker__wrapper">
												<div className="flex">
													<input disabled className="wb-js-datepicker-input w-full px-3 py-2" type="text" value="" />
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
																fillRule="evenodd"
																clipRule="evenodd"
																d="M16.1333 2.93333H5.86668V4.4C5.86668 5.21002 5.21003 5.86667 4.40002 5.86667C3.59 5.86667 2.93335 5.21002 2.93335 4.4V2.93333H2C0.895431 2.93333 0 3.82877 0 4.93334V19.2667C0 20.3712 0.89543 21.2667 2 21.2667H20C21.1046 21.2667 22 20.3712 22 19.2667V4.93333C22 3.82876 21.1046 2.93333 20 2.93333H19.0667V4.4C19.0667 5.21002 18.41 5.86667 17.6 5.86667C16.79 5.86667 16.1333 5.21002 16.1333 4.4V2.93333ZM20.5333 8.06667H1.46665V18.8C1.46665 19.3523 1.91436 19.8 2.46665 19.8H19.5333C20.0856 19.8 20.5333 19.3523 20.5333 18.8V8.06667Z"
															></path>
															<rect
																x="3.66669"
																width="1.46667"
																height="5.13333"
																rx="0.733333"
																fill="currentColor"
															></rect>
															<rect
																x="16.8667"
																width="1.46667"
																height="5.13333"
																rx="0.733333"
																fill="currentColor"
															></rect>
														</svg>
													</button>
												</div>
											</div>
											<label className="mb-1 block font-medium">Date to</label>
											<div className="mb-1 block font-medium">For example, 29/2/2024.</div>
											<div className="wb-datepicker__wrapper">
												<div className="flex">
													<input disabled className="wb-js-datepicker-input w-full px-3 py-2" type="text" value="" />
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
																fillRule="evenodd"
																clipRule="evenodd"
																d="M16.1333 2.93333H5.86668V4.4C5.86668 5.21002 5.21003 5.86667 4.40002 5.86667C3.59 5.86667 2.93335 5.21002 2.93335 4.4V2.93333H2C0.895431 2.93333 0 3.82877 0 4.93334V19.2667C0 20.3712 0.89543 21.2667 2 21.2667H20C21.1046 21.2667 22 20.3712 22 19.2667V4.93333C22 3.82876 21.1046 2.93333 20 2.93333H19.0667V4.4C19.0667 5.21002 18.41 5.86667 17.6 5.86667C16.79 5.86667 16.1333 5.21002 16.1333 4.4V2.93333ZM20.5333 8.06667H1.46665V18.8C1.46665 19.3523 1.91436 19.8 2.46665 19.8H19.5333C20.0856 19.8 20.5333 19.3523 20.5333 18.8V8.06667Z"
															></path>
															<rect
																x="3.66669"
																width="1.46667"
																height="5.13333"
																rx="0.733333"
																fill="currentColor"
															></rect>
															<rect
																x="16.8667"
																width="1.46667"
																height="5.13333"
																rx="0.733333"
																fill="currentColor"
															></rect>
														</svg>
													</button>
												</div>
											</div>
										</div>
										<br />
									</Fragment>
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
					{Array.from({ length: attributes.listingItemsPerPage }, (_, i) => (
						<PreviewItems
							key={i}
							index={i}
							attributes={attributes}
							fieldLabels={fieldLabels}
							featuredImagePreviewClass={featuredImagePreviewClass}
						/>
					))}
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
