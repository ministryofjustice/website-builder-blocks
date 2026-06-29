<?php
	add_filter( 'the_content', 'wb_filter_add_index_for_h2_elements', 100 );
	function wb_filter_add_index_for_h2_elements( $content ) {
		if ( empty( $content ) ) {
			return $content;
		}

		if ( is_singular() && in_the_loop() && is_main_query() ) {
			$result = wb_get_ordered_content( $content );

			if ( isset( $result['content'] ) && is_string( $result['content'] ) ) {
				return $result['content'];
			}
		}
		return $content;
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
		$tags = $xpath->query('//h2 | //h3');
		$hidden_tags = $xpath->query('//b');
		$current_H2 = "";
		$back_to_top_node = $xpath->query('//b[@id="back-to-top-link-text"]')->item(0);
		if (!empty($back_to_top_node)) $back_to_top_text = esc_html($back_to_top_node->nodeValue);
		if (empty($back_to_top_text)) $back_to_top_text = "Back to top"; //fallback
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

			$parent = "";
			if ($tag->nodeName === 'h2') {
				$current_H2 = $id;
			} elseif ($tag->nodeName === 'h3' && $current_H2) {
				$parent = $current_H2;
			}

			$index[] = ["title"=>$title,"id"=>$id,"parent"=>$parent,"level"=>$tag->nodeName];

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

		return array("index"=>$index,"content"=>$changed_content);
	}

	/**
	 * This function constructs a table of contents
	 * from the number of H2s on the page, which it
	 * gets from the above funciton
	 */

	function wb_table_of_contents(
		$content,
		$class="",
		$toc_title="Table of contents",
		$top="Back to top",
		$both_levels=false,
		$nesting_icon=""
	) {
		$list_class = "";
		if ($both_levels) $list_class .= "dual-level";

		$style_string = "";
		if ($both_levels && $nesting_icon!="") {
			$style_string = "style='--bullet-icon: \"".esc_attr($nesting_icon)."\"'";
		}

		$index = wb_get_ordered_content($content)["index"];

		// Create the table of contents
		$toc_list = "";
		$count_headings = 0;
		$h2_array = [];
		$h3_array = [];
		$list_item_start = "<li class='wb-table-of-contents__item'>";

		foreach ($index as $content_item) {
			$this_id = esc_attr($content_item["id"]);
			$this_title = esc_html($content_item["title"]);
			$this_parent = esc_html($content_item["parent"]);
			$this_level = esc_html($content_item["level"]);

			$link = "<a id='anchor-for-$this_id' href='#$this_id'>$this_title</a>";

			if ($this_parent == "") {
				$h2_array[$this_id] = $link;
				$count_headings++; //we only count top headings
			} else {
				$h3_array[$this_parent][$this_id] = $link;
			}
		}

		if (!$count_headings) return ""; // No top headings for the table of contents = no table of contents

		foreach($h2_array as $id => $h2) {
			$toc_list .= $list_item_start.$h2;
			if (array_key_exists($id,$h3_array)) {
				$toc_list .= "<ol id='submenu-under-$id' class='wb-table-of-contents__sub-list' data-parent='$id'>";
				foreach($h3_array[$id] as $h3) {
					$toc_list .= $list_item_start.$h3."</li>";
				}
				$toc_list .= "</ol>";
			}
			$toc_list .= "</li>";
		}

		$print_columns = "";
		// If there are more than 15 top headings, put it in columns to make better use of the page
		// Increase to 3 columns after 25 (less space might make more wrap)
		// Only top level headings are displayed when printing
		if ($count_headings > 15) $print_columns = "wb-print-col wb-print-col--2";
		if ($count_headings > 25) $print_columns = "wb-print-col wb-print-col--3";

		$toc = "<div id='table-of-contents' class='wb-table-of-contents " . esc_attr($class) . "' $style_string>
				<h2 class='wb-table-of-contents__heading' id='table-of-contents-heading'>" . esc_html($toc_title) . "</h2>
				<p hidden><b id='back-to-top-link-text'>$top</b></p>
				<ol class='wb-table-of-contents__list $list_class $print_columns'>$toc_list</ol>
			</div>";

		return $toc;
	}

?>
