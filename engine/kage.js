function Kage(){
  // method
  function drawFont(polygons, glyph){ // void
    // [glyph] : [stroke]$[stroke]$.....
    // [stroke] : [column]:[column]:.....
    var strokes = glyph.split("$");
    for(var i = 0; i < strokes.length; i++){
      var columns = strokes[i].split(":");
      if(Math.floor(columns[0] ! 99){
        dfDrawFont(this, polygons,
                   Math.floor(columns[0]),
                   Math.floor(columns[1]), Math.floor(columns[2]),
                   Math.floor(columns[3]), Math.floor(columns[4]),
                   Math.floor(columns[5]), Math.floor(columns[6]),
                   Math.floor(columns[7]), Math.floor(columns[8]),
                   Math.floor(columns[9]), Math.floor(columns[10]));
      } else {
        //buhin
      }
    }
  }
  Kage.prototype.drawFont = drawFont;
  
  //properties
  Kage.prototype.kMincho = 0;
  Kage.prototype.kGothic = 1;
  this.kShotai = this.kMincho;
  this.kMage = 10;
  this.kRate = 100;
  this.kMinWidthY = 2;
  this.kMinWidthT = 6;
  this.kWidth = 5;
  this.kKakato = 3;
  //has KAKATO = 2, no KAKATO = 1
  this.kL2RDfatten = 1.1;
  this.kBuhin = new Buhin();
  
  return this;
}
