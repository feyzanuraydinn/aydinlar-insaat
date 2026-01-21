# Aydınlar İnşaat

Corporate website for Aydınlar İnşaat - a construction and real estate company built with Next.js 15, Prisma 7, and Tailwind CSS.

*Built this project for our family business. Love you, dad. I would say you are the best but sadly, that's me.*

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Jose (JWT)
- **File Upload:** Cloudinary
- **Email:** Resend
- **Maps:** Leaflet + OpenStreetMap
- **Animation:** GSAP
- **Forms:** React Hook Form + Zod

## Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin panel pages
│   ├── (frontend)/       # Public pages
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin components
│   ├── frontend/         # Frontend components
│   └── ui/               # Shared UI components
├── data/                 # Static data
├── hooks/                # Custom hooks
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## Setup

### Requirements

- Node.js 18+
- PostgreSQL
- Cloudinary account
- Resend account (optional)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push

# Run dev server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
JWT_SECRET="your-jwt-secret"
RESEND_API_KEY="your-resend-api-key"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Features

### Frontend
- Responsive design
- SEO optimized
- Project & property filtering
- Interactive maps
- GSAP animations

### Admin Panel
- JWT authentication
- Project management (CRUD)
- Property management (CRUD)
- Site settings management
- Cloudinary image upload

## License

This project is for personal use only.
