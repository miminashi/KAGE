#!/usr/bin/perl
use utf8;
binmode STDOUT, ":utf8";

use CGI;
$form = new CGI;

$PERL = "/usr/bin/perl";
$RM = "/bin/rm";
$LICENSE = 'Created by KAGE system. (http://fonts.jp/)';
$TEMP="temp";

$RANDOM = sprintf("%05X", rand() * 0x100000);
$TEMPDIR = "/tmp/makettf_$RANDOM";
mkdir($TEMPDIR);

&makehead();
&makefoot();
&makeparts();
$dummy = `$PERL makettf.pl $TEMPDIR $TEMP mincho 3`;
&sendfont();

sub makehead{
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
    open FH, ">:utf8", "$TEMPDIR/head.txt";
    print FH <<"EOT";
New()
Reencode("UnicodeFull")
SetTTFName(0x409,0,"$LICENSE")
SetTTFName(0x409,1,"$fontname_en")
SetTTFName(0x409,4,"$fontname_en")
SetTTFName(0x411,1,"$fontname_ja")
SetTTFName(0x411,4,"$fontname_ja")
EOT
    close FH;
}

sub makefoot{
    open FH, ">:utf8", "$TEMPDIR/foot.txt";
    close FH;
}

sub makeparts{
    my $temp = $form->param('partsdata');
    utf8::decode($temp);
    open FH, ">:utf8", "$TEMPDIR/parts.txt";
    print FH $temp;
    close FH;
}

sub sendfont{
    my $fdata = "";
    my $fsize = 0;
    my @bdata;
    print <<"EOT";
Content-type: application/octet-stream
Content-Disposition: attachment; filename = $fontname_en.ttf

EOT
    open FH, "<:utf8", "$TEMPDIR/$TEMP.ttf";
    while(1){
	$readed = read FH, $fdata, 1024;
	utf8::decode($fdata);
	print $fdata;
	if($readed <= 0){
	    last;
	}
    }
    close FH;
    $dummy = `$RM -r $TEMPDIR`;
}
