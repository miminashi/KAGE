//kagecgi.h
//

#include "kage.h"
#include "sysdep.h"

#ifndef _KAGECGI_H_
#define _KAGECGI_H_

// define for localhost environment
#define errorFileSize 4009
#define errorFileName "error.png"
#define pngFilePath "/var/www/fontsjp/v0.4/"
#define databaseFileName "../../kagedb/wiki"

#define kBaseline 188
#define pngWidth 200
#define pngHeight 200
#define canvasWidth 400
#define canvasHeight 400

#define min(x1,x2) ((x1) > (x2))? (x2):(x1)
#define max(x1,x2) ((x1) > (x2))? (x1):(x2)

DB *kDatabase;

FILE *debug;

png_bytepp kageCanvas;

int kDesign;
int kSize;
int kType;
int kInput;
GString *kResultText;
int kMode;

void generateGlyph(const GString *in, GString *out);
void searchPartsData(const GString *in, GString *out);
void searchAliasData(const GString *in, GString *out);
void searchCacheData(const GString *in, GString *out);
void doCombine(const GString *in, GString *out);
void drawGlyph(const GString *in, const int mode);

int isIDS(const GString *in);
void divideInto2(const GString *in, GString *partIDS1, GString *partIDS3);
void divideInto3(const GString *in, GString *partIDS1, GString *partIDS2, GString *partIDS3);
void addStrokeWithTransform(const GString *stroke, const int num, const int *tf, GString *out, int mode);
void convertArray(int *buf, GString *out, int size, int mode);
int * convertStroke(const char *in, int *a, int *size);
void convert99(const GString *in, GString *out);
void convert99calc(const char *in, GString *out);

void DotsWidth(int *dlx, int *drx);
void DotsHeight(int *dly, int *dry);
void PartsWidth(const GString *in, int *lx, int *rx);
void PartsHeight(const GString *in, int *ly, int *ry);
GString * CalcSizes(const GString *in, int mode);
void DrawBox();
void CalcOptions(const GString *in, int *mitsudo, int *flag, double *yoko, double *tate);
void DoDrawParts(const GString *in, const int lx1, const double rf1, const int ly1, const double rfy1);
void DoDrawMixFont(const GString *in1, const int lx1, const double rf1, const GString *in2, const int lx2, const double rf2, const int ly1, const double rfy1, const int ly2, const double rfy2);

void combineYoko2(const GString *parts1, const GString *parts3, int *result);
void combineYoko3(const GString *parts1, const GString *parts2, const GString *parts3, int *result);
void combineTate2(const GString *parts1, const GString *parts3, int *result);
void combineTate3(const GString *parts1, const GString *parts2, const GString *parts3, int *result);
void combineHame2(const GString *parts1, const GString *parts3, int *result);

int initDB();
int closeDB();
void searchPartsData(const GString *in, GString *out);
void searchAliasData(const GString *in, GString *out);

png_bytepp initPng(int width, int height);
int closePng(int width, int height, png_bytepp canvas);
int writePng(int width, int height, png_bytepp image, FILE *fp);

void fillPolygon(struct kPoint *p, int number, int col, unsigned char **image);

#endif
