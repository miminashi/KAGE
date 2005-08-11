// chise_tools.i
//
// Copyright (C) 2005 Koichi Kamichi.
//
// reference : http://www.swig.org/Doc1.3/Perl5.html
//             sample.c included to libchise

%module chise_tools

// This tells SWIG to treat char ** as a special case
%typemap(in) char ** {
	AV *tempav;
  	I32 len;
	int i;
	SV  **tv;
	if (!SvROK($input))
	    croak("Argument $argnum is not a reference.");
        if (SvTYPE(SvRV($input)) != SVt_PVAV)
	    croak("Argument $argnum is not an array.");
        tempav = (AV*)SvRV($input);
	len = av_len(tempav);
	$1 = (char **) malloc((len+2)*sizeof(char *));
	for (i = 0; i <= len; i++) {
	    tv = av_fetch(tempav, i, 0);	
	    $1[i] = (char *) SvPV(*tv,PL_na);
        }
	$1[i] = NULL;
};

// This cleans up the char ** array after the function call
%typemap(freearg) char ** {
	free($1);
}

// Creates a new Perl array and places a NULL-terminated char ** into it
%typemap(out) char ** {
	AV *myav;
	SV **svs;
	int i = 0,len = 0;
	/* Figure out how many elements we have */
	while ($1[len])
	   len++;
	svs = (SV **) malloc(len*sizeof(SV *));
	for (i = 0; i < len ; i++) {
	    svs[i] = sv_newmortal();
	    sv_setpv((SV*)svs[i],$1[i]);
	};
	myav =	av_make(len,svs);
	free(svs);
        $result = newRV((SV*)myav);
        sv_2mortal($result);
        argvi++;
}

%inline %{

#include <chise.h>

unsigned char *get_uchar(char *argv){
  return (unsigned char *)argv;
}

char *get_char(unsigned char *argv){
  return (char *)argv;
}

unsigned char buffer[1024];
int buffer_size = 1024;

void clear_buffer(){
  int i;
  for(i = 0; i < buffer_size; i++){
    buffer[i] = 0;
  }
}

unsigned char feature[10240];
int feature_size = 10240;

static int
name_map_func (CHISE_DS *ds, unsigned char *name)
{
  strcat((char *)feature, (char *)name);
  strcat((char *)feature, (char *)"\n");
  return 0;
}

void listup_feature(CHISE_DS *ds){
  int i;
  for(i = 0; i < feature_size; i++){
    feature[i] = 0;
  }
  chise_ds_foreach_char_feature_name (ds, &name_map_func);
}

%}
