<?php

/**
 * Graph block
 * Frontend PHP code
 *
 * Uses WordPress' dynamic block method
 * https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
 *
 * Outputs an empty SVG mount + the chart config/data as JSON for view.js to
 * render with D3, plus an accessible data table that doubles as the no-JS
 * fallback.
 *
 * @package wb_blocks
 *
 */

/**
 * Evenly thin a list of rows down to at most $max items (keeping the last one).
 *
 * Used to shrink what is sent to the browser for very large datasets: only the
 * plotted geometry needs to travel over the wire, not every raw row.
 */
function wb_blocks_graph_downsample($rows, $max)
{
	$count = count($rows);
	if ($count <= $max) {
		return $rows;
	}

	$stride = (int) ceil($count / $max);
	$out = [];
	for ($i = 0; $i < $count; $i += $stride) {
		$out[] = $rows[$i];
	}

	$last = $rows[$count - 1];
	if (end($out) !== $last) {
		$out[] = $last;
	}

	return $out;
}

/**
 * Serialise rows to a CSV string with RFC-4180 quoting. Mirrors rowsToCsv() in
 * data-prep.js so the downloaded file matches the editor.
 */
function wb_blocks_graph_to_csv($columns, $rows)
{
	$escape = function ($value) {
		$s = ($value === null) ? '' : (string) $value;
		return preg_match('/[",\n\r]/', $s) ? '"' . str_replace('"', '""', $s) . '"' : $s;
	};

	$lines = [implode(',', array_map($escape, $columns))];
	foreach ($rows as $row) {
		$lines[] = implode(',', array_map(fn($col) => $escape($row[$col] ?? ''), $columns));
	}

	return implode("\n", $lines);
}

/**
 * Coerce a cell to a number the same way the JS renderer does (tolerant of
 * "£1,200", "30%" etc.; text returns null).
 */
function wb_blocks_graph_to_number($value)
{
	if ($value === null) {
		return null;
	}
	if (is_int($value) || is_float($value)) {
		return is_finite($value) ? $value : null;
	}
	$cleaned = preg_replace('/[$£€¥,\s]/u', '', trim((string) $value));
	$cleaned = preg_replace('/%$/', '', $cleaned);
	if ($cleaned === '' || ! is_numeric($cleaned)) {
		return null;
	}
	return (float) $cleaned;
}

/**
 * Group rows by the X column and combine the value columns. Mirrors
 * prepareData() in data-prep.js so the front end matches the editor preview.
 *
 * @return array ['rows' => array, 'series' => array]
 */
function wb_blocks_graph_aggregate($rows, $x_column, $y_columns, $method)
{
	$series = array_values(array_filter($y_columns, fn($c) => $c !== '' && $c !== null));

	if (! $method || $method === 'none' || ! $x_column) {
		return ['rows' => $rows, 'series' => $series];
	}

	// Group preserving first-seen order.
	$groups = [];
	foreach ($rows as $row) {
		$key = (string) ($row[$x_column] ?? '');
		$groups[$key][] = $row;
	}

	if ($method === 'count') {
		$out = [];
		foreach ($groups as $key => $group_rows) {
			$out[] = [$x_column => $key, 'Count' => count($group_rows)];
		}
		return ['rows' => $out, 'series' => ['Count']];
	}

	$out = [];
	foreach ($groups as $key => $group_rows) {
		$result = [$x_column => $key];
		foreach ($series as $col) {
			$nums = [];
			foreach ($group_rows as $r) {
				$n = wb_blocks_graph_to_number($r[$col] ?? null);
				if ($n !== null) {
					$nums[] = $n;
				}
			}
			if (empty($nums)) {
				$result[$col] = null;
			} else {
				switch ($method) {
					case 'sum':
						$result[$col] = array_sum($nums);
						break;
					case 'average':
						$result[$col] = array_sum($nums) / count($nums);
						break;
					case 'min':
						$result[$col] = min($nums);
						break;
					case 'max':
						$result[$col] = max($nums);
						break;
					default:
						$result[$col] = null;
				}
			}
		}
		$out[] = $result;
	}

	return ['rows' => $out, 'series' => $series];
}

