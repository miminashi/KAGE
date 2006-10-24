#-----------------------------------------------------------------------------
use utf8;
binmode STDOUT, ":utf8";
require 'chiseperl.pl';
use Encode;

$rate = 0.75;
$x = -10;
$y = 14;
%char = ();
%link = ();
%family = ();
%object = ();
@list= ();
$file= @ARGV[1];
$txt = "txt";
$png = "png";
$svg = "svg";
$graphviz = '/usr/bin/dot';
$html = "html";

#-----------------------------------------------------------------------------
&init_chise;

foreach(@chise_feature){
  if($_ !~ m/sources/){
    push(@list, $_);
  }
}

&process(eval('0x'.$ARGV[0]));

#-----------------------------------------------------------------------------

# create txt
open FH, ">:utf8", "$file.$txt";
print FH "digraph g{\r\n";
print FH "\trankdir = \"LR\";\r\n";
$be_child = ",".join(",", values(%family)).",";
foreach(sort(keys %family)){
  if($be_child =~ m/,$_,/){
    next;
  }
  &ireko($_,1);
}
foreach(sort(keys %char)){
  printf FH "\t\"%X\" [ label = \"$char{$_}\", shape = \"record\" ];\r\n", $_;
}
foreach(sort(keys %link)){
  @temp = split(/-/, $_);
  printf FH "\t\"%X\" -> \"%X\" [ label = \"$link{$_}\" ];\r\n", $temp[0], $temp[1];
}
print FH "}\r\n";
close FH;

#create png
$dummy = `$graphviz -Tpng -o$file.$png $file.$txt`;

#create svg
$dummy = `$graphviz -Tsvg -o$file.$svg $file.$txt`;

