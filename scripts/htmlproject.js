function HTMLProject (project) {

	this.bgcolour = project.bgcolour;
	this.textcolour = project.textcolour;
	this.focused = false;

	this.html = []
	this.html["container"] = $("<div class='project-container'></div>");
	this.html["img-wrap"] = $("<div id='img-wrap'></div>");
	this.html["title"] = $("<div class='project-title'><span class='title'>" + project.title + " &#8213 </span><span class='subtitle'>" + project.subtitle + "</span></div>");
	this.html["description"] = $("<div class='project-description'><span>" + project.description + "</span></div>");

	this.images = [];



	for (var i = 0; i < project.images.length; i++){
		this.images.push($("<img class='project-img' src=" + project.images[i].url + ">"));
	}

	for (var key in this.html) {
	 	this.html["container"].append(this.html[key]);
	}

	this.html["img-wrap"].append(this.images);
	this.html["container"].append(this.html["img-wrap"]);

	$('.scrolling-content').append(this.html["container"]);

	this.getHeight = function(){
		return this.html["container"].height();
	}

	this.getBg = function(){
		return this.bgcolour;
	}

	this.getTextColour = function(){
		return this.textcolour;
	}

	this.getImages = function(){
		return this.images;
	}

	this.isFocused = function(){
		return this.focused;
	}

	this.setFocus = function(focus){
		this.focused = focus;
	}

	var self = this;
	this.load = function load (callback){

		var count = 0;
		for (var i = 0; i < self.images.length; i++){
			self.images[i].load(function(){
				count++;

				if (count == self.images.length){
					callback();
				}
			});
		}
	}
}
