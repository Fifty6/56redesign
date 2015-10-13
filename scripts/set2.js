function Project(project){
	this.bgcolour = project.bgcolour;
	this.textcolour = project.textcolour;
	this.title = project.title;
	this.client = project.client;
	this.date = project.date;
	this.images = [];

	for (var i = 0; i < project.images.length; i++){
		this.images.push(project.images[i].url);
	}
	
	this.getBg = function (){
		return this.bgcolour;
	};

	this.getTextColour = function (){
		return this.textcolour;
	};

	this.getTitle = function (){
		return this.title;
	};

	this.getClient = function (){
		return this.client;
	};

	this.getDate = function (){
		return this.date;
	};

	this.getImages = function (){
		return this.images;
	};
}