#create html
open FH, "<:utf8", "$file.$svg";
open FH2, ">:utf8", "$file.$html";
print FH2 <<EOT;
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="map.css">
<title>chise_linkmap : u$ARGV[0]</title>
</head>
<body>
<img src="$file.$png" usemap="#object" border="0">
EOT
foreach(<FH>){
  if(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=cns11643\&\#45\;([1-9])\:([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"general\" style=\"top: $top; left: $left;\">";
    print FH2 "<img src=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/glyphs/CNS$3/$4.gif\">\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=jef\&\#45\;china3\:([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    $target = $3;
    $target =~ tr/A-F/a-f/;
    print FH2 "<div class=\"general\" style=\"top: $top; left: $left;\">";
    print FH2 "<img src=\"http://kanji.zinbun.kyoto-u.ac.jp/db/CHINA3/Gaiji/$target.gif\" width=\"40\" height=\"40\">\r\n";
    print FH2 "</div>";
  #} elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=gb2312\:([0-9A-F]{4})/){
  #  $left = int($1 / $rate) + $x;
  #  $top = int($2 / $rate) + $y;
  #  print FH2 "<div style=\"position: absolute; top: $top; left: $left;\">";
  #  $ku = int(eval('0x'.$3) / 0x100) - 0x20;
  #  $ten = sprintf "%02d", eval('0x'.$3) % 0x100 - 0x20;
  #  print FH2 "<img src=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/glyphs/GB0/$ku-$ten.gif\">\r\n";
  #  print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=gb2312\:([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"gb\" style=\"top: $top; left: $left;\">";
    $char = $3;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'gb2312-raw', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=jis\&\#45\;x0208\@19(78|83|90|97)\:([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"general\" style=\"top: $top; left: $left;\">";
    $ku = int(eval('0x'.$4) / 0x100) - 0x20;
    $ten = sprintf "%02d", eval('0x'.$4) % 0x100 - 0x20;
    print FH2 "<img src=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/glyphs/JIS-$3/$ku-$ten.gif\">\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=jis\&\#45\;x0212\:([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"general\" style=\"top: $top; left: $left;\">";
    $ku = int(eval('0x'.$3) / 0x100) - 0x20;
    $ten = sprintf "%02d", eval('0x'.$3) % 0x100 - 0x20;
    print FH2 "<img src=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/glyphs/JIS-SP/$ku-$ten.gif\">\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=zinbun\&\#45;oracle\:([0-9A-F]{1,4})/){
    $left = int($1 / $rate) + $x - 20;
    $top = int($2 / $rate) + $y;
    my $number = sprintf "%04d", eval('0x'.$3);
    print FH2 "<img style=\"position: absolute; top: $top; left: $left;\" src=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/glyphs/ZOB-1968/$number.png\" width=\"80\" height=\"80\">";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=ucs\:([0-9A-F]{4,6})/){
    $left = int($1 / $rate) + $x - 20;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"ucs\" style=\"top: $top; left: $left;\">";
    print FH2 "[".pack('U',eval('0x'.$3))."]\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=big5\:([0-9A-F]{4,6})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"big5\" style=\"top: $top; left: $left;\">";
    $char = $3;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'big5', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  #} elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=hanziku\&\#45\;([0-9]{1,2})\:([0-9A-F]{4})/){
  #  $left = int($1 / $rate) + $x;
  #  $top = int($2 / $rate) + $y;
  #  #$number = sprintf "%02d", $3;
  #  $number = $3;
  #  $numberk = $3;
  #  $numberk =~ tr/12345678/一二三四五六七八/;
  #  #print FH2 "<div style=\"position: absolute; top: $top; left: $left; font-family: 'hzk${number}u'; font-size: 40px;\">";
  #  print FH2 "<div style=\"position: absolute; top: $top; left: $left; font-family: '細明體外字集$numberk'; font-size: 40px;\">";
  #  #printf FH2 pack('U', chise::chise_ds_decode_char($chise_ds, chise_tools::get_uchar("=hanziku-$number"), eval('0x'.$4)));
  #  #printf FH2 pack('U', chise::chise_ds_decode_char($chise_ds, chise_tools::get_uchar("=big5"), eval('0x'.$4)));
  #  $char = $4;
  #  $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
  #  Encode::from_to($char, 'big5', 'utf-8');
  #  utf8::decode($char);
  #  print FH2 "$char\r\n";
  #  print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=big5\&\#45\;cdp\:([0-9A-F]{4,6})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"cdp\" style=\"top: $top; left: $left;\">";
    printf FH2 pack('U', chise::chise_ds_decode_char($chise_ds, chise::get_uchar('=big5-pua'), eval('0x'.$3)));
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=jis\&\#45\;x0208\:([0-9A-F]{4,6})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"jis\" style=\"top: $top; left: $left;\">";
    $char = $3;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'jis0208-raw', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=ks\&\#45\;x1001\:([0-9A-F]{4,6})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"ks\" style=\"top: $top; left: $left;\">";
    $char = $3;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'ksc5601-raw', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=gt\&\#45\;pj\&\#45\;([0-9]{1,2}):([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    $number = sprintf("%02d", $3);
    print FH2 "<div class=\"gt$number\" style=\"top: $top; left: $left;\">";
    $char = $4;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'jis0208-raw', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  } elsif(m/x\=\"([0-9]+)\" y\=\"([0-9]+)\"\>\=gt\&\#45\;pj\&\#45\;(k[12]):([0-9A-F]{4})/){
    $left = int($1 / $rate) + $x;
    $top = int($2 / $rate) + $y;
    print FH2 "<div class=\"gt$3\" style=\"top: $top; left: $left;\">";
    $char = $4;
    $char =~ s/([0-9A-F]{2})/pack('H2', $1)/eg;
    Encode::from_to($char, 'jis0208-raw', 'utf-8');
    utf8::decode($char);
    print FH2 "$char\r\n";
    print FH2 "</div>";
  }
}

print FH2 "<map name=\"object\">\n";
seek FH, 0, 0;
$i = 0;
foreach(<FH>){
  if($i == 1){
    m/points=\"[0-9]+,[0-9]+ ([0-9]+),([0-9]+) [0-9]+,[0-9]+ ([0-9]+),([0-9]+) /;
    print FH2 "<area href=\"http://mousai.kanji.zinbun.kyoto-u.ac.jp/char-desc?char=%26u-$target%3B\" shape=\"rect\" coords=\"".int($3 / $rate).", ".int($4 / $rate).", ".int($1 / $rate).", ".int($2 / $rate)."\">\n";
    $i = 0;
  }
  elsif(m/^<g id=\"node[0-9]+\" class=\"node\"><title>(2{0,1}[0-9A-F]{4})<\/title>\n$/){
    $target = $1;
    $i = 1;
  }
}
print FH2 "</map>\n";
close FH;

print FH2 <<EOT;
</body>
</html>
EOT
close FH2;

&close_chise;

