#!/usr/bin/perl

$random = sprintf "%05X", int(rand()*0x100000);

use CGI;
$cgi = new CGI;
$target = $cgi->param('code');
$dummy = `/usr/bin/perl /home/kamichi/chiseperl/map.pl $target $random 2>/dev/null`;

$buffer = "";
open FH, "<$random.html";
foreach(<FH>){
  $buffer .= $_;
}
close FH;

print "Content-type: text/html\n\n";
print $buffer;
