# Makefile
#

CC=gcc -Wall
INSTALL=install
WGET=wget
BINDIR=/usr/local/bin
SHAREDIR=/usr/local/share/kagecgi
DBURL=http://fonts.jp/kagedb/kagedb

#for cygwin with glib
#CFLAGS= -I/usr/local/include -I/usr/local/include/glib-2.0 -I/usr/local/include/glib-2.0/glib -I/usr/local/lib/glib-2.0/include
#LIBS= -L/usr/local/lib -lpng -ldb -lglib-2.0

#for linux
CFLAGS= -I/usr/local/include -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/X11R6/include
LIBS= -L/usr/local/lib -lpng -ldb -lglib-2.0 -L/usr/X11R6/lib -lX11

#for MacOSX with fink
#CFLAGS= -I/sw/include -I/sw/include/glib-2.0 -I/sw/lib/glib-2.0/include/ -I/sw/include/libpng/ -I/usr/include -I/usr/X11R6/include/
#LIBS= -L/sw/lib -lpng -lglib-2.0 -L/usr/lib -ldbm -L/usr/X11R6/lib -lX11

all: kage.cgi

kage.cgi: kagecgi.o kagepng.o kagedf.o kagecd.o kageic.o kagepoly.o kagedb.o kageeg.o kagecomb.o kagechar.o kagetool.o
	$(CC) $(CFLAGS) -o kage.cgi kagecgi.o kagepng.o kagedf.o kagecd.o kageic.o kagepoly.o kagedb.o kageeg.o kagecomb.o kagechar.o kagetool.o $(LIBS)

kagecgi.o: kagecgi.c
kagedf.o: kagedf.c
kagecd.o: kagecd.c
kageic.o: kageic.c
kagepoly.o: kagepoly.c
kagedb.o: kagedb.c
kageeg.o: kageeg.c
kagechar.o: kagechar.c
kagecomb.o: kagecomb.c
kagetool.o: kagetool.c
kagepng.o: kagepng.c

clean:
	\rm -r -f *.o *~ *.exe *.cgi *.stackdump kagedb

install: kage.cgi
	mkdir -p $(BINDIR)
	$(INSTALL) -c -m 755 kage.cgi $(BINDIR)
	mkdir -p $(SHAREDIR)
	$(INSTALL) -c -m 644 error.png $(SHAREDIR)

kagedb:
	$(WGET) $(DBURL)

database: kagedb
	$(INSTALL) -c -m 644 kagedb $(SHAREDIR)

