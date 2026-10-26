# SSC kinnisvaraarenduse demo

Kohalik Reacti, TypeScripti ja Three.js veebileht. Tegemist on näidisarendusega, mitte SSC OÜ tegeliku projektiga.

## Käivitamine

Veebilehe käivitamiseks piisab ühest käsust:

```sh
npm run dev
```

Ava terminalis näidatud aadress. Eraldi tuuriserverit, käivitusfaili ega käsitsi failide kopeerimist pole vaja. Sama käsk töötab Linuxis/WSL-is ja Windowsi PowerShellis, ka selle projekti WSL-võrgukaustas. Windowsi cmd võib kuvada UNC-töökataloogi hoiatuse; käivitaja lahendab selle automaatselt ajutise kettatähega.

Windowsi ja WSL-i vahel vahetamisel kontrollib käivitaja Rollupi ja esbuildi platvormipakette ning paigaldab vajadusel õige versiooni automaatselt. Selleks on esimesel käivitusel vaja internetiühendust. Kogu node_modules kausta ega lukufaili kustutama ei pea. Järgmised käivitused kasutavad olemasolevaid tööriistu.

Vajalik Node.js 20.19+ või 22.12+. Uues arvutis paigalda sõltuvused esmalt `npm install` abil.

Kontrollid ja tootmisbuild:

```sh
npm test
npm run build
```

## 3D-vieweri ühendus

Ühendus järgib paketi `3D-viewer/3D-viewer/README.html` juhendit:

- Kogu `3D-viewer/3D-viewer/viewer/` kaust kopeeritakse käivitamisel ja buildimisel muutmata kujul asukohta `public/3d/viewer/`.
- Veebilehe iframe viitab aadressile `/3d/viewer/index.html`, kasutab `loading="lazy"` ning lubab `fullscreen; xr-spatial-tracking`.
- Raami mõõdud ja dialoog määratakse ainult veebilehe CSS-is. Iframe tekib alles „Ava 3D-tuur” nupu vajutamisel ning veebileht suunab fookuse laadimise järel kohe vaaturi aknasse. Vieweri enda failides fookuse loogikat ei muudeta.
- Ühtegi paketi faili, seadistust, algkaamerat, teksti ega JavaScripti ei muudeta. Pakett määrab ise tuuri käitumise.
- Tootmisväljundis on sama muutmata kaust asukohas `dist/3d/viewer/`.

Veebileht ja viewer käivituvad ühe käsuga `npm run dev`. Kui lähtepakett vahetatakse, tuleb server sama käsuga uuesti käivitada. Kõigi korterite ühine iframe-aadress asub failis `src/data.ts` (`TOUR_URL`).

## Andmed ja navigeerimine

`src/data.ts` sisaldab keskseid linnaosade, hoone ja korterite andmeid. Mõlemad linnaosad kasutavad sama District komponenti ning sama hoone objekti. Kõik korterid kasutavad sama detailinfo objekti, põhiplaani, lokaalseid SVG illustratsioone ja ühte tuuri seadistust. Galerii ja plaan on illustratiivsed. Väliseid mudeli- või kaarditeenuseid ei kasutata. Google Fontsi puudumisel kasutatakse süsteemi sans-serif kirja.

Valik salvestatakse URL-i parameetritesse `linnaosa`, `hoone`, `korter`. Näiteks `/?linnaosa=b&hoone=pargi-7&korter=12`. Brauseri tagasi/edasi nupud taastavad valiku. Korrus salvestatakse parameetrisse `korrus`; valitud korteri korrus tuleneb kesksetest andmetest. Mõlemas linnaosas on sama 12-korruseline näidismaja, igal korrusel neli korterit. Korruse kohal hõljutamine tõstab kogu korruse roheliselt esile ja korrusel klõpsamine avab selle korterivaliku.

Mobiilil saab kõiki samme valida tekstiliste nuppudega. 3D-linnaosavaade kasutab fikseeritud linnulennult kaamerat. Vaaturi saab sulgeda Escape klahviga ja fookus jääb dialoogi sisse. Vähendatud animatsioonide eelistus lülitab linnaosakaamera sujuvuse ning CSS üleminekud välja.







## Vercel Web Analytics

Veebilehe juurtasandil kasutatakse ametlikku `@vercel/analytics/react` komponenti. See lisab külastuste ja lehevaatamiste kogumise veebilehele; vieweri paketti ei muudeta. Kohalikus arenduses kasutab komponent arendusrežiimi.

Verceli projekti Web Analytics peab olema sisse lülitatud. Muudatus hakkab avalikul lehel tööle pärast uut Verceli deploymenti. Külastuste nähtavust tuleb seejärel kontrollida Verceli Analyticsi vaates; kohalik build ei kinnita andmete jõudmist Vercelisse.
