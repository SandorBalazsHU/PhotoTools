# PhotoTourTools
> web app

<br/>
<br/>

# Projekt ötlet leírása:
Egy mobilon használható webes appot szeretnénk megvalósítani, mely kirándulásokkor, azok tervezésében, és az ott készített képek rendszerezésében segédkezik. A program a helyadatok lekérdezésével, térkép használatával megjeleníti a tartózkodásunk helyét, az útvonalat, amin haladunk, továbbá a kirándulás során készített fotókat helyadat szerint rendszerezi, eltárolja így azok könnyebben visszakereshetővé válnak. Az app ezen kívül kirándulás célpont alapján időjárási adatokat is megjelenít.

<br/>

# Funkcionális követelmények:

### Fő funkcionalitási körök:
* Kezdőlap
* Fotó mód
* GPS Tracker
* Túratérkép
* Időjárás, holdfázisok, ajánlások
* Fotó kalkulátor

### Másodlagos funkcionalitási körök:
*	Offline adatok kezelése.
*	Regisztráció
*	Online funkciók
*	Beállítások

<br/>

## User story-k:

###	Kezdőlap:
*	Megjelenik az aktuális dátum, idő és időzóna
*	Megjelennek az aktuális koordináták és hely.
*	Jelzi az online és az offline módot.
*	Megjelennek az aktuális időjárási adatok
*	Megjelenik az időjárás előrejelzés
*	Megjelennek a holdfázisok.
*	Megjelenik a napkelte, napnyugta, naphossz, delelés, aranyóra, kékóra időpontok.
*	Megjelennek a fotózási témajavaslatok, ajánlások. 

###	Fotó mód:
* Megjelenik a kameranézet, fényképet készíthetünk,
*	A fotó helye és ideje mentésre kerül.
*	A fotóhoz megjegyzés fűzhető.

###	GPS Tracker:
*	Új túra indítása.
*	Új túra adatainak kitöltése, mentése.
*	Túra közben előre beállított időközönként lekéri és tárolja a GPS és magassági adatokat.
*	A gyorsulásmérő, giroszkóp és iránytű adatokat is tárolja.
*	A plusz adatokkal pontosítást végez.
*	Kiegészítő lehetőségek:
    *	Tárolja a túra közben készített fotók pozícióját, idejét.
    *	Megjegyzés fűzhető a képhez.
    *	Szöveges megjegyzések helyezhetők el az útvonalon.
*	Aktív túra térképes megjelenítése (A túratérkép lapra átlépve):
    *	A túratérkép lapra átlépve a mérések helyét pontonként térképen megjeleníti.
    *	A mérési pontok közötti útvonalat törtvonallal vagy görbe illesztéssel kirajzolja.
    * A megjegyzések és képek helyét is megjeleníti,
    * megjeleníti a jelenlegi pozíciót.
*	A túra adatainak mentése lokálisan.
*	Túra adatainak online szinkronizálása.

###	Túratérkép:
*	A jelenlegi pozíció megjelenítése.
*	Az aktív túra adatainak megjelenítése (Lásd a GPS Tracker-nél.)
*	Offline térkép mentése és betöltése. (Ha technikailag lehetséges lesz)

###	Időjárás, holdfázisok, ajánlások:
*	Megjelenik a napkelte, napnyugta, naphossz, delelés, aranyóra, kékóra időpontok.
*	Megjelennek az aktuális időjárási adatok
*	Megjelenik az időjárás előrejelzés
*	Megjelennek a holdfázisok.
*	Kiemeli a várható fényviszonyokat a felhőzet alapján.
*	Megjelennek a fotózási témajavaslatok, ajánlások.

###	Fotó kalkulátor:
*	Expozíciós idő számoló mező ISO, Blende és a fénymérő adatai alapján.

###	Galéria mód, korábbi képek visszanézése:
*	A hamburger menüből megnyitható a galéria.
* A képek időrendben is megtekinthetők, illetve helyadat szerint.
* Térkép segítségével, hely és sugár megadásával lehet lekérni a képeket.
*	A galériában rendezetten jelennek meg a képek
    *	Egy képet megnyitva megtekinthetőek a kép adatai. (Dátum, idő EXIF adatok stb.)
    * Látható a kép helye
    * Láthatóak az esetleges megjegyzések.

