# Online Könyvtár – Használati útmutató

Ez a projekt egy egyszerű online könyvtárkezelő alkalmazás Node.js és MongoDB alapokon. A felhasználók könyveket kereshetnek, kölcsönözhetnek és visszavihetnek, valamint bejelentkezhetnek a saját fiókjukba.

## Telepítés

1. A projekt futtatásához szükséges:

   - Node.js
   - MongoDB

2. Telepítés:

```bash
npm install
```

3. Dummy felhasználók létrehozása:

   - Indítsd el a szervert: `node server.js`
   - Nyisd meg a böngészőben: `http://localhost:3000/api/users/seed-users`

Ez két felhasználót hoz létre:

- [anna@example.com](mailto:anna@example.com) / pass123
- [bela@example.com](mailto:bela@example.com) / pass456

## Használat

- A kezdőlapon kereshetsz könyveket.
- A részletek gombra kattintva megtekintheted a könyv adatait.
- Bejelentkezés után kölcsönözhetsz és visszavihetsz könyveket.
- Csak a saját kölcsönzéseidhez van hozzáférésed.

## Bejelentkezés / Kijelentkezés

- A fejlécben látható a bejelentkezett felhasználó neve.
- Ha nem vagy bejelentkezve, egy „Login” link jelenik meg.
- A „Logout” linkkel kijelentkezhetsz.

## Megjegyzés

A rendszer szerveroldali session-öket használ a bejelentkezéshez. A könyvkölcsönzés és visszavétel csak bejelentkezett felhasználók számára elérhető.
