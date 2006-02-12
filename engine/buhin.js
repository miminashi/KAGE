function Buhin(number){
  // method
  function push(name, data){ // void
    var temp = new Object();
    temp.name = name;
    temp.data = data;
    this.array.push(temp);
  }
  Buhin.prototype.push = push;
  
  function search(name){ // string
    for(var i = 0; i < this.array.length; i++){
      if(this.array[i].name == name){
        return this.array[i].data;
      }
    }
  }
  Buhin.prototype.search = search;
  
  // property
  this.array = new Array();
  
  // initialize
  // no operation
  
  return this;
}
