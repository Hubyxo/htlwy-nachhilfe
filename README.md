# HTL Waidhofen/Ybbs – Nachhilfeplattform

Webplattform zur Vermittlung von schulinterner Nachhilfe an der HTL Waidhofen an der Ybbs. Schüler:innen melden sich mit ihrem Microsoft-Schulkonto an, suchen Coaches nach Fach und buchen sie. Coaches verwalten ihr Profil und bestätigen oder lehnen Buchungsanfragen ab.

![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

---

## Inhaltsverzeichnis

- [Features](#features)
- [Tech-Stack](#tech-stack)
- [Architektur](#architektur)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Setup](#setup)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Supabase einrichten](#supabase-einrichten)
- [Azure AD einrichten](#azure-ad-einrichten)
- [Entwicklung](#entwicklung)
- [Build & Deployment](#build--deployment)
- [Klassenerkennung](#klassenerkennung)

---

## Features

### Schüler:innen
- Anmeldung mit Microsoft-Schulkonto (Azure AD)
- Coaches nach Fach durchsuchen und Detailprofile ansehen
- Coach buchen und Status der eigenen Buchungen verfolgen
- Übersicht der gebuchten Coaches
- Benachrichtigungen bei Buchungsbestätigung

### Coaches
- Registrierung als Coach mit Klasse, Fächern und Verfügbarkeit
- Verwaltung des eigenen Coach-Profils
- Übersicht eingehender Buchungsanfragen
- Anfragen bestätigen, ablehnen (mit Begründung) oder als abgeschlossen markieren
- Bewertungen durch Schüler:innen

### Admin
- Separater Admin-Login und Admin-Panel
- Anlegen und Verwalten von Coach-Profilen
- Coaches zurückstufen (Demote-Funktion)

---

## Tech-Stack

| Bereich        | Technologie                                  |
|----------------|----------------------------------------------|
| Frontend       | React 18, TypeScript, Vite 5                 |
| Routing        | React Router v7                              |
| Styling        | Tailwind CSS 3, PostCSS, Autoprefixer        |
| Icons          | lucide-react                                 |
| Backend / Auth | Supabase (Auth, PostgreSQL, RLS, Edge Functions) |
| Identity       | Microsoft Azure AD via Supabase OAuth        |
| Linting        | ESLint 9, typescript-eslint                  |

---

## Architektur

- **Authentifizierung:** Supabase Auth mit Azure-AD-Provider (`signInWithAzure`). Beim ersten Login wird automatisch ein Benutzerprofil in der Datenbank angelegt.
- **Datenhaltung:** PostgreSQL über Supabase. Zugriffskontrolle erfolgt über Row Level Security (RLS); alle Policies sind als Migrationen versioniert.
- **Klassen-/Abteilungserkennung:** Klassencode und Abteilung werden aus der E-Mail-Adresse bzw. den Azure-AD-Metadaten abgeleitet (`src/lib/classParser.ts`).
- **Edge Functions:** Versand von E-Mail-Benachrichtigungen (`supabase/functions/send-email`).

---

## Projektstruktur

```
htlwy-nachhilfe/
├── public/                     # Statische Assets
├── src/
│   ├── components/             # Wiederverwendbare UI-Komponenten
│   ├── contexts/               # AuthContext, ThemeContext
│   ├── lib/                    # supabase-Client, classParser, classCode
│   ├── pages/                  # Seiten / Routen
│   ├── App.tsx                 # Routing
│   └── main.tsx                # Einstiegspunkt
├── supabase/
│   ├── functions/send-email/   # Edge Function für Benachrichtigungen
│   └── migrations/             # SQL-Migrationen inkl. RLS-Policies
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Voraussetzungen

- [Node.js](https://nodejs.org/) (LTS empfohlen) und npm
- Ein [Supabase](https://supabase.com/)-Projekt
- Eine registrierte App in [Azure AD / Microsoft Entra](https://entra.microsoft.com/) der HTL

---

## Setup

```bash
git clone https://github.com/Hubyxo/htlwy-nachhilfe.git
cd htlwy-nachhilfe
npm install
```

Anschließend `.env` anlegen (siehe [Umgebungsvariablen](#umgebungsvariablen)) und den Dev-Server starten.

---

## Umgebungsvariablen

Lege eine Datei `.env` im Projektwurzelverzeichnis an:

```env
VITE_SUPABASE_URL=https://<dein-projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<dein-supabase-anon-key>
VITE_AZURE_CLIENT_ID=<deine-azure-client-id>
```

> Alle clientseitig genutzten Variablen müssen mit `VITE_` beginnen, sonst werden sie von Vite nicht eingebunden. Der `anon`-Key ist öffentlich – die Absicherung erfolgt über RLS, **nicht** über Geheimhaltung des Keys.

---

## Supabase einrichten

1. Neues Supabase-Projekt erstellen.
2. Migrationen aus `supabase/migrations/` einspielen (Supabase CLI oder SQL-Editor). Sie erstellen die Tabellen und RLS-Policies, u. a.:
   - `users` – Benutzerprofile
   - `coach_profiles` – Coach-spezifische Daten
   - `bookings` – Buchungen zwischen Schüler:innen und Coaches
   - `notifications` – Benachrichtigungen
   - Bewertungen, Admin-Support und zugehörige Policies
3. Edge Function `send-email` deployen:
   ```bash
   supabase functions deploy send-email
   ```
4. Azure als Auth-Provider unter **Authentication → Providers** aktivieren.

---

## Azure AD einrichten

1. App in Azure AD / Microsoft Entra registrieren.
2. Die **Application (client) ID** in `VITE_AZURE_CLIENT_ID` eintragen.
3. Redirect-URIs hinterlegen:
   - `http://localhost:5173` (lokale Entwicklung)
   - die Produktions-URL (z. B. `https://htlwy.at`)
4. Den Azure-Provider in Supabase mit Client-ID und Secret konfigurieren; die Redirect-URL aus Supabase muss ebenfalls in Azure eingetragen sein.

---

## Entwicklung

```bash
npm run dev       # Dev-Server (Vite, Standard: http://localhost:5173)
npm run lint      # ESLint
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal testen
```

---

## Build & Deployment

```bash
npm run build
```

Der statische Output landet in `dist/` und kann auf jedem Static-Host bzw. eigenen Server ausgeliefert werden. Vor dem Build müssen die Umgebungsvariablen gesetzt sein, da Vite sie zur Build-Zeit einbettet. Bei eigener Domain die Produktions-URL als Redirect-URI in Azure **und** Supabase hinterlegen.

---

## Klassenerkennung

`src/lib/classParser.ts` leitet aus dem Klassencode die Abteilung ab. Unterstützte Suffixe:

| Suffix  | Abteilung               |
|---------|-------------------------|
| AHIT    | Informationstechnologie |
| AHMBA / BHMBA | Maschinenbau      |
| AHET    | Elektrotechnik          |
| AHWIM / BHWIM | Wirtschaftsingenieure |
| AFME    | Mechatronik             |

Die Jahrgangsstufe wird aus der führenden Ziffer (1–5) des Klassencodes ermittelt.

---

> Schulprojekt für die HTL Waidhofen an der Ybbs.
