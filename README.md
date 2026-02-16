# Karsilo

A multi-entity business analytics and payment management platform built for organizations that need centralized visibility across their Stripe-connected accounts.

## Overview

Karsilo is a B2B SaaS dashboard that aggregates payment data, revenue analytics, and customer insights from multiple Stripe accounts into a single unified interface. It's designed for organizations managing several business entities, product lines, or subsidiaries — each with their own Stripe account — who need a consolidated view of their financial operations.

The platform handles Stripe Connect OAuth, real-time data synchronization via Firebase, role-based team access, and automated report generation.

## Features

### Payment Analytics & Revenue Tracking
- Real-time balance and revenue dashboards with interactive charts (Recharts)
- Multiple chart modes: revenue, payment count, volume, and earnings
- Time-range filtering (week, month, year, all-time)
- Currency and entity-based filtering for granular analysis
- Balance transaction history with detailed breakdowns

### Multi-Entity Management
- Connect and manage multiple Stripe accounts through OAuth
- Per-entity product catalogs, customer lists, and charge history
- Top products visualization by transaction volume
- Entity-level filtering across all analytics views

### Team & Organization Management
- Role-based access control with four levels: Viewer, Member, Admin, Owner
- Invite-based team onboarding
- Organization settings with branding and logo support
- Multi-step onboarding flow for new organizations

### Customer & Product Insights
- Customer listing and management pulled from Stripe
- Product performance tracking (transaction counts, revenue)
- Refund tracking and management
- Invoice and charge history with payment method details

### Reports & Compliance
- Automated Stripe report generation (17+ report types including balance, payout reconciliation)
- Subscription-tier-based history limits
- API endpoints for programmatic report access

### Security
- Firebase Authentication with email/password
- JWT-based sessions via NextAuth.js (7-day expiration with auto-refresh)
- AES-256-GCM encryption for stored OAuth tokens (PBKDF2 key derivation, 100k iterations)
- CSRF protection on all OAuth flows

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5.9 |
| Monorepo | Turborepo, pnpm workspaces |
| UI | Chakra UI v3, Tailwind CSS, Emotion |
| Auth | NextAuth.js, Firebase Auth |
| Database | Firebase Firestore |
| Payments | Stripe Connect OAuth, Stripe API |
| Charts | Recharts, Chakra UI Charts |
| Jobs | Node.js background processors (reports, email digests) |
| Icons | Lucide React, React Icons |

## Subscription Tiers

| Feature | Free | Starter | Growth | Pro |
|---------|------|---------|--------|-----|
| Members | 1 | 3 | 5 | 15 |
| Entities | 1 | 3 | 10 | 20 |
| History | 1 month | 1 year | 3 years | Unlimited |
| API Access | — | — | Yes | Yes |


## Architecture Notes

**Data fetching** — Custom React hooks (`useCharges`, `useProducts`, `useCustomers`, etc.) handle Firestore queries with session-storage caching, pagination, loading states, and automatic refetch.

**Auth flow** — Users authenticate via Firebase email/password. NextAuth wraps this in a JWT session persisted in HTTP-only cookies. Client-side token refresh runs every 50 minutes to stay ahead of the 60-minute Firebase token expiration.

**Stripe integration** — Organizations connect Stripe accounts through OAuth. Access tokens are encrypted at rest with AES-256-GCM. The app reads charges, customers, products, invoices, and balance data through the Stripe API using these stored credentials.

**Monorepo** — Turborepo orchestrates builds across apps and shared packages. Common types, Firebase utilities, Stripe helpers, and UI components live in `packages/` to avoid duplication.