<br/>

# Nem funkcionális követelmények:

###	Hatékonyság
*	Rendszerkövetelmények:
(a működő, de nem feltétlen teljes funkcionalitású programhoz)
    * Javascript és device API futtatásra képes böngésző
    *	RAM: 1 GB
    *	Szabad hely: >500 MB
*	Minden műveletre igaz legyen, hogy nem fog több időbe telni az elvégzése, mint 10 ms. 
*	Biztosítani kell az akadás-mentes képvilágot a felhasználó számára. 
###	Megbízhatóság
*	Ha egy gép teljesíti a rendszerkövetelményben foglaltakat, akkor mindenképpen futnia kell a programnak rajta.
*	Minden feltelepült programnak ugyanolyan funkcionalitással kell rendelkeznie.
###	Biztonság
*	Amennyiben az alkotócsapat eredeti példányát használja a felhasználó, úgy semmilyen más nem kívánt szoftver nem származhat sem a program telepítéséből, sem használatából. 
*	A program nem igényel különösebb biztonsági intézkedéseket.
###	Hordozhatóság
*	A programot több különböző eszközre is egyszerű legyen feltelepíteni.
* Alacsony helyigényénél fogva könnyen terjeszthető legyen.
###	Felhasználhatóság
*	Intuitív felhasználói felület kell.
*	Könnyen legyen telepíthető.
*	Legyen egyaránt könnyen elsajátítható a program használata a különféle háttérismeretekkel rendelkező felhasználóknak.

<br/>

## Menedzselési követelmények
###	Környezeti
*	A felhasználás helye egy Javascript és device API futtatásra képes böngészővel ellátott eszköz.
*	Nem kell más külön szoftver a program helyes működéséhez.
###	Működési
*	A program használatához nem szükséges semmilyen szaktudás.
*	A programot egyéni preferencia szerint bármikor igénybe veheti a felhasználó. 
##	Fejlesztési
*	A programnak az általános funkcionalitása várhatóan nem változik, de az egyes tételeket könnyen kell tudnunk módosítani.
*	Plusz funkcionalitás igénye esetén biztosítani kell a minél könnyebb bővíthetőséget.

<br/>

## Külső követelmények
###	Etikai
*	Nincs korhoz kötve a program használata
*	Nem tartalmaz erőszakot, sem etikailag kérdéses fogalmat a program.
###	Adatvédelmi és biztonsági
*	A program tárolhat személyes adatnak minősülő adatokat (mint, például fotók, helyadatok), de ezek csak az adott eszközön tárolódnak el, ehhez csak a felhasználó tud hozzáférni.
*	Egyébiránt nem sért adatvédelmi elveket. 

<br/>

## Fő tervezési szempontok:
*	Reszponzív megjelenés.
*	Fekvő és álló tájolás közötti automatikus és sima váltás.
*	One page application. (Csak egyszeri betöltés, ezután a REST API-t hívások aszinkron módon)
*	Egy oldalas megjelenés. Az aktuális információk az oldal tetején jelennek meg. A részletezés egy legörgetés után jelennek meg, a beállítások egy újbóli legörgetés után láthatóak, majd a segítség pedig ez alatt jelenik meg.
*	Teljes Offline és Online működés támogatása. (A mobilnet nélküli túrahelyek miatt fonatos.) (Ha technikailag lehetséges lesz)
*	Regisztráció csak az online mentéshez szükséges, minden más mentés helyileg tárolható.


<br/>

# Drótváztervek:

## Kezdőoldal mobilon
![](https://github.com/elte-fi/project-3-csoport/blob/master/src/index_mobil.jpg)


## Kezdőoldal monitoron
![](https://github.com/elte-fi/project-3-csoport/blob/master/src/index_monitor.jpg)

## Galéria

### Időrendben
![](https://github.com/elte-fi/project-3-csoport/blob/master/src/gallery1.jpg)

### Helyadat szerint
![](https://github.com/elte-fi/project-3-csoport/blob/master/src/gallery2.jpg)
![](https://github.com/elte-fi/project-3-csoport/blob/master/src/gallery3.jpg)
