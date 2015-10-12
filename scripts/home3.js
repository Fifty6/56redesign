var HTMLProjects = [];
var projectsInited = 0;
var NUM_PROJECTS = 0;

function initHeights(){
	projectsInited++;

	if (projectsInited == NUM_PROJECTS){
		main();
	}
}

$( document ).ready(function() {
	$.getJSON("data/projects.json", function(json) {
		NUM_PROJECTS = json.projects.length;
	    for (var i = 0; i < json.projects.length; i++){
	    	HTMLProjects.push(new HTMLProject(json.projects[i]));
	    	HTMLProjects[i].load(initHeights);
	    }
	});
});

//at this point we have all project data loaded
//and we know the height of each project
function main(){
	console.log('all loaded');

	$(document).alton({
	    fullSlideContainer: 'full', // Tell Alton the full height container
	    singleSlideClass: 'slide', // Tell Alton the full height slide class
	    useSlideNumbers: false, // Set to false if you don't want to use pagination
	    slideNumbersBorderColor: '#fff', // Set the outside color of the pagination items
	    slideNumbersColor: 'transparent', // Set the inner color of the pagination items
	    bodyContainer: 'pageWrapper', // Tell Alton the body class
	});
}

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    
    for (var i = 0; i < HTMLProjects.length; i++){
    	if (scroll == HTMLProjects[i].html["container"].offset().top){
    		$("body").css('background-color' , HTMLProjects[i].getColour());
    	}
    }
});