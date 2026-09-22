# AURA Edinburgh | Michelin-Starred Fine Dining Frontend

A luxury, production-grade frontend web application for **AURA**, an acclaimed two-Michelin-star fine dining restaurant situated in the historic 18th-century stone vaults of Royal Terrace, Edinburgh, Scotland.

## Tech Stack

- **Framework**: React 19 (Strict Mode)
- **Routing**: React Router v7 (`react-router-dom`) with code-splitting & lazy-loaded pages
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS v4 + Custom Luxury Design System
- **Animations**: Framer Motion 13 (Page transitions, scroll reveals, lightbox modals)
- **State & Data Fetching**: TanStack Query v5 (timeouts, skeleton loading, retries, and caching)
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **AI Concierge**: Menu-aware dining assistant with an optional server-side Gemini Flash-Lite integration

## Architectural Overview

```
src/
├── components/
│   ├── common/              # Button, Badge, Skeleton, PageHeader, ScrollToTop
│   ├── layout/              # Navbar (blur on scroll), Footer (accolades & newsletter)
│   ├── home/                # Hero, TerroirStory, FeaturedCourses, Accolades, ExperiencePreview, ReservationCTA
│   ├── menu/                # MenuFilters, DishCard, CategoryTabs
│   ├── reservations/        # MultiStep ReservationWizard, live pricing tally, confirmation voucher
│   ├── gallery/             # GalleryLightbox with responsive masonry & keyboard navigation
│   ├── contact/             # ContactForm, MapAndHours, concierge info
│   └── concierge/           # AI Dining Concierge chat panel and menu recommendations
├── context/                 # ToastContext (custom luxury animated toasts)
├── data/                    # Authentic Scottish fine dining mock dataset (terroir provenance & sommelier pairings)
├── hooks/                   # useDishes, useDish, useTastingMenus, useReviews, useGallery, useCreateReservation
├── lib/                     # utils (cn, formatCurrency), validations (Zod schemas)
├── pages/                   # Home, Menu, DishDetail, About, Gallery, Reservations, Contact, NotFound
├── types/                   # Comprehensive TypeScript definitions
├── App.tsx                  # App root with Framer Motion AnimatePresence
├── main.tsx                 # App entry point with TanStack Query & Toast providers
└── index.css                # Tailwind CSS v4 theme tokens, glassmorphism & typography
```

## AI Dining Concierge

The floating concierge is available immediately using the verified local menu dataset. To enable Gemini-powered responses, add `GEMINI_API_KEY` to `backend/.env` and restart the backend. The key remains server-side. The default model is `gemini-3.5-flash-lite`; without a key, the endpoint returns grounded local recommendations instead.

## Demo mode

Normal operation reports backend failures to the user instead of fabricating reservations or availability. To intentionally run the standalone mock-data experience, copy `.env.example` to `.env` and set `VITE_DEMO_MODE=true`.

## Available Scripts

- `npm run dev`: Start the local Vite development server
- `npm run build`: Type-check with TypeScript compiler and build the optimized production bundle
- `npm run preview`: Preview the production build locally
