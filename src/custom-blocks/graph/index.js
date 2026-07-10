import { csvParse } from 'd3-dsv';
import { renderGraph } from './render-graph';
import { prepareData, rowsToCsv, downloadCsv } from './data-prep';

const { __, sprintf } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useBlockProps, InspectorControls, PanelColorSettings } = wp.blockEditor;
const { useEffect, useRef, useMemo } = wp.element;
const {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
	CheckboxControl,
	FormFileUpload,
	Button,
	Notice,
} = wp.components;

const CHART_TYPES = [
	{ label: __( 'Bar', 'wb_blocks' ), value: 'bar' },
	{ label: __( 'Line', 'wb_blocks' ), value: 'line' },
	{ label: __( 'Area', 'wb_blocks' ), value: 'area' },
	{ label: __( 'Scatter', 'wb_blocks' ), value: 'scatter' },
	{ label: __( 'Pie', 'wb_blocks' ), value: 'pie' },
];

const PALETTE_OPTIONS = [
	{ label: __( 'Default', 'wb_blocks' ), value: 'govuk' },
	{ label: __( 'Blues', 'wb_blocks' ), value: 'blues' },
	{ label: __( 'Monochrome', 'wb_blocks' ), value: 'mono' },
];

const X_TYPE_OPTIONS = [
	{ label: __( 'Auto-detect', 'wb_blocks' ), value: 'auto' },
	{ label: __( 'Category (text/labels)', 'wb_blocks' ), value: 'category' },
	{ label: __( 'Number', 'wb_blocks' ), value: 'number' },
	{ label: __( 'Date / time', 'wb_blocks' ), value: 'date' },
];

// Cap the upload size: the data is stored inline in the post, so large files
// bloat the post and slow the editor/save. Keep uploads lean.
const MAX_UPLOAD_BYTES = 1.2 * 1024 * 1024; // 1.2 MB
const MAX_UPLOAD_LABEL = __( '1.2 MB', 'wb_blocks' );

const AGGREGATE_OPTIONS = [
	{ label: __( 'None — plot every row', 'wb_blocks' ), value: 'none' },
	{ label: __( 'Count of rows', 'wb_blocks' ), value: 'count' },
	{ label: __( 'Sum', 'wb_blocks' ), value: 'sum' },
	{ label: __( 'Average', 'wb_blocks' ), value: 'average' },
	{ label: __( 'Minimum', 'wb_blocks' ), value: 'min' },
	{ label: __( 'Maximum', 'wb_blocks' ), value: 'max' },
];

/**
 * Parse an uploaded file's text into { columns, rows } based on its format.
 */
function parseData( text, format ) {
	if ( format === 'json' ) {
		const parsed = JSON.parse( text );
		const rows = Array.isArray( parsed )
			? parsed
			: Array.isArray( parsed.data )
			? parsed.data
			: [];
		const columns = rows.length ? Object.keys( rows[ 0 ] ) : [];
		return { columns, rows };
	}

	// Default: CSV (handles quoted fields, embedded commas etc.).
	const rows = csvParse( text );
	const columns = rows.columns || ( rows.length ? Object.keys( rows[ 0 ] ) : [] );
	// Strip the non-enumerable `columns` prop d3 attaches by copying rows out.
	return { columns, rows: rows.map( ( r ) => ( { ...r } ) ) };
}

/**
 * Live preview rendered with the same D3 module used on the front end.
 */
function GraphPreview( { config, dataRef } ) {
	const ref = useRef( null );

	// Keep the latest config in a ref so the resize handler always draws the
	// current data without needing it in the effect dependencies.
	const configRef = useRef( config );
	configRef.current = config;

	// A lightweight signature of the *visual* settings only — deliberately
	// excludes the (potentially huge) data array so we don't stringify the
	// whole dataset on every keystroke. The raw data's identity (`dataRef`) is
	// tracked separately and only changes when a new file is uploaded.
	const sig = JSON.stringify( {
		chartType: config.chartType,
		xColumn: config.xColumn,
		xType: config.xType,
		showAllXLabels: config.showAllXLabels,
		aggregate: config.aggregate,
		yColumns: config.yColumns,
		xAxisLabel: config.xAxisLabel,
		yAxisLabel: config.yAxisLabel,
		showLegend: config.showLegend,
		showGridlines: config.showGridlines,
		palette: config.palette,
		axisColour: config.axisColour,
	} );

	useEffect( () => {
		const mount = ref.current;
		if ( ! mount ) {
			return;
		}

		// Coalesce rapid changes / resize events into a single rAF draw.
		let frame = null;
		const draw = () => {
			if ( frame ) {
				cancelAnimationFrame( frame );
			}
			frame = requestAnimationFrame( () => renderGraph( mount, configRef.current ) );
		};

		draw();
		const observer = new ResizeObserver( draw );
		observer.observe( mount );
		return () => {
			if ( frame ) {
				cancelAnimationFrame( frame );
			}
			observer.disconnect();
		};
	}, [ sig, dataRef ] );

	return <div className="wb-graph__canvas" ref={ ref } />;
}

