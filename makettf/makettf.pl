#!/usr/bin/perl

$FONTFORGE = "export LANG=utf-8; /usr/bin/fontforge";
$MAKEGLYPH = "/usr/bin/js ./makeglyph.js";
$MV = "/bin/mv";
$HEADER_FILENAME = "head.txt";
$PARTS_FILENAME = "parts.txt";
$FOOTER_FILENAME = "foot.txt";
$TEMPNAME = "temp";

use utf8;
use CGI;
binmode STDOUT, ":utf8";

if(scalar(@ARGV) != 4){
  print "Usage: makettf.pl WorkingDirectory WorkingName Shotai Weight\n";
  print "Shotai: mincho or gothic\n";
  print "Weight: 1 3 5 7\n";
  exit;
}

$WORKDIR=$ARGV[0];
$WORKNAME=$ARGV[1];
$SHOTAI=$ARGV[2];
$WEIGHT=$ARGV[3];

unlink "$WORKDIR/$WORKNAME.log";
unlink "$WORKDIR/$WORKNAME.scr";
unlink "$WORKDIR/$WORKNAME.ttf";
mkdir "$WORKDIR/build";

# initialize
if(-e "$WORKDIR/$HEADER_FILENAME"){
  open FH, "<:utf8", "$WORKDIR/$HEADER_FILENAME";
  open FH2, ">>:utf8", "$WORKDIR/$WORKNAME.scr";
  while(!eof FH){
    my $buffer = <FH>;
    print FH2 $buffer;
  }
  close FH;
  close FH2;
}
else{
  open FH, ">>:utf8", "$WORKDIR/$WORKNAME.log";
  print FH "No header file.\n";
  close FH;
  exit;
}

# parse buhin
%buhin = ();
if(-e "$WORKDIR/$PARTS_FILENAME"){
  open FH, "<:utf8", "$WORKDIR/$PARTS_FILENAME";
  my $buffer = "";
  while(<FH>){
    $buffer .= $_;
  }
  close FH;
  $temp = $buffer;
}
else{
  open FH, ">>:utf8", "$WORKDIR/$WORKNAME.log";
  print FH "No parts file.\n";
  close FH;
  exit;
}
@temp = split(/\r\n|\r|\n/, $temp);
foreach(@temp){
  if($_ =~ m/:/){
    @temp2 = split(/ +|\t/, $_);
    $buhin{$temp2[0]} = $temp2[1];
  }
}

# parse target codepoint
%target = ();
foreach(sort(keys %buhin)){
  if($_ =~ m/^\[([^\]])\]$/){
    $target = sprintf("%X", unpack('U', $1));
  } elsif(length($_) == 1){
    $target = sprintf("%X", unpack('U', $_));
  } elsif($_ =~ m/^[Uu]{0,1}[\+\-]{0,1}([0-9A-Fa-f]{1,8})$/){
    $target = $1;
  } else {
    next;
  }
  $target =~ s/^0+//g; # delete zero for the beginning
  $name = $_;
  $target{$target} = $name;
}

# make glyph for each target
foreach(sort(keys(%target))){
  $code = $_;
  $target = $target{$_};
  %subset = ();
  &addsubset($target);
  $partsdata = "";
  foreach(keys(%subset)){
    $partsdata .= $_." ".$subset{$_}."\n";
  }
  utf8::encode($target);
  $target =~ s/([^0-9A-Za-z_ ])/'%'.unpack('H2',$1)/ge;
  $target =~ s/\s/+/g;
  utf8::encode($partsdata);
  $partsdata =~ s/([^0-9A-Za-z_ ])/'%'.unpack('H2',$1)/ge;
  $partsdata =~ s/\s/+/g;
  $svg =  `$MAKEGLYPH $target $partsdata $SHOTAI $WEIGHT`;
  open FH, ">$WORKDIR/build/$code.svg";
  print FH $svg;
  close FH;
  &addglyph($code);
}

# scripts footer
if(-e "$WORKDIR/$FOOTER_FILENAME"){
  open FH, "<:utf8", "$WORKDIR/$FOOTER_FILENAME";
  open FH2, ">>:utf8", "$WORKDIR/$WORKNAME.scr";
  while(!eof FH){
    my $buffer = <FH>;
    print FH2 $buffer;
  }
  close FH;
  close FH2;
}
else{
  open FH, ">>:utf8", "$WORKDIR/$WORKNAME.log";
  print FH "No footer file.\n";
  close FH;
  exit;
}

&makefont;

sub addglyph{
    my $buffer =<<"EOT";
Print(0u$_[0])
Select(0u$_[0])
Clear()
Import("$WORKDIR/build/$_[0].svg")
Scale(500)
Move(400, -400)
RemoveOverlap()
Simplify()
SetWidth(1000)
Move(0, 50)
RoundToInt()
AutoHint()
EOT
  open FH, ">>:utf8", "$WORKDIR/$WORKNAME.scr";
  print FH $buffer;
  close FH;
}

sub makefont{
  my $buffer = "Generate(\"$WORKDIR/$TEMPNAME.ttf\", \"\", 0)\n";
  $buffer .= "Quit()\n";
  open FH, ">>:utf8", "$WORKDIR/$WORKNAME.scr";
  print FH $buffer;
  close FH;
  
  $buffer = `$FONTFORGE -script $WORKDIR/$WORKNAME.scr > $WORKDIR/$WORKNAME.log 2>&1`;
  $buffer = `$MV $WORKDIR/$TEMPNAME.ttf $WORKDIR/$WORKNAME.ttf`;
}

sub addsubset{
  $subset{$_[0]} = $buhin{$_[0]};
  while($buhin{$_[0]} =~ m/(^|\$)99:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:(.+?)(\$|$)/gc){
    if(!exists($subset{$2})){
      &addsubset($2);
    }
  }
}

