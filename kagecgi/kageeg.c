//kageeg.c
//

#include "kage.h"
#include "kagecgi.h"
#include "sysdep.h"

void generateGlyphByIDS(const GString *in, GString *out, int flag){
	GString *tmp1, *tmp2, *tmp3, *tmp4;
	
	//pass this method if 'in' is not UCS parts
	if((in->str)[0] != 'u'){
		generateGlyph(in, out);
		return;
	}
	//pass this method if 'in' is place-variant-flag defined
	if(in->len < 5 && 7 < in->len){
		generateGlyph(in, out);
		return;
	}
	
	tmp1 = g_string_new(in->str);
	tmp2 = g_string_new(in->str);
//	tmp3 = g_string_new(in->str);
//	tmp4 = g_string_new(in->str);
	
	//append design flag
//	if(kDesign == 10) g_string_append(tmp1, "-10");
//	else if(kDesign == 11) g_string_append(tmp1, "-11");
//	else if(kDesign == 20) g_string_append(tmp1, "-20");
//	else if(kDesign == 30) g_string_append(tmp1, "-30");
//	else if(kDesign == 40) g_string_append(tmp1, "-40");
//	else g_string_append(tmp1, "-00");
//	if(kDesign == 10) g_string_append(tmp2, "-10");
//	else if(kDesign == 11) g_string_append(tmp2, "-11");
//	else if(kDesign == 20) g_string_append(tmp2, "-20");
//	else if(kDesign == 30) g_string_append(tmp2, "-30");
//	else if(kDesign == 40) g_string_append(tmp2, "-40");
//	else g_string_append(tmp2, "-00");
//	g_string_append(tmp3, "-00");
//	g_string_append(tmp4, "-00");
	
	//append place flag
	if(1 <= flag && flag <= 7){
		if(tmp1->len != 7) g_string_append(tmp1, "-");
		if(flag == 1) g_string_append(tmp1, "01");
		else if(flag == 2) g_string_append(tmp1, "02");
		else if(flag == 3) g_string_append(tmp1, "03");
		else if(flag == 4) g_string_append(tmp1, "04");
		else if(flag == 5) g_string_append(tmp1, "05");
		else if(flag == 6) g_string_append(tmp1, "06");
	}

//	g_string_append(tmp2, "00");
//	if(flag == 1) g_string_append(tmp3, "01");
//	else if(flag == 2) g_string_append(tmp3, "02");
//	else if(flag == 3) g_string_append(tmp3, "03");
//	else if(flag == 4) g_string_append(tmp3, "04");
//	else if(flag == 5) g_string_append(tmp3, "05");
//	else if(flag == 6) g_string_append(tmp3, "06");
//	else g_string_append(tmp3, "00");
//	g_string_append(tmp4, "00");
	
	generateGlyph(tmp1, out);
	if(out->len != 0) return;
	generateGlyph(tmp2, out);
	if(out->len != 0) return;
//	generateGlyph(tmp3, out);
//	if(out->len != 0) return;
//	generateGlyph(tmp4, out);
	return;
}

void generateGlyph(const GString *in, GString *out){
	GString *tmp, *in2;
	tmp = g_string_new("");
	g_string_set_size(out, 0);
	
//	in2 = g_string_new(in->str);
	
	//1st search
//	if(*(in2->str) == 'u' && (in2->len == 4 || in2->len == 5)){
//		//append design flag
//		if(kDesign == 10) g_string_append(in2, "-1000");
//		else if(kDesign == 11) g_string_append(in2, "-1100");
//		else if(kDesign == 20) g_string_append(in2, "-2000");
//		else if(kDesign == 30) g_string_append(in2, "-3000");
//		else if(kDesign == 40) g_string_append(in2, "-4000");
//		else g_string_append(in2, "-0000");
		
		//search from parts(1st)
//		searchPartsData(in2, tmp);
//		if(tmp->len != 0){
//			g_string_assign(out, tmp->str);
//			return;
//		}
		
		//search from alias(1st)
//		searchAliasData(in2, tmp);
//		if(tmp->len != 0){
//			generateGlyph(tmp, out);
//			if(out->len == 0) return;
//			//save to cache ... not yet
//			return;
//		}
//	}
	
	//2nd search
	//search from parts(2nd)
	searchPartsData(in, tmp);
	if(tmp->len != 0){
		g_string_assign(out, tmp->str);
		return;
	}
	
	//search from alias(2nd)
	searchAliasData(in, tmp);
	if(tmp->len != 0){
		generateGlyph(tmp, out);
		if(out->len == 0) return;
		//save to cache ... not yet
		return;
	}
	
	//check if its IDS
	if(isIDS(in)){
		doCombine(in, out);
		if(out->len == 0) return;
		//save to cache ... not yet
		return;
	}
}

