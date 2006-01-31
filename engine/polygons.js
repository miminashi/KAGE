function Polygons(){
  // method
  function push(_polygon){ // void
    this.array.push(_polygon);
  }
  Polygons.prototype.push = push;
  
  function generateSVG(){ // string
    var buffer = "";
    buffer += "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" baseProfile=\"full\">\n";
    buffer += "<g stroke=\"black\" stroke-width=\"1\" fill=\"black\">\n";
    for(var i = 0; i < this.array.length; i++){
      buffer += "<polyline points=\"";
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