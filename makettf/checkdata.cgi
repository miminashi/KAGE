#!/usr/bin/perl

$ERROR_SYNTAX = 1;
$ERROR_NOPARTS = 2;

use utf8;
binmode STDOUT, ":utf8";
use CGI;
$form = new CGI;
$| = 1;

my $data = $form->param('partsdata');
utf8::decode($data);
@buffer = split(/\r\n|\r|\n/, $data);

$result = "";

$pre1 = "";
$pre2 = "";

%parts = ();
foreach $temp (@buffer){
  if($temp =~ m/:/ && $temp =~ m/[0-9]/){
    @temp = split(/ |\t|\r\n|\r|\n/, $temp);
    $parts{$temp[0]} = 1;
  }
}

foreach $temp (@buffer){
  if($temp =~ m/:/ && $temp =~ m/[0-9]/){
    $error = 0;
    $check = 0;
    @temp = split(/ |\t|\r\n|\r|\n/, $temp);
    @temp2 = split(/\$/, $temp[1]);
    foreach $temp2 (@temp2){
      if($temp2 =~ m/^1:(0|2):(0|2):/){ $check++; }
      if($temp2 =~ m/^1:(0|12|22|32):(0|13|23|32|4):/){ $check++; }
      if($temp2 =~ m/^2:(0|12|22|32):(4|5|7):/){ $check++; }
      if($temp2 =~ m/^2:7:(0|4|8):/){ $check++; }
      if($temp2 =~ m/^2:2:7:/){ $check++; }
      if($temp2 =~ m/^3:(0|12|22|32):(0|5):/){ $check++; }
      if($temp2 =~ m/^6:22:5:/){ $check++; }
      if($temp2 =~ m/^7:(0|12|22|32):7:/){ $check++; }
      if($temp2 =~ m/^99:[^:]+:[^:]+:[^:]+:[^:]+:[^:]+:[^:]+:([^:]+)/){
        $check++;
        if(!exists($parts{$1})){
          $error = $error | $ERROR_NOPARTS;
        }
      }
      if($temp2 =~ m/^0:/){ $check++; }
    }
    if($check == 0){
      $error = $error | $ERROR_SYNTAX;
    }
    if($error != 0){
      if($error & $ERROR_SYNTAX){
        $result .= "** 文法エラー・処理できない筆画があります **\n";
      }
      if($error & $ERROR_NOPARTS){
        $result .= "** 99番で使用されている部品が存在しません **\n";
      }
      $result .= "$pre2\n$pre1\n==> $temp\n"."-" x 70 . "\n";
    }
  }
  $pre2 = $pre1;
  $pre1 = $temp;
}

if($result eq ""){
  $result = "エラーはありませんでした\n";
}

print <<"EOT";
Content-type: text/html;

<!DOCTYPE html
    PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="http://fonts.jp/green.css">
<html>
<head>
<title>チェック結果</title>
</head>
<body>
<div class="main">
<h1>チェック結果</h1>
<p>チェック結果は以下の通りです。</p>
<pre>
$result
</pre>
<p><a href="checkdata.html">戻る</a></p>
<hr class="footer">
fonts.jp
</div>
</body>
</html>
EOT
