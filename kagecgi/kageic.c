//kageic.c
//

#include "kage.h"
#include "kagecgi.h"

void icPolygon(struct kPoint *poly, int number){
	int i;
	char buf[256];
	
	if(kMode == 0){ //normal
		fillPolygon(poly, number, 0, kageCanvas);
	}
	else{ //output for eps
		sprintf(buf, "%d %d moveto\n", poly[0].X * 5, 1000 - (poly[0].Y * 5) - 200);
		g_string_append(kResultText, buf);
		for(i = 1; i < number; i++){
			sprintf(buf, " %d %d lineto\n", poly[i].X * 5, 1000 - (poly[i].Y * 5) - 200);
			g_string_append(kResultText, buf);
		}
		sprintf(buf, " %d %d lineto\n", poly[0].X * 5, 1000 - (poly[0].Y * 5) - 200);
		g_string_append(kResultText, buf);
		g_string_append(kResultText, "closepath\n");
	}
}
