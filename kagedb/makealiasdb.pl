###############################################################################
# makealiasdb.pl
#
#   create DB file for KAGE/cgi from alias.txt 
#   by Koichi Kamichi
###############################################################################

if($#ARGV != 0 || !(-d $ARGV[0])){
	print "Usage: perl makealiasdb.pl alias_dir\n";
	exit;
}
$aliasdir = $ARGV[0];
$aliasdir =~ s/\/?$//; # remove the last slash

if(-e "aliasdb"){
  print "Remove old aliasdb first.\n";
	exit;
}

use Fcntl;
use BerkeleyDB;

tie %db, "BerkeleyDB::Hash", -Filename => "aliasdb", -Flags => DB_CREATE
or die "An error occured at ceating DB file.\n";
%db = ();

open(FH, "<$ARGV[0]/alias.txt");
@buffer = <FH>;

$counter = 1;

foreach(@buffer){
	$_ =~ m/(.*?)\t(.*)\n/;
	$key = $1;
	$value = $2;
	if($value ne ""){
		print "\rcreating ... [$counter] key : $key      ";
		$db{$key} = $value;
		$counter++;
	}
}

close(FH);
untie(%db);
print "\n\rdone.\n";
