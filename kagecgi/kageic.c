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
	else if(kMode == 1){ //output for svg
		sprintf(buf, "<path d=\"M ");
		g_string_append(kResultText, buf);
		for(i = 0; i < number; i++){
			sprintf(buf, "%d,%d ", poly[i].X * 5, poly[i].Y * 5);
			g_string_append(kResultText, buf);
		}
		sprintf(buf, "Z\"/>");
		g_string_append(kResultText, buf);
	}
	else if(kMode == 2){ //output for eps
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
