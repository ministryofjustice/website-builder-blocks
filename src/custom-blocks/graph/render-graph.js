/**
 * Graph block — shared D3 rendering module.
 *
 * Imported by both the editor (index.js, live preview) and the public-facing
 * script (view.js). Given a mount element and a config object it draws a
 * responsive SVG chart using D3. Re-callable: it clears the mount each time so
 * it can be wired to a ResizeObserver for mobile-friendly redraws.
 *
 * @package wb_blocks
 */

import { select } from 'd3-selection';
import { scaleLinear, scaleBand, scalePoint, scaleOrdinal, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, area, arc, pie as d3pie } from 'd3-shape';
import { max, min, extent } from 'd3-array';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { toNumber, parseDate, resolveXType } from './data-prep';

// anfunc colours are from the Analytical Function
// https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-colours-in-charts/
// MoJ / GOV.UK flavoured qualitative palette. Kept in JS (rather than pulling
// in d3-scale-chromatic) so series colours match the design system.
const PALETTES = {
	anfunc: [ '#12436D', '#28A197', '#801650', '#F46A25', '#3D3D3D', '#A285D1' ],
	govuk: [ '#1d70b8', '#d4351c', '#00703c', '#f47738', '#4c2c92', '#b58840', '#28a197', '#912b88' ],
	blues: [ '#1d70b8', '#5694ca', '#003078', '#0b5cab', '#85994b', '#003a69', '#2e7da6', '#6f9fc8' ],
	mono: [ '#0b0c0c', '#505a5f', '#6f777b', '#b1b4b6', '#383f43', '#626a6e', '#8e9395', '#cbcecf' ],
};

const formatLarge = format( '~s' ); // 12k, 1.45M
const formatSmall = format( ',.4~r' ); // 4,200 · 0.38 · 25.14

/**
 * Format an axis number: abbreviate large magnitudes, but show fractions and
 * mid-range values plainly. ('~s' alone renders 0.38 as the misleading "380m".)
 */
function numberFormat( value ) {
	if ( ! Number.isFinite( value ) ) {
		return '';
	}
	return Math.abs( value ) >= 10000 ? formatLarge( value ) : formatSmall( value );
}

// Caps that keep very large datasets responsive. The full data is preserved
// for the table / re-editing; only the drawn geometry is reduced.
const MAX_PLOT_POINTS = 600;
const MAX_PIE_SLICES = 24;

/**
 * Evenly thin an array down to at most `max` items (keeping the last one) so
 * the chart never tries to draw tens of thousands of SVG nodes.
 */
function downsampleRows( rows, max ) {
	if ( ! Array.isArray( rows ) || rows.length <= max ) {
		return rows;
	}
	const stride = Math.ceil( rows.length / max );
	const out = [];
	for ( let i = 0; i < rows.length; i += stride ) {
		out.push( rows[ i ] );
	}
	const last = rows[ rows.length - 1 ];
	if ( out[ out.length - 1 ] !== last ) {
		out.push( last );
	}
	return out;
}

const dateFormat = timeFormat( '%e %b %Y' );

/**
 * Format an axis tick value for the given X-axis type.
 */
function formatXTick( value, xType ) {
	if ( xType === 'date' ) {
		const d = parseDate( value );
		return d ? dateFormat( d ) : String( value );
	}
	return String( value );
}

/**
 * Draw the chart described by `config` into `mount`.
 *
 * @param {HTMLElement} mount  Empty element the SVG is rendered into.
 * @param {Object}      config Block configuration + data.
 */
