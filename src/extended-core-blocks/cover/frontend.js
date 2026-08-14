document.addEventListener("DOMContentLoaded", () => {
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	document.querySelectorAll(".wp-block-cover").forEach(cover => {
		const video = cover.querySelector("video");
		const button = cover.querySelector(".video-pause-button");
		if (video) {
			button.addEventListener("click", event => {
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
		pauseVid(video, button);
	}
}

function playVid(video, button) {
	button.innerText = button.dataset.pauseText;
	let videoSource = video.dataset.src;
	if (videoSource && videoSource !== "") {
		// Restore the SRC if it was changed
		video.setAttribute("src", videoSource);
		video.removeAttribute("data-src");
	}
	video.play();
}

function pauseVid(video, button) {
	video.pause();
	button.innerText = button.dataset.playText;
	if (button.dataset.posterExists === "yes") {
		// If there is a poster, we sabotage the SRC so the poster appears
		// SRC is blanked; old SRC is moved to data-src attribute
		let videoSource = video.getAttribute("src");
		if (videoSource && videoSource !== "") {
			video.setAttribute("src", "");
			video.setAttribute("data-src", videoSource);
		}
	}
}
