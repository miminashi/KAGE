//kage.h
//

#include "sysdep.h"

#ifndef _KAGE_H_
#define _KAGE_H_

int kShotai;
#define kMincho 0
#define kGothic 1

#define kMage 10
#define kRate 20
#define kResolution (1000 / kRate + 1) * 2
#define kMinWidthY 2
#define kMinWidthT 6
#define kWidth 5
#define kKakato 3 //has KAKATO = 2, no KAKATO = 1
#define kKasane 3
#define kMixdot (kWidth * 2) * (kWidth * 2 - 1)

#define kMaxIDSSequenceLength 16
#define kMaxIDCLength 16
#define kMaxStrokeDataLength 256 // over 12(digits per integer with +/- flag) * 11(columns) + 1(line end)

struct kPoint{
	double X;
	double Y;
};

XPoint xpoly[kResolution];

struct kPoint poly[kResolution];
struct kPoint poly2[3];
struct kPoint poly3[5];
struct kPoint poly4[4];

struct EDGE {
    struct EDGE *next;
    long yTop, yBot;
    long xNowWhole, xNowNum, xNowDen, xNowDir;
    long xNowNumStep;
};

#define SGN(a) ( (a) > 0 ? 1 : ( (a) < 0 ? -1 : 0 ) )

//kagedf.c
void dfDrawFont(int, int, int, int, int, int, int, int, int, int, int);
//kagecd.c
void cdDrawCurve(double, double, double, double, double, double, int, int);
void cdDrawLine(double, double, double, double, int, int);
//kageic.c
void icPolygon(struct kPoint *, int);

#endif