export function renderGraph( mount, config ) {
	if ( ! mount ) {
		return;
	}

	const {
		chartType = 'bar',
		rows = [],
		xColumn,
		yColumns = [],
		xAxisLabel = '',
		yAxisLabel = '',
		showLegend = true,
		showGridlines = true,
		palette = 'govuk',
		axisColour = '',
		xType: declaredXType = 'auto',
		showAllXLabels = false,
		graphTitle = '',
	} = config || {};

	// Reset any previous render (supports redraw-on-resize).
	mount.innerHTML = '';

	// Chart-chrome colours are applied inline (below) rather than via CSS, so
	// they render identically in the block-editor iframe and on the front end
	// regardless of which stylesheet is loaded where. `currentColor` keeps text
	// readable in both light and dark themes; a chosen axis colour overrides it.
	const axisTextColour = axisColour || 'currentColor';

	const series = ( yColumns || [] ).filter( Boolean );
	const hasData = Array.isArray( rows ) && rows.length > 0 && xColumn && series.length > 0;

	if ( ! hasData ) {
		select( mount )
			.append( 'p' )
			.attr( 'class', 'wb-graph__empty' )
			.text( 'Select a chart type, an X-axis column and at least one value column to preview the graph.' );
		return;
	}

	const colours = PALETTES[ palette ] || PALETTES.govuk;
	const colour = scaleOrdinal().domain( series ).range( colours );

	// Thin large datasets down before drawing so the SVG node count stays
	// bounded regardless of how many rows were supplied.
	const plotRows = downsampleRows( rows, MAX_PLOT_POINTS );

	// Responsive sizing: fill the container width, keep a sensible aspect ratio
	// that flattens out on very narrow (mobile) viewports.
	const containerWidth = Math.max( mount.clientWidth || 0, 240 );
	const isNarrow = containerWidth < 480;
	const width = containerWidth;
	const height = Math.round(
		Math.min( Math.max( containerWidth * ( isNarrow ? 0.85 : 0.5 ), 220 ), 520 )
	);

	const svg = select( mount )
		.append( 'svg' )
		.attr( 'class', 'wb-graph__svg' )
		.attr( 'viewBox', `0 0 ${ width } ${ height }` )
		.attr( 'width', '100%' )
		.attr( 'height', height )
		.attr( 'preserveAspectRatio', 'xMidYMid meet' )
		.attr( 'role', 'img' )
		.attr(
			'aria-label',
			graphTitle
				? `${ graphTitle } — chart. The underlying data is in the table below.`
				: 'Chart. The underlying data is in the table below.'
		);

	if ( chartType === 'pie' ) {
		renderPie( svg, { width, height, rows: plotRows, xColumn, valueColumn: series[ 0 ], colours, showLegend } );
		return;
	}

	// Cartesian charts (bar / line / area / scatter) share axes + scales.
	const showSeriesLegend = showLegend && series.length > 1;

	// On narrow screens the legend moves below the chart (full width) instead of
	// eating a right-hand gutter, and grouped bars collapse into stacked bars so
	// the columns take far less horizontal room.
	const legendBelow = isNarrow && showSeriesLegend;
	const stackBars = isNarrow && chartType === 'bar' && series.length > 1;

	// Reserve a right-hand gutter for the (desktop) legend, capped so the chart
	// keeps a usable width.
	let legendWidth = 0;
	if ( showSeriesLegend && ! legendBelow ) {
		const longest = series.reduce( ( a, b ) => ( b.length > a.length ? b : a ), '' );
		legendWidth = Math.min(
			Math.round( longest.length * 6.8 + 26 ),
			Math.round( width * 0.4 )
		);
	}

	// Rows needed for a horizontal legend drawn below the chart.
	let legendBelowHeight = 0;
	if ( legendBelow ) {
		const total = series.reduce( ( sum, s ) => sum + 20 + s.length * 6.2 + 14, 0 );
		const rows = Math.max( 1, Math.ceil( total / Math.max( width - 8, 120 ) ) );
		legendBelowHeight = rows * 18 + 6;
	}

	// Resolve how the X axis is treated. A continuous (numeric/time) scale only
	// applies to line/area/scatter; bars stay categorical but are ordered and
	// labelled according to the type.
	const xType = resolveXType( plotRows, xColumn, declaredXType );
	const isContinuous = chartType !== 'bar' && ( xType === 'number' || xType === 'date' );

	const parseX = ( row ) =>
		xType === 'date'
			? parseDate( row[ xColumn ] )
			: xType === 'number'
			? toNumber( row[ xColumn ] )
			: String( row[ xColumn ] );

	// For categorical axes built from number/date columns, order categories by
	// their underlying value rather than the order rows happen to appear in.
	let orderedRows = plotRows;
	if ( ! isContinuous && xType !== 'category' ) {
		orderedRows = [ ...plotRows ].sort( ( a, b ) => {
			const av = parseX( a );
			const bv = parseX( b );
			if ( av === null ) return 1;
			if ( bv === null ) return -1;
			return av > bv ? 1 : av < bv ? -1 : 0;
		} );
	}

	const categories = orderedRows.map( ( row ) => String( row[ xColumn ] ) );

	// Size the bottom margin from the actual labels: when they rotate, long
	// labels (e.g. country names) drop well below the axis, so reserve room for
	// them plus a gap before the axis title — otherwise the title overlaps them.
	const labelsRotate = isNarrow || categories.length > 8;
	const longestLabel = categories.reduce(
		( a, b ) => ( b.length > a.length ? b : a ),
		''
	);
	const labelExtent = labelsRotate
		? Math.min(
				Math.ceil( Math.sin( ( 40 * Math.PI ) / 180 ) * longestLabel.length * 6.5 ) + 12,
				140
		  )
		: 26;
	const titleGap = xAxisLabel ? 24 : 0;

	const margin = {
		top: 16,
		right: ( isNarrow ? 12 : 24 ) + ( legendWidth ? legendWidth + 12 : 0 ),
		bottom: 14 + labelExtent + titleGap + legendBelowHeight,
		left: 52 + ( yAxisLabel ? 20 : 0 ),
	};
	const innerWidth = Math.max( width - margin.left - margin.right, 10 );
	const innerHeight = Math.max( height - margin.top - margin.bottom, 10 );

	const g = svg
		.append( 'g' )
		.attr( 'transform', `translate(${ margin.left },${ margin.top })` );

	// Categorical scales: band for bars, point for line/area/scatter.
	const xBand = scaleBand().domain( categories ).range( [ 0, innerWidth ] ).padding( 0.2 );
	const xPoint = scalePoint().domain( categories ).range( [ 0, innerWidth ] ).padding( 0.5 );

	// Continuous scale (numeric or time) for line/area/scatter.
	let xContinuous = null;
	if ( isContinuous ) {
		const xValues = plotRows.map( parseX ).filter( ( v ) => v !== null );
		const domain = xValues.length ? extent( xValues ) : [ 0, 1 ];
		xContinuous = ( xType === 'date' ? scaleTime() : scaleLinear() )
			.domain( domain )
			.range( [ 0, innerWidth ] )
			.nice();
	}

	// Y scale spans all selected series, padded and clamped to include zero.
	// Stacked bars need the cumulative total per category, not the single max.
	let yMin = 0;
	let yMax = 0;
	if ( stackBars ) {
		orderedRows.forEach( ( row ) => {
			let positiveTotal = 0;
			series.forEach( ( col ) => {
				const v = toNumber( row[ col ] );
				if ( v !== null && v > 0 ) {
					positiveTotal += v;
				}
			} );
			yMax = Math.max( yMax, positiveTotal );
		} );
	} else {
		series.forEach( ( col ) => {
			const values = plotRows.map( ( row ) => toNumber( row[ col ] ) ).filter( ( v ) => v !== null );
			if ( values.length ) {
				yMin = Math.min( yMin, min( values ) );
				yMax = Math.max( yMax, max( values ) );
			}
		} );
	}
	if ( yMin === yMax ) {
		yMax = yMin + 1;
	}
	const y = scaleLinear().domain( [ yMin, yMax ] ).nice().range( [ innerHeight, 0 ] );

	// Gridlines (drawn first so data sits on top). Styled inline with a faint,
	// theme-adaptive stroke so they show in the editor iframe too.
	if ( showGridlines ) {
		const grid = g
			.append( 'g' )
			.attr( 'class', 'wb-graph__grid' )
			.call( axisLeft( y ).ticks( 5 ).tickSize( -innerWidth ).tickFormat( () => '' ) );
		grid.select( '.domain' ).remove();
		grid.selectAll( '.tick line' )
			.style( 'stroke', 'currentColor' )
			.style( 'stroke-opacity', 0.12 )
			.style( 'shape-rendering', 'crispEdges' );
	}

	// Axes. Thin out / rotate X labels on narrow screens to stay legible.
	const maxTicks = isNarrow ? 6 : 12;

	let xAxisG;
	if ( isContinuous ) {
		xAxisG = g
			.append( 'g' )
			.attr( 'class', 'wb-graph__axis wb-graph__axis--x' )
			.attr( 'transform', `translate(0,${ innerHeight })` )
			.call(
				axisBottom( xContinuous )
					.ticks( maxTicks )
					.tickFormat( ( d ) =>
						xType === 'date' ? dateFormat( d ) : numberFormat( d )
					)
			);
	} else {
		// Thin labels so they don't overlap. "Label every bar" shows them all on
		// desktop, but on mobile we still cap the count (a label per bar is
		// unreadable on a narrow screen).
		const labelTarget = isNarrow
			? ( showAllXLabels ? 10 : maxTicks )
			: ( showAllXLabels ? categories.length : maxTicks );
		const step = Math.max( 1, Math.ceil( categories.length / labelTarget ) );
		const shownCategories =
			step <= 1 ? categories : categories.filter( ( _, i ) => i % step === 0 );
		xAxisG = g
			.append( 'g' )
			.attr( 'class', 'wb-graph__axis wb-graph__axis--x' )
			.attr( 'transform', `translate(0,${ innerHeight })` )
			.call(
				axisBottom( chartType === 'bar' ? xBand : xPoint )
					.tickValues( shownCategories )
					.tickFormat( ( d ) => formatXTick( d, xType ) )
			);
	}

	if ( labelsRotate ) {
		xAxisG
			.selectAll( 'text' )
			.attr( 'transform', 'rotate(-40)' )
			.attr( 'text-anchor', 'end' )
			.attr( 'dx', '-0.5em' )
			.attr( 'dy', '0.25em' );
	}

	const yAxisG = g
		.append( 'g' )
		.attr( 'class', 'wb-graph__axis wb-graph__axis--y' )
		.call( axisLeft( y ).ticks( 5 ).tickFormat( ( d ) => numberFormat( d ) ) );

	// Colour the axis lines and tick text inline so they render in the editor
	// iframe and honour the chosen axis text colour on both editor and front end.
	[ xAxisG, yAxisG ].forEach( ( axisG ) => {
		axisG.selectAll( '.domain, .tick line' )
			.style( 'stroke', 'currentColor' )
			.style( 'stroke-opacity', 0.6 );
		axisG.selectAll( 'text' )
			.style( 'fill', axisTextColour )
			// Smaller tick labels on mobile so more fit without overlapping.
			.style( 'font-size', isNarrow ? '10px' : null );
	} );

	// Axis titles.
	if ( xAxisLabel ) {
		g.append( 'text' )
			.attr( 'class', 'wb-graph__axis-title' )
			.attr( 'x', innerWidth / 2 )
			// Sit above the below-chart legend band (legendBelowHeight is 0 on desktop).
			.attr( 'y', innerHeight + margin.bottom - legendBelowHeight - 6 )
			.attr( 'text-anchor', 'middle' )
			.style( 'fill', axisTextColour )
			.style( 'font-weight', 700 )
			.text( xAxisLabel );
	}
	if ( yAxisLabel ) {
		g.append( 'text' )
			.attr( 'class', 'wb-graph__axis-title' )
			.attr( 'transform', 'rotate(-90)' )
			.attr( 'x', -innerHeight / 2 )
			.attr( 'y', -margin.left + 16 )
			.attr( 'text-anchor', 'middle' )
			.style( 'fill', axisTextColour )
			.style( 'font-weight', 700 )
			.text( yAxisLabel );
	}

	// X pixel position for a row's mark, for whichever scale is in play.
	const xPos = ( row ) =>
		isContinuous
			? xContinuous( parseX( row ) )
			: chartType === 'bar'
			? xBand( String( row[ xColumn ] ) ) + xBand.bandwidth() / 2
			: xPoint( String( row[ xColumn ] ) );

	if ( chartType === 'bar' && stackBars ) {
		// Mobile: stack the series within one band per category so the columns
		// take far less horizontal room. Track the running top per category.
		const tops = new Map();
		series.forEach( ( col ) => {
			g.append( 'g' )
				.attr( 'fill', colour( col ) )
				.selectAll( 'rect' )
				.data( orderedRows )
				.join( 'rect' )
				.attr( 'class', 'wb-graph__bar' )
				.attr( 'x', ( row ) => xBand( String( row[ xColumn ] ) ) )
				.attr( 'width', xBand.bandwidth() )
				.attr( 'y', ( row ) => {
					const cat = String( row[ xColumn ] );
					const v = toNumber( row[ col ] );
					const val = v !== null && v > 0 ? v : 0;
					const base = tops.get( cat ) || 0;
					tops.set( cat, base + val );
					return y( base + val );
				} )
				.attr( 'height', ( row ) => {
					const v = toNumber( row[ col ] );
					const val = v !== null && v > 0 ? v : 0;
					return Math.abs( y( val ) - y( 0 ) );
				} )
				.append( 'title' )
				.text( ( row ) => `${ col }: ${ row[ col ] }` );
		} );
	} else if ( chartType === 'bar' ) {
		// Grouped bars: divide each band between the selected series.
		const groupScale = scaleBand()
			.domain( series )
			.range( [ 0, xBand.bandwidth() ] )
			.padding( 0.05 );

		series.forEach( ( col ) => {
			g.append( 'g' )
				.attr( 'fill', colour( col ) )
				.selectAll( 'rect' )
				.data( orderedRows )
				.join( 'rect' )
				.attr( 'class', 'wb-graph__bar' )
				.attr( 'x', ( row ) => xBand( String( row[ xColumn ] ) ) + groupScale( col ) )
				.attr( 'width', groupScale.bandwidth() )
				.attr( 'y', ( row ) => {
					const v = toNumber( row[ col ] );
					return v === null ? y( 0 ) : y( Math.max( v, 0 ) );
				} )
				.attr( 'height', ( row ) => {
					const v = toNumber( row[ col ] );
					return v === null ? 0 : Math.abs( y( v ) - y( 0 ) );
				} )
				.append( 'title' )
				.text( ( row ) => `${ col }: ${ row[ col ] }` );
		} );
	} else if ( chartType === 'scatter' ) {
		series.forEach( ( col ) => {
			g.append( 'g' )
				.attr( 'fill', colour( col ) )
				.selectAll( 'circle' )
				.data(
					plotRows.filter(
						( row ) =>
							toNumber( row[ col ] ) !== null &&
							Number.isFinite( xPos( row ) )
					)
				)
				.join( 'circle' )
				.attr( 'class', 'wb-graph__point' )
				.attr( 'cx', ( row ) => xPos( row ) )
				.attr( 'cy', ( row ) => y( toNumber( row[ col ] ) ) )
				.attr( 'r', isNarrow ? 3.5 : 5 )
				.append( 'title' )
				.text( ( row ) => `${ row[ xColumn ] } — ${ col }: ${ row[ col ] }` );
		} );
	} else {
		// line or area
		series.forEach( ( col ) => {
			let points = ( isContinuous ? plotRows : orderedRows )
				.map( ( row ) => ( {
					row,
					x: xPos( row ),
					value: toNumber( row[ col ] ),
				} ) )
				.filter( ( p ) => p.value !== null && Number.isFinite( p.x ) );

			// Continuous data may arrive unsorted; the line must follow the axis.
			if ( isContinuous ) {
				points = points.slice().sort( ( a, b ) => a.x - b.x );
			}

			if ( chartType === 'area' ) {
				const areaGen = area()
					.x( ( p ) => p.x )
					.y0( y( 0 ) )
					.y1( ( p ) => y( p.value ) );
				g.append( 'path' )
					.datum( points )
					.attr( 'class', 'wb-graph__area' )
					.attr( 'fill', colour( col ) )
					.attr( 'fill-opacity', 0.25 )
					.attr( 'd', areaGen );
			}

			const lineGen = line()
				.x( ( p ) => p.x )
				.y( ( p ) => y( p.value ) );
			g.append( 'path' )
				.datum( points )
				.attr( 'class', 'wb-graph__line' )
				.attr( 'fill', 'none' )
				.attr( 'stroke', colour( col ) )
				.attr( 'stroke-width', 2 )
				.attr( 'd', lineGen );

			g.append( 'g' )
				.attr( 'fill', colour( col ) )
				.selectAll( 'circle' )
				.data( points )
				.join( 'circle' )
				.attr( 'class', 'wb-graph__point' )
				.attr( 'cx', ( p ) => p.x )
				.attr( 'cy', ( p ) => y( p.value ) )
				.attr( 'r', isNarrow ? 2.5 : 3.5 )
				.append( 'title' )
				.text( ( p ) => `${ p.row[ xColumn ] } — ${ col }: ${ p.row[ col ] }` );
		} );
	}

	if ( showSeriesLegend ) {
		if ( legendBelow ) {
			// Mobile: a horizontal, wrapping legend under the chart.
			drawLegendBelow(
				svg,
				series,
				colour,
				margin.left,
				height - legendBelowHeight + 12,
				innerWidth
			);
		} else {
			// Desktop: in the reserved right-hand gutter, aligned with the plot top.
			drawLegend( svg, series, colour, width - legendWidth, margin.top );
		}
	}
}

