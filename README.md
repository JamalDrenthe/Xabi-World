# Xabi World

Een interactief financieel dashboard gebouwd met React, TypeScript en Vite. De applicatie presenteert bankinformatie in een overzichtelijke interface met dashboards, transacties, rekeningen, investeringen, creditcards, leningen, diensten en instellingen.

## Functionaliteiten

- Dashboardoverzicht met saldo's, kaarten, recente transacties en financiële grafieken.
- Transactieoverzicht met filters voor alle transacties, inkomsten en uitgaven.
- Rekeningenoverzicht met debit- en creditinformatie.
- Investeringspagina met jaaroverzicht en maandelijkse omzetgrafieken.
- Creditcardbeheer met kaartoverzicht, uitgavenanalyse en kaartacties.
- Leningenoverzicht met leenproducten en terugbetalingsacties.
- Dienstenoverzicht voor bank- en aanvullende diensten.
- Instellingen voor profiel, voorkeuren en beveiliging.
- Responsieve navigatie met mobiele sidebar.
- Schakelbare lichte en donkere weergave.
- Toastmeldingen voor acties in de interface.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-achtige componenten op basis van Radix UI
- Chart.js en `react-chartjs-2`
- Lucide React voor iconen
- Sonner voor meldingen
- ESLint

## Lokaal starten

### Vereisten

- Node.js 20 of nieuwer
- npm

### Installatie

```bash
npm install
```

### Ontwikkelserver

```bash
npm run dev
```

De ontwikkelserver is daarna beschikbaar op de URL die Vite in de terminal toont, standaard `http://localhost:5173`.

### Productiebuild lokaal bekijken

```bash
npm run build
npm run preview
```

## Beschikbare scripts

| Script | Omschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-ontwikkelserver met hot module replacement. |
| `npm run build` | Controleert de TypeScript-code en maakt een productiebuild. |
| `npm run lint` | Voert ESLint uit over het project. |
| `npm run preview` | Serveert de gemaakte productiebuild lokaal. |

## Projectstructuur

```text
.
├── src/
│   ├── components/       Herbruikbare layout- en UI-componenten
│   │   └── ui/            Basiscomponenten voor de interface
│   ├── hooks/             React-hooks, waaronder responsive gedrag
│   ├── lib/               Gedeelde hulpfuncties
│   ├── sections/          Dashboardpagina's en financiële secties
│   ├── App.tsx            Hoofdcomponent en sectienavigatie
│   ├── App.css            App-specifieke stijlen
│   ├── index.css          Globale stijlen en themadefinities
│   └── main.tsx           Ingangspunt van de React-applicatie
├── index.html             HTML-shell van de applicatie
├── package.json           Scripts en dependencies
├── tailwind.config.js     Tailwind-configuratie
├── vite.config.ts         Vite-configuratie
└── tsconfig*.json         TypeScript-configuratie
```

## Status

Xabi World is een frontendprototype met lokale voorbeelddata. De interacties en meldingen demonstreren de gebruikerservaring; er is momenteel geen gekoppelde backend of externe databron.
