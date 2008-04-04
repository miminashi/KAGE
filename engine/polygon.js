function Polygon(number){
  // resolution : 0.1
  
  // method
  function push(x, y){ // void
    var temp = new Object();
    temp.x = Math.floor(x*10)/10;
    temp.y = Math.floor(y*10)/10;
    this.array.push(temp);
  }
  Polygon.prototype.push = push;
  
  function set(index, x, y){ // void
    this.array[index].x = Math.floor(x*10)/10;
    this.array[index].y = Math.floor(y*10)/10;
  }
  Polygon.prototype.set = set;
  
  function reverse(){ // void
    this.array.reverse();
  }
  Polygon.prototype.reverse = reverse;
  
  function concat(poly){ // void
    this.array = this.array.concat(poly.array);
  }
  Polygon.prototype.concat = concat;

  // property
  this.array = new Array();
  
  // initialize
  if(number){
    for(var i = 0; i < number; i++){
      this.push(0, 0);
    }
  }
  
  return this;
}
