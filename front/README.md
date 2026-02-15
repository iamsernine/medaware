# MedAware - Frontend

A mobile-first community health Q&A platform built with **Next.js**. Ask health questions, get verified professional answers, and join a supportive medical community.

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd medaware/front

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### AI category classification

To use AI triage when creating posts, run the **back** API and set the classify URL:

- In `back/`: copy `.env.example` to `.env`, set `MINIMAX_API_KEY`, then `npm run build` and `npm start` (see [../back/README.md](../back/README.md)).
- In the front, set `NEXT_PUBLIC_CLASSIFY_API=http://localhost:3001` (or your back URL). If unset, the app falls back to regex-based category detection.

---

## Project Structure

```
front/
├── app/
│   ├── layout.js           # Root layout with ToastProvider & BottomNav
│   ├── page.js             # Home feed — search, filter, post list
│   ├── globals.css         # Design system (tokens, components, animations)
│   ├── create/
│   │   └── page.js         # Create Post — AI triage, emergency detection
│   ├── post/
│   │   └── [id]/page.js    # Thread view — comments, expert cards, MythShield
│   └── profile/
│       └── page.js         # User profile — stats, edit modal, recent posts
├── components/
│   ├── BottomNav.js        # Mobile bottom navigation
│   ├── CommentBubble.js    # Comment display with reactions & replies
│   ├── EmergencyBanner.js  # Emergency detection banner
│   ├── ExpertCard.js       # Verified professional response card
│   ├── FilterTabs.js       # Trending / Newest / Unanswered tabs
│   ├── Modal.js            # Reusable modal overlay
│   ├── MythShield.js       # Fact-check panel with sources
│   ├── PostCard.js         # Post card for the feed
│   └── VotePill.js         # Upvote/downvote pill
├── context/
│   └── ToastContext.js      # Global toast notification context
├── lib/
│   ├── db.js               # localStorage-backed database with seed data
│   └── helpers.js          # Shared utilities (timeAgo, category detection, etc.)
└── public/                 # Static assets
```

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: JavaScript (React)
- **Styling**: Vanilla CSS with custom properties
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Icons**: [Material Icons Round](https://fonts.google.com/icons)
- **Storage**: `localStorage` (no backend required for core features)

---

## Implementation Notes

### Database (`lib/db.js`)

Client-side data layer using `localStorage`:

- **Auto-seeding**: First load generates users, posts, and comments
- **CRUD**: `getPosts()`, `addPost()`, `votePost()`, `getComments()`, `addComment()`, `reactToComment()`
- **Reset**: `resetDB()` clears and re-seeds

### AI Triage

When composing a post, the description is used to suggest a category:

- If **back** is running and `NEXT_PUBLIC_CLASSIFY_API` is set: `POST /classify/category` (Minimax LLM) is used.
- Otherwise: regex-based detection in `lib/helpers.js` (CATEGORY_MAP).

### Emergency Detection

Keywords such as _chest pain_, _heart attack_, _stroke_, _can't breathe_, _seizure_, _overdose_ trigger an emergency banner with a link to find the nearest ER (e.g. Google Maps).

---

## Scripts

| Command         | Action                   |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## License

This project is for educational purposes.