// Keep in step with $max_table_rows in index.php so the editor preview matches
// what the front end renders.
const MAX_TABLE_ROWS = 200;

/**
 * Coerce a cell value to something React can render. Non-primitive values
 * (nested objects/arrays from JSON) would otherwise throw "Objects are not
 * valid as a React child" and crash the block's edit component.
 */
function formatCell( value ) {
	if ( value === null || value === undefined ) {
		return '';
	}
	if ( typeof value === 'object' ) {
		return JSON.stringify( value );
	}
	return String( value );
}

/**
 * Accessible data table shown beneath the chart — mirrors the markup produced
 * by index.php so the editor preview matches the front end.
 */
function GraphDataTable( { columns, rows, title } ) {
	if ( ! columns.length || ! rows.length ) {
		return null;
	}

	return (
		<details className="wb-graph__table-wrap">
			<summary className="wb-graph__table-toggle">
				{ __( 'View data as a table', 'wb_blocks' ) }
			</summary>
			<div className="wb-graph__table-scroll">
				<table className="wb-graph__table">
					{ title && <caption>{ title }</caption> }
					<thead>
						<tr>
							{ columns.map( ( column ) => (
								<th scope="col" key={ column }>
									{ column }
								</th>
							) ) }
						</tr>
					</thead>
					<tbody>
						{ rows.slice( 0, MAX_TABLE_ROWS ).map( ( row, i ) => (
							<tr key={ i }>
								{ columns.map( ( column ) => (
									<td key={ column }>{ formatCell( row[ column ] ) }</td>
								) ) }
							</tr>
						) ) }
					</tbody>
				</table>
				{ rows.length > MAX_TABLE_ROWS && (
					<p className="wb-graph__table-note">
						{ sprintf(
							/* translators: 1: rows shown, 2: total rows */
							__( 'Showing the first %1$d of %2$d rows.', 'wb_blocks' ),
							MAX_TABLE_ROWS,
							rows.length
						) }
					</p>
				) }
			</div>
		</details>
	);
}

/**
 * Block: Graph
 *
 * Upload CSV / JSON data, map columns to axes and plot it with D3.
 */
