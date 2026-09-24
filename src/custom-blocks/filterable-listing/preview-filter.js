import { Fragment } from "@wordpress/element";
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

	var layoutClass = "wbb:grid wbb:grid-cols-1 wbb:sm:grid-cols-3 wbb:gap-4";
	//default, side-by-side - if converted from an auto-list, other values might be here
	if (attributes.stylesLayout === "stacked") {
		layoutClass = "wb-item-listing-is-stacked wbb:grid wbb:grid-cols-1 wbb:sm:grid-cols-1 wbb:gap-4";
		//wb-item-listing-is-stacked used to shew full day names if wide - see date-picker.js
	}
	const float = attributes.listingImagePosition;
	let imagePosition =
		float == "left" ? "wbb:sm:float-left wbb:mr-[5px]" : float == "right" ? "wbb:sm:float-right wbb:ml-3" : "";
	imagePosition += " wbb:mb-2";
	const featuredImagePreviewClass = `${imagePosition} wbb:w-[125px] wbb:h-[125px] wbb:md:w-[152px] wbb:md:h-[152px]`;

	const arrowIndex = attributes.stylesArrows?.[0] ?? 0;
	const arrowRight = attributes.stylesArrows?.[2] ?? "";
	const maskRight = arrowIndex > 0 && arrowRight ? `url("${arrowRight}")` : undefined;
	return (
		<div className={`${attributes.className} wb-block-filterable-listing`}>
			<div className={layoutClass}>
				<div className="wbb:col-span-1 wbb:pr-[var(--prose-max-width-padding)]">
					{attributes.listingSearchTextFilter && (
						<>
							<div>
								<label className="wbb:mb-1 wbb:block wbb:font-medium">Search</label>
								<input disabled className="wbb:w-full wbb:border wbb:px-3 wbb:py-2" type="search" />
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
											<label className="wbb:mb-1 wbb:block wbb:font-medium">{label}</label>
											<select disabled className="wb-blocks-filterable-listing-bloc-tax-filter wbb:w-full wbb:border wbb:px-3 wbb:py-2">
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
											<label className="wbb:mb-1 wbb:block wbb:font-medium">Date from</label>
											<div className="wbb:mb-1 wbb:block wbb:font-medium">For example, 29/2/2024.</div>
											<div className="wb-datepicker__wrapper">
												<div className="wbb:flex">
													<input disabled className="wb-js-datepicker-input wbb:w-full wbb:px-3 wbb:py-2" type="text" value="" />
													<button
														disabled
														className="wp-element-button wb-datepicker__toggle wb-js-datepicker-toggle wbb:px-1"
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
											<label className="wbb:mb-1 wbb:block wbb:font-medium">Date to</label>
											<div className="wbb:mb-1 wbb:block wbb:font-medium">For example, 29/2/2024.</div>
											<div className="wb-datepicker__wrapper">
												<div className="wbb:flex">
													<input disabled className="wb-js-datepicker-input wbb:w-full wbb:px-3 wbb:py-2" type="text" value="" />
													<button
														disabled
														className="wp-element-button wb-datepicker__toggle wb-js-datepicker-toggle wbb:px-1"
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
				<div className="wbb:col-span-2">
					<div
						className={`wb-listing wbb:mb-4 wbb:pb-2 ${attributes.stylesResultsShadedBackground ? "" : "wbb:border-b"}`}
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
			<div className="wbb:m-0 wbb:flex wbb:list-none wbb:items-center wbb:justify-center wbb:gap-4 wbb:p-0">
				<div className="wbb:inline-block">{`Page 1 of  ⌈𝑧÷${attributes.listingItemsPerPage}⌉`}</div>
				<div className="wbb:inline-block">
					<a href="#" style={{ "--right-icon": maskRight }} className={`wbb-page-nav ${attributes.stylesArrows[0] > 0 ? "wbb-page-nav--next" : ""}`}>
						<span className="wbb:inline-flex wbb:items-center wbb:gap-1">Next</span>
					</a>
				</div>
			</div>
		</div>
	);
}