function wb_blocks_render_callback_graph_block($attributes)
{
	// How much data to send to the browser. The chart only needs enough points
	// to plot; the table shows a capped sample. The full dataset stays in the
	// post and is never emitted to the front end (this is a dynamic block).
	$max_plot_points = 600;
	$max_table_rows  = 200;

	$chart_type     = esc_attr($attributes['chartType'] ?? 'bar');
	$columns        = is_array($attributes['columns'] ?? null) ? $attributes['columns'] : [];
	$rows           = is_array($attributes['dataRows'] ?? null) ? $attributes['dataRows'] : [];
	$x_column       = $attributes['xColumn'] ?? '';
	$x_type         = $attributes['xAxisType'] ?? 'auto';
	$show_all_x     = $attributes['showAllXLabels'] ?? false;
	$aggregate      = $attributes['aggregate'] ?? 'none';
	$y_columns      = is_array($attributes['yColumns'] ?? null) ? $attributes['yColumns'] : [];
	$graph_title    = esc_html($attributes['graphTitle'] ?? '');
	$palette        = esc_attr($attributes['palette'] ?? 'govuk');
	$axis_colour    = $attributes['axisColour'] ?? '';
	$show_legend    = $attributes['showLegend'] ?? true;
	$show_gridlines = $attributes['showGridlines'] ?? true;
	$show_download  = $attributes['showDownload'] ?? true;
	$show_table     = $attributes['showTable'] ?? true;
	$class_name     = esc_attr($attributes['graphClassName'] ?? '');

	// Nothing to plot yet — render nothing on the front end.
	if (empty($rows) || empty($columns)) {
		return '';
	}

	$rows = array_values($rows);

	// Pie uses a single value column.
	$effective_y = array_values($y_columns);
	if ($chart_type === 'pie') {
		$effective_y = array_slice($effective_y, 0, 1);
	}

	// Group-by aggregation runs on the full dataset (before downsampling) so
	// counts/sums/averages are correct, then the result is thinned for transport.
	$prepared  = wb_blocks_graph_aggregate($rows, $x_column, $effective_y, $aggregate);
	$plot_rows = wb_blocks_graph_downsample($prepared['rows'], $max_plot_points);

	// Config consumed by view.js (mirrors the editor preview config).
	$config = [
		'chartType'     => $chart_type,
		'rows'          => $plot_rows,
		'xColumn'       => $x_column,
		'xType'         => $x_type,
		'showAllXLabels' => (bool) $show_all_x,
		'graphTitle'    => $attributes['graphTitle'] ?? '',
		'yColumns'      => $prepared['series'],
		'xAxisLabel'    => $attributes['xAxisLabel'] ?? '',
		'yAxisLabel'    => $attributes['yAxisLabel'] ?? '',
		'showLegend'    => (bool) $show_legend,
		'showGridlines' => (bool) $show_gridlines,
		'palette'       => $palette,
		'axisColour'    => $axis_colour,
	];

	$json = wp_json_encode($config);

	// Full source data as CSV for the optional download button. Only embedded
	// when the button is shown, so it doesn't add weight to every page.
	$csv_json = $show_download ? wp_json_encode(wb_blocks_graph_to_csv($columns, $rows)) : '';

	ob_start();

	?>
	<figure class="wb-graph <?php echo $class_name; ?>">
		<?php if ($graph_title) : ?>
			<figcaption class="wb-graph__title"><?php echo $graph_title; ?></figcaption>
		<?php endif; ?>

		<?php // SVG is drawn into here by view.js. ?>
		<div class="wb-graph__canvas"></div>

		<?php // Config + data for the front-end script. ?>
		<script type="application/json" class="wb-graph__data"><?php echo $json; ?></script>

		<?php // Toolbar: data table toggle on the left, download on the right. ?>
		<?php if ($show_table || $show_download) : ?>
		<div class="wb-graph__actions">
		<?php if ($show_table) : // Accessible data table / no-JS fallback ?>
		<details class="wb-graph__table-wrap">
			<summary class="wb-graph__table-toggle"><?php esc_html_e('View data as a table', 'wb_blocks'); ?></summary>
			<div class="wb-graph__table-scroll">
				<table class="wb-graph__table">
					<?php if ($graph_title) : ?>
						<caption><?php echo $graph_title; ?></caption>
					<?php endif; ?>
					<thead>
						<tr>
							<?php foreach ($columns as $column) : ?>
								<th scope="col"><?php echo esc_html($column); ?></th>
							<?php endforeach; ?>
						</tr>
					</thead>
					<tbody>
						<?php foreach (array_slice($rows, 0, $max_table_rows) as $row) : ?>
							<tr>
								<?php foreach ($columns as $column) : ?>
									<td><?php echo esc_html($row[$column] ?? ''); ?></td>
								<?php endforeach; ?>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<?php if (count($rows) > $max_table_rows) : ?>
					<p class="wb-graph__table-note">
						<?php
						printf(
							/* translators: 1: rows shown, 2: total rows */
							esc_html__('Showing the first %1$s of %2$s rows.', 'wb_blocks'),
							number_format_i18n($max_table_rows),
							number_format_i18n(count($rows))
						);
						?>
					</p>
				<?php endif; ?>
			</div>
		</details>
		<?php endif; ?>
		<?php if ($show_download) : ?>
		<button type="button" class="wb-graph__download" data-filename="data.csv">
			<?php esc_html_e('Download CSV', 'wb_blocks'); ?>
		</button>
		<script type="application/json" class="wb-graph__csv-data"><?php echo $csv_json; ?></script>
		<?php endif; ?>
		</div>
		<?php endif; ?>
	</figure>
	<?php

	$output = ob_get_contents();
	ob_end_clean();

	return $output;
}
