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

// function handleBackground (e){
//     var heightSoFar = HTMLProjects[0].getHeight();
//     var scrollDist = 0;

//     if (e.originalEvent.wheelDeltaY < 0){
//     	scrollDist += Math.abs(e.originalEvent.wheelDeltaY);
//     }

//     for (var i = 1; i < HTMLProjects.length; i++){
    	
//     	if (scroll + scrollDist >= heightSoFar &&
//     		scroll + scrollDist < heightSoFar + HTMLProjects[i].getHeight()){
//                 // $("body").css('background-color' , HTMLProjects[i].getBg());

//                 // plane.material.color.setHex("0x"+HTMLProjects[i].getTextColour().substring(1,HTMLProjects[i].getTextColour().length));
//                 // renderer.setClearColor(HTMLProjects[i].getBg(), 1);
//                 // scene.fog.color.setHex("0x"+HTMLProjects[i].getBg().substring(1,HTMLProjects[i].getBg().length));

//                 // $(".project-title").css('color' , HTMLProjects[i].getTextColour());
//                 // $("aside").css('color' , HTMLProjects[i].getTextColour());
//                 // $(".logo svg").css('fill' , HTMLProjects[i].getTextColour());
//                 // $(".info").css('color' , HTMLProjects[i].getTextColour());
//                 // $("#about-wrap").css('color' , HTMLProjects[i].getBg());
//                 // $("#about-close div").css('background-color' , HTMLProjects[i].getBg());
//                 // $("#about-wrap p a").css('color' , HTMLProjects[i].getBg());
//                 // $("#about-wrap p a").css('border-bottom-color' , HTMLProjects[i].getBg());
//                 // $("#about-overlay").css('background-color' , HTMLProjects[i].getBg());
//                 // $(".project-description a").css({
//                 //     'color' : HTMLProjects[i].getTextColour(),
//                 //     'border-bottom-color' : HTMLProjects[i].getTextColour()});
// 	    		break;
//     	}
//     	heightSoFar += HTMLProjects[i].getHeight();
//     }
// }

function inView (top, bottom){
    if ($(window).scrollTop() < bottom && ($(window).scrollTop() + $(window).height()) > bottom){
        return true;
    }

    if ($(window).scrollTop() < top && ($(window).scrollTop() + $(window).height()) > top){
        return true;
    }

    if ($(window).scrollTop() > top && ($(window).scrollTop() + $(window).height()) < bottom){
        return true;
    }

    return false;
}

function changeColor(project) {
    $("body").css('background-color' , project.getBg());
    $(".project-title").css('color' , project.getTextColour());
    $("aside").css('color' , project.getTextColour());
    $(".logo svg").css('fill' , project.getTextColour());
    $(".info").css('color' , project.getTextColour());
    $("#about-wrap").css('color' , project.getBg());
    $("#about-close div").css('background-color' , project.getBg());
    $("#about-wrap p a").css('color' , project.getBg());
    // $("#about-wrap p a").css('border-bottom-color' , project.getBg());
    $("#about-overlay").css('background-color' , project.getTextColour());
    $(".project-description a").css({
        'color' : project.getTextColour(),
        'border-bottom-color' : project.getTextColour()}); 
}

