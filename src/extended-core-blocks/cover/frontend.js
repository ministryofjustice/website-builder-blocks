document.addEventListener('DOMContentLoaded', () => {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	document.querySelectorAll('.wp-block-cover').forEach((cover) => {
		const video = cover.querySelector('video');
		const button = cover.querySelector('.video-pause-button');
		if (video) {
			button.addEventListener('click', (event) => {
				event.stopPropagation();
				togglePause(video, button);
			});
			if (prefersReducedMotion) {
				// This initially pauses the video if the browser is set to prefer less movement
				pauseVid(video, button);
			}
		}
	});
});

function togglePause(video, button) {
	if (video.paused) {
		playVid(video, button);
	} else {
		pauseVid(video, button)
	}
}

function playVid(video, button) {
	button.innerText = button.dataset.pauseText;
	let videoSource = video.getAttribute("src");
	if (videoSource.startsWith("禁用_http")) {
		// Restore the SRC if it was changed
		video.setAttribute("src", videoSource.replace(/^禁用_/, ""));
	}
	video.play();
}

function pauseVid(video, button, videoBackupImageExists) {
	video.pause();
	button.innerText = button.dataset.playText;
	if (button.dataset.posterExists) {
		// If there is a poster, we sabotage the SRC so the poster appears
		// 禁用 = disabled, but just unicode characters which aren't going to be found in any URL
		let videoSource = video.getAttribute("src");
		if (!videoSource.startsWith("_")) {
			video.setAttribute("src", "禁用_" + videoSource);
		}
	}
}
