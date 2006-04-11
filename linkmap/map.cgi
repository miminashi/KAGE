#!/usr/bin/perl

$random = "linkmap_".(sprintf "%05X", int(rand()*0x100000));

use CGI;
$cgi = new CGI;
$target = $cgi->param('code');
$target =~ tr/\;\<\>\|//d;
$dummy = `/usr/bin/perl /var/www/chiseperl/map.pl $target $random 2>/dev/null`;

$buffer = "";
open FH, "<$random.html";
foreach(<FH>){
  $buffer .= $_;
}
close FH;

print "Content-type: text/html\n\n";
print $buffer;
