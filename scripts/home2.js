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

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

$( document ).ready(function() {
	$.getJSON("data/projects.json", function(json) {
		NUM_PROJECTS = json.projects.length;
        shuffle(json.projects);
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
                $("body").css('background-color' , HTMLProjects[i].getBg());

                plane.material.color.setHex("0x"+HTMLProjects[i].getTextColour().substring(1,HTMLProjects[i].getTextColour().length));
                renderer.setClearColor(HTMLProjects[i].getBg(), 1);
                scene.fog.color.setHex("0x"+HTMLProjects[i].getBg().substring(1,HTMLProjects[i].getBg().length));

                $(".project-title").css('color' , HTMLProjects[i].getTextColour());
                $("aside").css('color' , HTMLProjects[i].getTextColour());
                $(".logo svg").css('fill' , HTMLProjects[i].getTextColour());
                $(".info").css('color' , HTMLProjects[i].getTextColour());
                $("#about-wrap").css('color' , HTMLProjects[i].getBg());
                $("#about-close div").css('background-color' , HTMLProjects[i].getBg());
                $("#about-wrap p a").css('color' , HTMLProjects[i].getBg());
                $("#about-wrap p a").css('border-bottom-color' , HTMLProjects[i].getBg());
                $("#about-overlay").css('background-color' , HTMLProjects[i].getBg());
                $(".project-description a").css({
                    'color' : HTMLProjects[i].getTextColour(),
                    'border-bottom-color' : HTMLProjects[i].getTextColour()});
	    		break;
    	}
    	heightSoFar += HTMLProjects[i].getHeight();
    }
}

function handleOpacity (e){

    for (var i = 0; i < HTMLProjects.length; i++){
        if (i == 1){
            continue;
        }
        console.log(scroll + $('body').height());
        console.log(HTMLProjects[i].getText().offset().top);
        if (HTMLProjects[i].getText().css('opacity') != 0 &&
            ((scroll + $('body').height() + 500) < HTMLProjects[i].getText().offset().top || (scroll - 500) > (HTMLProjects[i].getText().offset().top + HTMLProjects[i].getText().height()))) {
                HTMLProjects[i].getText().css({'opacity': 0});  
                $(HTMLProjects[i].getText().parent().children()[1]).css({'opacity': 0}); 
                continue;
        }

        if (HTMLProjects[i].getText().css('opacity') != 1 &&
            scroll + $('body').height() > HTMLProjects[i].getText().offset().top + $('body').height()/2) {
                HTMLProjects[i].getText().animate({opacity: 1}, 750);  
                $(HTMLProjects[i].getText().parent().children()[1]).animate({opacity: 1}, 750);
                // continue;
        }

               
    }    

    for (var i = 0; i < HTMLProjects.length; i++){
    	for (var j = 0; j < HTMLProjects[i].getImages().length; j++){
            if (i == 1 && j == 0){
                continue;
            }
            if (HTMLProjects[i].getImages()[j].css('opacity') != 0 &&
                ((scroll + $('body').height() + 500)< HTMLProjects[i].getImages()[j].offset().top || (scroll - 500) > (HTMLProjects[i].getImages()[j].offset().top + HTMLProjects[i].getImages()[j].height()))) {
                    HTMLProjects[i].getImages()[j].css({'opacity': 0}); 
                    continue;       
            }
    		if (HTMLProjects[i].getImages()[j].css('opacity') != 1 &&
    			scroll + $('body').height() > HTMLProjects[i].getImages()[j].offset().top + $('body').height()/2) {
    				HTMLProjects[i].getImages()[j].animate({opacity: 1}, 750);
                    // continue;
    				
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
    		// checkFocus(e);
            handleOpacity(e);
    	}

    	handleBackground(e);
    	
    }
});

function main(){
	console.log('all loaded');
	scroll = HTMLProjects[0].getHeight();
	HTMLProjects[1].setFocus(true);
	$("body").css('background-color' , HTMLProjects[1].getBg());
    $(".project-title").css('color' , HTMLProjects[1].getTextColour());
    $("aside").css('color' , HTMLProjects[1].getTextColour());
    $(".logo svg").css('fill' , HTMLProjects[1].getTextColour());
    $(".info").css('color' , HTMLProjects[1].getTextColour());
    $("#about-wrap").css('color' , HTMLProjects[1].getBg());
    $("#about-close div").css('background-color' , HTMLProjects[1].getBg());
    $("#about-wrap p a").css('color' , HTMLProjects[1].getBg());
    $("#about-wrap p a").css('border-bottom-color' , HTMLProjects[1].getBg());
    $("#about-overlay").css('background-color' , HTMLProjects[1].getBg());
    $(".project-description a").css({
        'color' : HTMLProjects[1].getTextColour(),
        'border-bottom-color' : HTMLProjects[1].getTextColour()});

    plane.material.color.setHex("0x"+HTMLProjects[1].getTextColour().substring(1,HTMLProjects[1].getTextColour().length));
    renderer.setClearColor(HTMLProjects[1].getBg(), 1);
    scene.fog.color.setHex("0x"+HTMLProjects[1].getBg().substring(1,HTMLProjects[1].getBg().length));

	$(window).scrollTop(HTMLProjects[0].getHeight());

    HTMLProjects[1].getText().animate({opacity: 1}, 750);  
    $(HTMLProjects[1].getText().parent().children()[1]).animate({opacity: 1}, 750);
    HTMLProjects[1].getImages()[0].animate({opacity: 1}, 750);

    var aboutOverlay = $('#about-overlay'),
        aboutClose = $('#about-close'),
        scrollBody = $('.scrolling-content'),
        info = $('.info');

    info.click(function(){
        aboutOverlay.fadeIn(200);
        scrollBody.addClass('stop-scroll');
        $('body').css('overflow', 'hidden');
    });

    aboutClose.click(function(){
        aboutOverlay.fadeOut(200);
        scrollBody.removeClass('stop-scroll');
        $('body').css('overflow', 'auto');
    });

    setTimeout(function(){
        scrollBody.removeClass('fadein');
    }, 900);
}

