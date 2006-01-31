function Polygon(_index){
  // method
  function push(_x, _y){ // void
    var temp = new Object();
    temp.x = _x;
    temp.y = _y;
    this.array.push(temp);
  }
  Polygon.prototype.push = push;
  
  function set(_index, _x, _y){ // void
    this.array[_index].x = _x;
    this.array[_index].y = _y;
  }
  Polygon.prototype.set = set;
  
  function reverse(){ // void
    this.array.reverse();
  }
  Polygon.prototype.reverse = reverse;
  
  function concat(_poly){ // void
    this.array = this.array.concat(_poly.array);
  }
  Polygon.prototype.concat = concat;
  
  // property
  this.array = new Array();
  
  // initialize
  if(_index){
    for(var i = 0; i < _index; i++){
      this.push(0, 0);
    }
  }
  
  return this;
}
