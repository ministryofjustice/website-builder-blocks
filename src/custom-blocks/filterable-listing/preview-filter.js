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

	return "Filterable listing";
}
