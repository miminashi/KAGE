function Polygon(number){
  // method
  function push(x, y){ // void
    var temp = new Object();
    temp.x = x;
    temp.y = y;
    this.array.push(temp);
  }
  Polygon.prototype.push = push;
  
  function set(index, x, y){ // void
    this.array[index].x = x;
    this.array[index].y = y;
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
