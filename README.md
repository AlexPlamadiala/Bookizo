# Bookizo - Platformă de Programări Online

Bookizo este o platformă web unde utilizatorii pot găsi saloane de beauty, frizerii și coafori, pot vedea specialiștii disponibili și își pot face programări online.

## Tech Stack

- **Next.js 16** cu App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** (ORM)
- **PostgreSQL**
- **NextAuth v5** (Auth.js) pentru autentificare
- **Zod** pentru validare
- **Lucide React** pentru iconițe

## Instalare și Configurare

### 1. Clonează proiectul

```bash
git clone <repo-url>
cd Bookizo
```

### 2. Instalează dependențele

```bash
npm install
```

### 3. Configurează variabilele de mediu

Copiază fișierul `.env.example` în `.env` și completează valorile:

```bash
cp .env.example .env
```

Editează `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bookizo"
AUTH_SECRET="genereaza-un-secret-cu-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Creează baza de date

Asigură-te că PostgreSQL rulează, apoi:

```bash
# Generează clientul Prisma
npx prisma generate

# Creează tabelele în baza de date
npx prisma db push

# Populează cu date demo
npm run db:seed
```

Sau tot într-o singură comandă:

```bash
npm run setup
```

### 5. Pornește serverul de dezvoltare

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## Conturi Demo

| Rol | Email | Parolă | Salon |
|-----|-------|--------|-------|
| Admin | admin@bookizo.ro | admin123 | Elite Barber Studio |
| Admin | admin@glamour.ro | admin123 | Glamour Hair & Beauty |
| Admin | admin@freshcuts.ro | admin123 | Fresh Cuts Unisex |
| Client | client@bookizo.ro | client123 | - |

## Structura Proiectului

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth routes + register
│   │   ├── bookings/      # CRUD programări + sloturi disponibile
│   │   ├── salons/        # CRUD saloane
│   │   ├── services/      # CRUD servicii
│   │   └── specialists/   # CRUD specialiști
│   ├── book/[salonId]/    # Pagina de programare (wizard)
│   ├── dashboard/         # Dashboard admin salon
│   │   ├── bookings/      # Gestionare programări
│   │   ├── services/      # Gestionare servicii
│   │   ├── settings/      # Setări salon
│   │   └── specialists/   # Gestionare specialiști
│   ├── login/             # Pagina de conectare
│   ├── register/          # Pagina de înregistrare
│   ├── salons/            # Lista saloane + detalii salon
│   ├── specialists/[id]/  # Pagina specialist
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Homepage
├── components/
│   ├── booking/           # Componente booking (wizard)
│   ├── layout/            # Header, Footer, Providers
│   └── ui/                # Componente UI reutilizabile
├── lib/
│   ├── auth.ts            # Configurare NextAuth
│   ├── booking.ts         # Logica de calcul sloturi disponibile
│   ├── prisma.ts          # Prisma client singleton
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Scheme Zod
└── types/
    └── next-auth.d.ts     # Type augmentation NextAuth
```

## Funcționalități

### Utilizatori (Clienți)
- Vizualizare liste saloane cu căutare
- Vizualizare detalii salon (specialiști, servicii, recenzii)
- Vizualizare profil specialist cu program
- Programare online în 4 pași (specialist → serviciu → dată/oră → confirmare)
- Calcul real al sloturilor disponibile

### Administratori Salon
- Dashboard cu overview programări
- Gestionare programări (confirmare/anulare/finalizare)
- Adăugare specialiști cu program de lucru
- Adăugare servicii cu preț și durată
- Editare informații salon

### Logica de Booking
Sistemul calculează sloturile disponibile în funcție de:
- Programul de lucru al specialistului (per zi a săptămânii)
- Durata serviciului ales
- Programările deja existente (evită suprapuneri)
- Intervale de 30 de minute

## Comenzi Utile

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Regenerate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset DB and re-seed
npm run setup        # Full setup (generate + push + seed)
```

## Deployment (Vercel)

1. Push codul pe GitHub
2. Importă proiectul în Vercel
3. Adaugă variabilele de mediu (`DATABASE_URL`, `AUTH_SECRET`)
4. Deploy

Recomandare: folosește [Neon](https://neon.tech) sau [Supabase](https://supabase.com) pentru PostgreSQL serverless.

## Extensibilitate

Proiectul este pregătit pentru:
- Plăți online (Stripe)
- Notificări email/SMS
- Sistem complet de review-uri
- Hartă cu localizare saloane
- Filtrare pe oraș/tip salon
- Upload imagini
