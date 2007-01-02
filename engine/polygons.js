function Polygons(){
  // method
  function push(polygon){ // void
    // only a simple check
    var minx = 200;
    var maxx = 0;
    var miny = 200;
    var maxy = 0;
    for(var i = 0; i < polygon.array.length; i++){
      if(polygon.array[i].x < minx){
	minx = polygon.array[i].x;
      }
      if(polygon.array[i].x > maxx){
	maxx = polygon.array[i].x;
      }
      if(polygon.array[i].y < miny){
	miny = polygon.array[i].y;
      }
      if(polygon.array[i].y > maxy){
	maxy = polygon.array[i].y;
      }
    }
    if(minx != maxx && miny != maxy && polygon.array.length >= 3){
      var newArray = new Array();
      newArray.push(polygon.array.shift());
      while(polygon.array.length != 0){
	var temp = polygon.array.shift();
	if(newArray[newArray.length - 1].x != temp.x ||
	   newArray[newArray.length - 1].y != temp.y){
	  newArray.push(temp);
	}
      }
      if(newArray.length >= 3){
	polygon.array = newArray;
	this.array.push(polygon);
      }
    }
  }
  Polygons.prototype.push = push;
  
  function generateSVG(){ // string
    var buffer = "";
    buffer += "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \n  \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";
    buffer += "<svg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" baseProfile=\"full\">\n";
    buffer += "<g fill=\"black\">\n";
    for(var i = 0; i < this.array.length; i++){
      buffer += "<polygon points=\"";
      for(var j = 0; j < this.array[i].array.length; j++){
        buffer += this.array[i].array[j].x + "," + this.array[i].array[j].y + " ";
      }
      buffer += "\" />\n";
    }
    buffer += "</g>\n";
    buffer += "</svg>\n";
    return buffer;
  }
  Polygons.prototype.generateSVG = generateSVG;
  
  // property
  this.array = new Array();
  
  return this;
}
