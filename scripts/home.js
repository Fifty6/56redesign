var index = 0;
var sets = [];
var scrollLock1 = 30;
var scrollLock2 = 30;

var p1 = 0;
var p2 = 0;
var p3 = 0;

function incrIndex (n){
	for (var i = 0; i < n; i++){
		if (index < sets.length - 1){
			index++;
		}else{
			index = 0;
		}
	}
}

function decrIndex (n){
	for (var i = 0; i < n; i++){
		if (index == 0){
			index = sets.length - 1;
		}else{
			index--;
		}
	}
}

$( document ).ready(function() {
	$.getJSON("data/projects.json", function(json) {
	    for (var i = 0; i < json.projects.length; i++){
	    	sets.push(new Set(json.projects[i]));
	    }

	    sets[index].attach($(".content"));
	    setTimeout(function(){

	    	p1 = $(".content").height(); 
	    	incrIndex(1);
	    	sets[index].attach($(".content"));
	    	setTimeout(function(){ 
	    		p2 = $(".content").height(); 
	    		incrIndex(1);
	    		sets[index].attach($(".content"));
	    		setTimeout(function(){ 
	    			p3 = $(".content").height();
	    			sets[0].incrOpacity(0.5);
	    			$("body").css('background-color' , sets[0].getColour());
	    		}, 100);
	    	}, 100);
	    }, 100);




	});
});


var lastScrollTop = 0;
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();

    if (scroll > p1 - 500){
    	if (sets[index].getOpacity() < 1){
	    	decrIndex(1);
	    	sets[index].incrOpacity(0.1);
	    	incrIndex(1);
    	}
    }

    if (scroll > p2 - 500){
    	if (sets[index].getOpacity() < 1){
	    	sets[index].incrOpacity(0.1);
    	}
    }

    if (scroll >= 0 && scroll < 200){
    	decrIndex(2);
    	console.log(sets[index].getColour());
    	$("body").css('background-color' , sets[index].getColour());
    	incrIndex(2);
    }

    if (scroll >= p1 && scroll < p1 + 200){
    	decrIndex(1);
    	console.log(sets[index].getColour());
    	$("body").css('background-color' , sets[index].getColour());
    	incrIndex(1);
    }

    if (scroll >= p2 && scroll < p2 + 200){
    	console.log(sets[index].getColour());
    	$("body").css('background-color' , sets[index].getColour());
    }



    if (scroll > lastScrollTop){
    	// downscroll code

    	//scroll jacking
    	if (scroll >= p1 && scroll < p1 + 300){
	    	if (scrollLock1){
	    		$(window).scrollTop(p1);

	    		scrollLock1--;
	    		return;
	    	}
	    }
	    if (scroll >= p2 && scroll < p2 + 300){
			if (scrollLock2){
				$(window).scrollTop(p2);

				scrollLock2--;
				return;
			}
		}

       	//add/remove project
	    if (scroll + $(window).height() >= p3){
	    	decrIndex(2);

	    	sets[index].remove();

	    	incrIndex(3);
	    	sets[index].attach($(".content"));
	    	
	    	$(window).scrollTop(scroll - p1);
	    	lastScrollTop = $(window).scrollTop();
	    	scroll = $(window).scrollTop();
	    	event.stopPropagation();

	    	var tempp1 = p1;
	    	p1 = p2 - p1;
	    	p2 = p3 - tempp1;
	    	setTimeout(function(){ 
	    		p3 = $(".content").height(); 
	    		scrollLock1 = 30;
	    		scrollLock2 = 30;
	    	}, 0); 
	    }
   } else if (scroll < lastScrollTop){
    	// upscroll code
    	console.log("UPSCROLL");
    	scrollLock1 = 30;
    	scrollLock2 = 30;
    	//add/remove project
	    if (scroll + $(window).height() <= p2 && scroll > p1){
	    	sets[index].remove();
	    	decrIndex(3);
	    	sets[index].prepend($(".content"));
	    	$(window).scrollTop($(".content").height() - $(window).height());
	    	lastScrollTop = scroll;
	    	incrIndex(2);
	    	setTimeout(function(){ 
	    		$(window).scrollTop($(".content").height() - $(window).height());
	    		lastScrollTop = $(window).scrollTop();
	    		scroll = $(window).scrollTop();
	    		event.stopPropagation();

		    	var tempp1 = p1;
		    	p1 = $(".content").height() - p2;
		    	p2 = p1 + tempp1;
	    		p3 = $(".content").height(); 

	    	}, 0); 
	    }

	}


   lastScrollTop = scroll;

   console.log("lock point:" + p1);
});