registerBlockType( 'wb-blocks/graph', {
	apiVersion: 2,
	title: __( 'Graph', 'wb_blocks' ),
	description: __( 'Upload CSV or JSON data and plot it as a chart.', 'wb_blocks' ),
	icon: 'chart-bar',
	category: 'wb-blocks',
	keywords: [ __( 'graph', 'wb_blocks' ), __( 'chart', 'wb_blocks' ), __( 'data', 'wb_blocks' ), __( 'plot', 'wb_blocks' ) ],
	attributes: {
		chartType: { type: 'string', default: 'bar' },
		columns: { type: 'array', default: [] },
		dataRows: { type: 'array', default: [] },
		xColumn: { type: 'string', default: '' },
		xAxisType: { type: 'string', default: 'auto' },
		showAllXLabels: { type: 'boolean', default: false },
		aggregate: { type: 'string', default: 'none' },
		yColumns: { type: 'array', default: [] },
		graphTitle: { type: 'string', default: '' },
		xAxisLabel: { type: 'string', default: '' },
		yAxisLabel: { type: 'string', default: '' },
		palette: { type: 'string', default: 'govuk' },
		axisColour: { type: 'string', default: '' },
		showLegend: { type: 'boolean', default: true },
		showGridlines: { type: 'boolean', default: true },
		showDownload: { type: 'boolean', default: true },
		showTable: { type: 'boolean', default: true },
		fileName: { type: 'string', default: '' },
		parseError: { type: 'string', default: '' },
		graphClassName: { type: 'string', default: '' },
	},

	// Sample data so the block inserter shows a live preview instead of
	// "No preview available".
	example: {
		viewportWidth: 480,
		attributes: {
			chartType: 'bar',
			columns: [ 'Month', 'Sales' ],
			dataRows: [
				{ Month: 'Jan', Sales: '30' },
				{ Month: 'Feb', Sales: '45' },
				{ Month: 'Mar', Sales: '28' },
				{ Month: 'Apr', Sales: '60' },
				{ Month: 'May', Sales: '50' },
				{ Month: 'Jun', Sales: '72' },
			],
			xColumn: 'Month',
			yColumns: [ 'Sales' ],
			graphTitle: 'Example chart',
			fileName: 'example.csv',
			showLegend: false,
			showGridlines: true,
		},
	},

	edit: ( props ) => {
		const {
			attributes: {
				chartType,
				columns,
				dataRows,
				xColumn,
				xAxisType,
				showAllXLabels,
				aggregate,
				yColumns,
				graphTitle,
				xAxisLabel,
				yAxisLabel,
				palette,
				axisColour,
				showLegend,
				showGridlines,
				showDownload,
				showTable,
				fileName,
				parseError,
			},
			setAttributes,
			className,
		} = props;

		const blockProps = useBlockProps( { className: 'wb-graph wb-graph--editor' } );

		// Persist className so the PHP render callback can re-apply it.
		if ( className && className !== props.attributes.graphClassName ) {
			setAttributes( { graphClassName: className } );
		}

		const handleFile = ( event ) => {
			const file = event.target.files && event.target.files[ 0 ];
			if ( ! file ) {
				return;
			}
			if ( file.size > MAX_UPLOAD_BYTES ) {
				setAttributes( {
					parseError: sprintf(
						/* translators: 1: uploaded file size, 2: maximum allowed size */
						__( 'That file is %1$s MB. The maximum is %2$s — please upload a smaller file or summarise the data first.', 'wb_blocks' ),
						( file.size / 1024 / 1024 ).toFixed( 1 ),
						MAX_UPLOAD_LABEL
					),
				} );
				// Allow re-selecting (e.g. the same file after trimming it).
				event.target.value = '';
				return;
			}
			const format = /\.json$/i.test( file.name ) ? 'json' : 'csv';
			const reader = new FileReader();
			reader.onload = ( e ) => {
				try {
					const { columns: cols, rows } = parseData( e.target.result, format );
					if ( ! cols.length || ! rows.length ) {
						throw new Error( __( 'No rows or columns found in the file.', 'wb_blocks' ) );
					}
					setAttributes( {
						columns: cols,
						dataRows: rows,
						fileName: file.name,
						parseError: '',
						// Sensible default mapping: first column as X, second as Y.
						xColumn: cols[ 0 ],
						yColumns: cols.length > 1 ? [ cols[ 1 ] ] : [],
					} );
				} catch ( err ) {
					setAttributes( {
						parseError: ( format === 'json' ? __( 'Invalid JSON: ', 'wb_blocks' ) : __( 'Could not parse CSV: ', 'wb_blocks' ) ) + err.message,
					} );
				}
			};
			reader.readAsText( file );
		};

		const toggleYColumn = ( col, checked ) => {
			const next = checked
				? [ ...yColumns, col ]
				: yColumns.filter( ( c ) => c !== col );
			setAttributes( { yColumns: next } );
		};

		// Run the same group-by aggregation the front end (PHP) applies, so the
		// preview matches exactly. `prepared.series` accounts for "Count"
		// collapsing the value columns into one series. Memoised so a large
		// group-by doesn't re-run on every unrelated keystroke.
		const prepared = useMemo( () => {
			const effectiveY = chartType === 'pie' ? yColumns.slice( 0, 1 ) : yColumns;
			return prepareData( dataRows, xColumn, effectiveY, aggregate );
		}, [ dataRows, xColumn, aggregate, chartType, JSON.stringify( yColumns ) ] );

		const config = {
			chartType,
			rows: prepared.rows,
			xColumn,
			xType: xAxisType,
			showAllXLabels,
			aggregate,
			graphTitle,
			yColumns: prepared.series,
			xAxisLabel,
			yAxisLabel,
			showLegend,
			showGridlines,
			palette,
			axisColour,
		};

		const columnOptions = columns.map( ( c ) => ( { label: c, value: c } ) );

		return (
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody title={ __( 'Data', 'wb_blocks' ) } initialOpen={ true }>
						<PanelRow>
							<FormFileUpload
								accept=".csv,.json,text/csv,application/json"
								onChange={ handleFile }
								variant="secondary"
							>
								{ fileName
									? __( 'Replace data file', 'wb_blocks' )
									: __( 'Upload CSV or JSON', 'wb_blocks' ) }
							</FormFileUpload>
						</PanelRow>
						<p className="wb-graph__upload-hint">
							{ sprintf(
								/* translators: %s: maximum file size */
								__( 'CSV or JSON. Maximum file size: %s.', 'wb_blocks' ),
								MAX_UPLOAD_LABEL
							) }
						</p>
						{ fileName && (
							<p className="wb-graph__filename">
								{ fileName } —{ ' ' }
								{ dataRows.length }{ ' ' }
								{ __( 'rows', 'wb_blocks' ) }
							</p>
						) }
						{ parseError && (
							<Notice status="error" isDismissible={ false }>
								{ parseError }
							</Notice>
						) }
					</PanelBody>

					{ columns.length > 0 && (
						<PanelBody title={ __( 'Chart type & data', 'wb_blocks' ) } initialOpen={ true }>
							<PanelRow>
								<SelectControl
									label={ __( 'Chart type', 'wb_blocks' ) }
									value={ chartType }
									options={ CHART_TYPES }
									onChange={ ( value ) => setAttributes( { chartType: value } ) }
								/>
							</PanelRow>

							<p className="wb-graph__group-heading">
								{ __( 'Map your data', 'wb_blocks' ) }
							</p>

							<PanelRow>
								<SelectControl
									label={
										chartType === 'pie'
											? __( 'Labels column', 'wb_blocks' )
											: __( 'Horizontal axis (X)', 'wb_blocks' )
									}
									help={
										chartType === 'pie'
											? __( 'Pick the column that labels each slice.', 'wb_blocks' )
											: __( 'Pick one column for the bottom axis.', 'wb_blocks' )
									}
									value={ xColumn }
									options={ columnOptions }
									onChange={ ( value ) =>
										setAttributes( {
											xColumn: value,
											yColumns: yColumns.filter( ( c ) => c !== value ),
										} )
									}
								/>
							</PanelRow>
							{ chartType !== 'pie' && (
								<PanelRow>
									<SelectControl
										label={ __( 'X-axis type', 'wb_blocks' ) }
										help={ __(
											'How to treat the X values: even categories, a numeric scale, or a time axis.',
											'wb_blocks'
										) }
										value={ xAxisType }
										options={ X_TYPE_OPTIONS }
										onChange={ ( value ) => setAttributes( { xAxisType: value } ) }
									/>
								</PanelRow>
							) }
							{ chartType !== 'pie' && (
								<PanelRow>
									<ToggleControl
										label={ __( 'Label every bar', 'wb_blocks' ) }
										help={ __(
											'Show an X-axis label for every value. Off by default so labels do not overlap when there are many.',
											'wb_blocks'
										) }
										checked={ showAllXLabels }
										onChange={ ( value ) =>
											setAttributes( { showAllXLabels: value } )
										}
									/>
								</PanelRow>
							) }
							<fieldset className="wb-graph__fieldset">
								<legend>
									{ chartType === 'pie'
										? __( 'Value column', 'wb_blocks' )
										: __( 'Values to plot (Y)', 'wb_blocks' ) }
								</legend>
								<p className="wb-graph__fieldset-help">
									{ chartType === 'pie'
										? __( 'Pick the column with the numbers that size each slice.', 'wb_blocks' )
										: __( 'Tick one or more number columns to plot.', 'wb_blocks' ) }
								</p>
								{ chartType === 'pie' ? (
									<SelectControl
										value={ yColumns[ 0 ] || '' }
										options={ [
											{ label: __( '— select —', 'wb_blocks' ), value: '' },
											...columnOptions,
										] }
										onChange={ ( value ) =>
											setAttributes( { yColumns: value ? [ value ] : [] } )
										}
									/>
								) : (
									columns.map( ( col ) => (
										<CheckboxControl
											key={ col }
											label={ col === xColumn ? `${ col } (X axis)` : col }
											checked={ yColumns.includes( col ) }
											disabled={ col === xColumn }
											onChange={ ( checked ) => toggleYColumn( col, checked ) }
										/>
									) )
								) }
							</fieldset>

							<PanelRow>
								<SelectControl
									label={ __( 'Summarise data', 'wb_blocks' ) }
									help={
										aggregate === 'none'
											? __( 'Plot one mark per row. Choose a summary to group by the X column instead.', 'wb_blocks' )
											: __( 'Rows are grouped by the X column and combined with this calculation.', 'wb_blocks' )
									}
									value={ aggregate }
									options={ AGGREGATE_OPTIONS }
									onChange={ ( value ) => setAttributes( { aggregate: value } ) }
								/>
							</PanelRow>
						</PanelBody>
					) }

					<PanelBody title={ __( 'Labels', 'wb_blocks' ) } initialOpen={ false }>
						<PanelRow>
							<TextControl
								label={ __( 'Graph title', 'wb_blocks' ) }
								value={ graphTitle }
								onChange={ ( value ) => setAttributes( { graphTitle: value } ) }
							/>
						</PanelRow>
						{ chartType !== 'pie' && (
							<>
								<PanelRow>
									<TextControl
										label={ __( 'X-axis label', 'wb_blocks' ) }
										value={ xAxisLabel }
										onChange={ ( value ) => setAttributes( { xAxisLabel: value } ) }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label={ __( 'Y-axis label', 'wb_blocks' ) }
										value={ yAxisLabel }
										onChange={ ( value ) => setAttributes( { yAxisLabel: value } ) }
									/>
								</PanelRow>
							</>
						) }
					</PanelBody>

					<PanelBody title={ __( 'Appearance', 'wb_blocks' ) } initialOpen={ false }>
						<SelectControl
							__nextHasNoMarginBottom
							label={ __( 'Colour palette', 'wb_blocks' ) }
							value={ palette }
							options={ PALETTE_OPTIONS }
							onChange={ ( value ) => setAttributes( { palette: value } ) }
						/>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show legend', 'wb_blocks' ) }
								checked={ showLegend }
								onChange={ ( value ) => setAttributes( { showLegend: value } ) }
							/>
						</PanelRow>
						{ chartType !== 'pie' && (
							<PanelRow>
								<ToggleControl
									label={ __( 'Show gridlines', 'wb_blocks' ) }
									checked={ showGridlines }
									onChange={ ( value ) => setAttributes( { showGridlines: value } ) }
								/>
							</PanelRow>
						) }
						<PanelRow>
							<ToggleControl
								label={ __( 'Show download button', 'wb_blocks' ) }
								help={ __(
									'Lets visitors download the full data as a CSV file.',
									'wb_blocks'
								) }
								checked={ showDownload }
								onChange={ ( value ) => setAttributes( { showDownload: value } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show data table', 'wb_blocks' ) }
								help={ __(
									'The "View data as a table" section below the chart. Also acts as the no-JavaScript fallback.',
									'wb_blocks'
								) }
								checked={ showTable }
								onChange={ ( value ) => setAttributes( { showTable: value } ) }
							/>
						</PanelRow>
					</PanelBody>

					<PanelColorSettings
						title={ __( 'Axis text colour', 'wb_blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: axisColour,
								onChange: ( colour ) =>
									setAttributes( { axisColour: colour || '' } ),
								label: __( 'X and Y axis text', 'wb_blocks' ),
							},
						] }
					/>
				</InspectorControls>

				{ graphTitle && <p className="wb-graph__title">{ graphTitle }</p> }

				{ columns.length === 0 ? (
					<div className="wb-graph__placeholder">
						<p className="wb-graph__placeholder-title">
							{ __( 'Graph', 'wb_blocks' ) }
						</p>
						<p>
							{ __(
								'Upload a CSV or JSON file from the block settings to get started.',
								'wb_blocks'
							) }
						</p>
						<FormFileUpload
							accept=".csv,.json,text/csv,application/json"
							onChange={ handleFile }
							variant="primary"
						>
							{ __( 'Upload CSV or JSON', 'wb_blocks' ) }
						</FormFileUpload>
						<p className="wb-graph__upload-hint">
							{ sprintf(
								/* translators: %s: maximum file size */
								__( 'Maximum file size: %s.', 'wb_blocks' ),
								MAX_UPLOAD_LABEL
							) }
						</p>
						{ parseError && (
							<Notice status="error" isDismissible={ false }>
								{ parseError }
							</Notice>
						) }
					</div>
				) : (
					<>
						<GraphPreview config={ config } dataRef={ dataRows } />
						{ ( showTable || showDownload ) && (
							<div className="wb-graph__actions">
								{ showTable && (
									<GraphDataTable
										columns={ columns }
										rows={ dataRows }
										title={ graphTitle }
									/>
								) }
								{ showDownload && (
									<button
										type="button"
										className="wb-graph__download"
										onClick={ () =>
											downloadCsv(
												'data.csv',
												rowsToCsv( columns, dataRows )
											)
										}
									>
										{ __( 'Download CSV', 'wb_blocks' ) }
									</button>
								) }
							</div>
						) }
					</>
				) }
			</div>
		);
	},

	// Dynamic block — markup is produced by the PHP render callback.
	save: () => null,
} );
