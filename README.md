# Shrawan OS — Interactive Operating System Portfolio

An interactive, OS-inspired personal portfolio built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase**. It delivers a full desktop windowing experience on larger screens and automatically adapts into a native-inspired mobile OS interface on smartphones.

- **Live Website:** [https://shrawankarki.com.np](https://shrawankarki.com.np)
- **Author:** Shrawan Karki (Pratyush Karki) — [GitHub](https://github.com/Frontend-fuchhey) · [LinkedIn](https://www.linkedin.com/in/shrawan-karki-187706428/)

---

## Features

- **Adaptive Dual-OS Interface**
  - **Desktop Mode:** macOS-inspired window manager with draggable/minimizable windows, top status bar, desktop widgets, and magnification dock.
  - **Mobile Mode:** Android-inspired status bar, home screen clock widget, app grid, and gesture navigation.
- **Built-in Applications**
  - **About Me:** Biography, education timeline, skills, and achievements.
  - **Projects Explorer:** Categorized showcase of projects with architecture breakdowns, screenshots, and live/source links.
  - **Photo Gallery:** Categorized gallery moments with real-time database updates.
  - **Terminal (`shrawan@portfolio`):** Interactive CLI supporting system commands, natural-language AI portfolio queries, and `sudo admin` authentication.
  - **Resume:** Interactive CV viewer with one-click PDF download.
  - **Contact:** Direct messaging with automated email notifications (Gmail SMTP + Web3Forms fallback).
  - **Settings:** Live wallpaper customization and appearance controls.
  - **Tic Tac Toe:** Built-in mini-game with difficulty modes.
- **Live Admin Content Management (`/admin`)**
  - Triggered directly from the terminal via `sudo admin` (Google OAuth + Firestore Admin Verification or Database Passkey).
  - Opens in a standalone tab to add, edit, or delete **Projects**, **Gallery Photos**, and **Database Passkeys** in real time via Cloud Firestore without redeploying.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Styling & Motion** | Tailwind CSS 4, Framer Motion, Lucide Icons |
| **Backend & Database** | Firebase Authentication (Google OAuth), Cloud Firestore |
| **Serverless & Email** | Netlify Functions, Nodemailer (Gmail SMTP), Web3Forms |

---

## Project Structure

```text
├── android/                  # Native Android WebView wrapper & APK build script
├── netlify/
│   └── functions/
│       └── send-contact.js   # Serverless contact form & auto-reply handler
├── public/                   # Static assets, CV PDF, PWA manifest, SPA _redirects
├── src/
│   ├── assets/               # Bundled project & gallery images
│   ├── components/
│   │   ├── android/          # Mobile OS shell components (Dock, StatusBar, ClockWidget)
│   │   ├── apps/             # OS applications (About, Admin, Contact, Photos, Projects, Resume, Settings, Terminal, TicTacToe)
│   │   ├── icons/            # Custom application icons
│   │   ├── ui/               # Desktop shell & windowing UI (TopBar, Dock, Window, BootScreen, DesktopIcons)
│   │   └── ResumeView.tsx    # Embedded resume view component
│   ├── data/                 # Initial seed data, wallpapers, and user profile config
│   ├── hooks/                # Window state, live OS data subscription, and mobile detection hooks
│   ├── lib/
│   │   ├── adminAuth.ts      # Firestore administrator verification helper
│   │   ├── firebase.ts       # Firebase app, Auth, and Firestore initializer
│   │   └── portfolioDataService.ts # Real-time Firestore CRUD for projects, photos, and passkey
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Asset preloading utilities
│   ├── App.tsx               # Main OS desktop & mobile shell
│   └── main.tsx              # Entry point & standalone /admin route guard
├── .env.example              # Environment variable template
├── firestore.rules           # Cloud Firestore security rules
├── netlify.toml              # Netlify build & routing configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Frontend-fuchhey/Personal-Portfolio.git
cd Personal-Portfolio
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

The production-ready static bundle is output to the `dist/` directory.

---

## Firebase & Admin Panel Setup

1. **Authorized Domains:** In **Firebase Console → Authentication → Settings → Authorized domains**, add your production domain (e.g., `shrawankarki.com.np`, `*.netlify.app`, or `*.pages.dev`).
2. **Admin Accounts:** In **Cloud Firestore**, create collection `users` with a document ID matching your admin email (e.g., `pratyushkarki6@gmail.com`) and field `admin: true` (boolean).
3. **Database Passkey:** In **Cloud Firestore**, collection `config` → document `auth` stores `{ passkey: "..." }`, which can be updated live from the **Security & Passkey** tab inside `/admin`.
4. **Security Rules:** Publish the rules from [`firestore.rules`](./firestore.rules) in **Firebase Console → Firestore Database → Rules**.

---

## License

MIT License — see [`LICENSE.md`](./LICENSE.md) for details.
