//kagepng.c
//

#include "kage.h"
#include "sysdep.h"

png_bytepp initPng(int width, int height){
	png_bytepp image;
	int i, j;
	
	image = (png_bytepp)malloc(height * sizeof(png_bytep)); 
	for(j = 0; j < height; j++) image[j] = (png_bytep)malloc(width * sizeof(png_byte));
	for(i = 0; i < width; i++){
		for(j = 0; j < height; j++){
			image[j][i] = kWhite;
		}
	}
	return image;
}

int closePng(int width, int height, png_bytepp image){
	int i;
	for(i = 0; i < height; i++) free(image[i]);
	free(image);
	return 0;
}

int writePng(int width, int height, png_bytepp image, FILE *fp){
  png_structp pPng;
  png_infop pInfo;
  png_text pText[5];
  time_t gmt;
  png_time pngTime;
  int i, j;
  
  for(i = 0; i < width; i++){
    for(j = 0; j < height; j++){
      if(image[j][i] == kGray){ image[j][i] = kWhite; }
    }
  }
  
  pPng = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
  if(pPng == NULL){
    return 1;
  }
  pInfo = png_create_info_struct(pPng);
  if(pInfo == NULL){
    png_destroy_write_struct(&pPng, (png_infopp)NULL);
    return 1;
  }
  if(setjmp(pPng->jmpbuf)){
    png_destroy_write_struct(&pPng, &pInfo);
    return 1;
  }
  png_init_io(pPng, fp);
  png_set_filter(pPng, 0, PNG_ALL_FILTERS);
  png_set_compression_level(pPng, Z_BEST_COMPRESSION);
  //png_set_IHDR(pPng, pInfo, width, height, 8, PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
  png_set_IHDR(pPng, pInfo, width, height, 8, PNG_COLOR_TYPE_GRAY, PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
  png_set_gAMA(pPng, pInfo, 1.0);
  
  time(&gmt);
  png_convert_from_time_t(&pngTime, gmt);
  png_set_tIME(pPng, pInfo, &pngTime);
  
  pText[0].key = "Title";
  pText[0].text = "Kanji glyph generated by KAGE/cgi";
  pText[0].compression = PNG_TEXT_COMPRESSION_NONE;
  pText[1].key = "Author";
  pText[1].text = "KAGE/cgi version 0.4";
  pText[1].compression = PNG_TEXT_COMPRESSION_NONE;
  pText[2].key = "Description";
  pText[2].text = "see more information at http://fonts.jp/";
  pText[2].compression = PNG_TEXT_COMPRESSION_NONE;
  pText[3].key = "Creation Time";
  pText[3].text = png_convert_to_rfc1123(pPng, &pngTime);
  pText[3].compression = PNG_TEXT_COMPRESSION_NONE;
  pText[4].key = "Software";
  pText[4].text = "KAGE/cgi version 0.4";
  pText[4].compression = PNG_TEXT_COMPRESSION_NONE;
  png_set_text(pPng, pInfo, pText, 5);
  
  png_write_info(pPng, pInfo);
  png_write_image(pPng, image);
  png_write_end(pPng, pInfo);
  png_destroy_write_struct(&pPng, &pInfo);
  
  return 0;
}