function handleOpacity (){

    for (var i = 0; i < HTMLProjects.length; i++){
        
        var top_of_object = HTMLProjects[i].getText().offset().top;
        var bottom_of_object = top_of_object + HTMLProjects[i].getHeight();

        var middle_of_window = $(window).scrollTop() + $(window).height()*0.7;
        var upper_of_window = $(window).scrollTop() + $(window).height()*0.3;

        if( lastScroll < scroll && middle_of_window > top_of_object && middle_of_window < bottom_of_object){

            if (HTMLProjects[i].getText().css('opacity') == 0){
                HTMLProjects[i].getText().css({'margin-top':'10%'});
                $(HTMLProjects[i].getText().parent().children()[1]).css({'margin-top':'10%'});
                HTMLProjects[i].getText().animate({'opacity':'1', 'margin-top':'0%'},1000);
                $(HTMLProjects[i].getText().parent().children()[1]).animate({'opacity': '1', 'margin-top':'0%'}, 1000);
            }

            changeColor(HTMLProjects[i]);

        }else if (lastScroll > scroll && HTMLProjects[i].getText().css('opacity') == 0 && upper_of_window > top_of_object && upper_of_window < bottom_of_object){

            HTMLProjects[i].getText().animate({'opacity':'1'},1000);
            $(HTMLProjects[i].getText().parent().children()[1]).animate({'opacity': '1'}, 1000);

            changeColor(HTMLProjects[i]);
        }else if (!inView(top_of_object, bottom_of_object) ){

            HTMLProjects[i].getText().css({'opacity': '0'});
            $(HTMLProjects[i].getText().parent().children()[1]).css({'opacity': '0'});

        }
    }    

    for (var i = 0; i < HTMLProjects.length; i++){
    	for (var j = 0; j < HTMLProjects[i].getImages().length; j++){

            var top_of_object = HTMLProjects[i].getImages()[j].offset().top;
            var bottom_of_object = HTMLProjects[i].getImages()[j].offset().top + HTMLProjects[i].getImages()[j].height();
            var middle_of_window = $(window).scrollTop() + $(window).height()*0.7;
            var upper_of_window = $(window).scrollTop() + $(window).height()*0.3;

            if( lastScroll < scroll && HTMLProjects[i].getImages()[j].css('opacity') == 0 && middle_of_window > top_of_object && middle_of_window < bottom_of_object ){
                
                HTMLProjects[i].getImages()[j].css({'margin-top':'10%'});
                HTMLProjects[i].getImages()[j].animate({'opacity':'1', 'margin-top':'0%'},1000);
                
                    
            } else if (lastScroll > scroll && upper_of_window > top_of_object && upper_of_window < bottom_of_object){
                if (j == HTMLProjects[i].getImages().length-1){
                    //upscroll
                    // $("body").css('background-color' , HTMLProjects[i].getBg());
                    // $(".project-title").css('color' , HTMLProjects[i].getTextColour());
                    // $("aside").css('color' , HTMLProjects[i].getTextColour());
                    // $(".logo svg").css('fill' , HTMLProjects[i].getTextColour());
                    // $(".info").css('color' , HTMLProjects[i].getTextColour());
                    // $("#about-wrap").css('color' , HTMLProjects[i].getBg());
                    // $("#about-close div").css('background-color' , HTMLProjects[i].getBg());
                    // $("#about-wrap p a").css('color' , HTMLProjects[i].getBg());
                    // // $("#about-wrap p a").css('border-bottom-color' , HTMLProjects[i].getBg());
                    // $("#about-overlay").css('background-color' , HTMLProjects[i].getTextColour());
                    // $(".project-description a").css({
                    //     'color' : HTMLProjects[i].getTextColour(),
                    //     'border-bottom-color' : HTMLProjects[i].getTextColour()});
                }
                
                if (HTMLProjects[i].getImages()[j].css('opacity') == 0){

                    HTMLProjects[i].getImages()[j].animate({'opacity':'1'},1000);
                }
            }else if (!inView(top_of_object, bottom_of_object) ){

                HTMLProjects[i].getImages()[j].css({'opacity': '0'}); 

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

$(window).scroll(function() {
    if (scroll == $(window).scrollTop()){
        return;
    }
    console.log("scroll");
    	lastScroll = scroll;
    	scroll = $(window).scrollTop();

        // if (e.target.id == 'el') return;

     //    if(scrollJack){
     //    	e.preventDefault();
     //    	e.stopPropagation();
    	// 	return;
    	// }
    	if (!handleInfScroll(scroll)){
    		// checkFocus(e);
            handleOpacity();
    	}else{
            console.log("BASDFASDFAS");
            HTMLProjects[1].getText().css({'opacity': '1'});  
            $(HTMLProjects[1].getText().parent().children()[1]).css({'opacity': '1'});
            HTMLProjects[1].getImages()[0].css({'opacity': '1'});

            HTMLProjects[HTMLProjects.length-1].getText().css({'opacity': '1'});  
            $(HTMLProjects[HTMLProjects.length-1].getText().parent().children()[1]).css({'opacity': '1'});
            HTMLProjects[HTMLProjects.length-1].getImages()[0].css({'opacity': '1'});
        }

    	
    	
});

var lastY;
// var down = false;

$(document).on({'touchmove': function(e) {
    lastScroll = scroll;
    var currentY = e.originalEvent.touches[0].clientY;
    if(currentY > lastY){
        // moved down
        scroll = $(window).scrollTop() - 50;
    }else if(currentY < lastY){
        // moved up
        scroll = $(window).scrollTop() + 50;

    }

    $(window).scrollTop(scroll);
    lastY = currentY;

        
        

        // if (e.target.id == 'el') return;

     //    if(scrollJack){
     //     e.preventDefault();
     //     e.stopPropagation();
        //  return;
        // }
        if (!handleInfScroll(scroll)){
            // checkFocus(e);
            handleOpacity();
        }else{
            console.log("BASDFASDFAS");
            HTMLProjects[1].getText().css({'opacity': '1'});  
            $(HTMLProjects[1].getText().parent().children()[1]).css({'opacity': '1'});
            HTMLProjects[1].getImages()[0].css({'opacity': '1'});

            HTMLProjects[HTMLProjects.length-1].getText().css({'opacity': '1'});  
            $(HTMLProjects[HTMLProjects.length-1].getText().parent().children()[1]).css({'opacity': '1'});
            HTMLProjects[HTMLProjects.length-1].getImages()[0].css({'opacity': '1'});
        }

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
    // $("#about-wrap p a").css('border-bottom-color' , HTMLProjects[1].getBg());
    $("#about-overlay").css('background-color' , HTMLProjects[1].getTextColour());
    $(".project-description a").css({
        'color' : HTMLProjects[1].getTextColour(),
        'border-bottom-color' : HTMLProjects[1].getTextColour()});

    $( document ).ready(function() {

        setTimeout(function(){ 
            $(window).scrollTop(HTMLProjects[0].getHeight() + 20);

            HTMLProjects[1].getText().css({'margin-top':'10%'});
            $(HTMLProjects[1].getText().parent().children()[1]).css({'margin-top':'10%'});
            HTMLProjects[1].getText().animate({'opacity':'1'},1000);
            HTMLProjects[1].getText().animate({'margin-top':'0%'},1000);
            $(HTMLProjects[1].getText().parent().children()[1]).animate({'opacity': '1'}, 1000);
            $(HTMLProjects[1].getText().parent().children()[1]).animate({'margin-top':'0%'}, 1000);

            HTMLProjects[1].getImages()[0].css({'margin-top':'10%'});
            HTMLProjects[1].getImages()[0].animate({'opacity':'1'},1000);
            HTMLProjects[1].getImages()[0].animate({'margin-top':'0%'},1000);
        },10);
    });
	

    

    HTMLProjects[HTMLProjects.length-1].getText().animate({opacity: 1}, 750);  
    $(HTMLProjects[HTMLProjects.length-1].getText().parent().children()[1]).animate({opacity: 1}, 750);

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

