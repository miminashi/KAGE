function Kage(){
  // method
  function makeGlyph(polygons, target){ // void
    var buhin = this.kBuhin.search(target);
    if(buhin != ""){
      this.drawGlyph(polygons, buhin);
    }
  }
  Kage.prototype.makeGlyph = makeGlyph;

  function drawGlyph(polygons, glyph){ // void
    // [glyph] : [stroke]$[stroke]$.....
    // [stroke] : [column]:[column]:.....
    var strokes = glyph.split("$");
    for(var i = 0; i < strokes.length; i++){
      var columns = strokes[i].split(":");
      if(Math.floor(columns[0]) != 99){
	dfDrawFont(this, polygons,
		   Math.floor(columns[0]),
		   Math.floor(columns[1]), Math.floor(columns[2]),
		   Math.floor(columns[3]), Math.floor(columns[4]),
		   Math.floor(columns[5]), Math.floor(columns[6]),
		   Math.floor(columns[7]), Math.floor(columns[8]),
		   Math.floor(columns[9]), Math.floor(columns[10]));
      } else {
	var buhin = this.kBuhin.search(columns[7]);
	if(buhin != ""){
	  this.drawBuhin(polygons, buhin,
			 Math.floor(columns[3]),
			 Math.floor(columns[4]),
			 Math.floor(columns[5]),
			 Math.floor(columns[6]));
	}
      }
    }
  }
  Kage.prototype.drawGlyph = drawGlyph;
  
  function drawBuhin(polygons, glyph, x1, y1, x2, y2){ // void
    var strokes = glyph.split("$");
    for(var i = 0; i < strokes.length; i++){
      var columns = strokes[i].split(":");
      if(Math.floor(columns[0]) != 99){
	dfDrawFont(this, polygons,
		   Math.floor(columns[0]),
		   Math.floor(columns[1]),
		   Math.floor(columns[2]),
		   x1 + Math.floor(columns[3]) * (x2 - x1) / 200,
		   y1 + Math.floor(columns[4]) * (y2 - y1) / 200,
		   x1 + Math.floor(columns[5]) * (x2 - x1) / 200,
		   y1 + Math.floor(columns[6]) * (y2 - y1) / 200,
		   x1 + Math.floor(columns[7]) * (x2 - x1) / 200,
		   y1 + Math.floor(columns[8]) * (y2 - y1) / 200,
		   x1 + Math.floor(columns[9]) * (x2 - x1) / 200,
		   y1 + Math.floor(columns[10]) * (y2 - y1) / 200);
      } else {
	var buhin = this.kBuhin.search(columns[7]);
	if(buhin != ""){
	  this.drawBuhin(polygons, buhin,
			 x1 + Math.floor(columns[3]) * (x2 - x1) / 200,
			 y1 + Math.floor(columns[4]) * (y2 - y1) / 200,
			 x1 + Math.floor(columns[5]) * (x2 - x1) / 200,
			 y1 + Math.floor(columns[6]) * (y2 - y1) / 200);
	}
      }
    }
  }
  Kage.prototype.drawBuhin = drawBuhin;
  
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
