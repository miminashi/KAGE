// kagepoly.c
//

#include "kage.h"
#include "kagecgi.h"

void fillPolygon(struct kPoint *p, int number, int col, unsigned char **image){
  int miny, maxy;
  int cross[16], num;
  int i, j, k, l, m;
  double a, b;

  miny = 10000;
  maxy = -10000;
  //detect max/min y-point
  for(i = 0; i < number; i++){
    if(p[i].Y < miny) miny = p[i].Y;
    if(p[i].Y > maxy) maxy = p[i].Y;
    //fprintf(stderr,"%.1f:%.1f\n",p[i].X,p[i].Y);
  }
  //detect crossing point of each y-point and draw
  for(j = miny; j <= maxy; j++){
    num = 0;
    for(i = 0; i < number; i++){
      //if two points are tha same position, do nothing
      if(p[i].X == p[(i + 1) % number].X &&
	 p[i].Y == p[(i + 1) % number].Y) continue;
      //if be parallel to x-axis
      if(p[i].Y == p[(i + 1) % number].Y){
	if(p[i].Y == j){
	  cross[num] = p[(i + 1) % number].X;
	  //fprintf(stderr,"[%d]",cross[num]);
	  num++;
	}
      }
      //if be parallel to y-axis
      else if(p[i].X == p[(i + 1) % number].X){
	if((p[i].Y < j && j <= p[(i + 1) % number].Y) ||
	 (p[(i + 1) % number].Y <= j && j < p[i].Y)){
	  cross[num] = p[i].X;
	  //fprintf(stderr,"[%d]",cross[num]);
	  num++;
	  //spearhead: add one more
	  if(p[(i + 1) % number].Y == j &&
	     ((p[i].Y > p[(i + 1) % number].Y &&
	     p[(i + 1) % number].Y < p[(i + 2) % number].Y) ||
	     (p[i].Y < p[(i + 1) % number].Y &&
	     p[(i + 1) % number].Y > p[(i + 2) % number].Y))){
	    cross[num] = p[(i + 1) % number].X;
	    //fprintf(stderr,"[%d]",cross[num]);
	    num++;
	    //fprintf(stderr,"(add:%d)",j);
	  }
	}
      }
      //detect crossing point of each vector
      else if((p[i].Y < j && j <= p[(i + 1) % number].Y) ||
       (p[(i + 1) % number].Y <= j && j < p[i].Y)){
	a = (p[(i + 1) % number].Y - p[i].Y) 
	 / (p[(i + 1) % number].X - p[i].X);
	b = p[i].Y - a * p[i].X;
	cross[num] = (j - b) / a;
	//fprintf(stderr,"[%d]",cross[num]);
	num++;
	//spearhead: add one more
	if(p[(i + 1) % number].Y == j &&
	 ((p[i].Y > p[(i + 1) % number].Y &&
	 p[(i + 1) % number].Y < p[(i + 2) % number].Y) ||
	 (p[i].Y < p[(i + 1) % number].Y &&
	 p[(i + 1) % number].Y > p[(i + 2) % number].Y))){
	  cross[num] = p[(i + 1) % number].X;
	  //fprintf(stderr,"[%d]",cross[num]);
	  num++;
	  //fprintf(stderr,"(add:%d)",j);
	}
      }
    }
    if(num != 0){
      if(num % 2 != 0)fprintf(stderr,"y:%d(%d)\n",j,num);
      //if(num != 0 && num % 2 == 0){
      //sort crossing point
      for(k = 0; k < num - 1; k++){
	for(l = num - 1; l > k; l--){
	  if(cross[l] < cross[l - 1]){
	    m = cross[l];
	    cross[l] = cross[l - 1];
	    cross[l - 1] = m;
	  }
	}
      }
      //for(k=0;k<num;k++)fprintf(stderr,"%d:",cross[k]);
      //draw to vram
      for(k = 0 ; k < num; k = k + 2){
	for(l = cross[k]; l <= cross[k + 1]; l++){
	  if(0 <= j && j < canvasHeight && 0 <= l && l < canvasWidth)
	   image[j][l] = col;
	}
	//image[j][cross[k]] = col;
	//image[j][cross[k+1]] = col;
      }
    }
  }
}

