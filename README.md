# Komodo.js

Ši programavimo kalba sukurta Komodo komandos, kurios nariai yra Edgaras Lopatovas, Saulius Šaulys ir Martynas Stumbra iš IFF-7/4 grupės. Komodo.js parašyta naudojantis OHM.js biblioteka. Unikali savybės: kintamasis cypher, kuris naudoja crypto.js biblioteka, norint užšifruoti/dešifruoti patį kintamąjį.

### Būtinos sąlygos

Šiam projektui/programavimo kalbai pasileisti būtina įsirašyti lokaliai kompiuteryje Node.js bei Node Package Manager (npm).

Pasižiūrėti ar turite įsirašę node arba npm versiją galite per terminalą įvedus komandą:

```
node -v
```

arba

```
npm -v
```

### Įsirašymas

- Parsisiųskite repozitorijoje esančius failus;
- Nunaviguokite į repozitorijos direktoriją naudodami terminalą;
- Parašykite `npm i` į terminalą ir įvykdykite komandą, kad įrašytų reikiamas bibliotekas.

### Komodo.js failo kompiliavimas

Norėdami sukompiliuoti .komodo failą, reikia komandinėje eilutėje (terminale) įrašyta komandą `node index.js {pathToFile}`, kur pathToFile yra jūsų sukurto .komodo failo kelias. Pvz.: `node index.js ./tests/test5.komodo`.

## Testinių failų paleidimas

Repozitorijoje galite matyti direktoriją pavadinimu `tests`, kurioje yra sudaryti penki testiniai variantai su .komodo programavimo kalba. Joje yra ištestuojami Komodo.js kintamieji, sisteminės funkcijos, unikali savybė - duomenų tipas `cypher`. Testinius failus galite pasileisti su komanda `node index.js ./tests/test{testNumber}.komodo`, kur testNumber yra testo numeris. Pvz.: `node index.js ./tests/test1.komodo`.

## Sukurta naudojantis

- https://www.npmjs.com/package/ohm-js - Ohm.js biblioteka;
- https://www.npmjs.com/package/crypto.js - crypto.js biblioteka.

## Programavimo kalbos autoriai

- **Edgaras Lopatovas**
- **Saulius Šaulys**
- **Martynas Stumbra**
