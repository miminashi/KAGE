#
#
# CC=gcc -g
CC= gcc -Wall

VERSION=0.0.1

#for cygwin with glib gdk gtk
#CFLAGS= -I/usr/local/include -I/usr/local/include/glib-2.0 -I/usr/local/include/glib-2.0/glib -I/usr/local/include/glib-2.0/gobject -I/usr/local/include/gtk-2.0 -I/usr/local/include/gtk-2.0/gtk -I/usr/local/include/gtk-2.0/gdk -I/usr/local/include/gtk-2.0/gdk-pixbuf -I/usr/local/lib/glib-2.0/include -I/usr/local/lib/gtk-2.0/include -I/usr/local/include/pango-1.0 -I/usr/local/include/atk-1.0
#LIBS= -lpng -ldb -L/usr/local/lib -lglib-2.0 -lgtk-win32-2.0 -lgdk-win32-2.0 -lgthread-2.0 -lpangowin32-1.0 -lgobject-2.0 -lgmodule-2.0 -lpangoft2-1.0 -lpango-1.0 -latk-1.0 -lgdk_pixbuf-2.0

#for cygwin with glib
#CFLAGS= -I/usr/local/include -I/usr/local/include/glib-2.0 -I/usr/local/include/glib-2.0/glib -I/usr/local/lib/glib-2.0/include
#LIBS= -L/usr/local/lib -lpng -ldb -lglib-2.0

#for linux
CFLAGS= -I/usr/local/include -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/X11R6/include
LIBS= -L/usr/local/lib -lpng -ldb -lglib-2.0 -L/usr/X11R6/lib -lX11

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
	\rm -r -f *.o *~ *.exe *.cgi *.stackdump

