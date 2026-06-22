# Setup

Anleitung zum Aufsetzen der Nachhilfeplattform – vom schnellen lokalen Start bis zum vollständigen Aufbau eines eigenen Backends.

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Schnellstart: lokal gegen bestehendes Backend](#schnellstart-lokal-gegen-bestehendes-backend)
- [Umgebungsvariablen](#umgebungsvariablen)
- [npm-Skripte](#npm-skripte)
- [Eigenes Backend aufsetzen](#eigenes-backend-aufsetzen)
  - [Supabase-Projekt anlegen](#1-supabase-projekt-anlegen)
  - [Migrationen einspielen](#2-migrationen-einspielen)
  - [Edge Function deployen](#3-edge-function-deployen)
  - [Azure AD konfigurieren](#4-azure-ad-konfigurieren)
  - [Redirect-URLs setzen](#5-redirect-urls-setzen)
- [Wie der Login funktioniert](#wie-der-login-funktioniert)
- [Lokale Supabase-Instanz (optional)](#lokale-supabase-instanz-optional)
- [Build & Deployment](#build--deployment)
- [Häufige Probleme](#häufige-probleme)

---

## Voraussetzungen

- **Node.js** (LTS, mindestens Version 18 – Vite 5 setzt Node ≥ 18 voraus) und **npm**
- **Git**
- Für ein eigenes Backend zusätzlich:
  - ein [Supabase](https://supabase.com/)-Projekt
  - eine registrierte App in [Azure AD / Microsoft Entra](https://entra.microsoft.com/)
  - die [Supabase CLI](https://supabase.com/docs/guides/cli) (für Migrationen und Edge Functions)

---

## Schnellstart: lokal gegen bestehendes Backend

Der häufigste Fall: Du willst nur das Frontend lokal laufen lassen und nutzt das **bereits eingerichtete** Supabase-Backend. Dann brauchst du keine eigene Supabase- oder Azure-Konfiguration, sondern nur Projekt-URL und anon-Key.

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

Den `anon`-Key findest du im Supabase-Dashboard unter **Project Settings → API → Project API keys → `anon` `public`**.

Dev-Server starten:

```bash
npm run dev    # http://localhost:5173
```

Bevor der Login klappt, muss `http://localhost:5173` in Supabase als Redirect-URL erlaubt sein – siehe [Redirect-URLs setzen](#5-redirect-urls-setzen).

> **`.env` nicht committen.** Die Datei steht nicht in der `.gitignore` (die Vite-Default ignoriert nur `*.local`). Vor dem ersten Commit ergänzen:
> ```bash
> echo ".env" >> .gitignore
> ```

---

## Umgebungsvariablen

Es werden im Frontend nur diese beiden Variablen gelesen (`src/lib/supabase.ts`):

| Variable                  | Beschreibung                                              |
|---------------------------|----------------------------------------------------------|
| `VITE_SUPABASE_URL`       | URL des Supabase-Projekts (`https://<ref>.supabase.co`)  |
| `VITE_SUPABASE_ANON_KEY`  | Öffentlicher `anon`-Key des Projekts                     |

Hinweise:

- Alle clientseitig genutzten Variablen müssen mit `VITE_` beginnen, sonst bindet Vite sie nicht ein.
- Der `anon`-Key ist **öffentlich**. Die Absicherung erfolgt über Row Level Security (RLS), nicht über Geheimhaltung des Keys.
- Die Azure-Client-ID und das Secret werden **nicht** im Frontend gesetzt, sondern im Supabase-Dashboard beim Azure-Provider (siehe [Azure AD konfigurieren](#4-azure-ad-konfigurieren)).
- Vite bettet die Variablen zur **Build-Zeit** ein. Nach Änderungen an der `.env` den Dev-Server neu starten bzw. neu bauen.

---

## npm-Skripte

```bash
npm run dev       # Dev-Server (Vite, http://localhost:5173)
npm run lint      # ESLint
npm run build     # Produktions-Build nach dist/
npm run preview   # Produktions-Build lokal testen
```

---

## Eigenes Backend aufsetzen

Nur nötig, wenn du eine **eigene** Supabase- und Azure-Umgebung von Grund auf aufbaust (z. B. beim Forken oder für ein separates Test-Backend). Clone, `npm install` und `.env` sind identisch zum [Schnellstart](#schnellstart-lokal-gegen-bestehendes-backend) – hier kommt die Backend-seitige Einrichtung dazu.

### 1. Supabase-Projekt anlegen

Im [Supabase-Dashboard](https://supabase.com/dashboard) ein neues Projekt erstellen. URL und `anon`-Key anschließend in die `.env` eintragen (siehe [Umgebungsvariablen](#umgebungsvariablen)).

### 2. Migrationen einspielen

Die Migrationen unter `supabase/migrations/` erstellen alle Tabellen und RLS-Policies:

| Tabelle          | Zweck                                          |
|------------------|------------------------------------------------|
| `users`          | Benutzerprofile (Schüler:innen und Coaches)    |
| `coach_profiles` | Coach-spezifische Daten                        |
| `tutors`         | im Admin-Panel verwaltete Coach-Einträge       |
| `bookings`       | Buchungen zwischen Schüler:innen und Coaches   |
| `ratings`        | Bewertungen                                    |
| `notifications`  | Benachrichtigungen                             |
| `admin_sessions` | Admin-Support                                  |

Einspielen über die Supabase CLI:

```bash
supabase link --project-ref <dein-project-ref>
supabase db push
```

Der `project-ref` ist der Teil vor `.supabase.co` in deiner Projekt-URL. Alternativ lassen sich die SQL-Dateien manuell im **SQL-Editor** des Dashboards ausführen.

> **Bei einer bereits befüllten Datenbank vorsichtig sein.** Wurden Migrationen früher manuell eingespielt, kann `db push` versuchen, bereits vorhandene Objekte erneut anzulegen. Viele Migrationen sind idempotent geschrieben (`CREATE TABLE IF NOT EXISTS`, Spalten-Guards), aber prüfe im Zweifel die Migrations-History (`supabase_migrations.schema_migrations`).

### 3. Edge Function deployen

Der E-Mail-Versand bei Buchungsanfragen läuft über die Edge Function `send-email`:

```bash
supabase functions deploy send-email
```

Aufgerufen wird sie aus dem Buchungsablauf via `${VITE_SUPABASE_URL}/functions/v1/send-email`. Etwaige Secrets (z. B. ein Mail-API-Key) müssen als Function-Secrets in Supabase hinterlegt sein.

### 4. Azure AD konfigurieren

1. App in [Azure AD / Microsoft Entra](https://entra.microsoft.com/) registrieren.
2. **Application (client) ID** und ein **Client Secret** erzeugen.
3. Beides im Supabase-Dashboard unter **Authentication → Providers → Azure** eintragen und den Provider aktivieren (nicht im Frontend-`.env`).
4. In Azure als Redirect-URI die Supabase-Callback-URL hinterlegen:
   `https://<dein-projekt>.supabase.co/auth/v1/callback`

### 5. Redirect-URLs setzen

In Supabase unter **Authentication → URL Configuration** die **Site URL** und die erlaubten **Redirect URLs** setzen:

- `http://localhost:5173` – lokale Entwicklung
- die Produktions-URL, z. B. `https://nachhilfe.htlwy.com`

Fehlt die jeweilige Origin, scheitert der Login nach der Microsoft-Anmeldung – ohne sichtbare Fehlermeldung.

---

## Wie der Login funktioniert

Der Login nutzt Supabase Auth mit dem Azure-AD-Provider. In `src/contexts/AuthContext.tsx` ist das in der Funktion `signInWithAzure` gekapselt:

```ts
supabase.auth.signInWithOAuth({
  provider: 'azure',
  options: { scopes: 'email', redirectTo: window.location.origin },
});
```

Wichtig: `redirectTo` ist `window.location.origin` – also je nach Umgebung `http://localhost:5173` oder die Produktions-URL. Genau diese Origin muss in Supabase als erlaubte Redirect-URL eingetragen sein. Beim ersten erfolgreichen Login wird automatisch ein Profil in der Tabelle `users` angelegt.

Der Admin-Login läuft getrennt über E-Mail/Passwort (`supabase.auth.signInWithPassword`, `src/pages/AdminLogin.tsx`).

---

## Lokale Supabase-Instanz (optional)

Der Schnellstart zeigt auf die **produktive** Supabase-Instanz – lokale Logins legen dort echte Datensätze an. Für isoliertes Entwickeln eine lokale Instanz via CLI starten (benötigt Docker):

```bash
supabase start          # lokale Supabase-Umgebung hochfahren
supabase db reset       # Migrationen (und seed.sql, falls vorhanden) anwenden
```

`supabase start` gibt eine lokale API-URL und einen lokalen `anon`-Key aus, die du dann in die `.env` einträgst. Beachte, dass der Azure-Login gegen eine lokale Instanz zusätzliche Provider-Konfiguration erfordert.

---

## Build & Deployment

```bash
npm run build
```

Der statische Output landet in `dist/` und kann auf jedem Static-Host (z. B. Cloudflare Pages) ausgeliefert werden. Die Umgebungsvariablen müssen **vor** dem Build gesetzt sein, da Vite sie zur Build-Zeit einbettet. Bei eigener Domain die Produktions-URL als erlaubte Redirect-URL in Supabase hinterlegen.

---

## Häufige Probleme

**Die App lädt, aber nach dem Microsoft-Login lande ich nicht wieder in der App.**
Die aufrufende Origin (`http://localhost:5173` bzw. die Produktions-URL) ist nicht als Redirect-URL in Supabase eingetragen. Siehe [Redirect-URLs setzen](#5-redirect-urls-setzen).

**Die App startet, aber nichts funktioniert – keine Fehlermeldung.**
Meist eine fehlende oder falsche `.env`. Der Supabase-Client fällt bei fehlenden Variablen auf leere Werte zurück (`src/lib/supabase.ts`), wodurch die App normal lädt, aber jeder Datenbankzugriff still fehlschlägt. Zuerst die `.env` prüfen.

**`db push` meldet, dass Objekte bereits existieren.**
Die Migrations-History passt nicht zum tatsächlichen Datenbankstand. Migrations-History prüfen und ggf. bereits angewandte Migrationen als solche markieren, statt sie erneut auszuführen.

**Änderungen an der `.env` wirken nicht.**
Dev-Server nach Änderungen neu starten – Vite liest die Variablen beim Start ein.
