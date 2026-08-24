# Empirisys Intelligence Command

A premium Next.js 14 web application built for Empirisys Ltd, offering a unified portal for process-safety and HSE analytics intelligence.

## Features

- **Dashboard**: High-level metrics, intelligent routing search, and competitor insights.
- **Competitor Intelligence**: Sortable comparison matrix, capability threat charts, and AI-powered insights against 12 key market players.
- **Knowledge Assistant**: A sliding panel available globally, offering grounded AI chat against the Empirisys product knowledge base.
- **PDF Export**: Generate branded PDF reports instantly on every module.

## Technology Stack

- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Data Visualization**: Recharts, TanStack Table
- **PDF Export**: jsPDF + html2canvas
- **AI Integration**: Anthropic SDK (Claude 3 Opus)
- **Database**: Supabase + pgvector

## Setup Instructions

By default, the application runs perfectly in **Demo Mode**, utilizing bundled seed data and local streaming fallbacks. You do not need any API keys or databases to test the UI.

To fully enable the live AI features and database backend:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Database Initialization**
   Run the SQL provided in `supabase/schema.sql` inside your Supabase project's SQL Editor to create the necessary tables and functions.

4. **Seed Data**
   Populate the remote database with the initial dataset:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Design Notes
The application features a strict custom light-theme tailored to Empirisys, emphasizing clarity, professionalism, and modern aesthetics with carefully selected typography (Playfair Display for headlines, Inter for interface elements).

<!-- Vercel Trigger: Tue Jun 23 21:39:00 BST 2026 -->
