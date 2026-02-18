# Ghost Kitchen AI Voice Orchestrator

A full-stack application for taking AI voice orders and displaying them on a real-time kitchen dashboard.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Supabase
- **AI**: Retell AI

## Setup

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Retell AI Account

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=3000
   ```
4. `npm run dev` (Ensure you add a dev script to package.json: `"dev": "nodemon src/index.ts"`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. `npm run dev`

## Deployment
- Backend: Render (Web Service)
- Frontend: Vercel
