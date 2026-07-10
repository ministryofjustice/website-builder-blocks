/**
 * Graph block — shared data preparation.
 *
 * Pure helpers used by the editor (index.js) to turn the raw uploaded rows into
 * what actually gets plotted: number coercion, date parsing, X-axis type
 * detection and group-by aggregation. The PHP render callback mirrors the
 * aggregation in index.php so the front end produces identical data.
 *
 * @package wb_blocks
 */

import { timeParse } from 'd3-time-format';

/**
 * Coerce a cell value to a finite number, or null when it is not numeric.
 * Tolerant of "£1,200", "30%", "$45", "1 234.5"; rejects text like "C85".
 */
export function toNumber( value ) {
	if ( value === null || value === undefined ) {
		return null;
	}
	if ( typeof value === 'number' ) {
		return Number.isFinite( value ) ? value : null;
	}
	const cleaned = String( value )
		.trim()
		.replace( /[$£€¥,\s]/g, '' )
		.replace( /%$/, '' );
	if ( cleaned === '' ) {
		return null;
	}
	const n = Number( cleaned );
	return Number.isFinite( n ) ? n : null;
}

// Common date/time formats, tried in order. Falls back to native Date parsing.
const DATE_PARSERS = [
	'%Y-%m-%dT%H:%M:%S',
	'%Y-%m-%d %H:%M:%S',
	'%Y-%m-%d',
	'%Y/%m/%d',
	'%d/%m/%Y',
	'%d-%m-%Y',
	'%m/%d/%Y',
	'%Y-%m',
	'%Y',
].map( ( spec ) => timeParse( spec ) );

/**
 * Parse a value to a Date, or null when it is not a recognisable date.
 */
export function parseDate( value ) {
	if ( value instanceof Date ) {
		return Number.isNaN( value.getTime() ) ? null : value;
	}
	if ( value === null || value === undefined || value === '' ) {
		return null;
	}
	const s = String( value ).trim();
	for ( const parse of DATE_PARSERS ) {
		const d = parse( s );
		if ( d ) {
			return d;
		}
	}
	const native = new Date( s );
	return Number.isNaN( native.getTime() ) ? null : native;
}

/**
 * Resolve the effective X-axis type. When `declared` is anything other than
 * 'auto' it wins; otherwise the type is inferred from a sample of the column.
 *
 * @return {'category'|'number'|'date'} resolved type
 */
export function resolveXType( rows, xColumn, declared ) {
	if ( declared && declared !== 'auto' ) {
		return declared;
	}
	const sample = ( rows || [] )
		.slice( 0, 50 )
		.map( ( r ) => r[ xColumn ] )
		.filter( ( v ) => v !== null && v !== undefined && v !== '' );

	if ( ! sample.length ) {
		return 'category';
	}
	// Only treat as dates when they actually look like dates (contain a
	// separator) so bare years like "2024" stay numeric.
	const looksDate = sample.every(
		( v ) => /[-/:]/.test( String( v ) ) && parseDate( v ) !== null
	);
	if ( looksDate ) {
		return 'date';
	}
	if ( sample.every( ( v ) => toNumber( v ) !== null ) ) {
		return 'number';
	}
	return 'category';
}

/**
 * Aggregate rows by the X column. Returns the rows to plot plus the effective
 * series (Y columns) — `count` collapses to a single "Count" series.
 *
 * @param {Array}  rows     Raw data rows.
 * @param {string} xColumn  Column to group by.
 * @param {Array}  yColumns Selected value columns.
 * @param {string} method   none | count | sum | average | min | max
 * @return {{rows: Array, series: Array}} prepared data
 */
export function prepareData( rows, xColumn, yColumns, method ) {
	const series = ( yColumns || [] ).filter( Boolean );

	if ( ! method || method === 'none' || ! xColumn || ! Array.isArray( rows ) ) {
		return { rows: rows || [], series };
	}

	// Group preserving first-seen order.
	const groups = new Map();
	for ( const row of rows ) {
		const key = String( row[ xColumn ] );
		if ( ! groups.has( key ) ) {
			groups.set( key, [] );
		}
		groups.get( key ).push( row );
	}

	if ( method === 'count' ) {
		const out = [ ...groups.entries() ].map( ( [ key, groupRows ] ) => ( {
			[ xColumn ]: key,
			Count: groupRows.length,
		} ) );
		return { rows: out, series: [ 'Count' ] };
	}

	const aggregate = ( values ) => {
		const nums = values.map( toNumber ).filter( ( v ) => v !== null );
		if ( ! nums.length ) {
			return null;
		}
		switch ( method ) {
			case 'sum':
				return nums.reduce( ( a, b ) => a + b, 0 );
			case 'average':
				return nums.reduce( ( a, b ) => a + b, 0 ) / nums.length;
			case 'min':
				return Math.min( ...nums );
			case 'max':
				return Math.max( ...nums );
			default:
				return null;
		}
	};

	const out = [ ...groups.entries() ].map( ( [ key, groupRows ] ) => {
		const result = { [ xColumn ]: key };
		for ( const col of series ) {
			result[ col ] = aggregate( groupRows.map( ( r ) => r[ col ] ) );
		}
		return result;
	} );

	return { rows: out, series };
}

/**
 * Serialise rows to a CSV string with RFC-4180 quoting.
 */
export function rowsToCsv( columns, rows ) {
	const escape = ( value ) => {
		const s = value === null || value === undefined ? '' : String( value );
		return /[",\n\r]/.test( s ) ? '"' + s.replace( /"/g, '""' ) + '"' : s;
	};
	const header = columns.map( escape ).join( ',' );
	const body = ( rows || [] )
		.map( ( row ) => columns.map( ( col ) => escape( row[ col ] ) ).join( ',' ) )
		.join( '\n' );
	return body ? `${ header }\n${ body }` : header;
}

/**
 * Trigger a client-side download of `text` as `filename`.
 */
export function downloadCsv( filename, text ) {
	const blob = new Blob( [ text ], { type: 'text/csv;charset=utf-8;' } );
	const url = URL.createObjectURL( blob );
	const link = document.createElement( 'a' );
	link.href = url;
	link.download = filename;
	document.body.appendChild( link );
	link.click();
	document.body.removeChild( link );
	URL.revokeObjectURL( url );
}
