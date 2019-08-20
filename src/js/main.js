
/* Main Scripts */

// Imports //

import Swup from 'swup';

// Module Calls //

function init() {

	if (document.querySelector(".global-modules")) {


	}
	
	if (document.querySelector("#home-modules")) {


	}
}

// Page Transition Config //

const swup = new Swup({

	cache: true,
	preload: true,
	scroll: true,
	preload: true,
	support: true,
	disableIE: false,
	elements: ["#swup"],
	animationSelector: ".page-transition-animation",
	animateScrollToAnchor: false,
	animateScrollOnMobile: false,
	doScrollingRightAway: true,
	scrollDuration: 0,
  	LINK_SELECTOR: ".page-transition-target",
});

init();

swup.on("contentReplaced", init);
