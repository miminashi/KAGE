//kagecomb.c
//

#include "kage.h"
#include "kagecgi.h"
#include "sysdep.h"

void combineYoko2(const KGString *parts1, const KGString *parts3, int *result){
    int f, g, h, i, j, k, l;
    int flg_boxL, flg_boxR;
    int Xside, YsideLa, YsideLb, YsideRa, YsideRb, YheightL, YnanameL, YsmallL;
    int pxL, pxR, pyL, pyR;
    double prL, prR, pryL, pryR, rL, rR, rTemp;
    int lxL, rxL, lxR, rxR;
    int dlyL, dryL, dlyR, dryR;
    int chk_y1, chk_y2;
    int mitsuL, mitsuR;
    double yokoL, tateL, yokoR, tateR;
	int *buf, strokes;
	int tempShotai;
	
	//initialize
    pxL = 0;
    pyL = 0;
    prL = 1.0;
    pryL = 1.0;
    pxR = 0;
    pyR = 0;
    prR = 1.0;
    pryR = 1.0;
	
    YsideLa = 0;
    YsideLb = 0;
    YsideRa = 0;
    YsideRb = 0;
	YnanameL = 0;
    YheightL = pngWidth * 0.9;
	
	tempShotai = kShotai;
	kShotai = kGothic;
	
    CalcOptions(parts1, &mitsuL, &flg_boxL, &yokoL, &tateL);
    CalcOptions(parts3, &mitsuR, &flg_boxR, &yokoR, &tateR);
	
	//left parts Y-axis processing #1
    //if its upper and bottom are flat
    if(flg_boxL % 8 / 4 != 0) YsideLa++;
    if(flg_boxL % 16 / 8 != 0) YsideLb++;
	
    //if its goes right-up
	if(flg_boxL % 1024 / 512 == 0){
	    j = 0;
		buf = convertStroke(parts1->str, buf, &strokes);
		for(i = 0; i < strokes; i++) if(buf[i * 11 + 0] / 10 == 1) j++;
	    free(buf);
	    l = 0;
	    if(j != 0){
			YsideLb++;
	        YnanameL++;
		}
	}
    YheightL = YheightL - (YsideLa + YsideLb) * 2 * kWidth;
	
	//left parts Y-axis processing #2
    YsmallL = 0;
	if(flg_boxL % 1024 / 512 == 0){
		YsmallL = 1;
	    if(flg_boxL % 16 / 8 != 0 && flg_boxL % 8 / 4 != 0 && tateL <= 4) YheightL = (double)YheightL * (max(0.65, tateL * 0.22));
		else if(flg_boxL % 16 / 8 != 0 && tateL <= 3) YheightL = (double)YheightL * 0.8;
    	else if(YnanameL != 0 && flg_boxL % 8 / 4 != 0 && tateL <= 4) YheightL = (double)YheightL * (max(0.65, tateL * 0.22));
	    else if(YnanameL != 0 && tateL <= 3) YheightL = (double)YheightL * 0.8;
	    else YsmallL = 0;
	}
	
	//left parts Y-axis processing #3
    DoDrawParts(parts1, pxL, prL, pyL, pryL);
    DotsHeight(&dlyL, &dryL);
    pryL = (double)YheightL / (dryL - dlyL);
	
    if(YsmallL != 0){
        if(flg_boxL % 8 / 4 != 0) pyL = kBaseline - (double)pngWidth * 0.9 + 6 * kWidth - dlyL * pryL;
        else pyL = kBaseline - (double)pngWidth * 0.9 + 2 * kWidth - dlyL * pryL;
    }
    else{
        if(flg_boxL % 16 / 8 != 0 || YnanameL != 0) pyL = kBaseline - 2 * kWidth - dryL * pryL;
        else pyL = kBaseline - dryL * pryL;
    }
	
	//right parts Y-axis processing #1
    if(flg_boxR % 8 / 4 != 0) YsideRa++;
    if(flg_boxR % 16 / 8 != 0) YsideRb++;
	
    DoDrawParts(parts3, pxR, prR, pyR, pryR);
	DotsHeight(&dlyR, &dryR);
	
	if(flg_boxR % 512 / 256 != 0 && flg_boxR % 1024 / 512 == 0){
		pryR = pngWidth * 0.9 * 0.8 / (dryR - dlyR);
		pyR = kBaseline - pngWidth * 0.9 + 6 * kWidth - dlyR * pryR;
	}
	else{
		pryR = ((double)pngWidth * 0.9 - (YsideRa + YsideRb) * 2 * kWidth) / (dryR - dlyR);
		pyR = kBaseline - dryR * pryR;
		if(flg_boxR % 16 / 8 != 0) pyR = pyR - 2 * kWidth;
	}
	
	//calculate ratio
	rL = yokoL;
	rR = yokoR;
	
	if(flg_boxL % 2 / 1 != 0) rL = rL * 0.7;
	if(flg_boxL % 4 / 2 != 0) rL = rL * 0.7;
	if(flg_boxR % 2 / 1 != 0) rR = rR * 0.7;
	if(flg_boxR % 4 / 2 != 0) rR = rR * 0.7;
	
	rL = pow(rL, 0.6);
	rR = pow(rR, 0.6);
	
	rR = rR * 1.05;
	
	rTemp = rL + rR;
	rL = rL / rTemp;
	rR = rR / rTemp;
	
//    if(r < 0.3) r = 0.3;
//    else if(r > 0.7) r = 0.7;
	
    prL = rL;
    prR = rR;
	
	//calculate width of each parts #1
	Xside = 0;
    if(flg_boxL % 2 / 1 != 0) Xside++;
    if(flg_boxR % 4 / 2 != 0) Xside++;
	
//    DrawBox();
//    drawGlyph(parts1, 1);
//    DotsWidth(&lxL, &rxL);
//    DrawBox();
//    drawGlyph(parts3, 1);
//    DotsWidth(&lxR, &rxR);
    PartsWidth(parts1, &lxL, &rxL);
    PartsWidth(parts3, &lxR, &rxR);
    g = 0;
	
	//calculate width of each parts #2
//1    pxL = kWidth * 2 + (pngWidth - kWidth * 2 * 2) * prL * 0.5 - (lxL + rxL) / 2 * prL;
//1    pxR = kWidth * 2 + (pngWidth - kWidth * 2 * 2) * prL + kWidth * 2 * 2 + (pngWidth - kWidth * 2 * 2) * prR * 0.5 - (lxR + rxR) / 2 * prR;
//2    pxR = pngWidth * prL + kWidth * 4 + pngWidth * prR * 0.5 - (lxR + rxR) / 2 * prR;
//3    pxL = pngWidth * prL * 0.5 - (lxL + rxL) / 2 * prL;
//3    pxR = pngWidth * prL + pngWidth * prR * 0.5 - (lxR + rxR) / 2 * prR;
    pxL = 0;
    pxR = pngWidth * prL;
	
    DoDrawMixFont(parts1, pxL, prL, parts3, pxR, prR, pyL, pryL, pyR, pryR);
	
	//count dots for check crossing over
	DotsHeight(&chk_y1, &chk_y2);
	k = 0;
	for(i = 0; i < pngWidth * 1.1; i++){
		for(j = chk_y1; j <= chk_y2; j++){
			if(kageCanvas[j][i] == 0) k++;
		}
	}
	l = k;
	//fprintf(stderr,"%d,%d\n",chk_y1,chk_y2);
	
	//get close both parts
	h = pxR;
	while(k - l < kMixdot && g < kWidth * 2 * kKasane * 2){
		g = g + 2;
		f = pxR - g;
        DoDrawMixFont(parts1, pxL, prL, parts3, f, prR, pyL, pryL, pyR, pryR);
		
		//char fn[256];
		//FILE *fp;
		//snprintf(fn,sizeof(fn),"%03d.png",g);
      	//fp = fopen(fn, "w");
      	//writePng(pngWidth, pngHeight, kageCanvas, fp);
      	//fclose(fp);
		
        l = 0;
        for(i = 0; i < pngWidth * 1.1; i++){
			for(j = chk_y1; j <= chk_y2; j++){
                if(kageCanvas[j][i] == 0) l++;
            }
        }
    }
	//fprintf(stderr,"%d:%d:%d\n",g,k,l);
    pxR = f;
    //if(flg_boxR % 256 / 128 != 0) pxR = pxR + kWidth * 2 * kKasane * 10 / 2;
    //if(flg_boxR % 64 / 32 != 0) pxR = pxR + kWidth * 2 * kKasane * 8 / 2;
    //else if(k - l > pngWidth * 0.4){
    //	if(kShotai == kMincho) pxR = pxR + kMinWidthT * 2 * kKasane * 8 / 2;
	//	else if(kShotai == kGothic)  pxR = pxR + kWidth * 2 * kKasane * 8 / 2;
    //}
    if((flg_boxL % 2 / 1 != 0) && (flg_boxR % 4 / 2 != 0)){
    	if(kShotai == kMincho) pxR = pxR + kMinWidthT * 2 * kKasane * 6 / 2;
    	else pxR = pxR + kWidth * 2 * kKasane * 6 / 2;
    }
    else pxR = pxR + kWidth * 2 * kKasane * 2 / 2;
	
	//set results
	result[0] = pxL;
	result[1] = pyL;
	result[2] = pxL + pngWidth * prL;
	result[3] = pyL + pngWidth * pryL;
	result[8] = pxR;
	result[9] = pyR;
	result[10] = pxR + pngWidth * prR;
	result[11] = pyR + pngWidth * pryR;
	
	kShotai = tempShotai;
}

