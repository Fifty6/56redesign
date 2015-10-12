function Project(project){
	this.colour = project.colour;
	this.title = project.title;
	this.client = project.client;
	this.date = project.date;
	this.images = [];

	for (var i = 0; i < project.images.length; i++){
		this.images.push(project.images[i].url);
	}
	
	this.getColour = function (){
		return this.colour;
	}

	this.getTitle = function (){
		return this.title;
	}

	this.getClient = function (){
		return this.client;
	}

	this.getDate = function (){
		return this.date;
	}

	this.getImages = function (){
		return this.images;
	}
}