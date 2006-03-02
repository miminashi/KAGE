// KAGE engine sample for SpiderMonkey
//
// use like ... %js test.js > a.svg

load("polygon.js");
load("polygons.js");
load("buhin.js");
load("kage.js");
load("kagecd.js");
load("kagedf.js");

kage = new Kage();
polygons = new Polygons();

kage.kBuhin.push("test", "2:7:8:66:2:95:16:110:33$1:0:2:28:56:102:56$1:22:4:103:56:103:196$1:0:2:3:92:66:92$2:22:7:66:92:48:146:1:178$2:0:7:186:66:163:89:125:112$2:7:0:107:60:130:144:196:182");

kage.makeGlyph(polygons, "test");

print(polygons.generateSVG());
