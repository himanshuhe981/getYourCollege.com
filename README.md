# College Discovery Platform

A full-stack web application that helps students research, filter, and compare engineering colleges in India. Built as part of a product execution challenge to demonstrate end-to-end development capability across frontend, backend, database, and deployment.

---

## What This Project Does

Students often spend weeks manually comparing colleges across different websites. This platform consolidates that process into one place — search and filter colleges by name, location, and fee range; view detailed breakdowns of courses, placement records, and student reviews; compare up to three institutions side-by-side; and use the rank predictor to find colleges where your JEE or BITSAT score falls within historical cutoffs.

---

## Features

**College Listing and Search**
Real-time search with two filters (location and fee range). Results load in pages of twelve, with a "Load More" button for pagination. Each card shows the college name, location, annual fees in INR, rating, and latest placement percentage.

**College Detail Page**
Each college has a dedicated page with a full breakdown: courses offered with durations, year-by-year placement data visualised as a bar chart, exam cutoffs with the accepted rank range, and student reviews fetched from the database.

**College Comparison Tool**
Select up to three colleges from any page using the compare button on each card. On the Compare page, a side-by-side table shows fees, rating, placement percentage, location, and top courses. An inline search bar lets you add colleges directly from the comparison view without navigating away.

**Rank Predictor**
Enter your exam (JEE Main, JEE Advanced, BITSAT, VITEEE, MET, WBJEE) and your rank. The predictor queries the cutoff table in the database and returns every college where your rank falls within or below the historical cutoff.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **Database**: PostgreSQL hosted on Neon
- **ORM**: Prisma
- **State Management**: Zustand (for the comparison list, persisted in localStorage)
- **Animations**: Framer Motion
- **Typography**: Geist (body), Caveat (display headings)
- **Icons**: Lucide React

---

## Database Schema

The schema has five models: `College`, `Course`, `Placement`, `Cutoff`, and `Review`. Every related model cascades on delete. The database is seeded with 55 colleges covering IITs, BITS Pilani, VIT, and a large variety of state and private institutions across 15 cities in India.

---

## Getting Started

**Prerequisites**: Node.js 18 or later, a PostgreSQL database (Neon works well for free hosting).

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/college-discovery-platform.git
cd college-discovery-platform
npm install
```

Create a `.env` file in the root with your database connection string:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

Push the schema and seed the database:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

Start the development server:

```bash
npm run dev
```

The application runs at `http://localhost:3000`.

---

## Deployment

This is a unified Next.js application — there is no separate backend to deploy. Server Actions run as serverless functions automatically when deployed to Vercel.

1. Push the repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings.
4. Deploy. Vercel detects Next.js automatically and handles the build.

The Neon database is cloud-hosted and accessible from both local development and production without any changes to the connection string.

---

## Project Structure

```
src/
  actions/       Server Actions (getColleges, getCollegeById, predictColleges, searchCollegesByName)
  app/           Next.js App Router pages (/, /college/[id], /compare, /predictor)
  components/    Shared UI components (Navbar, CompareButton)
  lib/           Prisma client singleton
  store/         Zustand store for comparison state
prisma/
  schema.prisma  Database schema
  seed.ts        Data seeding script
```

---

## Notes

The rank predictor uses a straightforward query: it finds all cutoff records where the stored `maxRank` is greater than or equal to the submitted rank, meaning the user's score meets the requirement. This mirrors how actual cutoff logic works — if a college accepted up to rank 5000 last year and you have rank 3000, you qualify.

Reviews are seeded alongside colleges and are not user-submitted in this version. Adding an auth layer and a review submission form would be the logical next step.
