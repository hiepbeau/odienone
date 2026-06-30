# Firebase Setup — Ô Diên One

Project: **odienone** (`odienone.firebaseapp.com`)

## What was configured

| Item | File | Purpose |
|------|------|---------|
| Firestore rules | `firestore.rules` | Public read cards; writes via Admin SDK only |
| Storage rules | `storage.rules` | Public read avatars; writes via Admin SDK only |
| Composite indexes | `firestore.indexes.json` | Future passport & capsule queries |
| Admin SDK | `lib/firebase/admin.ts` | Secure server-side writes |
| Server Action | `actions/citizen-card.ts` | Card creation (replaces client writes) |

## 1. Enable Firebase services (Console)

Open [Firebase Console → odienone](https://console.firebase.google.com/project/odienone):

1. **Build → Firestore Database** → Create database → Production mode → region `asia-southeast1` (Singapore)

2. **Build → Authentication** → Sign-in method → **Anonymous** → Enable (required for Passport)

3. **Build → Authentication** → Sign-in method → **Email/Password** → Enable (required for Admin Dashboard)

4. Create an admin user: **Authentication → Users → Add user** (email + password)

5. Add that email to `ADMIN_EMAILS` in `.env` (comma-separated for multiple admins)

   Alternatively, set `profiles/{uid}.role` to `"admin"` in Firestore for a user who already signed in.

### Storage (optional — Blaze plan only)

Firebase **Cloud Storage requires the Blaze (pay-as-you-go) plan**. The Spark (free) plan cannot use Storage.

**You do NOT need Storage for Citizen Cards.** Avatars are compressed and saved directly in Firestore (`USE_FIREBASE_STORAGE=false`, default).

When you're ready for larger files (Time Capsule photos, etc.):

1. [Upgrade to Blaze](https://console.firebase.google.com/project/odienone/usage/details) — still free within generous quotas (5 GB storage, 1 GB/day download)
2. **Build → Storage** → Get started
3. Set `USE_FIREBASE_STORAGE=true` in `.env`
4. Run Storage CORS setup (step 4 below)

## 2. Deploy security rules

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Login
firebase login

# Deploy Firestore rules + indexes (Spark plan — no Storage required)
npm run firebase:deploy
```

Or deploy rules only:

```bash
npm run firebase:deploy:rules
```

When you upgrade to Blaze and enable Storage:

```bash
npm run firebase:deploy:storage
```

## 3. Environment variables

Your `.env` already has client + admin credentials. For **Vercel production**, add the same variables in Project Settings → Environment Variables.

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_FIREBASE_*` | Yes (all 6) |
| `FIREBASE_ADMIN_PROJECT_ID` | Yes |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Yes |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Yes (keep `\n` newlines) |
| `NEXT_PUBLIC_APP_URL` | Yes — set to your production URL |
| `ADMIN_EMAILS` | Yes for `/admin` — comma-separated admin emails |
| `USE_FIREBASE_STORAGE` | No — default `false` (Spark plan) |

**Production example:**

```
NEXT_PUBLIC_APP_URL=https://odienone.vercel.app
```

## 4. Storage CORS (only if `USE_FIREBASE_STORAGE=true`)

Required so `html-to-image` can embed Storage-hosted avatar photos in exported cards.

**Not needed on Spark plan** — data URL avatars work without CORS.

**Option A — Google Cloud SDK:**

```bash
gcloud auth login
gcloud config set project odienone
gsutil cors set docs/firebase-storage-cors.json gs://odienone.firebasestorage.app
```

**Option B — Cloud Shell** in [Google Cloud Console](https://console.cloud.google.com/storage/browser?project=odienone):

Upload `docs/firebase-storage-cors.json`, then run the `gsutil cors set` command above.

## 5. Service account permissions

The default Firebase Admin SDK service account needs:

- **Cloud Datastore User** (Firestore read/write) — required
- **Storage Admin** — only if `USE_FIREBASE_STORAGE=true`

Check: [IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=odienone) → `firebase-adminsdk-...` → Permissions.

## 6. Test locally

```bash
npm run dev
```

1. Open http://localhost:3000/citizen-card
2. Fill form + upload photo
3. Submit → card should save to Firestore `citizen_cards`
4. Open the profile link → public read should work

## 7. Verify in Console

After creating a test card:

- **Firestore** → `citizen_cards` collection → new document (avatar stored in `avatarUrl` field)
- **Firestore** → `analytics/counters` → `citizenCardSequence` incremented
- **Storage** → `avatars/` → only when `USE_FIREBASE_STORAGE=true`

## Security notes

- Never commit `.env` to git (already in `.gitignore`)
- Card creation runs on the **server** via Admin SDK — clients cannot write directly
- Rotate the service account key if it was ever exposed publicly

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Missing or insufficient permissions` | Run `npm run firebase:deploy:rules` |
| `FIREBASE_ADMIN_PRIVATE_KEY is not set` | Add admin vars to `.env.local` / Vercel |
| `7 PERMISSION_DENIED` on upload | Grant Storage Admin to service account |
| PNG download missing avatar | Run Storage CORS setup (step 4) |
| `auth/configuration-not-found` | Firebase Console → Authentication → **Get started**, then enable **Anonymous** sign-in |
| `auth/operation-not-allowed` | Authentication → Sign-in method → **Anonymous** → Enable |
| Admin login fails | Enable **Email/Password**, create user in Console, add email to `ADMIN_EMAILS` |
