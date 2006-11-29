# chiseperl.pl --- some useful funcions for using libchise with SWIG
#
# Copyright (C) 2005,2006 KAMICHI Koichi.
#
# global : $chise_ds, %chise_feature, $chise_newid
#          (deprecated: @chise_feature, @chise_ft)
# function : void init_chise();
#            void close_chise();
#            void update_chise();
#            void search_newid();
#            $var get_feature_value($feature, $char_id);
#            $var set_feature_value($feature, $char_id, $value);
#            $var create_new_char($feature, $value);
#            $char_id decode_char($feature_char, $int);

use chise;

sub init_chise{
  $chise_ds = chise::CHISE_DS_open($chise::CHISE_DS_Berkeley_DB,
				   $chise::chise_system_db_dir, 0, 0755);
  chise::listup_feature($chise_ds);
  # deprecated begin
  #@chise_feature = split(/\n/, chise::get_char($chise::feature));
  #@chise_ft = ();
  #foreach(@chise_feature){
  #  push(@chise_ft, chise::chise_ds_get_feature($chise_ds, chise::get_uchar($_)));
  #  $chise_ft{$_} = chise::chise_ds_get_feature($chise_ds, chise::get_uchar($_));
  #}
  # deprecated end
  my @temp = split(/\n/, chise::get_char($chise::feature));
  %chise_feature = ();
  foreach(@temp){
    $chise_feature{$_} = chise::chise_ds_get_feature($chise_ds, chise::get_uchar($_));
  }
  @chise_feature = keys(%chise_feature);
  @chise_ft = values(%chise_feature);
  $chise_newid = 0x0F0000;
}

sub get_feature_value{ # feature, char_id -> 0 or value
  if(scalar(@_) != 2){
    return 0;
  }
  my $ft = chise::chise_ds_get_feature($chise_ds, chise::get_uchar($_[0]));
  chise::clear_buffer;
  chise::chise_char_gets_feature_value($_[1], $ft,
                                       $chise::buffer, $chise::buffer_size);
  return chise::get_char($chise::buffer);
}

sub set_feature_value{ # feature, char_id, value -> result
  if(scalar(@_) != 3){
    return 0;
  }
  my $ft = chise::chise_ds_get_feature($chise_ds, chise::get_uchar($_[0]));
  chise::chise_char_set_feature_value($_[1], $ft, chise::get_uchar($_[2]));
  return 1;
}

sub close_chise{
  chise::CHISE_DS_close($chise_ds);
}

sub create_new_char{ # feature, value -> assinged char_id
  &search_newid;
  &set_feature_value($_[0], $chise_newid, $_[1]);
  $chise_newid++;
  return $chise_newid - 1;
}

sub search_newid{ # search new char_id and update $chise_newid
  while(1){
    my $found = 0;
    foreach(@chise_ft){
      chise::clear_buffer;
      chise::chise_char_gets_feature_value($chise_newid, $_, $chise::buffer, $chise::buffer_size);
      if(length(chise::get_char($chise::buffer)) != 0){
        $found = 1;
        last;
      }
    }
    if($found == 0){
      last;
    }
    $chise_newid++;
  }
}

sub update_chise{ # save added data to database
  foreach(@chise_ft){
    chise::chise_feature_sync($_);
  }
}

sub decode_char{ # feature, int -> charID, 0
  if(scalar(@_) != 2){
    return 0;
  }
  return chise::chise_ds_decode_char($chise_ds, chise::get_uchar($_[0]), $_[1]);
}

1;
