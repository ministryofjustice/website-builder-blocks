/**
 * Graph block — public-facing script.
 *
 * Bundled separately (build/graph.min.js) and only enqueued on pages that use
 * the block, so D3 isn't loaded site-wide. Reads the config + data embedded in
 * each block as JSON, renders a responsive chart and keeps it in sync with the
 * container width for mobile.
 *
 * @package wb_blocks
 */

import { renderGraph } from './render-graph';
import { downloadCsv } from './data-prep';

/**
 * Wire the optional "Download CSV" button to the embedded full dataset.
 */
function initDownload( el ) {
	const button = el.querySelector( '.wb-graph__download' );
	const csvEl = el.querySelector( 'script.wb-graph__csv-data' );
	if ( ! button || ! csvEl ) {
		return;
	}
	button.addEventListener( 'click', () => {
		let csv;
		try {
			csv = JSON.parse( csvEl.textContent );
		} catch ( e ) {
			return;
		}
		downloadCsv( button.dataset.filename || 'data.csv', csv );
	} );
}

function initGraph( el ) {
	initDownload( el );

	const mount = el.querySelector( '.wb-graph__canvas' );
	const dataEl = el.querySelector( 'script.wb-graph__data' );
	if ( ! mount || ! dataEl ) {
		return;
	}

	let config;
	try {
		config = JSON.parse( dataEl.textContent );
	} catch ( e ) {
		return;
	}

	const draw = () => renderGraph( mount, config );

	// Do the (potentially expensive) first render and wire up resize handling.
	let started = false;
	const start = () => {
		if ( started ) {
			return;
		}
		started = true;
		draw();

		// Once JS has rendered the chart, the data table becomes a progressive
		// enhancement that can be collapsed.
		el.classList.add( 'wb-graph--rendered' );

		// Redraw on resize (debounced via rAF) so axes/labels adapt to the viewport.
		if ( 'ResizeObserver' in window ) {
			let frame = null;
			const observer = new ResizeObserver( () => {
				if ( frame ) {
					cancelAnimationFrame( frame );
				}
				frame = requestAnimationFrame( draw );
			} );
			observer.observe( mount );
		} else {
			window.addEventListener( 'resize', draw );
		}
	};

	// Defer rendering until the chart is near the viewport so off-screen and
	// below-the-fold charts don't block initial page load.
	if ( 'IntersectionObserver' in window ) {
		const io = new IntersectionObserver(
			( entries, obs ) => {
				entries.forEach( ( entry ) => {
					if ( entry.isIntersecting ) {
						obs.disconnect();
						start();
					}
				} );
			},
			{ rootMargin: '200px' }
		);
		io.observe( el );
	} else {
		start();
	}
}

function initAll() {
	document.querySelectorAll( '.wb-graph' ).forEach( initGraph );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAll );
} else {
	initAll();
}
