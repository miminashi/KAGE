function Kage(){
  // method
  function makeGlyph(polygons, buhin){ // void
    var glyphData = this.kBuhin.search(buhin);
    if(glyphData != ""){
      this.drawStrokesArray(polygons, this.adjustUroko(this.adjustKakato(this.getEachStrokes(glyphData))));
    }
  }
  Kage.prototype.makeGlyph = makeGlyph;
  
  function getEachStrokes(glyphData){ // strokes array
    var strokesArray = new Array();
    var strokes = glyphData.split("$");
    for(var i = 0; i < strokes.length; i++){
      var columns = strokes[i].split(":");
      if(Math.floor(columns[0]) != 99){
        strokesArray.push([
          Math.floor(columns[0]),
          Math.floor(columns[1]),
          Math.floor(columns[2]),
          Math.floor(columns[3]),
          Math.floor(columns[4]),
          Math.floor(columns[5]),
          Math.floor(columns[6]),
          Math.floor(columns[7]),
          Math.floor(columns[8]),
          Math.floor(columns[9]),
          Math.floor(columns[10])
          ]);
      } else {
        var buhin = this.kBuhin.search(columns[7]);
        if(buhin != ""){
          strokesArray = strokesArray.concat(this.getEachStrokesOfBuhin(buhin,
                                                  Math.floor(columns[3]),
                                                  Math.floor(columns[4]),
                                                  Math.floor(columns[5]),
                                                  Math.floor(columns[6]))
                            );
        }
      }
    }
    return strokesArray;
  }
  Kage.prototype.getEachStrokes = getEachStrokes;
  
  function getEachStrokesOfBuhin(buhin, x1, y1, x2, y2){
    var temp = this.getEachStrokes(buhin);
    var result = new Array();
    for(var i = 0; i < temp.length; i++){
      result.push([temp[i][0],
                   temp[i][1],
                   temp[i][2],
                   x1 + temp[i][3] * (x2 - x1) / 200,
                   y1 + temp[i][4] * (y2 - y1) / 200,
                   x1 + temp[i][5] * (x2 - x1) / 200,
                   y1 + temp[i][6] * (y2 - y1) / 200,
                   x1 + temp[i][7] * (x2 - x1) / 200,
                   y1 + temp[i][8] * (y2 - y1) / 200,
                   x1 + temp[i][9] * (x2 - x1) / 200,
                   y1 + temp[i][10] * (y2 - y1) / 200]);
    }
    return result;
  }
  Kage.prototype.getEachStrokesOfBuhin = getEachStrokesOfBuhin;
  
	function adjustUroko(strokesArray){ // strokesArray
    for(var i = 0; i < strokesArray.length; i++){
      if(strokesArray[i][0] == 1 && strokesArray[i][2] == 0){ // 縦はウロコないので無視。でも計算量が無駄
        for(var k = 0; k < this.kAdjustUrokoLengthStep; k++){
          var tx, ty, tlen;
          if(strokesArray[i][4] == strokesArray[i][6]){ // 横
            tx = strokesArray[i][5] - this.kAdjustUrokoLine[k];
            ty = strokesArray[i][6] - 0.5;
            tlen = strokesArray[i][5] - strokesArray[i][3];
          } else {
            var rad = Math.atan((strokesArray[i][6] - strokesArray[i][4]) / (strokesArray[i][5] - strokesArray[i][3]));
            tx = strokesArray[i][5] - this.kAdjustUrokoLine[k] * Math.cos(rad) - 0.5 * Math.sin(rad);
            ty = strokesArray[i][6] - this.kAdjustUrokoLine[k] * Math.sin(rad) - 0.5 * Math.cos(rad);
            tlen = Math.sqrt((strokesArray[i][6] - strokesArray[i][4]) * (strokesArray[i][6] - strokesArray[i][4]) +
                             (strokesArray[i][5] - strokesArray[i][3]) * (strokesArray[i][5] - strokesArray[i][3]));
          }
          if(tlen < this.kAdjustUrokoLength[k] ||
             isCrossWithOthers(strokesArray, i, tx, ty, strokesArray[i][5], strokesArray[i][6])
             ){
            strokesArray[i][2] += (this.kAdjustUrokoLengthStep - k) * 100;
            k = Infinity;
          }
        }
      }
    }
    return strokesArray;
  }
  Kage.prototype.adjustUroko = adjustUroko;
	
  function adjustKakato(strokesArray){ // strokesArray
    for(var i = 0; i < strokesArray.length; i++){
      if(strokesArray[i][0] == 1 &&
         (strokesArray[i][2] == 13 || strokesArray[i][2] == 23)){
        for(var k = 0; k < this.kAdjustKakatoStep; k++){
          if(isCrossBoxWithOthers(strokesArray, i,
                               strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                               strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                               strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                               strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])
             ){
            strokesArray[i][2] += (3 - k) * 100;
            k = Infinity;
          }
        }
      }
    }
    return strokesArray;
  }
  Kage.prototype.adjustKakato = adjustKakato;
  
  function drawStrokesArray(polygons, strokesArray){
    for(var i = 0; i < strokesArray.length; i++){
      dfDrawFont(this, polygons,
                 strokesArray[i][0],
                 strokesArray[i][1],
                 strokesArray[i][2],
                 strokesArray[i][3],
                 strokesArray[i][4],
                 strokesArray[i][5],
                 strokesArray[i][6],
                 strokesArray[i][7],
                 strokesArray[i][8],
                 strokesArray[i][9],
                 strokesArray[i][10]);
    }
  }
  Kage.prototype.drawStrokesArray = drawStrokesArray;
  
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
	
  this.kRate = 100;
	
  this.kMinWidthY = 2;
  this.kMinWidthT = 6;
  this.kWidth = 5;
  this.kKakato = 3;
  this.kL2RDfatten = 1.1;
  this.kMage = 10;
	
  this.kAdjustKakatoL = ([14, 9, 5, 2]); // 調整済みカカト用 000,100,200,300
  this.kAdjustKakatoR = ([8, 6, 4, 2]); // 調整済みカカト用 000,100,200,300
  this.kAdjustKakatoRangeX = 20; // 影響判定矩形の大きさ
  this.kAdjustKakatoRangeY = ([1, 19, 24, 30]); // 影響判定矩形の大きさ境界（3領域）
  this.kAdjustKakatoStep = 3; // 影響判定矩形の段階
	
  this.kAdjustUrokoX = ([24, 20, 16, 12]); // 調整済みサイズ 000,100,200,300
  this.kAdjustUrokoY = ([12, 11, 9, 8]); // 調整済みサイズ 000,100,200,300
  this.kAdjustUrokoLength = ([22, 36, 50]); // 影響判定長さの段階
  this.kAdjustUrokoLengthStep = 3; // 影響判定長さの段階
  this.kAdjustUrokoLine = ([22, 26, 30]); // 交差の影響判定。Lengthと対応
	
  this.kBuhin = new Buhin();
  
  return this;
}