/**
 * Horizontal legend that wraps within `maxWidth`, drawn below the chart on
 * narrow screens. `y` is the baseline of the first row.
 */
function drawLegendBelow( svg, keys, colour, x, y, maxWidth ) {
	const legend = svg
		.append( 'g' )
		.attr( 'class', 'wb-graph__legend' )
		.attr( 'transform', `translate(${ x },${ y })` );

	let cx = 0;
	let cy = 0;
	keys.forEach( ( key ) => {
		const itemWidth = 20 + key.length * 6.2 + 14;
		if ( cx > 0 && cx + itemWidth > maxWidth ) {
			cx = 0;
			cy += 18;
		}
		const item = legend.append( 'g' ).attr( 'transform', `translate(${ cx },${ cy })` );
		item.append( 'rect' )
			.attr( 'width', 12 )
			.attr( 'height', 12 )
			.attr( 'y', -10 )
			.attr( 'rx', 2 )
			.attr( 'fill', colour( key ) );
		item.append( 'text' )
			.attr( 'class', 'wb-graph__legend-label' )
			.attr( 'x', 18 )
			.attr( 'y', 0 )
			.style( 'fill', 'currentColor' )
			.text( key );
		cx += itemWidth;
	} );
}

/**
 * Pie / proportion chart: one slice per row, sized by a single value column.
 */
