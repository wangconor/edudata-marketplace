# EduData Marketplace

A platform that connects schools with funding through anonymous student surveys. Students complete surveys about consumer preferences and habits, generating anonymized datasets that companies can purchase — with proceeds going directly back to participating schools.

Built for the **2024 Congressional App Challenge**.

## How It Works

1. A student opens the mobile app and selects their school
2. They browse available surveys (e.g. "Favorite Shoe Brands", "Media Consumption Habits")
3. They answer multiple-choice questions anonymously
4. Their responses are aggregated with classmates' data
5. Companies purchase the anonymized school-level datasets
6. Revenue flows back to the school

## Repository Structure

```
edudata-marketplace/
├── backend/          # FastAPI REST API
├── student-app/      # Expo React Native mobile app
└── company-dashboard/  # React web dashboard for companies
```

## Components

### Backend (`/backend`)
A Python REST API built with **FastAPI** and **Supabase** (PostgreSQL).

**Endpoints:**
- `GET /schools` — list all participating schools
- `GET /surveys` — all surveys with questions and answer choices
- `POST /submit` — submit an anonymous survey response
- `GET /results/{survey_title}/{school_id}` — aggregated results for a school
- `GET /leaderboard/{survey_title}` — schools ranked by participation count

**Setup:**
```bash
pip install fastapi uvicorn supabase python-dotenv
cp .env.example .env  # add your Supabase credentials
uvicorn main:app --reload
```

### Student App (`/student-app`)
A cross-platform mobile app built with **Expo** and **React Native**.

Students select their school, browse available surveys, and submit responses. The app fetches live data from the backend API.

**Setup:**
```bash
cd student-app
npm install
npx expo start
```

### Company Dashboard (`/company-dashboard`)
A **React** web app where companies can browse available datasets, view survey categories, and purchase school-level data.

**Setup:**
```bash
cd company-dashboard
npm install
npm start
```

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo Router |
| Backend | Python, FastAPI |
| Database | Supabase (PostgreSQL) |
| Web Dashboard | React |

## Environment Variables

The backend requires a `.env` file in `/backend`:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit this file. See `.gitignore`.
