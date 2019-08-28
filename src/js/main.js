
/* Main Scripts */

// Imports //

import Swup from "swup";
import moduleItem from "./modules/module";
import moduleHomePage from "./modules/pages/home-page";
import modulePage from "./modules/pages/page";

// Module Calls //

function init(){

	if (document.querySelector(".global-modules")){

		moduleItem();
	}
	
	if (document.querySelector(".home-module")){

		moduleHomePage();
	}
	
	if (document.querySelector(".page-module")){

		modulePage();
    }
}

// Page Transition Config //

const swup = new Swup({

	cache: true,
	preload: true,
	scroll: true,
	support: true,
	disableIE: false,
	elements: ["#swup"],
	animationSelector: ".page-transition-animation",
	animateScrollToAnchor: false,
	animateScrollOnMobile: false,
	doScrollingRightAway: false,
	scrollDuration: 0,
  	LINK_SELECTOR: ".page-transition-target",
});

init();

swup.on("contentReplaced", init);

