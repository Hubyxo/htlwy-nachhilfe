# HTL Nachhilfe - Microsoft Auth Setup

## Übersicht

Diese Anwendung nutzt Microsoft Azure AD für die Authentifizierung von Schülern und Lehrern der HTL Waidhofen/Ybbs.

## Wichtige Features

### Für Schüler:
- Anmeldung mit Microsoft-Konto
- Durchsuchen von verfügbaren Coaches nach Fächern
- Buchung von Coaches
- Übersicht der gebuchten Coaches
- Benachrichtigungen bei Buchungsbestätigung

### Für Coaches:
- Registrierung als Coach mit Klassenauswahl
- Verwaltung des eigenen Coach-Profils
- Übersicht der gebuchten Schüler
- Bestätigen oder Ablehnen von Buchungsanfragen
- Benachrichtigungen bei neuen Buchungen

## Azure AD Konfiguration

Die App ist bereits für die Tenant ID **6dd5291a-610e-4172-a7b6-9a7dc57e9a2a** konfiguriert.

### Fehlende Konfiguration:

Sie müssen die korrekte **Client ID** in der `.env`-Datei eintragen:

```env
VITE_AZURE_CLIENT_ID=<Ihre-Client-ID-hier>
```

Die Client ID finden Sie in Ihrem Azure Portal unter:
1. Azure Active Directory
2. App registrations
3. Ihre registrierte App
4. Overview → Application (client) ID

### Redirect URIs in Azure konfigurieren:

Stellen Sie sicher, dass in Ihrer Azure App die folgenden Redirect URIs konfiguriert sind:
- `http://localhost:5173` (für lokale Entwicklung)
- Ihre Produktions-URL (z.B. `https://ihre-domain.com`)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Datenbank

Die Supabase-Datenbank ist bereits konfiguriert mit folgenden Tabellen:
- `users` - Benutzerprofile
- `coach_profiles` - Coach-spezifische Daten
- `bookings` - Buchungen zwischen Schülern und Coaches
- `notifications` - Benachrichtigungen

## Edge Functions

- `confirm-booking` - Bestätigung/Ablehnung von Buchungen

## Erste Schritte nach Setup

1. Starten Sie die App
2. Melden Sie sich mit einem Microsoft-Konto an
3. Bei der ersten Anmeldung wird automatisch ein User-Profil erstellt
4. Wählen Sie "Nachhilfecoach werden" um sich als Coach zu registrieren
5. Geben Sie Ihre Klasse, Fächer und Verfügbarkeit an
6. Andere Schüler können Sie nun buchen

## Wichtige Hinweise

- Die erste Anmeldung erstellt automatisch einen User-Eintrag in der Datenbank
- Coaches müssen sich nach der ersten Anmeldung registrieren
- Bookings müssen von Coaches bestätigt werden
- Benachrichtigungen werden automatisch bei neuen Buchungen erstellt
