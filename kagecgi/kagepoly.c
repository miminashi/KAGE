// kagepoly.c
//

#include <stdio.h>
#include <stdlib.h>
#include "kagecgi.h"
#include "kage.h"

void fillPolygon(struct kPoint *p, int number, int col, unsigned char **image){
	int i, ix, iy;
	Region rgn;
	XRectangle rect;
	
	for(i = 0; i < number; i++){
			xpoly[i].x = p[i].X;
			xpoly[i].y = p[i].Y;
	}
	rgn = XPolygonRegion(xpoly, number, EvenOddRule);
	XClipBox(rgn, &rect);
	
	for(ix = rect.x ; ix <= rect.x + rect.width; ix++){
		for(iy = rect.y ; iy <= rect.y + rect.height; iy++){
			if(XPointInRegion(rgn, ix, iy) && ix >= 0 && iy >= 0 && ix < canvasWidth && iy < canvasHeight){
				image[iy][ix] = col;
			}
		}
	}
}