void doCombine(const GString *in, GString *out){
	GString *partIDS1, *partIDS2, *partIDS3;
	GString *partStroke1, *partStroke2, *partStroke3;
	int result[12];
	
	partIDS1 = g_string_new("");
	partIDS2 = g_string_new("");
	partIDS3 = g_string_new("");
	partStroke1 = g_string_new("");
	partStroke2 = g_string_new("");
	partStroke3 = g_string_new("");
	
	g_string_set_size(out, 0);
	
	//check first IDC
	if(strncmp(in->str, "u2ff", 4) != 0) return;
	//switch by combine types
	switch((in->str)[4]){
		case '0':
			divideInto2(in, partIDS1, partIDS3);
			if(partIDS1->len == 0) return;
			//ready each parts
			generateGlyphByIDS(partIDS1, partStroke1, 1);
			if(partStroke1->len == 0) return;
			partStroke1 = CalcSizes(partStroke1, 0);
			generateGlyphByIDS(partIDS3, partStroke3, 2);
			if(partStroke3->len == 0) return;
			partStroke3 = CalcSizes(partStroke3, 0);
			break;
		case '1':
			divideInto2(in, partIDS1, partIDS3);
			if(partIDS1->len == 0) return;
			//ready each parts
			generateGlyphByIDS(partIDS1, partStroke1, 3);
			if(partStroke1->len == 0) return;
			partStroke1 = CalcSizes(partStroke1, 0);
			generateGlyphByIDS(partIDS3, partStroke3, 4);
			if(partStroke3->len == 0) return;
			partStroke3 = CalcSizes(partStroke3, 0);
			break;
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case 'a':
//		case 'b':
			divideInto2(in, partIDS1, partIDS3);
			if(partIDS1->len == 0) return;
			//ready each parts
			generateGlyphByIDS(partIDS1, partStroke1, 5);
			if(partStroke1->len == 0) return;
			partStroke1 = CalcSizes(partStroke1, 0);
			generateGlyphByIDS(partIDS3, partStroke3, 6);
			if(partStroke3->len == 0) return;
			partStroke3 = CalcSizes(partStroke3, 0);
			break;
		case '2':
			divideInto3(in, partIDS1, partIDS2, partIDS3);
			if(partIDS1->len == 0) return;
			//ready each parts
			generateGlyphByIDS(partIDS1, partStroke1, 1);
			if(partStroke1->len == 0) return;
			partStroke1 = CalcSizes(partStroke1, 0);
			generateGlyphByIDS(partIDS2, partStroke2, 1);
			if(partStroke2->len == 0) return;
			partStroke2 = CalcSizes(partStroke2, 0);
			generateGlyphByIDS(partIDS3, partStroke3, 2);
			if(partStroke3->len == 0) return;
			partStroke3 = CalcSizes(partStroke3, 0);
			break;
		case '3':
			divideInto3(in, partIDS1, partIDS2, partIDS3);
			if(partIDS1->len == 0) return;
			//ready each parts
			generateGlyphByIDS(partIDS1, partStroke1, 3);
			if(partStroke1->len == 0) return;
			partStroke1 = CalcSizes(partStroke1, 0);
			generateGlyphByIDS(partIDS2, partStroke2, 3);
			if(partStroke2->len == 0) return;
			partStroke2 = CalcSizes(partStroke2, 0);
			generateGlyphByIDS(partIDS3, partStroke3, 4);
			if(partStroke3->len == 0) return;
			partStroke3 = CalcSizes(partStroke3, 0);
			break;
	}
	switch((in->str)[4]){
		case '0':
			combineYoko2(partStroke1, partStroke3, result);
			break;
		case '1':
			combineTate2(partStroke1, partStroke3, result);
			break;
		case '2':
			combineYoko3(partStroke1, partStroke2, partStroke3, result);
			break;
		case '3':
			combineTate3(partStroke1, partStroke2, partStroke3, result);
			break;
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case 'a':
//		case 'b':
			combineHame2(partStroke1, partStroke3, result);
			break;
	}
	switch((in->str)[4]){
		case '0':
		case '1':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case 'a':
//		case 'b':
			addStrokeWithTransform(partStroke1, 1, result, out, 1);
			addStrokeWithTransform(partStroke3, 3, result, out, 1);
			break;
		case '2':
		case '3':
			addStrokeWithTransform(partStroke1, 1, result, out, 1);
			addStrokeWithTransform(partStroke2, 2, result, out, 1);
			addStrokeWithTransform(partStroke3, 3, result, out, 1);
			break;
	}
}

void drawGlyph(const GString *in, const int mode){
	int i, j;
	int *buf;
	buf = convertStroke(in->str, buf, &j);
	for(i = 0; i < j; i++){
		if(mode == 0){ //normal
			dfDrawFont(buf[i * 11 + 0],
			 buf[i * 11 + 1],
			 buf[i * 11 + 2],
			 buf[i * 11 + 3],
			 buf[i * 11 + 4],
			 buf[i * 11 + 5],
			 buf[i * 11 + 6],
			 buf[i * 11 + 7],
			 buf[i * 11 + 8],
			 buf[i * 11 + 9],
			 buf[i * 11 + 10]);
		}
		else if(mode == 1){ //without decoration
			dfDrawFont(buf[i * 11 + 0],
			 0,
			 0,
			 buf[i * 11 + 3],
			 buf[i * 11 + 4],
			 buf[i * 11 + 5],
			 buf[i * 11 + 6],
			 buf[i * 11 + 7],
			 buf[i * 11 + 8],
			 buf[i * 11 + 9],
			 buf[i * 11 + 10]);
		}
	}
	free(buf);
}

