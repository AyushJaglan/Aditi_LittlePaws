# Animal Rescue India Platform

## Overview

A full-stack nationwide animal welfare platform for India built as a pnpm monorepo.
Connects citizens, government veterinary departments, NGOs, and animal shelters.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Forms**: react-hook-form + @hookform/resolvers
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080, served at /api)
│   └── animal-rescue-india/ # React+Vite frontend (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seeding script
```

## Key Features

1. **Injured Animal Reporting System** - Emergency reporting with GPS, photo upload, severity classification
2. **Government & Vet Dashboard** - Case management, vet assignment, treatment tracking (password: govt123)
3. **Admin Dashboard** - Full platform management (password: admin123)
4. **Animal Adoption Center** - Rescue animal listings with adoption application flow
5. **Pet Essentials Marketplace** - Store with food, toys, grooming, medicines, accessories
6. **Volunteer/NGO Registration** - Network of rescue helpers
7. **Rescue Map** - Real-time case tracking with filters by state/district/severity
8. **Treatment Records** - Case timelines with medical reports and recovery progress

## Database Schema

Tables:
- `reports` - Injury reports submitted by citizens
- `cases` - Rescue case tracking records
- `animals` - Animals available for adoption
- `adoptions` - Adoption applications
- `products` - Pet essentials marketplace products
- `volunteers` - Registered volunteers and NGOs
- `vets` - Government veterinary doctors
- `hospitals` - Government veterinary hospitals

## API Routes

All routes at `/api` prefix:
- `GET/POST /api/reports` - Injury reports
- `GET/PATCH /api/reports/:id` - Single report
- `GET/PATCH /api/cases` - Rescue cases
- `GET /api/animals` - Adoptable animals
- `POST /api/adoptions` - Apply for adoption
- `GET /api/products` - Marketplace products
- `POST /api/volunteers` - Register volunteer
- `GET /api/vets` - Veterinarians
- `GET /api/hospitals` - Hospitals
- `GET /api/stats` - Platform statistics

## Seeding

Run `pnpm --filter @workspace/scripts run seed` to populate with sample data (5 hospitals, 5 vets, 6 animals, 12 products, 3 volunteers, 2 sample cases).

## Development

- Frontend: `pnpm --filter @workspace/animal-rescue-india run dev`
- API server: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
