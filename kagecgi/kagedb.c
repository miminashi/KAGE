//kagedb.c
//

#include "kage.h"
#include "kagecgi.h"
#include "sysdep.h"

int initDB(){
	db_create(&kDatabase, NULL, 0);
	kDatabase->open(kDatabase, databaseFileName, NULL, DB_HASH, DB_RDONLY, 0644);
	return 0;
}

int closeDB(){
	kDatabase->close(kDatabase, 0);
	return 0;
}

void searchPartsData(const GString *in, GString *out){
	DBT dbkey, dbdata;
	char *start, *end, *buf;
	GString *temp, *temp2;
	
	//cut off the end '-0000' if 'in' end with it
	temp = g_string_new(in->str);
//	if(strncmp(temp->str + temp->len - 5, "-0000", 5) == 0) g_string_set_size(temp, temp->len - 5);
	if((temp->str)[0] == 'u'){
		if(strncmp(temp->str + temp->len - 4, "-j00", 4) == 0) g_string_set_size(temp, temp->len - 4);
		else if(strncmp(temp->str + temp->len - 4, "-g00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-t00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-k00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-v00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-u00", 4) == 0) g_string_set_size(temp, temp->len - 2);
	}
	
	memset(&dbkey,0,sizeof(DBT));
	memset(&dbdata,0,sizeof(DBT));
	dbkey.data = temp->str;
	dbkey.size = temp->len;
	g_string_set_size(out, 0);
	temp2 = g_string_new("");
	kDatabase->get(kDatabase, NULL, &dbkey, &dbdata, 0);
	if(dbdata.size != 0){
		buf = (char *)malloc(dbdata.size + 1);
		strncpy(buf, dbdata.data, dbdata.size + 1); 
		//first:search selected shotai
		if(kShotai == kMincho) start = strstr(buf, ",mincho,");
		else start = strstr(buf, ",gothic,");
		if(start != NULL){
			start = strchr((start+8), ',');
			if(start != NULL){
				start = strchr((start+1), ',');
				if(start != NULL){
					end = strchr((start+1), ',');
					if(end != NULL){
						g_string_append_len(temp2, (start+1), end - start - 2 + 1);
						convert99(temp2, out);
						return;
					}
				}
			}
		}
		//second:search another shotai
		if(kShotai == kMincho) start = strstr(buf, ",gothic,");
		else start = strstr(buf, ",mincho,");
		if(start != NULL){
			start = strchr((start+8), ',');
			if(start != NULL){
				start = strchr((start+1), ',');
				if(start != NULL){
					end = strchr((start+1), ',');
					if(end != NULL){
						g_string_append_len(temp2, (start+1), end - start - 2 + 1);
						convert99(temp2, out);
						return;
					}
				}
			}
		}
		free(buf);
	}
}

void searchAliasData(const GString *in, GString *out){
	DBT dbkey, dbdata;
	char *start, *end, *buf;
	GString *temp;
	
	//cut off the end '-0000' if 'in' end with it
	temp = g_string_new(in->str);
//	if(strncmp(temp->str + temp->len - 5, "-0000", 5) == 0) g_string_set_size(temp, temp->len - 5);
	if((temp->str)[0] == 'u'){
		if(strncmp(temp->str + temp->len - 4, "-j00", 4) == 0) g_string_set_size(temp, temp->len - 4);
		else if(strncmp(temp->str + temp->len - 4, "-g00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-t00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-k00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-v00", 4) == 0) g_string_set_size(temp, temp->len - 2);
		else if(strncmp(temp->str + temp->len - 4, "-u00", 4) == 0) g_string_set_size(temp, temp->len - 2);
	}
	
	memset(&dbkey,0,sizeof(DBT));
	memset(&dbdata,0,sizeof(DBT));
	dbkey.data = temp->str;
	dbkey.size = temp->len;
	g_string_set_size(out, 0);
	kDatabase->get(kDatabase, NULL, &dbkey, &dbdata, 0);
	if(dbdata.size != 0){
		buf = (char *)malloc(dbdata.size + 1);
		strncpy(buf, dbdata.data, dbdata.size + 1); 
		start = strstr(buf, ",linkto,");
		if(start != NULL){
			start = strchr((start+8), ',');
			if(start != NULL){
				start = strchr((start+1), ',');
				if(start != NULL){
					end = strchr((start+1), ',');
					if(end != NULL){
						g_string_append_len(out, (start+1), end - start - 2 + 1);
					}
				}
			}
		}
		free(buf);
	}
}

