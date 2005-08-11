# chiseperl.pl --- some useful funcions for using libchise with SWIG
#
# Copyright (C) 2005 Koichi Kamichi.
#
# global : $chise_ds, @chise_feature, @chise_ft, $chise_newid
# function : void init_chise();
#            void close_chise();
#            void update_chise();
#            void search_newid();
#            $var get_feature_value($feature, $char_id);
#            $var set_feature_value($feature, $char_id, $value);
#            $var create_new_char($feature, $value);

use chise_tools;
use chise;

sub init_chise{
  $chise_ds = chise::CHISE_DS_open(0, $chise::chise_system_db_dir, 0, 0755);
  chise_tools::listup_feature($chise_ds);
  @chise_feature = split(/\n/, chise_tools::get_char($chise_tools::feature));
  @chise_ft = ();
  foreach(@chise_feature){
    push(@chise_ft, chise::chise_ds_get_feature($chise_ds, chise_tools::get_uchar($_)));
  }
  $chise_newid = 0x0F0000;
}

sub get_feature_value{ # feature, char_id -> 0 or value
  if(scalar(@_) != 2){
    return 0;
  }
  my $ft = chise::chise_ds_get_feature($chise_ds, chise_tools::get_uchar($_[0]));
  chise_tools::clear_buffer;
  chise::chise_char_gets_feature_value($_[1], $ft,
                                       $chise_tools::buffer, $chise_tools::buffer_size);
  return chise_tools::get_char($chise_tools::buffer);
}

sub set_feature_value{ # feature, char_id, value -> result
  if(scalar(@_) != 3){
    return 0;
  }
  my $ft = chise::chise_ds_get_feature($chise_ds, chise_tools::get_uchar($_[0]));
  chise::chise_char_set_feature_value($_[1], $ft, chise_tools::get_uchar($_[2]));
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
      chise_tools::clear_buffer;
      chise::chise_char_gets_feature_value($chise_newid, $_, $chise_tools::buffer, $chise_tools::buffer_size);
      if(length(chise_tools::get_char($chise_tools::buffer)) != 0){
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

1;