function renderPie( svg, { width, height, rows, xColumn, valueColumn, colours, showLegend } ) {
	const radius = Math.min( width, height ) / 2 - 16;
	const cx = showLegend ? Math.min( width / 2, height / 2 ) : width / 2;
	const cy = height / 2;

	let slices = rows
		.map( ( row ) => ( { label: String( row[ xColumn ] ), value: toNumber( row[ valueColumn ] ) } ) )
		.filter( ( d ) => d.value !== null && d.value > 0 );

	// Too many slices is both slow and unreadable: keep the largest and roll
	// the remainder into a single "Other" slice.
	if ( slices.length > MAX_PIE_SLICES ) {
		slices.sort( ( a, b ) => b.value - a.value );
		const top = slices.slice( 0, MAX_PIE_SLICES - 1 );
		const other = slices
			.slice( MAX_PIE_SLICES - 1 )
			.reduce( ( sum, d ) => sum + d.value, 0 );
		slices = [ ...top, { label: 'Other', value: other } ];
	}

	const colour = scaleOrdinal().domain( slices.map( ( s ) => s.label ) ).range( colours );
	const pieGen = d3pie().sort( null ).value( ( d ) => d.value );
	const arcGen = arc().innerRadius( 0 ).outerRadius( radius );

	const g = svg.append( 'g' ).attr( 'transform', `translate(${ cx },${ cy })` );

	g.selectAll( 'path' )
		.data( pieGen( slices ) )
		.join( 'path' )
		.attr( 'class', 'wb-graph__slice' )
		.attr( 'd', arcGen )
		.attr( 'fill', ( d ) => colour( d.data.label ) )
		.attr( 'stroke', '#ffffff' )
		.attr( 'stroke-width', 1 )
		.append( 'title' )
		.text( ( d ) => `${ d.data.label }: ${ d.data.value }` );

	if ( showLegend ) {
		drawLegend(
			svg,
			slices.map( ( s ) => s.label ),
			colour,
			cx + radius + 16,
			16
		);
	}
}

/**
 * Render a simple swatch + label legend at the given offset.
 */
function drawLegend( svg, keys, colour, offsetX, offsetY ) {
	const legend = svg
		.append( 'g' )
		.attr( 'class', 'wb-graph__legend' )
		.attr( 'transform', `translate(${ offsetX },${ offsetY })` );

	keys.forEach( ( key, i ) => {
		const row = legend.append( 'g' ).attr( 'transform', `translate(0,${ i * 18 })` );
		row.append( 'rect' )
			.attr( 'width', 12 )
			.attr( 'height', 12 )
			.attr( 'rx', 2 )
			.attr( 'fill', colour( key ) );
		row.append( 'text' )
			.attr( 'class', 'wb-graph__legend-label' )
			.attr( 'x', 18 )
			.attr( 'y', 10 )
			.style( 'fill', 'currentColor' )
			.text( key );
	} );
}
