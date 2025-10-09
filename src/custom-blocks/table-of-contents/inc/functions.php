<?php
	add_filter( 'the_content', 'wb_filter_add_index_for_h2_elements', 1 );
	function wb_filter_add_index_for_h2_elements( $content ) {
		// Check if we're inside the main loop in a single Post.
		if ( is_singular() && in_the_loop() && is_main_query()) {
			$back_to_top_text = get_back_to_top_text();
			return wb_get_ordered_content($content,$back_to_top_text)["content"];
		}
	}

	function wb_get_ordered_content($content, $back_to_top_text = "Back to top") {
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
		foreach($tags as $tag) {
			$heading_class = $tag->getAttribute('class');
			if (str_contains($heading_class,"wb-toc-ignore")) continue; // We ignore headings with the class "wb-toc-ignore"

			$tag->setAttribute('class', "wb-toc-heading");
			$title = $tag->nodeValue;
			$id = preg_replace('/[^a-zA-Z0-9]/', '', remove_accents($title));
			$id = ++$count."-$id"; //$count is incremented & added to ID (this ensures no duplicates)
			$index[] = ["title"=>$title,"id"=>$id];

			//Jump to top link
			$jump_link = $dom->createElement("a",esc_html($back_to_top_text));
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

	function wb_table_of_contents($content, $class="") {
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
				<h2 class='wb-table-of-contents__heading' id='table-of-contents-heading'>Table of contents</h2>
				<ol class='wb-table-of-contents__list $list_class $print_columns'>$list_of_headings</ol>
			</div>";

		return $toc;
	}

	function get_back_to_top_text() {
		$lang = get_locale(); // gets page language
		if (substr($lang,0,2) == "cy")
			// transation from https://www.legislation.gov.uk/cy/ukpga/1991/34/part/II/crossheading/new-enforcement-powers/1991-09-25/data.htm?wrap=true#top
			return "Yn ôl i’r brig";
		return "Back to top";
	}
?>
