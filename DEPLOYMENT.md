# CoupleUp — Deployment Guide

This guide walks you through everything needed to take CoupleUp from code to a live URL. Read it top to bottom before starting.

---

## 1. What Still Needs to Be Done Before You Can Go Live

| # | Task | Where |
|---|------|--------|
| 1 | Register a Meta Developer app and get Instagram OAuth credentials | [developers.facebook.com](https://developers.facebook.com) |
| 2 | Provision a PostgreSQL database | Neon / Supabase / Railway (all free tiers available) |
| 3 | Run the Prisma database migration | `npx prisma migrate deploy` |
| 4 | Set environment variables on your hosting platform | Vercel dashboard |
| 5 | Deploy the Next.js app | Vercel (recommended) |
| 6 | Point a domain at the deployment | Vercel / your registrar |
| 7 | Add your live callback URL to your Meta app | developers.facebook.com |

---

## 2. Instagram OAuth Setup (Meta Developer App)

CoupleUp uses Instagram's **Basic Display API**. You need a Facebook/Meta developer account.

### Step-by-step

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App**.
2. Choose **"Consumer"** as the app type.
3. Fill in the app name (`CoupleUp`) and contact email.
4. In the left sidebar go to **Add a Product → Instagram Basic Display → Set Up**.
5. Under **Instagram Basic Display → Basic Display**:
   - **Valid OAuth Redirect URIs**: `https://your-domain.com/api/auth/callback/instagram`
   - **Deauthorize Callback URL**: `https://your-domain.com/api/auth/signout`
   - **Data Deletion Request URL**: `https://your-domain.com/api/auth/signout`
6. Click **Save Changes**.
7. Go to **App Review → Permissions and Features**. Request:
   - `instagram_graph_user_profile` — required to read name, username, and profile photo
8. Under **Basic Display → User Token Generator**, add yourself as a test user.
9. Copy your **Instagram App ID** and **Instagram App Secret** — these become `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET`.

> **Note:** Until your app passes Meta review, only added test users can log in. You can start testing immediately with your own Instagram account added as a tester.

---

## 3. Database Setup (Neon — Recommended Free Option)

### Option A: Neon (serverless Postgres, generous free tier)

1. Go to [neon.tech](https://neon.tech) → **Sign up → New Project**.
2. Choose a region close to your users (e.g. `eu-west-1` for India/Europe).
3. Copy the **Connection String** — it looks like:
   ```
   postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Paste it as `DATABASE_URL` in your environment variables (see Section 4).

### Option B: Supabase

1. [supabase.com](https://supabase.com) → **New Project**.
2. Go to **Settings → Database → Connection String → URI**.
3. Copy the URI. Replace `[YOUR-PASSWORD]` with your project password.

### Option C: Railway

1. [railway.app](https://railway.app) → **New Project → Add PostgreSQL**.
2. Click the Postgres service → **Connect** tab → copy **DATABASE_URL**.

---

## 4. Environment Variables

Create a `.env` file locally (never commit it — it's in `.gitignore`). On Vercel, add these under **Project Settings → Environment Variables**.

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/coupleup?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"        # exact public URL of your app
NEXTAUTH_SECRET="a-random-32-char-secret"     # generate with: openssl rand -base64 32

# Instagram OAuth (from Meta Developer Console)
INSTAGRAM_CLIENT_ID="your-instagram-app-id"
INSTAGRAM_CLIENT_SECRET="your-instagram-app-secret"

# T&C version (increment this when you update terms to re-prompt users)
TC_VERSION="1.0"
```

**Generate a strong `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

---

## 5. Running the Database Migration

After setting `DATABASE_URL`, run:

```bash
# Locally (first time setup)
npx prisma migrate dev --name init

# On CI / production (uses existing migrations, never prompts)
npx prisma migrate deploy

# Verify the schema was applied
npx prisma studio   # opens a local browser GUI to inspect your tables
```

This creates all tables: `users`, `user_profiles`, `couples`, `votes`, `daily_vote_counts`, `reports`, `consent_records`.

---

## 6. Deploying to Vercel (Recommended)

Vercel is the easiest host for Next.js apps — zero config required.

### First deploy

1. Push this repo to GitHub (it already is — just ensure `main` branch has the latest).
2. Go to [vercel.com](https://vercel.com) → **Add New Project → Import Git Repository**.
3. Select `ultramagnus23/CoupleUP`.
4. Under **Environment Variables**, add all variables from Section 4.
5. Click **Deploy**. Vercel auto-detects Next.js and builds it.
6. After the first deploy, copy the generated URL (e.g. `https://coupleup.vercel.app`).
7. Set `NEXTAUTH_URL` to that URL in Vercel's environment variables, then **redeploy**.

### Add a custom domain (optional)

1. In Vercel project → **Settings → Domains → Add**.
2. Follow DNS instructions for your registrar.
3. Update `NEXTAUTH_URL` to your custom domain.

### Run the DB migration after deploy

In your local terminal (with `DATABASE_URL` pointing to production):
```bash
npx prisma migrate deploy
```

Or add it as a **Build Command** override in Vercel:
```
npx prisma migrate deploy && next build
```

---

## 7. Post-Deploy Checklist

- [ ] Visit `https://your-domain.com` — landing page loads
- [ ] Click "Continue with Instagram" — redirected to Instagram login
- [ ] Log in with a test Instagram account — redirected to `/consent`
- [ ] Check all 3 boxes → "I Agree" → redirected to `/setup`
- [ ] Complete setup → redirected to `/feed`
- [ ] Feed shows (empty initially) → no errors in browser console
- [ ] Visit `/terms` and `/privacy` — both render fully
- [ ] Visit `/leaderboard` — page loads
- [ ] Add a second test Instagram user → they should be auto-matched after setup
- [ ] Vote on a couple card → vote count increments
- [ ] Check `/my-couples` → couple appears
- [ ] Check `/settings` → preferences editable, account deletion works

---

## 8. Local Development Setup

```bash
# 1. Clone repo
git clone https://github.com/ultramagnus23/CoupleUP.git
cd CoupleUP

# 2. Install dependencies
npm install

# 3. Copy and fill in env vars
cp .env.example .env
# Edit .env with your values

# 4. Run DB migration
npx prisma migrate dev --name init

# 5. Start dev server
npm run dev
# Opens at http://localhost:3000
```

For Instagram OAuth to work locally, add `http://localhost:3000/api/auth/callback/instagram` to your Meta app's **Valid OAuth Redirect URIs**.

---

## 9. What Was Built (Implementation Summary)

### Core Engine (no DB dependencies, fully tested)
| Module | File | Status |
|--------|------|--------|
| Numerology Engine | `src/lib/numerology.ts` | ✅ Built + 13 unit tests |
| Compatibility Calculator | `src/lib/compatibility.ts` | ✅ Built + 8 unit tests |
| Matching Engine | `src/lib/matching.ts` | ✅ Built |

### API Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `POST /api/consent` | Record consent, create user | ✅ |
| `POST /api/setup` | Save gender/DOB/name, run matching | ✅ |
| `PUT /api/setup` | Save optional profile data | ✅ |
| `GET /api/feed` | Paginated couple cards | ✅ |
| `POST /api/vote` | Cast a vote (daily limit enforced) | ✅ |
| `GET /api/leaderboard` | Top 50 by period | ✅ |
| `GET /api/my-couples` | User's own couples + stats | ✅ |
| `DELETE /api/my-couples` | Leave a couple | ✅ |
| `POST /api/report` | Report a couple (auto-hides at 5) | ✅ |
| `GET/PUT/DELETE /api/settings` | Read/update/delete account | ✅ |
| `GET /api/me` | Current session user data | ✅ |

### Pages
| Route | Page | Status |
|-------|------|--------|
| `/` | Landing — Instagram OAuth CTA | ✅ |
| `/consent` | 3-checkbox legal consent gate | ✅ |
| `/setup` | 2-step profile + numerology setup | ✅ |
| `/feed` | Voting feed, infinite scroll, filter bar | ✅ |
| `/leaderboard` | Top 50 with gold/silver/bronze | ✅ |
| `/my-couples` | Personal dashboard + numerology profile | ✅ |
| `/settings` | Preferences, account deletion | ✅ |
| `/terms` | Full 12-section T&C | ✅ |
| `/privacy` | Privacy Policy | ✅ |

### What Is NOT Built (Out of Scope / V2)
- **Email notifications** — no email provider integrated. Plug in Resend or SendGrid to `src/lib/email.ts` and call it from the matching engine.
- **Admin moderation dashboard** — reports are stored in DB; build `/admin` behind auth for reviewing them.
- **Push notifications** — requires a service worker and a push service (e.g. web-push or OneSignal).
- **Share as image** — generating a couple card image (e.g. with `@vercel/og`) for social sharing.
- **Instagram token refresh** — long-lived tokens expire in 60 days; add a cron job to refresh them via the Instagram API.
- **Real-time vote counter** — currently polling; can upgrade to Server-Sent Events or WebSockets.
- **V2 blended matching** — profile data + numerology weighted blend (infrastructure is there, logic is not).

---

## 10. Frequently Asked Questions

**Q: Do I need Meta app review before going live?**  
A: Not for testing — you can add up to 25 Instagram test users without review. For a full public launch you need to submit for `instagram_graph_user_profile` permission review. Meta typically approves this within 5 business days if your privacy policy is clear (ours is at `/privacy`).

**Q: Can I test without a real Instagram account?**  
A: No. Instagram does not provide a sandbox with fake accounts. Use your own Instagram account and add it as a test user in the Meta Developer console.

**Q: The feed is empty — why?**  
A: Matches are only created after at least 2 users complete setup with compatible preferences. In a fresh DB, add 2 test accounts with opposite preferences (e.g. Male/interested in Women and Female/interested in Men) and complete setup for both.

**Q: How do I run tests?**  
```bash
npm test
# 21 tests covering numerology + compatibility — all should pass
```

**Q: How do I view the database?**  
```bash
npx prisma studio
# Opens http://localhost:5555 — visual table browser
```