void combineYoko3(const KGString *parts1, const KGString *parts2, const KGString *parts3, int *result){
	//not yet
}

void combineTate2(const KGString *parts1, const KGString *parts3, int *result){
    int f, g, h, i, j, k, l;
    int flg_boxL, flg_boxR;
    int pxL, pxR, pyL, pyR;
    double prL, prR, pryL, pryR, rL, rR, rTemp;
    int lxL, rxL, lxR, rxR;
    int lyL, ryL, lyR, ryR;
    int dlxL, drxL, dlxR, drxR;
    int chk_x1, chk_x2;
    int mitsuL, mitsuR;
    double yokoL, tateL, yokoR, tateR;
	int *buf, strokes;
	int tempShotai;
	
	//initialize
    pxL = 0;
    pyL = 0;
    prL = 1.0;
    pryL = 1.0;
    pxR = 0;
    pyR = 0;
    prR = 1.0;
    pryR = 1.0;
	
	tempShotai = kShotai;
	kShotai = kGothic;
	
    CalcOptions(parts1, &mitsuL, &flg_boxL, &yokoL, &tateL);
    CalcOptions(parts3, &mitsuR, &flg_boxR, &yokoR, &tateR);
	
	//calculate ratio
	rL = tateL;
	rR = tateR;
	
	if(flg_boxL % 8 / 4 != 0) rL = rL * 0.7;
	if(flg_boxL % 16 / 8 != 0) rL = rL * 0.7;
	if(flg_boxR % 8 / 4 != 0) rR = rR * 0.7;
	if(flg_boxR % 16 / 8 != 0) rR = rR * 0.7;
	
	rL = pow(rL, 0.8);
	rR = pow(rR, 0.8);
	
	rR = rR * 1.1;
	
	rTemp = rL + rR;
	rL = rL / rTemp;
	rR = rR / rTemp;
	
//    if(r < 0.3) r = 0.3;
//    else if(r > 0.7) r = 0.7;
	
    pryL = rL;
    pryR = rR;
	
	//calucurate size of X-axis
    PartsWidth(parts1, &lxL, &rxL);
    PartsWidth(parts3, &lxR, &rxR);
    PartsHeight(parts1, &lyL, &ryL);
    PartsHeight(parts3, &lyR, &ryR);
	
	//left parts
    if(flg_boxL % 64 / 32 != 0){
		buf = convertStroke(parts1->str, buf, &strokes);
		for(i = 0; i < strokes; i++){
			if(buf[i * 11 + 0] == 0) j = buf[i * 11 + 4]; // center line
        }
        k = max(j - lxL, rxL - j);// k : distance from center line
        prL = (kSize * 0.9 * 0.5) / k;
        if(k == j - lxL) pxL = 0;
        else pxL = kSize * 0.5 - j * prL;
    }
    else if(flg_boxL % 2 / 1 != 0 && flg_boxL % 4 / 2 != 0 && flg_boxL % 32 / 16 == 0){
        prL = min(1.0, (double)yokoL * 0.1 + 0.5) - ((kWidth * 6) / (kSize * 0.9));
        DoDrawParts(parts1, pxL, prL, pyL, pryL);
        DotsWidth(&dlxL, &drxL);
        pxL = (kSize / 2 - (dlxL + drxL) / 2);
    }
    else if(flg_boxL % 128 / 64 != 0){
        prL = 0.77;
        DoDrawParts(parts1, pxL, prL, pyL, pryL);
        DotsWidth(&dlxL, &drxL);
        pxL = (kSize / 2 - (dlxL + drxL) / 2);
    }
    else if(flg_boxL % 2 / 1 != 0 && flg_boxL % 32 / 16 == 0){
        prL = (kSize * 0.9 - kWidth * 4) / (rxL - lxL);
		pxL = kWidth * 4;
    }
    else if(flg_boxL % 4 / 2 != 0 && flg_boxL % 32 / 16 == 0){
        prL = (kSize * 0.9 - kWidth * 4) / (rxL - lxL);
        pxL = (kSize*0.05+kWidth*2) - lxL * prL;
    }
	
	//right parts
    if(flg_boxR % 64 / 32 != 0){
		buf = convertStroke(parts3->str, buf, &strokes);
		for(i = 0; i < strokes; i++){
			if(buf[i * 11 + 0] == 0) j = buf[i * 11 + 4]; // center line
        }
        k = max(j - lxR, rxR - j);// k : distance from center line
        prR = (kSize * 0.9 * 0.5) / k;
        if(k == j - lxR) pxR = 0;
		else pxR = kSize * 0.5 - j * prR;
	}
	else if(flg_boxR % 2 / 1 != 0 && flg_boxR % 4 / 2 != 0 && flg_boxR % 32 / 16 == 0){
		prR = min(1.0, (double)yokoR * 0.1 + 0.5) - ((kWidth * 6) / (kSize * 0.9));
		DoDrawParts(parts3, pxR, prR, pyR, pryR);
		DotsWidth(&dlxR, &drxR);
		pxR = (kSize / 2 - (dlxR + drxR) / 2);
	}
	else if(flg_boxR % 128 / 64 != 0){
		prR = 0.77;
		DoDrawParts(parts3, pxR, prR, pyR, pryR);
		DotsWidth(&dlxR, &drxR);
		pxR = (kSize / 2 - (dlxR + drxR) / 2);
	}
	else if(flg_boxR % 2 / 1 != 0 && flg_boxR % 32 / 16 == 0){
		prR = (kSize * 0.9 - kWidth * 4) / (rxR - lxR);
//            pxR = width * 4;
		pxR = (kSize*0.05+kWidth*3) - lxR * prR;
	}
	else if(flg_boxR % 4 / 2 != 0 && flg_boxR % 32 / 16 == 0){
		prR = (kSize * 0.9 - kWidth * 4) / (rxR - lxR);
//            pxR = (size*0.05+width*2) - lxR * prR;
		pxR = (kSize*0.05+kWidth*1) - lxR * prR;
	}
	
	g = 0;
	
	//calculate width of each parts
	pyL = kWidth * 1.5 + (kSize - kWidth * 1.5 * 4) * pryL * 0.5 - (lyL + ryL) / 2 * pryL;
	pyR = kWidth * 1.5 + (kSize - kWidth * 1.5 * 4) * pryL + kWidth * 1.5 * 2 + (kSize - kWidth * 1.5 * 4) * pryR * 0.5 - (lyR + ryR) / 2 * pryR;
	
	DoDrawMixFont(parts1, pxL, prL, parts3, pxR, prR, pyL, pryL, pyR, pryR);
	
	//count dots for check crossing over
	DotsWidth(&chk_x1, &chk_x2);
	k = 0;
	for(i = 0; i < pngWidth * 1.1; i++){
		for(j = chk_x1; j <= chk_x2; j++){
			if(kageCanvas[i][j] == 0) k++;
		}
	}
	l = k;
	
	//get close both parts
	h = pyR;
	while(k - l < kMixdot && g < kWidth * (kKasane + 4)){
		g = g + 2;
		f = pyR - g;
        DoDrawMixFont(parts1, pxL, prL, parts3, pxR, prR, pyL, pryL, f, pryR);
		
        l = 0;
        for(i = 0; i < pngWidth * 1.1; i++){
            for(j = chk_x1; j <= chk_x2; j++){
                if(kageCanvas[i][j] == 0) l++;
            }
        }
    }
    pyR = f;
    if(k - l > pngWidth * 0.4) pyR = pyR + kWidth * 5;
    else pyR = pyR + kWidth * 3;
	
	//set results
	result[0] = pxL;
	result[1] = pyL;
	result[2] = pxL + pngWidth * prL;
	result[3] = pyL + pngWidth * pryL;
	result[8] = pxR;
	result[9] = pyR;
	result[10] = pxR + pngWidth * prR;
	result[11] = pyR + pngWidth * pryR;
	
	kShotai = tempShotai;
}

void combineTate3(const KGString *parts1, const KGString *parts2, const KGString *parts3, int *result){
  //not yet
}

void combineHame2(const KGString *parts1, const KGString *parts3, int *result){
  int i, flag;
  int *buf, strokes;

  flag = 0;

  //set results
  result[0] = 0;
  result[1] = 0;
  result[2] = 200;
  result[3] = 200;
  buf = convertStroke(parts1->str, buf, &strokes);
  for(i = 0; i < strokes; i++){
    if(buf[i * 11 + 0] == 9){
      result[8] = buf[i * 11 + 3];
      result[9] = buf[i * 11 + 4];
      result[10] = buf[i * 11 + 5];
      result[11] = buf[i * 11 + 6];
      flag = 1;
    }
  }
  if(flag == 0){ //error
    result[8] = 50;
    result[9] = 50;
    result[10] = 150;
    result[11] = 150;
  }
  //not yet
}
