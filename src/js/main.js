
/* Main Scripts */

// Imports //

import Swup from 'swup';
import moduleItem from './modules/module-item';
import moduleHomePage from './modules/pages/home-page-module';
import modulePageItem from './modules/pages/page-item';

// Module Calls //

function init() {

	if (document.querySelector(".global-modules")) {

        moduleItem();
	}
	
	if (document.querySelector("#home-module")) {

        moduleHomePage();
    }
    
    if (document.querySelector("#page-item-module")) {

        modulePageItem();
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
