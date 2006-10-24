#!/usr/bin/perl

$PERL = "/usr/bin/perl";
$LINKMAP_DIR = "/var/www/chiseperl";

$random = "linkmap_".(sprintf "%05X", int(rand()*0x100000));

use CGI;
$cgi = new CGI;
$target = $cgi->param('code');
$target =~ s/[^a-zA-Z0-9]//g;

$dummy = `$PERL $LINKMAP_DIR/map.pl $target $random 2>/dev/null`;

$buffer = "";
open FH, "<${random}.html";
while(!eof(FH)){
  $buffer .= <FH>;
}
close FH;

print "Content-type: text/html\n\n";
print $buffer;

