var HTMLProjects = [];
var projectsInited = 0;
var NUM_PROJECTS = 0;

var scroll = 0;
var lastScroll = 0;
var scrollJack = 0;

function initHeights(){
	projectsInited++;

	if (projectsInited == NUM_PROJECTS){
		main();
	}
}

$( document ).ready(function() {
	$.getJSON("data/projects.json", function(json) {
		NUM_PROJECTS = json.projects.length;

		HTMLProjects.push(new HTMLProject(json.projects[NUM_PROJECTS - 1]));
	    for (var i = 0; i < json.projects.length; i++){
	    	HTMLProjects.push(new HTMLProject(json.projects[i]));
	    	HTMLProjects[i].load(initHeights);
	    }
	    HTMLProjects.push(new HTMLProject(json.projects[0]));

	});
});

function currentFocused (projects){
	for (var i = 0; i < projects.length; i++){
    	if (projects[i].isFocused()){
    		return i;
    	}
    }
    return 0;
}

function handleInfScroll(scroll){
	var totalHeight = 0;
	for (var i = 0; i < HTMLProjects.length; i++){
    	totalHeight += HTMLProjects[i].getHeight();
    }

    var p2 = totalHeight - HTMLProjects[HTMLProjects.length - 1].getHeight();

    if (scroll >= p2){
    	$(window).scrollTop(HTMLProjects[0].getHeight() + (scroll - p2));
    	scroll = HTMLProjects[0].getHeight() + (scroll - p2);
    	lastScroll = HTMLProjects[0].getHeight() + (scroll - p2);
    	return 1;
    }

    if (scroll <= HTMLProjects[0].getHeight()) {
    	$(window).scrollTop( totalHeight - HTMLProjects[HTMLProjects.length - 1].getHeight() - (HTMLProjects[0].getHeight() - scroll));
    	scroll =  totalHeight - HTMLProjects[HTMLProjects.length - 1].getHeight() - (HTMLProjects[0].getHeight() - scroll);
    	lastScroll =  totalHeight - HTMLProjects[HTMLProjects.length - 1].getHeight() - (HTMLProjects[0].getHeight() - scroll);

    	return 1;
    }
    return 0;
}

function checkFocus (e){
    var heightSoFar = HTMLProjects[0].getHeight();
    var scrollDist = 0;

    if (e.originalEvent.wheelDeltaY < 0){
    	scrollDist += Math.abs(e.originalEvent.wheelDeltaY);
    }else{
    	return;
    }

    for (var i = 1; i < HTMLProjects.length; i++){
    	
    	if (!HTMLProjects[i].isFocused() && 
    		scroll + scrollDist >= heightSoFar &&
    		scroll + scrollDist < heightSoFar + HTMLProjects[i].getHeight() &&
    		lastScroll + scrollDist < heightSoFar){
    			HTMLProjects[i].setFocus(true);
    			scrollJack = 1;
    			setTimeout(function(){ $(window).scrollTop(heightSoFar);}, 0);
    			setTimeout(function(){ 
    				scrollJack = 0;
    			}, 500);
    			
	    		for (var k = 0; k < HTMLProjects.length; k++){
	    			if (i != k){
	    				HTMLProjects[k].setFocus(false);
	    			}
	    		}
	    		break;
    	}
    	heightSoFar += HTMLProjects[i].getHeight();
    }
}

function handleBackground (e){
    var heightSoFar = HTMLProjects[0].getHeight();
    var scrollDist = 0;

    if (e.originalEvent.wheelDeltaY < 0){
    	scrollDist += Math.abs(e.originalEvent.wheelDeltaY);
    }

    for (var i = 1; i < HTMLProjects.length; i++){
    	
    	if (scroll + scrollDist >= heightSoFar &&
    		scroll + scrollDist < heightSoFar + HTMLProjects[i].getHeight()){
    			$("body").css('background-color' , HTMLProjects[i].getColour());
	    		break;
    	}
    	heightSoFar += HTMLProjects[i].getHeight();
    }
}

function handleOpacity (e){

    for (var i = 1; i < HTMLProjects.length; i++){
    	for (var j = 0; j < HTMLProjects[i].getImages().length; j++){
    		if (lastScroll <  HTMLProjects[i].getImages()[j].offset().top - HTMLProjects[i].getImages()[j].height() &&
    			scroll > HTMLProjects[i].getImages()[j].offset().top - HTMLProjects[i].getImages()[j].height()) {
    				HTMLProjects[i].getImages()[j].animate({opacity: 1}, 1500);
    				return;
			}
    	}
    }
}

$( window ).resize(function() {
	console.log("RESIZE");
	setTimeout(function(){ 
		$(window).scrollTop(scroll);
	}, 0);
});

$('body').on({
    'mousewheel': function(e) {
    	lastScroll = scroll;
    	scroll = $(window).scrollTop();

        if (e.target.id == 'el') return;

        if(scrollJack){
        	e.preventDefault();
        	e.stopPropagation();
    		return;
    	}
    	if (!handleInfScroll(scroll)){
    		checkFocus(e);
    	}

    	handleBackground(e);
    	handleOpacity(e);
    }
});

function main(){
	console.log('all loaded');
	scroll = HTMLProjects[0].getHeight();
	HTMLProjects[1].setFocus(true);
	$("body").css('background-color' , HTMLProjects[1].getColour());
	$(window).scrollTop(HTMLProjects[0].getHeight());

	$(".work").html('Work');
	$(".info").html('Info');
}