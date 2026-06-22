# HTL Waidhofen/Ybbs – Nachhilfeplattform

Webplattform zur Vermittlung von schulinterner Nachhilfe an der HTL Waidhofen an der Ybbs. Schüler:innen melden sich mit ihrem Microsoft-Schulkonto an, durchsuchen Coaches, sehen deren Detailprofile und buchen sie für ein bestimmtes Fach. Coaches verwalten ihr Profil und bestätigen oder lehnen Buchungsanfragen ab. Termine werden anschließend direkt per E-Mail zwischen Coach und Schüler:in vereinbart.

![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

---

## Inhaltsverzeichnis

- [Features](#features)
- [Status & Geplant](#status--geplant)
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
- Coach-Liste durchsuchen, nach Abteilung filtern und Detailprofile inkl. Durchschnittsbewertung ansehen
- Coach für ein bestimmtes Fach buchen und den Status der eigenen Anfragen verfolgen
- Übersicht der gebuchten Coaches
- Benachrichtigungen (In-App und E-Mail) bei Buchungsbestätigung
- Abgeschlossene Coachings bewerten

### Coaches
- Registrierung als Coach mit Klasse, Fächern und Verfügbarkeit
- Verwaltung des eigenen Coach-Profils
- Übersicht eingehender Buchungsanfragen (inkl. E-Mail-Benachrichtigung)
- Anfragen bestätigen, mit Begründung ablehnen oder als abgeschlossen markieren
- Erhalt von Bewertungen durch Schüler:innen

### Admin
- Separater Admin-Login (E-Mail/Passwort) und Admin-Panel
- Coaches anlegen, bearbeiten und löschen
- Coaches zurückstufen (Demote-Funktion)

---

## Status & Geplant

Die Plattform befindet sich in der Beta. Der Kernablauf (Anmeldung, Suche, Buchung, Bewertung) ist funktionsfähig. Noch in Arbeit:

- Filtern der Coach-Liste nach Fach (aktuell nur nach Abteilung)
- Zurückziehen eigener Buchungsanfragen durch Schüler:innen
- Admin-Übersicht über alle Buchungen
- Moderation von Bewertungen im Admin-Panel
- Benutzer-/Account-Verwaltung für Admins

---

## Tech-Stack

| Bereich        | Technologie                                      |
|----------------|--------------------------------------------------|
| Frontend       | React 18, TypeScript, Vite 5                     |
| Routing        | React Router v7                                  |
| Styling        | Tailwind CSS 3, PostCSS, Autoprefixer            |
| Icons          | lucide-react                                     |
| Backend / Auth | Supabase (Auth, PostgreSQL, RLS, Edge Functions) |
| Identity       | Microsoft Azure AD via Supabase OAuth            |
| Linting        | ESLint 9, typescript-eslint                      |

---

## Architektur

- **Authentifizierung:** Supabase Auth mit Azure-AD-Provider. Der Login läuft über `supabase.auth.signInWithOAuth({ provider: 'azure' })`, gekapselt in der Funktion `signInWithAzure` (`src/contexts/AuthContext.tsx`). Beim ersten Login wird automatisch ein Benutzerprofil in der Tabelle `users` angelegt.
- **Admin-Login:** Separater Login per E-Mail/Passwort über `supabase.auth.signInWithPassword` (`src/pages/AdminLogin.tsx`).
- **Datenhaltung:** PostgreSQL über Supabase. Zugriffskontrolle erfolgt über Row Level Security (RLS); alle Policies sind als Migrationen versioniert.
- **Klassen-/Abteilungserkennung:** Klassencode, Jahrgang und Abteilung werden aus dem Klassencode abgeleitet (`src/lib/classParser.ts`).
- **Edge Functions:** Versand von E-Mail-Benachrichtigungen über `supabase/functions/send-email`, aufgerufen aus dem Buchungsablauf via `${VITE_SUPABASE_URL}/functions/v1/send-email`.
- **Theming:** Hell-/Dunkelmodus über `src/contexts/ThemeContext.tsx`.

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
```

> Nur diese beiden Variablen werden im Frontend gelesen. Die Azure-Client-ID und das Secret werden **nicht** im Frontend gesetzt, sondern im Supabase-Dashboard beim Azure-Provider hinterlegt (siehe [Azure AD einrichten](#azure-ad-einrichten)).
>
> Alle clientseitig genutzten Variablen müssen mit `VITE_` beginnen, sonst werden sie von Vite nicht eingebunden. Der `anon`-Key ist öffentlich – die Absicherung erfolgt über RLS, **nicht** über Geheimhaltung des Keys.

---

## Supabase einrichten

1. Neues Supabase-Projekt erstellen.
2. Migrationen aus `supabase/migrations/` einspielen (Supabase CLI oder SQL-Editor). Sie erstellen die Tabellen und RLS-Policies, u. a.:
   - `users` – Benutzerprofile
   - `coach_profiles` – Coach-spezifische Daten
   - `tutors` – im Admin-Panel verwaltete Coach-Einträge
   - `bookings` – Buchungen zwischen Schüler:innen und Coaches
   - `ratings` – Bewertungen
   - `notifications` – Benachrichtigungen
   - Admin-Support (`admin_sessions`) und zugehörige Policies
3. Edge Function `send-email` deployen:
   ```bash
   supabase functions deploy send-email
   ```
4. Azure als Auth-Provider unter **Authentication → Providers** aktivieren und dort Client-ID und Secret hinterlegen.

---

## Azure AD einrichten

1. App in Azure AD / Microsoft Entra registrieren.
2. **Application (client) ID** und ein **Client Secret** erzeugen.
3. Client-ID und Secret im Supabase-Dashboard unter **Authentication → Providers → Azure** eintragen (nicht im Frontend-`.env`).
4. Als Redirect-URI in Azure die Callback-URL von Supabase hinterlegen (Form: `https://<dein-projekt>.supabase.co/auth/v1/callback`).
5. In Supabase unter **Authentication → URL Configuration** die **Site URL** und erlaubten Redirect-URLs setzen:
   - `http://localhost:5173` (lokale Entwicklung)
   - die Produktions-URL (z. B. `https://nachhilfe.htlwy.com`)

> Der Login leitet nach `window.location.origin` zurück – die jeweilige Origin (localhost bzw. Produktion) muss in Supabase als erlaubte Redirect-URL eingetragen sein.

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

Der statische Output landet in `dist/` und kann auf jedem Static-Host (z. B. Cloudflare Pages) ausgeliefert werden. Vor dem Build müssen die Umgebungsvariablen gesetzt sein, da Vite sie zur Build-Zeit einbettet. Bei eigener Domain die Produktions-URL als erlaubte Redirect-URL in Supabase hinterlegen.

---

## Klassenerkennung

`src/lib/classParser.ts` leitet aus dem Klassencode die Abteilung ab. Unterstützte Suffixe:

| Suffix        | Abteilung               |
|---------------|-------------------------|
| AHIT          | Informationstechnologie |
| AHMBA / BHMBA | Maschinenbau            |
| AHET          | Elektrotechnik          |
| AHWIM / BHWIM | Wirtschaftsingenieure   |
| AFME          | Mechatronik             |

Die Jahrgangsstufe wird aus der führenden Ziffer (1–5) des Klassencodes ermittelt.

---

> Schulprojekt für die HTL Waidhofen an der Ybbs.
