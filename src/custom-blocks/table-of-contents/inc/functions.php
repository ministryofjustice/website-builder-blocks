<?php
	add_filter( 'the_content', 'wb_filter_add_index_for_h2_elements', 100 );
	function wb_filter_add_index_for_h2_elements( $content ) {
		// Check if we're inside the main loop in a single Post.
		if ( is_singular() && in_the_loop() && is_main_query()) {
			return wb_get_ordered_content($content)["content"];
		}
	}

	function wb_get_ordered_content($content) {
		if ( !has_block( 'wb-blocks/table-of-contents', get_the_ID() ) ) return array("content"=>$content);
		$index = [];
		if (empty($content)) {
			return ["index" => $index, "content" => $content];
		}
		$count = 0; //index number
		$dom = new DOMDocument();
		libxml_use_internal_errors(true);
		if (!$dom->loadHtml('<?xml encoding="UTF-8">'.$content)) {
			return array("index"=>$index,"content"=>$content);
		}
		libxml_clear_errors();
		$xpath = new DOMXPath($dom);
		$tags = $xpath->query('//h2');
		$hiddentags = $xpath->query('//b');
		$back_to_top_text = "Back to top"; //fallback
		foreach($hiddentags as $tag) {
			$tag_id = $tag->getAttribute('id');
			if ($tag_id == "back-to-top-link-text") {
				$back_to_top_text = esc_html($tag->nodeValue);
				// This grabs the text content of the B tag with the correct ID, so it can be passed into the content below.
				// This text content is set in the block settings.
				break;
			};
		}
		foreach($tags as $tag) {
			$heading_class = $tag->getAttribute('class');
			if (
				str_contains($heading_class,"wb-toc-ignore") ||
				str_contains($heading_class,"wb-table-of-contents__heading")
				) continue; // We ignore headings with the class "wb-toc-ignore" and the ToC's own H2

			$tag->setAttribute('class', $heading_class." wb-toc-heading");
			$title = $tag->nodeValue;
			$id = preg_replace('/[^a-zA-Z0-9]/', '', remove_accents($title));
			$id = ++$count."-$id"; //$count is incremented & added to ID (this ensures no duplicates)
			$index[] = ["title"=>$title,"id"=>$id];

			//Jump to top link
			$jump_link = $dom->createElement("a",$back_to_top_text);
			$jump_link->setAttribute('href', '#table-of-contents-heading'); //link to the table of contents title
			$tag_suffix = $dom->createElement("span"," (");
			$tag_suffix->setAttribute('class', 'wb-jump-link has-small-font-size');
			$tag_suffix->appendChild($jump_link);
			$tag_suffix->append(")");
	
			$tag->appendChild($tag_suffix);
			$tag->setAttribute('id', $id);
		}
	
		// This is the content with IDs for all h2 elements (or whatever was set in $tags)
		$changed_content = trim($dom->saveHtml());

		//$changed_content = wb_toc_column_layout($changed_content);
	
		return array("index"=>$index,"content"=>$changed_content);
	}

	/**
	 * This function constructs a table of contents
	 * from the number of H2s on the page, which it
	 * gets from the above funciton
	 */

	function wb_table_of_contents($content, $class="", $toc_title="Table of contents", $top="Back to top") {
		$list_class = "";

		$index = wb_get_ordered_content($content)["index"];

		// Create the table of contents
		$list_of_headings = "";
		$count_headings = 0;
		foreach ($index as $content_item) {
			$list_of_headings .= '<li class="wb-table-of-contents__item"><a id="anchor-for-'.$content_item["id"].'" class="govuk-link govuk-link--no-visited-state" href="#'.$content_item["id"].'">'.$content_item["title"].'</a></li>';
			$count_headings++;
		}

		if ($list_of_headings == "") return ""; // If there are no matched headings, then there is no table of contents to shew

		$print_columns = "";
		// If there are more than 15 headings, put it in columns to make better use of the page
		// Increase to 3 columns after 25 (less space might make more wrap)
		if ($count_headings > 15) $print_columns = "wb-print-col wb-print-col--2";
		if ($count_headings > 25) $print_columns = "wb-print-col wb-print-col--3";

		$toc = "<div id='table-of-contents' class='wb-table-of-contents $class'>
				<h2 class='wb-table-of-contents__heading' id='table-of-contents-heading'>$toc_title</h2>
				<p hidden><b id='back-to-top-link-text'>$top</b></p>
				<ol class='wb-table-of-contents__list $list_class $print_columns'>$list_of_headings</ol>
			</div>";

		return $toc;
	}
?>
