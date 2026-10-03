# Vikash Rana Interiors - Portfolio Website

Fully dynamic, mobile-first portfolio for interior designer Vikash Rana (MERN stack) with an admin panel.
Saara content (hero, about, projects, services, testimonials, contact details, footer, SEO) admin panel se badalta hai.

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
cp .env.example .env      # phir .env mein apni values bharo
npm install
npm run seed              # admin user banata hai (ADMIN_EMAIL / ADMIN_PASSWORD se)
npm run seed:demo         # (optional) starter hero, about aur 6 services daalta hai
npm run dev               # http://localhost:5000
```

`.env` mein chahiye:
| Key | Kya hai |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Lamba random string (32+ characters) |
| `CLOUDINARY_*` | Cloudinary dashboard se cloud name, key, secret |
| `CLIENT_URL` | Frontend URL (kai ho to comma se alag karo) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Sirf `npm run seed` ke liye |

### 2. Frontend
```bash
cd Frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

### 3. Admin panel
`http://localhost:5173/admin/login` par login karo. Wahan se:
- **Hero Section:** banner image, heading, subheading, button
- **About:** photo, bio, stats
- **Projects:** add/edit/delete, gallery, Featured aur Published ek tap mein
- **Services / Testimonials:** add/edit/delete, Show/Hide ek tap mein
- **Messages:** contact form ke messages, search, unread filter, mark all read
- **Settings:** site name, logo, phone, WhatsApp, email, address, working hours, map, social links, footer tagline, SEO

## Deploy

### Backend (Render / Railway)
- Root directory: `Backend`
- Build: `npm install`  |  Start: `npm start`
- Environment variables wahi jo `.env` mein hain. `CLIENT_URL` mein apni Vercel/Netlify site ka URL daalo.
- Pehli baar deploy ke baad Shell se `npm run seed` chalao.

### Frontend (Vercel / Netlify)
- Root directory: `Frontend`
- Build: `npm run build`  |  Output: `dist`
- Environment variable: `VITE_API_URL=https://<aapka-backend>/api`
- `vercel.json` aur `public/_redirects` pehle se hain, isliye refresh par 404 nahi aayega.

> Free hosting par server kuch der idle rehne ke baad pehli visit mein ~1 minute le sakta hai.
> Site us waqt "Waking up the server" ka note dikhati hai.

## Features
- Mobile-first layout (320px se shuru), touch-friendly 44px buttons, notch/safe-area support
- Phone par swipe: project gallery, testimonials, category filter
- Responsive optimized images (Cloudinary srcset), lazy loading
- Har page ka apna SEO title/description/share image
- 404 page, project Previous/Next, related projects, Share, Enquire button
- Security: login rate limit (10 / 15 min), contact form limit + spam trap, whitelisted updates, JWT auth