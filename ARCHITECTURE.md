# Ô Diên One — Architecture

> Community digital platform celebrating the first anniversary of Ô Diên commune (01/07/2026).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | Firebase (Auth, Firestore, Storage) |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| QR | qrcode |
| Export | html-to-image |
| Deploy | Vercel |

## Directory Structure (Feature-First)

```
odienone/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx              # Home / Hero
│   │   ├── citizen-card/         # Feature 1
│   │   ├── passport/             # Feature 2
│   │   ├── quiz/                 # Feature 3
│   │   └── time-capsule/         # Feature 4
│   ├── admin/                    # Admin panel (protected)
│   ├── api/                      # API routes (OG images, webhooks)
│   ├── layout.tsx
│   └── globals.css
│
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Header, Footer, Nav
│   ├── effects/                  # Confetti, Fireworks, Countdown
│   └── shared/                   # Cards, Glass panels, Stats
│
├── features/                     # Feature modules (domain logic + UI)
│   ├── citizen-card/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types.ts
│   ├── passport/
│   ├── quiz/
│   ├── time-capsule/
│   ├── admin/
│   └── home/
│
├── lib/                          # Core utilities
│   ├── firebase/                 # Firebase client & admin SDK
│   ├── utils.ts                  # cn(), formatters
│   ├── constants.ts              # App-wide constants
│   └── seo.ts                    # Metadata helpers
│
├── hooks/                        # Global custom hooks
├── types/                        # Global TypeScript types
├── services/                     # Cross-feature services
├── actions/                      # Server Actions
│
├── public/                       # Static assets, PWA manifest
└── docs/                         # Architecture & schema docs
```

## Feature Module Convention

Each feature under `features/` follows:

```
features/<name>/
├── components/     # Feature-specific React components
├── hooks/          # Feature-specific hooks
├── schemas/        # Zod validation schemas
├── services/       # Firebase CRUD & business logic
├── types.ts        # Feature domain types
└── index.ts        # Public API barrel export
```

## Database Schema (Firestore)

### Collections

| Collection | Purpose |
|------------|---------|
| `profiles` | User profile linked to Firebase Auth |
| `citizen_cards` | Generated citizen cards |
| `passport_locations` | ~20 stamp locations with QR data |
| `passport_scans` | User scan records (userId + locationId) |
| `quiz_questions` | Quiz question bank |
| `quiz_answers` | Answer options per question |
| `quiz_results` | User quiz submissions & scores |
| `capsules` | Time capsule messages |
| `badges` | Badge definitions |
| `user_badges` | Earned badges per user |
| `analytics` | Aggregated event counters |

### Document Shapes

```typescript
// profiles/{uid}
{
  uid: string
  displayName: string
  email?: string
  village?: string
  avatarUrl?: string
  role: 'user' | 'admin'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// citizen_cards/{id}
{
  id: string
  userId?: string
  citizenId: string          // e.g. OD-2026-00001
  fullName: string
  birthday: string
  village: string
  avatarUrl: string
  issueDate: string        // 01/07/2026
  qrCodeUrl: string
  profileSlug: string        // public profile URL slug
  createdAt: Timestamp
}

// passport_locations/{id}
{
  id: string
  name: string
  nameVi: string
  description: string
  category: 'government' | 'education' | 'culture' | 'nature' | 'commerce'
  qrSecret: string           // HMAC token for scan validation
  badgeId?: string
  order: number
  isActive: boolean
  coordinates?: { lat: number; lng: number }
}

// passport_scans/{id}
{
  id: string
  userId: string
  locationId: string
  scannedAt: Timestamp
}

// quiz_questions/{id}
{
  id: string
  question: string
  category: 'food' | 'history' | 'landmarks' | 'daily' | 'dialect' | 'festival'
  order: number
  isActive: boolean
}

// quiz_answers/{id}
{
  id: string
  questionId: string
  text: string
  score: number              // points toward Ô Diên percentage
  order: number
}

// quiz_results/{id}
{
  id: string
  userId?: string
  displayName?: string
  answers: { questionId: string; answerId: string }[]
  score: number              // 0-100
  title: string              // e.g. "Ô Diên Chính Hiệu"
  posterUrl?: string
  createdAt: Timestamp
}

// capsules/{id}
{
  id: string
  userId?: string
  authorName: string
  village: string
  title: string
  message: string
  photoUrl?: string
  isAnonymous: boolean
  visibility: 'public' | 'private'
  status: 'pending' | 'approved' | 'rejected'
  milestone: 'future' | string  // no fixed open date
  unlockDate?: string           // legacy documents only
  createdAt: Timestamp
}

// badges/{id}
{
  id: string
  name: string
  nameVi: string
  description: string
  icon: string
  requirement: { type: string; value: number }
}

// user_badges/{id}
{
  id: string
  userId: string
  badgeId: string
  earnedAt: Timestamp
}

// analytics/summary
{
  citizenCards: number
  messages: number
  passportLocations: number
  quizResults: number
  lastUpdated: Timestamp
}
```

## Authentication Strategy

- **Public features**: Citizen Card, Quiz, Time Capsule work without login (optional anonymous Firebase Auth)
- **Passport**: Requires Firebase Auth to track stamps across devices
- **Admin**: Firebase Auth with custom claim `role: admin` or Firestore `profiles.role === 'admin'`

## Data Flow

```
User Action → React Component → Server Action / Service → Firebase
                    ↓
              TanStack Query (cache & sync)
                    ↓
              UI Update + Animations
```

## Route Map

| Route | Feature | Auth |
|-------|---------|------|
| `/` | Home | Public |
| `/citizen-card` | Citizen Card Generator | Public |
| `/citizen-card/[slug]` | Public Profile | Public |
| `/passport` | Passport Collection | Required |
| `/passport/scan/[locationId]` | QR Scan Handler | Required |
| `/quiz` | Quiz | Public |
| `/quiz/result/[id]` | Quiz Result Poster | Public |
| `/time-capsule` | Time Capsule | Public |
| `/admin` | Admin Dashboard | Admin |
| `/admin/*` | Admin sub-pages | Admin |

## Theme Tokens

```css
--primary-red: #C41E3A
--primary-gold: #D4AF37
--primary-white: #FAFAFA
--glass-bg: rgba(255, 255, 255, 0.08)
--glass-border: rgba(255, 255, 255, 0.15)
```

## Badge Unlock Rules

| Badge | Requirement |
|-------|-------------|
| Explorer | Visit 5 locations |
| Historian | Visit all cultural/historical sites |
| Pioneer | First 100 passport holders |
| First Anniversary | Visit all 20 locations |

## Deployment

- **Platform**: Vercel
- **Env vars**: Firebase config, admin credentials
- **PWA**: next-pwa or manual service worker
- **OG Images**: `@vercel/og` dynamic generation

## Phase Roadmap

1. ✅ Architecture & folders
2. Project initialization
3. Layout & theme
4. Citizen Card
5. Passport
6. Quiz
7. Time Capsule
8. ✅ Admin Dashboard
9. Testing
10. Deployment
