//kagedb.c
//

#include <db1/db.h>
//#include <db2/db_185.h>

#include <sys/fcntl.h>
#include <glib.h>
#include "kagecgi.h"
#include "kage.h"

int initDB(){
	kDatabase = dbopen(databaseFileName, O_RDWR|O_CREAT, 0666, DB_HASH, NULL);
	return 0;
}

int closeDB(){
	kDatabase->close(kDatabase);
	return 0;
}

void searchPartsData(const GString *in, GString *out){
	DBT dbkey, dbdata;
	char *start, *end;
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
	kDatabase->get(kDatabase, &dbkey, &dbdata, 0);
	if(dbdata.size != 0){
		//first:search selected shotai
		if(kShotai == kMincho) start = strstr(dbdata.data, ",mincho,");
		else start = strstr(dbdata.data, ",gothic,");
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
		if(kShotai == kMincho) start = strstr(dbdata.data, ",gothic,");
		else start = strstr(dbdata.data, ",mincho,");
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
	}
}

void searchAliasData(const GString *in, GString *out){
	DBT dbkey, dbdata;
	char *start, *end;
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
	kDatabase->get(kDatabase, &dbkey, &dbdata, 0);
	if(dbdata.size != 0){
		start = strstr(dbdata.data, ",linkto,");
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
	}
}

