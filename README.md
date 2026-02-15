# MedAware

> Community-driven medical Q&A for **MedAware**: a place where patients ask, doctors respond, and people share from their experience — **to counter health misinformation** that circulates online and in traditional practices and can seriously impact people’s health.

## Why MedAware?

Health misinformation spreads easily, from traditional remedies to viral "advice" that can seriously harm. Wrong information in domains like cardiology, mental health, pediatrics, or general wellness can have a real, negative impact on people's health.

MedAware aims to be **a solution for that misinformation**: a place where questions get clear answers, where verified professionals can weigh in, and where the community can learn from shared experience so people can make better, safer health decisions.

---

## Features

| Feature                 | Description                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Health Feed**         | Browse, search & filter health questions by trending, newest, or unanswered                                                 |
| **AI Triage**           | Automatic category detection (Cardiology, Neurology, Dermatology…) when creating posts (optional backend: `back` / Minimax) |
| **MythShield™**         | Fact-check panels with WHO/CDC/Harvard sources on common health myths                                                       |
| **Expert Badges**       | Verified professionals (doctors, nurses) are visually distinguished                                                         |
| **Emergency Detection** | Auto-detects urgent keywords (chest pain, stroke…) and shows a banner with emergency resources                              |
| **Voting & Reactions**  | Upvote/downvote posts; react to comments with “thanked” & “informative”                                                     |
| **User Profiles**       | Editable profile with bio, location, stats, and recent activity                                                             |
| **Bookmarks**           | Save posts for later (persisted in localStorage)                                                                            |
| **Toast Notifications** | Contextual success toasts for actions                                                                                       |
| **Bottom Navigation**   | Mobile-style nav (Home, Create, Profile)                                                                                    |

---

## Seed Data — Community

The app ships with realistic mock data (e.g. Moroccan community):

| Name                        | Role                     | City       |
| --------------------------- | ------------------------ | ---------- |
| **Yassine Bennani**         | Community Member (you)   | Casablanca |
| **Dr. Karim El Fassi**      | Cardiologist ✅          | Rabat      |
| **Fatima Zahra Ouali, IDE** | Emergency Nurse ✅       | Tanger     |
| **Mohamed Amrani**          | Fitness Enthusiast       | Marrakech  |
| **Hajar Idrissi**           | Health Myth Debunker     | Fès        |
| **Omar Tazi**               | Chronic Migraine Patient | Meknès     |
| **Dr. Amine Cherkaoui, MD** | Ophthalmologist ✅       | Agadir     |
| **Salma Berrada**           | Wellness Blogger & Mom   | Oujda      |

Seed includes health posts across cardiology, neurology, dermatology, psychiatry, pediatrics, ophthalmology, and general health, plus threaded comments with expert and community responses.

---

## Screenshots

### Home Feed

|                     Trending (default)                      |                         Newest                          |                           Unanswered                            |
| :---------------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------------: |
| ![Trending](/front/public/screenshots/01_home_trending.png) | ![Newest](/front/public/screenshots/02_home_newest.png) | ![Unanswered](/front/public/screenshots/03_home_unanswered.png) |

|                         Search                          |                      Verified Pro Only                      |
| :-----------------------------------------------------: | :---------------------------------------------------------: |
| ![Search](/front/public/screenshots/04_home_search.png) | ![Pro Only](/front/public/screenshots/05_home_pro_only.png) |

### Thread View

|             Post Detail + Expert Response              |                       MythShield & Comments                       |                    Upvote Interaction                     |
| :----------------------------------------------------: | :---------------------------------------------------------------: | :-------------------------------------------------------: |
| ![Thread](/front/public/screenshots/06_thread_top.png) | ![MythShield](/front/public/screenshots/07_thread_mythshield.png) | ![Upvote](/front/public/screenshots/08_thread_upvote.png) |

### Create Post

|                       Empty Form                        |                       AI Triage Detection                       |                        Emergency Banner                         |
| :-----------------------------------------------------: | :-------------------------------------------------------------: | :-------------------------------------------------------------: |
| ![Empty](/front/public/screenshots/10_create_empty.png) | ![AI Triage](/front/public/screenshots/11_create_ai_triage.png) | ![Emergency](/front/public/screenshots/12_create_emergency.png) |

### Profile

|                       Profile View                        |                         Edit Profile Modal                         |
| :-------------------------------------------------------: | :----------------------------------------------------------------: |
| ![Profile](/front/public/screenshots/13_profile_view.png) | ![Edit Modal](/front/public/screenshots/15_profile_edit_modal.png) |

---

## What’s in this repo

| Part      | Description                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **front** | Next.js web app: health feed, create post (with AI category triage), thread view, profiles, MythShield fact-check panels, emergency detection. |
| **back**  | NestJS API (JavaScript): `POST /classify/category` for medical text classification via Minimax LLM (used by the front for AI triage).          |

## Quick start

- **Frontend**: see [front/README.md](front/README.md) for setup and run (`npm install`, `npm run dev`).
- **Backend** (optional, for AI category detection): see [back/README.md](back/README.md). Set `MINIMAX_API_KEY` in `back/.env`, then `npm run build` and `npm start` in `back/`.
