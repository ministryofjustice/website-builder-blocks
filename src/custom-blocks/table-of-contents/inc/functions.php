<?php
	add_filter( 'the_content', 'wb_filter_add_index_for_h2_elements', 1 );
	function wb_filter_add_index_for_h2_elements( $content ) {
		// Check if we're inside the main loop in a single Post.
		if ( is_singular() && in_the_loop() && is_main_query()) {
			
			if(is_page()){
				global $post;

				$numbered_headings = false;

				$display_numbered_headings = get_post_meta($post->ID, 'page_numbered_headings', true);

				if(!empty($display_numbered_headings)){
					$numbered_headings = $display_numbered_headings;
				}
				$numbered_headings = true; //TEMP - not for this block
				
				if(!is_page_template( 'page-toc.php' ) && !$numbered_headings){
					return $content;
				}

				$out = wb_get_ordered_content($content, $numbered_headings)["content"];
				$table = wb_table_of_contents($out);
				return wb_toc_column_layout($table,$out);
			}
			$numbered_headings = true; //TEMP - not for this block
			$table_of_contents = true; //NEEDS SETTING???

			if (!$table_of_contents && !$numbered_headings) return $content;
			return wb_get_ordered_content($content, $numbered_headings)["content"];
		}
	}

	function wb_get_ordered_content($content, $numbered_headings) {
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
			$tag->setAttribute('class', "wb-toc-heading");
			$title = $tag->nodeValue;
			$id = preg_replace('/[^a-zA-Z0-9]/', '', remove_accents($title));
			$id = ++$count."-$id"; //$count is incremented & added to ID (this ensures no duplicates)
			$index[] = ["title"=>$title,"id"=>$id];
			if ($numbered_headings) $tag->prepend($count.". "); //adds the index number before the title if $ordered set
	
			//Jump to top link
			$jump_link = $dom->createElement("a",esc_html("Back to top")); //SETTING TO SET TEXT NEEDED
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

	function wb_table_of_contents($content, $ordered = false, $print = false) {
		$list_class = "";

		$index = wb_get_ordered_content($content,$ordered)["index"];

		// Create the table of contents
		$list_of_headings = "";
		$count_headings = 0;
		foreach ($index as $content_item) {
			$list_of_headings .= '<li class="hale-table-of-contents__item"><a id="anchor-for-'.$content_item["id"].'" class="govuk-link govuk-link--no-visited-state" href="#'.$content_item["id"].'">'.$content_item["title"].'</a></li>';
			$count_headings++;
		}

		if ($list_of_headings == "") return ""; // If there are no matched headings, then there is no table of contents to shew

		$print_columns = "";
		// If there are more than 15 headings, put it in columns to make better use of the page
		// Increase to 3 columns after 25 (less space might make more wrap)
		if ($count_headings > 15) $print_columns = "hale-print-col hale-print-col--2";
		if ($count_headings > 25) $print_columns = "hale-print-col hale-print-col--3";

		$toc = "<div id='table-of-contents' class='wb-table-of-contents alignleft'>
				<h2 class='govuk-heading-s govuk-!-margin-bottom-2 hale-table-of-contents__heading' id='table-of-contents-heading'>".__("Table of contents","hale")."</h2>
				<ol class='hale-table-of-contents__list govuk-list $list_class $print_columns'>$list_of_headings</ol>
			</div>";

		return $toc;
	}

	function wb_toc_column_layout($table,$content) {
		ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
		
		$output = '<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">';
			$output .= '<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:33.33%">';
				$output .= $table;
			$output .= '</div><div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:66.66%">';
				$output .= $content;
			$output .= '</div>';
		$output .= '</div>';
		return $output;
	}
?>


