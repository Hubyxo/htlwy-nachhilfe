# HTL Waidhofen/Ybbs – Nachhilfeplattform

Webplattform zur Vermittlung von schulinterner Nachhilfe an der HTL Waidhofen an der Ybbs. Schüler:innen melden sich mit ihrem Microsoft-Schulkonto an, durchsuchen Coaches, sehen deren Detailprofile und buchen sie für ein bestimmtes Fach. Coaches verwalten ihr Profil und bestätigen oder lehnen Buchungsanfragen ab. Termine werden anschließend direkt per E-Mail zwischen Coach und Schüler:in vereinbart.

![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

---

## Inhaltsverzeichnis

- [Schnellstart (lokal gegen bestehendes Backend)](#schnellstart-lokal-gegen-bestehendes-backend)
- [Features](#features)
- [Status & Geplant](#status--geplant)
- [Tech-Stack](#tech-stack)
- [Architektur](#architektur)
- [Projektstruktur](#projektstruktur)
- [Eigenes Backend aufsetzen](#eigenes-backend-aufsetzen)
- [Entwicklung](#entwicklung)
- [Build & Deployment](#build--deployment)
- [Klassenerkennung](#klassenerkennung)

---

## Schnellstart (lokal gegen bestehendes Backend)

Für den häufigsten Fall: Du willst das Frontend lokal laufen lassen und nutzt das **bereits eingerichtete** Supabase-Backend. Dann brauchst du **keine** eigene Supabase- oder Azure-Konfiguration – nur Projekt-URL und anon-Key.

Voraussetzung: Node LTS (mind. 18) und npm.

```bash
git clone https://github.com/Hubyxo/htlwy-nachhilfe.git
cd htlwy-nachhilfe
npm install
```

`.env` im Projekt-Root anlegen (eine Vorlage gibt es im Repo nicht):

```env
VITE_SUPABASE_URL=https://<dein-projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<dein-supabase-anon-key>
```

> Den `anon`-Key findest du im Supabase-Dashboard unter **Project Settings → API → Project API keys → `anon` `public`**. Beide Variablen müssen mit `VITE_` beginnen, sonst bindet Vite sie nicht ein. Der `anon`-Key ist öffentlich – die Absicherung erfolgt über RLS, nicht über Geheimhaltung des Keys.

```bash
npm run dev    # http://localhost:5173
```

**Zwei Stolpersteine, die nicht zu Fehlermeldungen führen:**

1. **Login funktioniert nur, wenn `http://localhost:5173` in Supabase als Redirect-URL erlaubt ist.** Eintragen unter **Authentication → URL Configuration → Redirect URLs**. Fehlt der Eintrag, kommst du nach dem Microsoft-Login nicht zurück in die App – ohne sichtbaren Fehler.
2. **Fehlende oder falsche `.env` erzeugt keinen Crash.** Der Supabase-Client fällt auf leere Werte zurück (`src/lib/supabase.ts`), die App startet normal, aber jeder Datenbankzugriff schlägt still fehl. Wenn „nichts geht", prüfe zuerst die `.env`.

> **Tipp:** `.env` steht nicht in der `.gitignore`. Vor dem ersten Commit ergänzen, damit sie nicht versehentlich eingecheckt wird:
> ```bash
> echo ".env" >> .gitignore
> ```

> **Hinweis:** Dieser Weg zeigt auf die *produktive* Supabase-Instanz. Lokale Logins legen echte Datensätze an. Für isoliertes Testen eine lokale Supabase-Instanz via CLI (`supabase start`, benötigt Docker) verwenden.

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

## Eigenes Backend aufsetzen

Wenn du eine **eigene** Supabase- und Azure-Umgebung von Grund auf aufbaust (z. B. beim Forken oder für ein separates Test-Backend), findest du die vollständige Schritt-für-Schritt-Anleitung in **[SETUP.md](./SETUP.md)** – inklusive Supabase-Projekt, Migrationen, Edge Function, Azure-Provider und Redirect-URLs.

Für reines lokales Arbeiten gegen das bestehende Backend genügt der [Schnellstart](#schnellstart-lokal-gegen-bestehendes-backend) oben.

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
