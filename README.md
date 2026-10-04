# Vikash Rana Interiors - Portfolio Website

Fully dynamic, mobile-first portfolio for interior designer Vikash Rana (MERN stack) with an admin panel.
All content (hero, about, projects, services, testimonials, contact details, footer, SEO) can be changed from the admin panel.

## Tech
- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Framer Motion
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, Cloudinary (images)

## Folder structure
```
Backend/   REST API
Frontend/  Public website + admin panel (/admin)
```

## Local setup

### 1. Backend
```bash
cd Backend
cp .env.example .env      # then fill in your own values
npm install
npm run seed              # creates the admin user (from ADMIN_EMAIL / ADMIN_PASSWORD)
npm run seed:demo         # (optional) adds starter hero, about, services and skills
npm run dev               # http://localhost:5000
```

Required in `.env`:
| Key | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string (32+ characters) |
| `CLOUDINARY_*` | Cloud name, API key and API secret from the Cloudinary dashboard |
| `CLIENT_URL` | Frontend URL, exactly as it appears in the browser (several URLs can be separated by commas) |
| `GEMINI_API_KEY` | For the AI Tools page (free key from Google AI Studio). Without it, the AI tools show as unavailable |
| `GEMINI_MODEL` | (optional) defaults to `gemini-flash-latest` |
| `NODE_ENV` | Set to `production` on the live server (hides error stack traces) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Only used by `npm run seed` |

### 2. Frontend
```bash
cd Frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

### 3. Admin panel
Log in at `http://localhost:5173/admin/login`. From there you can manage:
- **Hero Section:** banner image, heading, subheading, button
- **About:** photo, bio, stats
- **Projects:** add/edit/delete, gallery, Featured and Published in one tap
- **Gallery, Skills, AI Tools, Resume & PDFs:** add/edit/delete, Show/Hide in one tap
- **Services / Testimonials:** add/edit/delete, Show/Hide in one tap
- **Messages:** contact form messages, search, unread filter, mark all read
- **Activity Monitor:** visits, logins and admin activity
- **Settings:** site name, logo, phone, WhatsApp, email, address, working hours, map, social links, footer tagline, SEO, password

## Deploy

### Backend (Render / Railway)
- Root directory: `Backend`
- Build: `npm install`  |  Start: `npm start`
- Environment variables: the same as in `.env`. Set `CLIENT_URL` to your Vercel/Netlify site URL (domain only, e.g. `https://your-site.vercel.app`, with no trailing path).
- After the first deploy, run `npm run seed` from the Shell.

### Frontend (Vercel / Netlify)
- Root directory: `Frontend`
- Build: `npm run build`  |  Output: `dist`
- Environment variable: `VITE_API_URL=https://<your-backend>/api`
- `vercel.json` and `public/_redirects` are already included, so refreshing a page will not give a 404.

> On free hosting, the first visit after the server has been idle for a while can take ~1 minute.
> The site shows a "Waking up the server" note during that time.

## Features
- Mobile-first layout (from 320px), touch-friendly 44px buttons, notch/safe-area support
- Swipe on phones: project gallery, testimonials, category filter
- Responsive optimized images (Cloudinary srcset), lazy loading
- Separate SEO title/description/share image for every page
- 404 page, project Previous/Next, related projects, Share, Enquire button
- Security: login rate limit (10 / 15 min), contact form limit + spam trap, whitelisted updates, JWT auth