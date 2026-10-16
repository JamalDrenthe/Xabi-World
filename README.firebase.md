# Xabi World — Firebase & Omgeving Documentatie

## 1. Projecten & Beheer
- **Gekoppeld account:** `info@xabi.world` (en `info@jamaldrenthe.com`)
- **Development Project ID:** `xabi-world-dev`
- **Productie Project ID:** `xabi-world-prod`
- **Website URL:** `https://xabi.world` (gehost op Vercel)
- **Repository:** `https://github.com/JamalDrenthe/Xabi-World.git`

## 2. Authenticatie & Rollen
- **Google OAuth:** Inloggen met Google is geïmplementeerd via Firebase Auth.
- **Admin Rechten:** Wanneer er wordt ingelogd met `info@xabi.world` of `info@jamaldrenthe.com`, krijgt de gebruiker automatisch de **Admin** rol toegewezen met volledige bevoegdheden in de UI en over Firestore documenten.
- **Demo Accounts voor Normale Gebruikers:**
  - 👤 **Daan Vermeulen** (`daan.vermeulen@xabi.world`) — Particulier / Basis Lid
  - 💎 **Sophie van Dijk** (`sophie.vandijk@xabi.world`) — Premium Belegger
  - 🏢 **Lucas de Boer** (`lucas.deboer@xabi.world`) — Zakelijk Ondernemer

## 3. Firebase Console Instellingen
Om Google OAuth live op het webadres `xabi.world` te laten werken:
1. Ga naar **Firebase Console** -> Project `xabi-world-dev` (en `xabi-world-prod`).
2. Ga naar **Authentication** -> **Sign-in method** en zet **Google** op ingeschakeld.
3. Ga naar **Authentication** -> **Settings** -> **Authorized domains** en voeg toe:
   - `xabi.world`
   - `localhost`

## 4. Handige commando's
```bash
# Wisselen tussen dev en prod
firebase use dev
firebase use prod

# Firestore security rules deployen
firebase deploy --only firestore:rules --project xabi-world-dev
firebase deploy --only firestore:rules --project xabi-world-prod

# Builden en testen
npm run build
```
