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

	var overarchingClass = "grid ";
	var featuredImagePreviewClass = "float-right w-[125px] h-[125px] md:w-[152px] md:h-[152px]";
	switch (attributes.stylesLayout) {
		case "stacked":
			overarchingClass += "grid-cols-1";
			break;
		case "side-by-side-2-1":
			overarchingClass += "grid-cols-1 md:grid-cols-2";
			break;
		case "side-by-side": // 3-1
			overarchingClass += "grid-cols-1 md:grid-cols-3";
			featuredImagePreviewClass += " md:float-none";
			break;
		case "side-by-side-4-1":
			overarchingClass += "grid-cols-1 lg:grid-cols-4";
			featuredImagePreviewClass = "float-right lg:float-none w-[125px] h-[125px] lg:w-[152px] lg:h-[152px]";
			break;
		case "side-by-side-4-2":
			overarchingClass += "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
			featuredImagePreviewClass =
				"sm:float-right lg:float-none w-[125px] h-[125px] sm:w-[100px] sm:h-[100px] lg:w-[152px] lg:h-[152px]";
			break;
		default:
			overarchingClass += "grid-cols-1 md:grid-cols-3 ";
	}

	if (attributes.stylesResultsShadedBackground) overarchingClass += " gap-x-4";

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
