function cdDrawCurveU(kage, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, a1, a2){
  var rad, t;
  var x, y, v;
  var ix, iy, ia, ib, ir;
  var tt;
  var delta;
  var deltad;
  var XX, XY, YX, YY;
  var poly, poly2;
  var hosomi;
  
  if(kage.kShotai == kage.kMincho){ // mincho
    switch(a1 % 100){
    case 0:
    case 7:
      delta = -1 * kage.kMinWidthY * 0.5;
      break;
    case 1:
    case 2: // ... must be 32
    case 6:
    case 22:
    case 32: // changed
      delta = 0;
      break;
    case 12:
    //case 32:
      delta = kage.kMinWidthY;
      break;
    default:
      break;
    }
    
    if(x1 == sx1){
      if(y1 < sy1){ y1 = y1 - delta; }
      else{ y1 = y1 + delta; }
    }
    else if(y1 == sy1){
      if(x1 < sx1){ x1 = x1 - delta; }
      else{ x1 = x1 + delta; }
    }
    else{
      rad = Math.atan((sy1 - y1) / (sx1 - x1));
      if(x1 < sx1){ v = 1; } else{ v = -1; }
      x1 = x1 - delta * Math.cos(rad) * v;
      y1 = y1 - delta * Math.sin(rad) * v;
    }
    
    switch(a2 % 100){
    case 0:
    case 1:
    case 7:
    case 9:
    case 15: // it can change to 15->5
    case 14: // it can change to 14->4
    case 17: // no need
    case 5:
      delta = 0;
      break;
    case 8: // get shorten for tail's circle
      delta = -1 * kage.kMinWidthT * 0.5;
      break;
    default:
      break;
    }
    
    if(sx2 == x2){
      if(sy2 < y2){ y2 = y2 + delta; }
      else{ y2 = y2 - delta; }
    }
    else if(sy2 == y2){
      if(sx2 < x2){ x2 = x2 + delta; }
      else{ x2 = x2 - delta; }
    }
    else{
      rad = Math.atan((y2 - sy2) / (x2 - sx2));
      if(sx2 < x2){ v = 1; } else{ v = -1; }
      x2 = x2 + delta * Math.cos(rad) * v;
      y2 = y2 + delta * Math.sin(rad) * v;
    }
    
    hosomi = 0.5;
    if(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) < 50){
      hosomi += 0.4 * (1 - Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 50);
    }
    
    poly = new Polygon();
    poly2 = new Polygon();
    
    for(tt = 0; tt <= 1000; tt = tt + kage.kRate){
      t = tt / 1000;
      
      if(sx1 == sx2 && sy1 == sy2){ // Spline
        //calculate a dot
        x = ((1.0 - t) * (1.0 - t) * x1 + 2.0 * t * (1.0 - t) * sx1 + t * t * x2);
        y = ((1.0 - t) * (1.0 - t) * y1 + 2.0 * t * (1.0 - t) * sy1 + t * t * y2);
        
        //KATAMUKI of vector by BIBUN
        ix = (x1 - 2.0 * sx1 + x2) * 2.0 * t + (-2.0 * x1 + 2.0 * sx1);
        iy = (y1 - 2.0 * sy1 + y2) * 2.0 * t + (-2.0 * y1 + 2.0 * sy1);
      } else { // Bezier
        //calculate a dot
        x = (1.0 - t) * (1.0 - t) * (1.0 - t) * x1 + 3.0 * t * (1.0 - t) * (1.0 - t) * sx1 + 3 * t * t * (1.0 - t) * sx2 + t * t * t * x2;
        y = (1.0 - t) * (1.0 - t) * (1.0 - t) * y1 + 3.0 * t * (1.0 - t) * (1.0 - t) * sy1 + 3 * t * t * (1.0 - t) * sy2 + t * t * t * y2;
        //KATAMUKI of vector by BIBUN
        ix = t * t * (-3 * x1 + 9 * sx1 + -9 * sx2 + 3 * x2) + t * (6 * x1 + -12 * sx1 + 6 * sx2) + -3 * x1 + 3 * sx1;
        iy = t * t * (-3 * y1 + 9 * sy1 + -9 * sy2 + 3 * y2) + t * (6 * y1 + -12 * sy1 + 6 * sy2) + -3 * y1 + 3 * sy1;
      }
      //line SUICHOKU by vector
      if(ix != 0 && iy != 0){
        ir = Math.atan(iy / ix * -1);
        ia = Math.sin(ir) * (kage.kMinWidthT);
        ib = Math.cos(ir) * (kage.kMinWidthT);
      }
      else if(ix == 0){
        ia = kage.kMinWidthT;
        ib = 0;
      }
      else{
        ia = 0;
        ib = kage.kMinWidthT;
      }
      
      if(a1 == 7 && a2 == 0){ // L2RD: fatten
        deltad = Math.pow(t, hosomi) * kage.kL2RDfatten;
      }
      else if(a1 == 7){
        deltad = Math.pow(t, hosomi);
      }
      else if(a2 == 7){
        deltad = Math.pow(1.0 - t, hosomi);
      }
      else{ deltad = 1; }
      
      if(deltad < 0.15){
        deltad = 0.15;
      }
      ia = ia * deltad;
      ib = ib * deltad;
      
      //reverse if vector is going 2nd/3rd quadrants
      if(ix <= 0){
        ia = ia * -1;
        ib = ib * -1;
      }
      
      //copy to polygon structure
      poly.push(x - ia, y - ib);
      poly2.push(x + ia, y + ib);
    }
    
    // suiheisen ni setsuzoku
    if(a1 == 132){
      var index = 0;
      while(true){
        if(poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y){
          break;
        }
        index++;
      }
      newx1 = poly2.array[index + 1].x + (poly2.array[index].x - poly2.array[index + 1].x) *
        (poly2.array[index + 1].y - y1) / (poly2.array[index + 1].y - poly2.array[index].y);
      newy1 = y1;
      newx2 = poly.array[0].x + (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1) /
        (poly.array[1].y - poly.array[0].y);
      newy2 = y1;
      
      for(var i = 0; i < index; i++){
        poly2.shift();
      }
      poly2.set(0, newx1, newy1);
      poly.unshift(newx2, newy2);
    }
    
    poly2.reverse();
    poly.concat(poly2);
    polygons.push(poly);
    
    //process for head of stroke
    rad = Math.atan((sy1 - y1) / (sx1 - x1));
    if(x1 < sx1){ v = 1; } else{ v = -1; }
    XX = Math.sin(rad) * v;
    XY = Math.cos(rad) * v * -1;
    YX = Math.cos(rad) * v;
    YY = Math.sin(rad) * v;
    
    if(a1 == 12){
      if(x1 == x2){
        poly= new Polygon();
        poly.push(x1 - kage.kMinWidthT, y1);
        poly.push(x1 + kage.kMinWidthT, y1);
        poly.push(x1 - kage.kMinWidthT, y1 - kage.kMinWidthT);
        polygons.push(poly);
      }
      else{
        poly = new Polygon();
        poly.push(x1 - kage.kMinWidthT * XX, y1 - kage.kMinWidthT * XY);
        poly.push(x1 + kage.kMinWidthT * XX, y1 + kage.kMinWidthT * XY);
        poly.push(x1 - kage.kMinWidthT * XX - kage.kMinWidthT * YX, y1 - kage.kMinWidthT * XY - kage.kMinWidthT * YY);
        polygons.push(poly);
      }
    }
    
    var type;
    var pm = 0;
    if(a1 == 0){
      if(y1 <= y2){ //from up to bottom
        type = (Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4);
        if(type > 0){
          type = type * 2;
        } else {
          type = type * 16;
        }
        if(type < 0){
          pm = -1;
        } else {
          pm = 1;
        }
        if(x1 == sx1){
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT, y1);
          poly.push(x1 + kage.kMinWidthT, y1);
          poly.push(x1 - kage.kMinWidthT * pm, y1 - kage.kMinWidthY * type * pm);
          polygons.push(poly);
        }
        else{
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT * XX, y1 - kage.kMinWidthT * XY);
          poly.push(x1 + kage.kMinWidthT * XX, y1 + kage.kMinWidthT * XY);
          poly.push(x1 - kage.kMinWidthT * pm * XX - kage.kMinWidthY * type * pm * YX, y1 - kage.kMinWidthT * pm * XY - kage.kMinWidthY * type * pm * YY);
          polygons.push(poly);
        }
      }
      else{ //bottom to up
        if(x1 == sx1){
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT, y1);
          poly.push(x1 + kage.kMinWidthT, y1);
          poly.push(x1 + kage.kMinWidthT, y1 - kage.kMinWidthY);
          polygons.push(poly);
        }
        else{
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT * XX, y1 - kage.kMinWidthT * XY);
          poly.push(x1 + kage.kMinWidthT * XX, y1 + kage.kMinWidthT * XY);
          poly.push(x1 + kage.kMinWidthT * XX - kage.kMinWidthY * YX, y1 + kage.kMinWidthT * XY - kage.kMinWidthY * YY);
          polygons.push(poly);
        }
      }
    }
    
    if(a1 == 22){ //box's up-right corner, any time same degree
      poly = new Polygon();
      poly.push(x1 - kage.kMinWidthT, y1 - kage.kMinWidthY);
      poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
      poly.push(x1 + kage.kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
      poly.push(x1 + kage.kMinWidthT, y1 + kage.kMinWidthT);
      poly.push(x1, y1 + kage.kMinWidthT);
      polygons.push(poly);
    }
    
    if(a1 == 0){ //beginning of the stroke
      if(y1 <= y2){ //from up to bottom
        if(pm > 0){
          type = 0;
        }
        var move = kage.kMinWidthY * type * pm;
        if(x1 == sx1){
          poly = new Polygon();
          poly.push(x1 + kage.kMinWidthT, y1 - move);
          poly.push(x1 + kage.kMinWidthT * 1.5, y1 + kage.kMinWidthY - move);
          poly.push(x1 + kage.kMinWidthT * 0.5, y1 + kage.kMinWidthY * 3 - move / 2);
          polygons.push(poly);
        }
        else{
          poly = new Polygon();
          poly.push(x1 + kage.kMinWidthT * XX - move * YX,
                    y1 + kage.kMinWidthT * XY - move * YY);
          poly.push(x1 + kage.kMinWidthT * 1.5 * XX + (kage.kMinWidthY - move * 1.2) * YX,
                    y1 + kage.kMinWidthT * 1.5 * XY + (kage.kMinWidthY - move * 1.2) * YY);
          poly.push(x1 + kage.kMinWidthT * 0.5 * XX + (kage.kMinWidthY * 3 - move * 0.8) * YX,
                    y1 + kage.kMinWidthT * 0.5 * XY + (kage.kMinWidthY * 3 - move * 0.8) * YY);
          polygons.push(poly);
        }
      }
      else{ //from bottom to up
        if(x1 == sx1){
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT, y1);
          poly.push(x1 - kage.kMinWidthT * 1.5, y1 + kage.kMinWidthY);
          poly.push(x1 - kage.kMinWidthT * 0.5, y1 + kage.kMinWidthY * 3);
          polygons.push(poly);
        }
        else{
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT * XX, y1 - kage.kMinWidthT * XY);
          poly.push(x1 - kage.kMinWidthT * 1.5 * XX + kage.kMinWidthY * YX, y1 + kage.kMinWidthY * YY - kage.kMinWidthT * 1.5 * XY);
          poly.push(x1 - kage.kMinWidthT * 0.5 * XX + kage.kMinWidthY * 3 * YX, y1 + kage.kMinWidthY * 3 * YY - kage.kMinWidthT * 0.5 * XY);
          polygons.push(poly);
        }
      }
    }
    
    //process for tail
    rad = Math.atan((y2 - sy2) / (x2 - sx2));
    if(sx2 < x2){ v = 1; } else{ v = -1; }
    YX = Math.sin(rad) * v * -1;
    YY = Math.cos(rad) * v;
    XX = Math.cos(rad) * v;
    XY = Math.sin(rad) * v;
    
    if(a2 == 1 || a2 == 8 || a2 == 15){ //the last filled circle ... it can change 15->5
      if(sx2 == x2){
        poly = new Polygon();
        poly.push(x2 - kage.kMinWidthT, y2);
        poly.push(x2 - kage.kMinWidthT * 0.7, y2 + kage.kMinWidthT * 0.7);
        poly.push(x2, y2 + kage.kMinWidthT);
        poly.push(x2 + kage.kMinWidthT * 0.7, y2 + kage.kMinWidthT * 0.7);
        poly.push(x2 + kage.kMinWidthT, y2);
        polygons.push(poly);
      }
      else if(sy2 == y2){
        poly = new Polygon();
        poly.push(x2, y2 - kage.kMinWidthT);
        poly.push(x2 + kage.kMinWidthT * 0.7, y2 - kage.kMinWidthT * 0.7);
        poly.push(x2 + kage.kMinWidthT, y2);
        poly.push(x2 + kage.kMinWidthT * 0.7, y2 + kage.kMinWidthT * 0.7);
        poly.push(x2, y2 + kage.kMinWidthT);
        polygons.push(poly);
      }
      else{
        poly = new Polygon();
        poly.push(x2 + Math.sin(rad) * kage.kMinWidthT * v, y2 - Math.cos(rad) * kage.kMinWidthT * v);
        poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * 0.7 * v + Math.sin(rad) * kage.kMinWidthT * 0.7 * v,
                  y2 + Math.sin(rad) * kage.kMinWidthT * 0.7 * v - Math.cos(rad) * kage.kMinWidthT * 0.7 * v);
        poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * v, y2 + Math.sin(rad) * kage.kMinWidthT * v);
        poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * 0.7 * v - Math.sin(rad) * kage.kMinWidthT * 0.7 * v,
                  y2 + Math.sin(rad) * kage.kMinWidthT * 0.7 * v + Math.cos(rad) * kage.kMinWidthT * 0.7 * v);
        poly.push(x2 - Math.sin(rad) * kage.kMinWidthT * v, y2 + Math.cos(rad) * kage.kMinWidthT * v);
        polygons.push(poly);
      }
    }
    
    if(a2 == 9 || (a1 == 7 && a2 == 0)){ // Math.sinnyu & L2RD Harai ... no need for a2=9
      var type = (Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6);
      if(type > 0){
        type = type * 8;
      } else {
        type = type * 3;
      }
      var pm = 0;
      if(type < 0){
        pm = -1;
      } else {
        pm = 1;
      }
      if(sy2 == y2){
        poly = new Polygon();
        poly.push(x2, y2 + kage.kMinWidthT * kage.kL2RDfatten);
        poly.push(x2, y2 - kage.kMinWidthT * kage.kL2RDfatten);
        poly.push(x2 + kage.kMinWidthT * kage.kL2RDfatten * Math.abs(type), y2 + kage.kMinWidthT * kage.kL2RDfatten * pm);
        polygons.push(poly);
      }
      else{
        poly = new Polygon();
        poly.push(x2 + kage.kMinWidthT * kage.kL2RDfatten * YX, y2 + kage.kMinWidthT * kage.kL2RDfatten * YY);
        poly.push(x2 - kage.kMinWidthT * kage.kL2RDfatten * YX, y2 - kage.kMinWidthT * kage.kL2RDfatten * YY);
        poly.push(x2 + kage.kMinWidthT * kage.kL2RDfatten * Math.abs(type) * XX + kage.kMinWidthT * kage.kL2RDfatten * pm * YX,
                  y2 + kage.kMinWidthT * kage.kL2RDfatten * Math.abs(type) * XY + kage.kMinWidthT * kage.kL2RDfatten * pm * YY);
        polygons.push(poly);
      }
    }
    
    if(a2 == 15){ //jump up ... it can change 15->5
      if(sy2 == y2){
        poly = new Polygon();
        poly.push(x2, y2 - kage.kMinWidthT + 1);
        poly.push(x2 + 2, y2 - kage.kMinWidthT - kage.kWidth * 5);
        poly.push(x2, y2 - kage.kMinWidthT - kage.kWidth * 5);
        poly.push(x2 - kage.kMinWidthT, y2 - kage.kMinWidthT + 1);
        polygons.push(poly);
      }
      else{
        poly = new Polygon();
        poly.push(x2 + (kage.kMinWidthT - 1) * Math.sin(rad) * v, y2 - (kage.kMinWidthT - 1) * Math.cos(rad) * v);
        poly.push(x2 + 2 * Math.cos(rad) * v + (kage.kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
                  y2 + 2 * Math.sin(rad) * v - (kage.kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
        poly.push(x2 + (kage.kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
                  y2 - (kage.kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
        poly.push(x2 + (kage.kMinWidthT - 1) * Math.sin(rad) * v - kage.kMinWidthT * Math.cos(rad) * v,
                  y2 - (kage.kMinWidthT - 1) * Math.cos(rad) * v - kage.kMinWidthT * Math.sin(rad) * v);
        polygons.push(poly);
      }
    }
    
    if(a2 == 14){ //jump to left, allways go left ... it can change 14->4
      poly = new Polygon();
      poly.push(x2, y2);
      poly.push(x2, y2 - kage.kMinWidthT);
      poly.push(x2 - kage.kWidth * 4, y2 - kage.kMinWidthT);
      poly.push(x2 - kage.kWidth * 4, y2 - kage.kMinWidthT * 0.5);
      polygons.push(poly);
    }
  }
  else{ //gothic
    if(a1 % 10 == 2){
      if(x1 == sx1){
        if(y1 < sy1){ y1 = y1 - kage.kWidth; } else{ y1 = y1 + kage.kWidth; }
      }
      else if(y1 == sy1){
        if(x1 < sx1){ x1 = x1 - kage.kWidth; } else{ x1 = x1 + kage.kWidth; }
      }
      else{
        rad = Math.atan((sy1 - y1) / (sx1 - x1));
        if(x1 < sx1){ v = 1; } else{ v = -1; }
        x1 = x1 - kage.kWidth * Math.cos(rad) * v;
        y1 = y1 - kage.kWidth * Math.sin(rad) * v;
      }
    }
    
    if(a1 % 10 == 3){
      if(x1 == sx1){
        if(y1 < sy1){
          y1 = y1 - kage.kWidth * kage.kKakato;
        }
        else{
          y1 = y1 + kage.kWidth * kage.kKakato;
        }
      }
      else if(y1 == sy1){
        if(x1 < sx1){
          x1 = x1 - kage.kWidth * kage.kKakato;
        }
        else{
          x1 = x1 + kage.kWidth * kage.kKakato;
        }
      }
      else{
        rad = Math.atan((sy1 - y1) / (sx1 - x1));
        if(x1 < sx1){ v = 1; } else{ v = -1; }
        x1 = x1 - kage.kWidth * Math.cos(rad) * v * kage.kKakato;
        y1 = y1 - kage.kWidth * Math.sin(rad) * v * kage.kKakato;
      }
    }
    if(a2 % 10 == 2){
      if(sx2 == x2){
        if(sy2 < y2){ y2 = y2 + kage.kWidth; } else{ y2 = y2 - kage.kWidth; }
      }
      else if(sy2 == y2){
        if(sx2 < x2){ x2 = x2 + kage.kWidth; } else{ x2 = x2 - kage.kWidth; }
      }
      else{
        rad = Math.atan((y2 - sy2) / (x2 - sx2));
        if(sx2 < x2){ v = 1; } else{ v = -1; }
        x2 = x2 + kage.kWidth * Math.cos(rad) * v;
        y2 = y2 + kage.kWidth * Math.sin(rad) * v;
      }
    }
    
    if(a2 % 10 == 3){
      if(sx2 == x2){
        if(sy2 < y2){
          y2 = y2 + kage.kWidth * kage.kKakato;
        }
        else{
          y2 = y2 - kage.kWidth * kage.kKakato;
        }
      }
      else if(sy2 == y2){
        if(sx2 < x2){
          x2 = x2 + kage.kWidth * kage.kKakato;
        }
        else{
          x2 = x2 - kage.kWidth * kage.kKakato;
        }
      }
      else{
        rad = Math.atan((y2 - sy2) / (x2 - sx2));
        if(sx2 < x2){ v = 1; } else{ v = -1; }
        x2 = x2 + kage.kWidth * Math.cos(rad) * v * kage.kKakato;
        y2 = y2 + kage.kWidth * Math.sin(rad) * v * kage.kKakato;
      }
    }
    
    poly = new Polygon();
    poly2 = new Polygon();
    
    for(tt = 0; tt <= 1000; tt = tt + kage.kRate){
      t = tt / 1000;
      
      if(sx1 == sx2 && sy1 == sy2){
        //calculating each point
        x = ((1.0 - t) * (1.0 - t) * x1 + 2.0 * t * (1.0 - t) * sx1 + t * t * x2);
        y = ((1.0 - t) * (1.0 - t) * y1 + 2.0 * t * (1.0 - t) * sy1 + t * t * y2);
        
        //SESSEN NO KATAMUKI NO KEISAN(BIBUN)
        ix = (x1 - 2.0 * sx1 + x2) * 2.0 * t + (-2.0 * x1 + 2.0 * sx1);
        iy = (y1 - 2.0 * sy1 + y2) * 2.0 * t + (-2.0 * y1 + 2.0 * sy1);
      } else {
      }
      //SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
      if(kage.kShotai == kage.kMincho){ //always false ?
        if(ix != 0 && iy != 0){
          ir = Math.atan(iy / ix * -1.0);
          ia = Math.sin(ir) * kage.kMinWidthT;
          ib = Math.cos(ir) * kage.kMinWidthT;
        }
        else if(ix == 0){
          ia = kage.kMinWidthT;
          ib = 0;
        }
        else{
          ia = 0;
          ib = kage.kMinWidthT;
        }
        ia = ia * Math.sqrt(1.0 - t);
        ib = ib * Math.sqrt(1.0 - t);
      }
      else{
        if(ix != 0 && iy != 0){
          ir = Math.atan(iy / ix * -1.0);
          ia = Math.sin(ir) * kage.kWidth;
          ib = Math.cos(ir) * kage.kWidth;
        }
        else if(ix == 0){
          ia = kage.kWidth;
          ib = 0;
        }
        else{
          ia = 0;
          ib = kage.kWidth;
        }
      }
      
      //reverse if vector is going 2nd/3rd quadrants
      if(ix <= 0){
        ia = ia * -1;
        ib = ib * -1;
      }
      
      //save to polygon
      poly.push(x - ia, y - ib);
      poly2.push(x + ia, y + ib);
    }
    
    poly2.reverse();
    poly.concat(poly2);
    polygons.push(poly);
  }
}

function cdDrawBezier(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2){
  cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}

function cdDrawCurve(kage, polygons, x1, y1, x2, y2, x3, y3, a1, a2){
  cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}

function cdDrawLine(kage, polygons, tx1, ty1, tx2, ty2, ta1, ta2){
  var rad;
  var v, x1, y1, x2, y2;
  var a1, a2, opt1, opt2;
  var XX, XY, YX, YY;
  var poly;
  
  if(kage.kShotai == kage.kMincho){ //mincho
    x1 = tx1;
    y1 = ty1;
    x2 = tx2;
    y2 = ty2;
    a1 = ta1 % 100;
    a2 = ta2 % 100;
    opt1 = Math.floor(ta1 / 100);
    opt2 = Math.floor(ta2 / 100);
    
    if(x1 == x2){ //if TATE stroke, use y-axis
      poly = new Polygon(4);
      switch(a1){
      case 0:
        poly.set(3, x1 - kage.kMinWidthT, y1 - kage.kMinWidthY / 2);
        poly.set(0, x1 + kage.kMinWidthT, y1 + kage.kMinWidthY / 2);
        break;
      case 1:
      case 6: //... no need
      case 22:
        poly.set(3, x1 - kage.kMinWidthT, y1);
        poly.set(0, x1 + kage.kMinWidthT, y1);
        break;
      case 12:
        poly.set(3, x1 - kage.kMinWidthT, y1 - kage.kMinWidthY - kage.kMinWidthT);
        poly.set(0, x1 + kage.kMinWidthT, y1 - kage.kMinWidthY);
        break;
      case 32:
        poly.set(3, x1 - kage.kMinWidthT, y1 - kage.kMinWidthY);
        poly.set(0, x1 + kage.kMinWidthT, y1 - kage.kMinWidthY);
        break;
      }
      
      switch(a2){
      case 0:
        if(a1 == 6){ //KAGI's tail ... no need
          poly.set(2, x2 - kage.kMinWidthT, y2);
          poly.set(1, x2 + kage.kMinWidthT, y2);
        }
        else{
          poly.set(2, x2 - kage.kMinWidthT, y2 + kage.kMinWidthT / 2);
          poly.set(1, x2 + kage.kMinWidthT, y2 - kage.kMinWidthT / 2);
        }
        break;
      case 1:
        poly.set(2, x2 - kage.kMinWidthT, y2);
        poly.set(1, x2 + kage.kMinWidthT, y2);
        break;
      case 13:
        poly.set(2, x2 - kage.kMinWidthT, y2 + kage.kAdjustKakatoL[opt2] + kage.kMinWidthT);
        poly.set(1, x2 + kage.kMinWidthT, y2 + kage.kAdjustKakatoL[opt2]);
        break;
      case 23:
        poly.set(2, x2 - kage.kMinWidthT, y2 + kage.kAdjustKakatoR[opt2] + kage.kMinWidthT);
        poly.set(1, x2 + kage.kMinWidthT, y2 + kage.kAdjustKakatoR[opt2]);
        break;
      case 32:
        poly.set(2, x2 - kage.kMinWidthT, y2 + kage.kMinWidthY);
        poly.set(1, x2 + kage.kMinWidthT, y2 + kage.kMinWidthY);
        break;
      }
      
      polygons.push(poly);
      
      if(a1 == 22){ //box's right top corner
        poly = new Polygon();
        poly.push(x1 - kage.kMinWidthT, y1 - kage.kMinWidthY);
        poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
        poly.push(x1 + kage.kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
        poly.push(x1 + kage.kMinWidthT, y1 + kage.kMinWidthT);
        poly.push(x1 - kage.kMinWidthT, y1);
        polygons.push(poly);
      }
      
      if(a1 == 0){ //beginning of the stroke
        poly = new Polygon();
        poly.push(x1 + kage.kMinWidthT, y1 + kage.kMinWidthY * 0.5);
        poly.push(x1 + kage.kMinWidthT + kage.kMinWidthT * 0.5, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY);
        poly.push(x1 + kage.kMinWidthT, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2);
        polygons.push(poly);
      }
      
      if((a1 == 6 && a2 == 0) || a2 == 1){ //KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
        poly = new Polygon();
        poly.push(x2 - kage.kMinWidthT, y2);
        poly.push(x2 - kage.kMinWidthT * 0.6, y2 + kage.kMinWidthT * 0.6);
        poly.push(x2, y2 + kage.kMinWidthT);
        poly.push(x2 + kage.kMinWidthT * 0.6, y2 + kage.kMinWidthT * 0.6);
        poly.push(x2 + kage.kMinWidthT, y2);
        poly.reverse(); // for fill-rule
        polygons.push(poly);
      }
    }
    else if(y1 == y2){ //if it is YOKO stroke, use x-axis
      if(a1 == 6){ //if it is KAGI's YOKO stroke, get bold
        poly = new Polygon();
        poly.push(x1, y1 - kage.kMinWidthT);
        poly.push(x2, y2 - kage.kMinWidthT);
        poly.push(x2, y2 + kage.kMinWidthT);
        poly.push(x1, y1 + kage.kMinWidthT);
        polygons.push(poly);
        
        if(a2 == 1 || a2 == 0 || a2 == 5){ // no need a2=1
          //KAGI NO YOKO BOU NO SAIGO NO MARU
          poly = new Polygon();
          poly.push(x2, y2 - kage.kMinWidthT);
          poly.push(x2 + kage.kMinWidthT * 0.6, y2 - kage.kMinWidthT * 0.6);
          poly.push(x2 + kage.kMinWidthT, y2);
          poly.push(x2 + kage.kMinWidthT * 0.6, y2 + kage.kMinWidthT * 0.6);
          poly.push(x2, y2 + kage.kMinWidthT);
          polygons.push(poly);
        }
        
        if(a2 == 5){
          //KAGI NO YOKO BOU NO HANE
          poly = new Polygon();
          poly.push(x2, y2 - kage.kMinWidthT + 1);
          poly.push(x2 + 2, y2 - kage.kMinWidthT - kage.kWidth * 5);
          poly.push(x2, y2 - kage.kMinWidthT - kage.kWidth * 5);
          poly.push(x2 - kage.kMinWidthT, y2 - kage.kMinWidthT + 1);
          poly.reverse(); // for fill-rule
          polygons.push(poly);
        }
      }
      else{
        //always same
        poly = new Polygon(4);
        poly.set(0, x1, y1 - kage.kMinWidthY);
        poly.set(1, x2, y2 - kage.kMinWidthY);
        poly.set(2, x2, y2 + kage.kMinWidthY);
        poly.set(3, x1, y1 + kage.kMinWidthY);
        polygons.push(poly);
        
        //UROKO
        if(a2 == 0){
          poly = new Polygon();
          poly.push(x2, y2 - kage.kMinWidthY);
          poly.push(x2 - kage.kAdjustUrokoX[opt2], y2);
          poly.push(x2 - kage.kAdjustUrokoX[opt2] / 2, y2 - kage.kAdjustUrokoY[opt2]);
          polygons.push(poly);
        }
      }
    }
    else{ //for others, use x-axis
      rad = Math.atan((y2 - y1) / (x2 - x1));
      if((Math.abs(y2 - y1) < Math.abs(x2 - x1)) && (a1 != 6) && (a2 != 6) && !(x1 > x2)){ //ASAI KAUDO
        //always same
        poly = new Polygon(4);
        poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthY, y1 - Math.cos(rad) * kage.kMinWidthY);
        poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
        poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthY, y2 + Math.cos(rad) * kage.kMinWidthY);
        poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthY, y1 + Math.cos(rad) * kage.kMinWidthY);
        polygons.push(poly);
        
        //UROKO
        if(a2 == 0){
          poly = new Polygon();
          poly.push(x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
          poly.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2], y2 - Math.sin(rad) * kage.kAdjustUrokoX[opt2]);
          poly.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2] / 2 + Math.sin(rad) * kage.kAdjustUrokoX[opt2] / 2, y2 - Math.sin(rad) * kage.kAdjustUrokoY[opt2] - Math.cos(rad) * kage.kAdjustUrokoY[opt2]);
          polygons.push(poly);
        }
      }
      
      else{ //KAKUDO GA FUKAI or KAGI NO YOKO BOU
        if(x1 > x2){ v = -1; } else{ v = 1; }
        poly = new Polygon(4);
        switch(a1){
        case 0:
          poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * 0.5 * v,
                   y1 - Math.cos(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
          poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * 0.5 * v,
                   y1 + Math.cos(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
          break;
        case 1:
        case 6:
        case 22:
          poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthT * v, y1 - Math.cos(rad) * kage.kMinWidthT * v);
          poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthT * v, y1 + Math.cos(rad) * kage.kMinWidthT * v);
          break;
        case 12:
          poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v,
                   y1 - Math.cos(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
          poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthT * v - (kage.kMinWidthT + kage.kMinWidthY) * Math.cos(rad) * v,
                   y1 + Math.cos(rad) * kage.kMinWidthT * v - (kage.kMinWidthT + kage.kMinWidthY) * Math.sin(rad) * v);
          break;
        case 32:
          poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v,
                   y1 - Math.cos(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
          poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v,
                   y1 + Math.cos(rad) * kage.kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
          break;
        }
        
        switch(a2){
        case 0:
          if(a1 == 6){
            poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v, y2 - Math.cos(rad) * kage.kMinWidthT * v);
            poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthT * v, y2 + Math.cos(rad) * kage.kMinWidthT * v);
          }
          else{
            poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v - kage.kMinWidthT * 0.5 * Math.cos(rad) * v,
                     y2 - Math.cos(rad) * kage.kMinWidthT * v - kage.kMinWidthT * 0.5 * Math.sin(rad) * v);
            poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthT * v + kage.kMinWidthT * 0.5 * Math.cos(rad) * v,
                     y2 + Math.cos(rad) * kage.kMinWidthT * v + kage.kMinWidthT * 0.5 * Math.sin(rad) * v);
          }
          break;
        case 1: // is needed?
        case 5:
          poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v, y2 - Math.cos(rad) * kage.kMinWidthT * v);
          poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthT * v, y2 + Math.cos(rad) * kage.kMinWidthT * v);
          break;
        case 13:
          poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.cos(rad) * v,
                   y2 - Math.cos(rad) * kage.kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.sin(rad) * v);
          poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kage.kMinWidthT) * Math.cos(rad) * v,
                   y2 + Math.cos(rad) * kage.kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kage.kMinWidthT) * Math.sin(rad) * v);
          break;
        case 23:
          poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.cos(rad) * v,
                   y2 - Math.cos(rad) * kage.kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.sin(rad) * v);
          poly.set(2,
                   x2 - Math.sin(rad) * kage.kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kage.kMinWidthT) * Math.cos(rad) * v,
                   y2 + Math.cos(rad) * kage.kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kage.kMinWidthT) * Math.sin(rad) * v);
          break;
        case 32:
          poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * v,
                   y2 - Math.cos(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * v);
          poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * v,
                   y2 + Math.cos(rad) * kage.kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * v);
          break;
        }
        
        polygons.push(poly);
        
        if((a1 == 6) && (a2 == 0 || a2 == 5)){ //KAGI NO YOKO BOU NO SAIGO NO MARU
          poly = new Polygon();
          poly.push(x2 + Math.sin(rad) * kage.kMinWidthT * v, y2 - Math.cos(rad) * kage.kMinWidthT * v);
          poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * 0.8 * v + Math.sin(rad) * kage.kMinWidthT * 0.6 * v,
                    y2 + Math.sin(rad) * kage.kMinWidthT * 0.8 * v - Math.cos(rad) * kage.kMinWidthT * 0.6 * v);
          poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * v, y2 + Math.sin(rad) * kage.kMinWidthT * v);
          poly.push(x2 + Math.cos(rad) * kage.kMinWidthT * 0.8 * v - Math.sin(rad) * kage.kMinWidthT * 0.6 * v,
                    y2 + Math.sin(rad) * kage.kMinWidthT * 0.8 * v + Math.cos(rad) * kage.kMinWidthT * 0.6 * v);
          poly.push(x2 - Math.sin(rad) * kage.kMinWidthT * v, y2 + Math.cos(rad) * kage.kMinWidthT * v);
          polygons.push(poly);
        }
        
        if(a1 == 6 && a2 == 5){
          //KAGI NO YOKO BOU NO HANE
          poly = new Polygon();
          poly.push(x2 + (kage.kMinWidthT - 1) * Math.sin(rad) * v, y2 - (kage.kMinWidthT - 1) * Math.cos(rad) * v);
          poly.push(x2 + 2 * Math.cos(rad) * v + (kage.kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
                    y2 + 2 * Math.sin(rad) * v - (kage.kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
          poly.push(x2 + (kage.kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
                    y2 - (kage.kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
          poly.push(x2 + (kage.kMinWidthT - 1) * Math.sin(rad) * v - kage.kMinWidthT * Math.cos(rad) * v,
                    y2 - (kage.kMinWidthT - 1) * Math.cos(rad) * v - kage.kMinWidthT * Math.sin(rad) * v);
          polygons.push(poly);
        }
        
        if(a1 == 22){ //SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
          poly = new Polygon();
          poly.push(x1 - kage.kMinWidthT, y1 - kage.kMinWidthY);
          poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
          poly.push(x1 + kage.kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
          poly.push(x1 + kage.kMinWidthT, y1 + kage.kMinWidthT);
          poly.push(x1 - kage.kMinWidthT, y1);
          polygons.push(poly);
        }
        
        XX = Math.sin(rad) * v;
        XY = Math.cos(rad) * v * -1;
        YX = Math.cos(rad) * v;
        YY = Math.sin(rad) * v;
        
        if(a1 == 0){ //beginning of the storke
          poly = new Polygon();
          poly.push(x1 + kage.kMinWidthT * XX + (kage.kMinWidthY * 0.5) * YX,
                    y1 + kage.kMinWidthT * XY + (kage.kMinWidthY * 0.5) * YY);
          poly.push(x1 + (kage.kMinWidthT + kage.kMinWidthT * 0.5) * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YX,
                    y1 + (kage.kMinWidthT + kage.kMinWidthT * 0.5) * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YY);
          poly.push(x1 + kage.kMinWidthT * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YX,
                    y1 + kage.kMinWidthT * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YY);
          polygons.push(poly);
        }
      }
    }
  }
  else{ //gothic
    if(tx1 == tx2){ //if TATE stroke, use y-axis
      if(ty1 > ty2){
        x1 = tx2;
        y1 = ty2;
        x2 = tx1;
        y2 = ty1;
        a1 = ta2;
        a2 = ta1;
      }
      else{
        x1 = tx1;
        y1 = ty1;
        x2 = tx2;
        y2 = ty2;
        a1 = ta1;
        a2 = ta2;
      }
      
      if(a1 % 10 == 2){ y1 = y1 - kage.kWidth; }
      if(a2 % 10 == 2){ y2 = y2 + kage.kWidth; }
      if(a1 % 10 == 3){ y1 = y1 - kage.kWidth * kage.kKakato; }
      if(a2 % 10 == 3){ y2 = y2 + kage.kWidth * kage.kKakato; }
      
      poly = new Polygon();
      poly.push(x1 - kage.kWidth, y1);
      poly.push(x2 - kage.kWidth, y2);
      poly.push(x2 + kage.kWidth, y2);
      poly.push(x1 + kage.kWidth, y1);
      poly.reverse(); // for fill-rule
      
      polygons.push(poly);
    }
    else if(ty1 == ty2){ //if YOKO stroke, use x-axis
      if(tx1 > tx2){
        x1 = tx2;
        y1 = ty2;
        x2 = tx1;
        y2 = ty1;
        a1 = ta2;
        a2 = ta1;
      }
      else{
        x1 = tx1;
        y1 = ty1;
        x2 = tx2;
        y2 = ty2;
        a1 = ta1;
        a2 = ta2;
      }
      if(a1 % 10 == 2){ x1 = x1 - kage.kWidth; }
      if(a2 % 10 == 2){ x2 = x2 + kage.kWidth; }
      if(a1 % 10 == 3){ x1 = x1 - kage.kWidth * kage.kKakato; }
      if(a2 % 10 == 3){ x2 = x2 + kage.kWidth * kage.kKakato; }
      
      poly = new Polygon();
      poly.push(x1, y1 - kage.kWidth);
      poly.push(x2, y2 - kage.kWidth);
      poly.push(x2, y2 + kage.kWidth);
      poly.push(x1, y1 + kage.kWidth);
      
      polygons.push(poly);
    }
    else{ //for others, use x-axis
      if(tx1 > tx2){
        x1 = tx2;
        y1 = ty2;
        x2 = tx1;
        y2 = ty1;
        a1 = ta2;
        a2 = ta1;
      }
      else{
        x1 = tx1;
        y1 = ty1;
        x2 = tx2;
        y2 = ty2;
        a1 = ta1;
        a2 = ta2;
      }
      rad = Math.atan((y2 - y1) / (x2 - x1));
      if(a1 % 10 == 2){
        x1 = x1 - kage.kWidth * Math.cos(rad);
        y1 = y1 - kage.kWidth * Math.sin(rad);
      }
      if(a2 % 10 == 2){
        x2 = x2 + kage.kWidth * Math.cos(rad);
        y2 = y2 + kage.kWidth * Math.sin(rad);
      }
      if(a1 % 10 == 3){
        x1 = x1 - kage.kWidth * Math.cos(rad) * kage.kKakato;
        y1 = y1 - kage.kWidth * Math.sin(rad) * kage.kKakato;
      }
      if(a2 % 10 == 3){
        x2 = x2 + kage.kWidth * Math.cos(rad) * kage.kKakato;
        y2 = y2 + kage.kWidth * Math.sin(rad) * kage.kKakato;
      }
      
      //SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
      poly = new Polygon();
      poly.push(x1 + Math.sin(rad) * kage.kWidth, y1 - Math.cos(rad) * kage.kWidth);
      poly.push(x2 + Math.sin(rad) * kage.kWidth, y2 - Math.cos(rad) * kage.kWidth);
      poly.push(x2 - Math.sin(rad) * kage.kWidth, y2 + Math.cos(rad) * kage.kWidth);
      poly.push(x1 - Math.sin(rad) * kage.kWidth, y1 + Math.cos(rad) * kage.kWidth);
      
      polygons.push(poly);
    }
  }
}