#-----------------------------------------------------------------------------
sub process{
  my ($buffer, @buffer, $feature);
  if(exists($char{$_[0]})){
    return;
  }
  
  #S-exporession
  if($_[0] =~ m/^\(\(/){
    $char{$_[0]} .= "$_[0]\\n";
    next;
  }
  
  #ccs-feature
  foreach(@list){
    if((substr($_,0,1) eq '=' && substr($_,1,1) ne '>') || $_ eq "morohashi-daikanwa"){
      $buffer = get_feature_value($_, $_[0]);
      if($buffer ne ""){
        if($_ eq "=daikanwa" || $_ eq "=gt" || $_ eq "=gt-k"){
          $char{$_[0]} .= sprintf("$_:%05d\\n", $buffer);
        #} elsif($_ =~ m/^\=(gt-pj-[0-9]{1,2}|gt-pj-k[12]|big5|big5-cdp|jis-x0208|ks-x1001|ucs|cns11643-[1-9]|gb2312|jis-x0208\@1978|jis-x0208\@1983|jis-x0208\@1990|jis-x0208\@1997|jis-x0212|hanziku-[1-8]|jef-china3)$/){
        } elsif($_ =~ m/^\=(gt-pj-[0-9]{1,2}|gt-pj-k[12]|big5|big5-cdp|jis-x0208|ks-x1001|ucs|cns11643-[1-9]|gb2312|jis-x0208\@1978|jis-x0208\@1983|jis-x0208\@1990|jis-x0208\@1997|jis-x0212|jef-china3)$/){
          $char{$_[0]} .= sprintf("$_:%X\\n \\n \\n", $buffer);
        } elsif($_ =~ m/^\=(zinbun-oracle)$/){
          $char{$_[0]} .= sprintf("$_:%X\\n \\n \\n \\n \\n", $buffer);
        } elsif($_ eq "morohashi-daikanwa"){
          $char{$_[0]} .= "$_:$buffer\\n";
        } else {
          $char{$_[0]} .= sprintf("$_:%X\\n", $buffer);
        }
      }
    }
  }
  #goto-feature
  foreach(@list){
    if(substr($_,0,2) eq '->'){
      $buffer = get_feature_value($_, $_[0]);
      if($buffer ne ""){
        $feature = $_;
        @buffer = &parse($buffer);
        if(scalar(@buffer) == 0){
          next;
        }
        foreach(@buffer){
          if($feature eq "->subsumptive" || $feature eq "->denotational"){
            $family{$_[0]} .= "$_,";
            &process($_);
          } else {
            $feature =~ s/->//;
            $link{$_[0]."-".$_} .= $feature."\\n";
            &process($_);
          }
        }
      }
    }
  }
  #comefrom-feature
  foreach(@list){
    if(substr($_,0,2) eq '<-'){
      $buffer = get_feature_value($_, $_[0]);
      if($buffer ne ""){
        $feature = $_;
        @buffer = &parse($buffer);
        if(scalar(@buffer) == 0){
          next;
        }
        foreach(@buffer){
          #$link{$_."-".$_[0]} .= $feature."\\n";
          &process($_);
        }
      }
    }
  }
  #nearlyequal-feature
  foreach(@list){
    if(substr($_,0,2) eq '=>'){
      $buffer = get_feature_value($_, $_[0]);
      if($buffer ne ""){
        $feature = $_;
        @buffer = &parse($buffer);
        if(scalar(@buffer) == 0){
          next;
        }
        foreach(@buffer){
          $link{$_."-".$_[0]} .= $feature."\\n";
          &process($_);
        }
      }
    }
  }
}

sub parse{
  my $target = $_[0];
  my (@temp, @temp2);
  utf8::decode($target);
  if(substr($target,0,1) eq '('){
    if(substr($target,0,2) eq '(('){ # feature is S-expression
      push(@temp2, substr($target,1,length($substr)-1));
    } else {
      @temp = split(/ /, substr($target, 1, length($target) - 2));
      foreach(@temp){
        push(@temp2, unpack('U*', substr($_, 1)));
      }
    }
    return @temp2;
  } else{
  }
}

sub ireko{
  my @temp = split(/,/, $family{$_[0]});
  printf FH "\t"x$_[1]."subgraph cluster%X\ {\n", $_[0];
  if($_[1] == 1){
    printf FH "\t\t\"%X\" [ color = white ];\n", $_[0];
  } else { 
    printf FH "\t"x($_[1] + 1)."style = filled; color = gray%d;\n", 100 - ($_[1] - 1) * 20;
    printf FH "\t"x($_[1] + 1)."\"%X\" [ color = gray%d ];\n", $_[0], 100 - ($_[1] - 1) * 20;
  }
  foreach(@temp){
    if(exists($family{$_})){
      &ireko($_, $_[1]+1);
    } else{
      printf FH "\t"x($_[1] + 1)."\"%X\";\n", $_;
    }
  }
  print FH "\t"x$_[1]."}\n";
}
#-----------------------------------------------------------------------------
