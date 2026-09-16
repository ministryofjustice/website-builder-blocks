import PreviewItems from "./preview-items.js";

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
			type: "date_field",
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

	// Image position - using float left and float right here for simpler code (the php file has more comprehensive positioning)
	const float = attributes.listingImagePosition;
	let imagePosition =
		float == "left" ? "wbb:sm:float-left wbb:mr-[5px]" : float == "right" ? "wbb:sm:float-right wbb:ml-3" : "";
	imagePosition += " wbb:mb-2";
	var overarchingClass = "wbb:grid ";
	var featuredImagePreviewClass = `${imagePosition} wbb:w-[125px] wbb:h-[125px] wbb:md:w-[152px] wbb:md:h-[152px]`;
	switch (attributes.stylesLayout) {
		case "stacked":
			overarchingClass += "wbb:grid-cols-1";
			break;
		case "side-by-side-2-1":
			overarchingClass += "wbb:grid-cols-1 wbb:md:grid-cols-2";
			break;
		case "side-by-side": // 3-1
			overarchingClass += "wbb:grid-cols-1 wbb:md:grid-cols-3";
			featuredImagePreviewClass += " wbb:md:float-none";
			break;
		case "side-by-side-4-1":
			overarchingClass += "wbb:grid-cols-1 wbb:lg:grid-cols-4";
			featuredImagePreviewClass = `${imagePosition} wbb:lg:float-none wbb:w-[125px] wbb:h-[125px] wbb:lg:w-[152px] wbb:lg:h-[152px]`;
			break;
		case "side-by-side-4-2":
			overarchingClass += "wbb:grid-cols-1 wbb:sm:grid-cols-2 wbb:lg:grid-cols-4";
			featuredImagePreviewClass = `${imagePosition} wbb:lg:float-none wbb:w-[125px] wbb:h-[125px] wbb:sm:w-[100px] wbb:sm:h-[100px] wbb:lg:w-[152px] wbb:lg:h-[152px]`;
			break;
		default:
			overarchingClass += "wbb:grid-cols-1 wbb:md:grid-cols-3 ";
	}

	if (attributes.stylesResultsShadedBackground) overarchingClass += " wbb:gap-x-4";

	return (
		<div className={overarchingClass}>
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
	);
}
