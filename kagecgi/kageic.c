//kageic.c
//

#include "kage.h"
#include "kagecgi.h"

void icPolygon(kPoint *poly, int number){
  int i;
  char buf[256];
  
  if(kMode == 0){ //normal
    fillPolygon(poly, number, 0, kageCanvas);
  }
  else if(kMode == 1){ //output for svg
    sprintf(buf, "<path d=\"M ");
    kg_string_append(kResultText, buf);
    for(i = 0; i < number; i++){
      if(i == 1){
	sprintf(buf, "L ");
	kg_string_append(kResultText, buf);
      }
      sprintf(buf, "%.0f,%.0f ", poly[i].X * 5, poly[i].Y * 5);
      kg_string_append(kResultText, buf);
    }
    sprintf(buf, "Z\"/>");
    kg_string_append(kResultText, buf);
  }
  else if(kMode == 2){ //output for eps
    sprintf(buf, "%.0f %.0f moveto\n", poly[0].X * 5, 1000 - (poly[0].Y * 5) - 200);
    kg_string_append(kResultText, buf);
    for(i = 1; i < number; i++){
      sprintf(buf, " %.0f %.0f lineto\n", poly[i].X * 5, 1000 - (poly[i].Y * 5) - 200);
      kg_string_append(kResultText, buf);
    }
    sprintf(buf, " %.0f %.0f lineto\n", poly[0].X * 5, 1000 - (poly[0].Y * 5) - 200);
    kg_string_append(kResultText, buf);
    kg_string_append(kResultText, "closepath\n");
  }
}
