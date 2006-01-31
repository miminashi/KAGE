#!/usr/bin/perl
use utf8;
use CGI;

$FONTFORGE = "/usr/local/bin/fontforge";
$PERL = "/usr/bin/perl";
$ECHO = "/bin/echo";
$RM = "/bin/rm";
$TEMP = "/tmp/tempKAGE";
$KAGESCRIPT = "/home/kamichi/perl";
$FMT = "svg";
$LICENSE = 'Created by KAGE system. (http://fonts.jp/)';

$form = new CGI;

$fontname_en = $form->param('fontname-en');
$fontname_en =~ s/[\;\&\#\"\'\%\\\$\:\!\=\~\^\`]//g;
$fontname_ja = $form->param('fontname-ja');
$fontname_ja =~ s/[\;\&\#\"\'\%\\\$\:\!\=\~\^\`]//g;
utf8::decode($fontname_ja);
if($fontname_en eq ""){
    $fontname_en = "Untitled";
}
if($fontname_ja eq ""){
    $fontname_ja = $fontname_en;
}
$partsdata = $form->param('partsdata');
$partsdata =~ s/[\;\&\#\"\'\%\\]//g;
$mappingtable = $form->param('mappingtable');
$mappingtable =~ s/[\;\&\#\"\'\%\\\$\:]//g;
@unicoderange = ();
for(my $i = 0; $i < 16; $i++){
    $unicoderange[$i] = $form->param("unicoderange$i");
    $unicoderange[$i] =~ s/[^0-9a-fA-F\-]//g;
    if($unicoderange[$i] eq ""){
	$unicoderange[$i] = "--";
    }
}
for(my $i = 0; $i < 4; $i++){
    $codepagerange[$i] = $form->param("codepagerange$i");
    $codepagerange[$i] =~ s/[^0-9a-fA-F]//g;
    if($codepagerange[$i] eq ""){
	$codepagerange[$i] = "00";
    }
}

#open FH, "<", "parts.txt";
#$temp = "";
#%parts = ();
#foreach(<FH>){
#    $temp .= $_;
#    @temp = split(/ \t|\r\n|\r|\n/, $_);
#    $parts{$temp[0]} = $temp[1];
#}
#close FH;
@temp2 = split(/\r\n|\r|\n/, $partsdata);
$temp = "";
%parts = ();
foreach(@temp2){
    $temp .= $_;
    @temp = split(/ |\t|\r\n|\r|\n/, $_);
    $parts{$temp[0]} = $temp[1];
}
open FH, ">", "$TEMP.parts.txt";
$temp =~ s/ /\t/g;
print FH $temp;
close FH;

#open FH, "<", "map.txt";
#%map = ();
#foreach(<FH>){
#    @temp = split(/\t|\r\n|\r|\n/, $_);
#    $map{$temp[0]} = $temp[1];
#}
#close FH;
@temp2 = split(/\r\n|\r|\n/, $mappingtable);
%map = ();
foreach(@temp2){
    @temp = split(/ |\t|\r\n|\r|\n/, $_);
    $map{$temp[0]} = $temp[1];
}

$script =<<"EOT";
New()
Reencode("UnicodeFull")
SetTTFName(0x409,0,"$LICENSE")
SetTTFName(0x409,1,"$fontname_en")
SetTTFName(0x409,4,"$fontname_en")
SetTTFName(0x411,1,"$fontname_ja")
SetTTFName(0x411,4,"$fontname_ja")
EOT

foreach(sort(keys %map)){
    $temp = $parts{$map{$_}};
    $dummy = `cd $KAGESCRIPT; $ECHO '$temp' | $PERL $KAGESCRIPT/kagepre.pl $TEMP.parts.txt | $PERL $KAGESCRIPT/kage$FMT.pl > $TEMP.$_.$FMT`;
    &addglyph($_);
}
&makefont;

sub addglyph{
    $script .=<<"EOT";
Select(0u$_[0])
Clear()
Import("$TEMP.$_[0].$FMT")
#Import("$TEMP.$_[0].$FMT",0,2)
RemoveOverlap()
Simplify()
SetWidth(1000)
SetVWidth(1000)
Move(0, 50)
RoundToInt()
AutoHint()
EOT
}

sub makefont{
    $script .= "Generate(\"$TEMP.ttf\", \"\", 0)\n";
    $script .= "Quit()\n";
    open FH, ">:utf8", "$TEMP.scr";
    print FH $script;
    close FH;
    
    $dummy = `export LANG=utf-8; $FONTFORGE -script $TEMP.scr 2>/dev/null`;
    
    my $fdata = "";
    my $fsize = 0;
    my $i;
    my @bdata;
    open FH, "<$TEMP.ttf";
    $fsize = -s FH;
    read FH, $fdata, $fsize;
    close FH;
    @bdata = unpack("C*", $fdata);
    for($i = 0; $i < $fsize - 23; $i++){
	if($bdata[$i] == ord("P") && $bdata[$i+1] == ord("f") && $bdata[$i+2] == ord("E") && $bdata[$i+3] == ord("d")){
	    #$bdata[$i-5] = 0x10;
	    for($j = 0; $j < 16; $j++){
		if($unicoderange[$j] ne "--"){
		    $bdata[$i-16+$j] = eval('0x'.$unicoderange[$j]);
		}
	    }
	    #$bdata[$i+20] = 0x80; # Symbol
	    #$bdata[$i+21] = 0x02; # JIS/Japan
	    #$bdata[$i+22] = 0x00;
	    #$bdata[$i+23] = 0x03; # Latin 1 & 2 
	    for($j = 0; $j < 4; $j++){
              $bdata[$i+20+$j] = eval('0x'.$codepagerange[$j]);
            }
	}
    }
    $fdata = pack("C*", @bdata);
    #open FH, ">./$fontname.ttf";
    #print FH $fdata;
    #close FH;
    print <<"EOT";
Content-type: application/octet-stream
Content-Disposition: attachment; filename = $fontname_en.ttf

$fdata
EOT
    
    $dummy = `$RM $TEMP*`;
}
