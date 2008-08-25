function Kage(){
  // method
  function makeGlyph(polygons, buhin){ // void
    var glyphData = this.kBuhin.search(buhin);
    if(glyphData != ""){
      this.drawStrokesArray(polygons, this.adjustKakato(this.getEachStrokes(glyphData)));
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
  
  function adjustKakato(strokesArray){ // strokesArray
    for(var i = 0; i < strokesArray.length; i++){
      if(strokesArray[i][0] == 1 &&
         (strokesArray[i][2] == 13 || strokesArray[i][2] == 23)){
        for(var k = 0; k < this.kAdjustKakatoStep; k++){
          var crossing = 0;
          for(var j = 0; j < strokesArray.length && !crossing; j++){
            if(i == j){ continue; }
            switch(strokesArray[j][0]){
            case 0:
            case 8:
            case 9:
              break;
            case 6:
            case 7:
              if(!crossing && isCross(strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[j][9],
                         strokesArray[j][10],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[j][9],
                         strokesArray[j][10],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[j][9],
                         strokesArray[j][10],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[j][9],
                         strokesArray[j][10],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
            case 2:
            case 12:
            case 3:
              if(!crossing && isCross(strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[j][7],
                         strokesArray[j][8],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
            default:
              if(!crossing && isCross(strokesArray[j][3],
                         strokesArray[j][4],
                         strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][3],
                         strokesArray[j][4],
                         strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][3],
                         strokesArray[j][4],
                         strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
              if(!crossing && isCross(strokesArray[j][3],
                         strokesArray[j][4],
                         strokesArray[j][5],
                         strokesArray[j][6],
                         strokesArray[i][5] - this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1],
                         strokesArray[i][5] + this.kAdjustKakatoRangeX / 2,
                         strokesArray[i][6] + this.kAdjustKakatoRangeY[k + 1])){
                crossing++;
              }
            }
          }
          if(crossing){
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
  this.kMage = 10;
  this.kRate = 100;
  this.kMinWidthY = 2;
  this.kMinWidthT = 6;
  this.kWidth = 5;
  this.kAdjustKakatoL = ([14, 9, 5, 2]); // 調整済みカカト用
  this.kAdjustKakatoR = ([8, 6, 4, 2]); // 調整済みカカト用
  this.kAdjustKakatoRangeX = 20; // 影響判定矩形の大きさ
  this.kAdjustKakatoRangeY = ([1, 19, 24, 30]); // 影響判定矩形の大きさ
  this.kAdjustKakatoStep = 3; // 影響判定矩形の段階
  this.kKakato = 3;
  this.kL2RDfatten = 1.1;
  this.kBuhin = new Buhin();
  
  return this;
}
