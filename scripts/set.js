function Set(project){
	this.colour = project.colour;
	this.html = []
	this.html["title"] = $("<div class='project-title'>" + "<p>" + project.title + "</p></div>");
	this.html["client"] = $("<div class='project-client'>" + "<p>" + project.client + "</p></div>");
	this.html["date"] = $("<div class='project-date'>" + "<p>" + project.date + "</p></div>");

	this.images = [];

	for (var i = 0; i < project.images.length; i++){
		this.images.push($("<img class='project-img' src=" + project.images[i].url + ">"));
	}
	
	this.getColour = function (){
		return this.colour;
	}
	this.attach = function (dom){
		for (var key in this.html) {
		 	dom.append(this.html[key]);
		 	this.html[key].css('opacity', '0.5');
		}

		for (var i = 0; i < this.images.length; i++){
		 	dom.append(this.images[i]);
		 	this.images[i].css('opacity', '0.5');
		}
	}

	this.prepend = function (dom){

		for (var i = this.images.length; i >= 0 ; i--){
		 	dom.prepend(this.images[i]);
		}

		var arr = [];
		  
		for (var key in this.html) {
			arr.push(key);
		 	dom.prepend(this.html[key]);
		}

		for (var i = arr.length-1; i >= 0; i--) {
		    dom.prepend(this.html[arr[i]]);
		}
	}
	this.remove = function (){
		for (var key in this.html) {
		 	this.html[key].remove();
		}

		for (var i = 0; i < this.images.length; i++){
		 	this.images[i].remove();
		}
	}

	this.incrOpacity = function (incr){
		var opc;
		for (var key in this.html) {
		 	opc = this.html[key].css('opacity');
		 	this.html[key].css('opacity', parseFloat(opc) + incr);
		}

		for (var i = 0; i < this.images.length; i++){
			opc = this.html[key].css('opacity');
		 	this.images[i].css('opacity', parseFloat(opc) + incr);
		}
	}

	this.getOpacity = function(){
		return this.images[0].css('opacity');
	}
}