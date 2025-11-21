# Confess.cam

Anonymous Retro Confession Booth - A mashup of Dispo's Instax camera UI, Yik Yak anonymity, and PostSecret nostalgia.

## How It Works

1. **Take a Photo**: Open the site and use the retro disposable camera interface to capture a selfie
2. **Add Effects**: Your photo instantly gets heavy film grain, light leaks, and a date stamp
3. **Write Confession**: Flip the digital polaroid to write your anonymous confession on the back
4. **Drop It**: The photo flips, shakes, and drops into the global feed
5. **Burn Confessions**: "Burn" (like) confessions you relate to - most burned ones rise to the top

**Zero accounts, zero handles. Pure catharsis + voyeurism.**

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (for physical-feel animations)
- **react-webcam** (camera capture)
- **LocalStorage** (for MVP - stores user's own confessions)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: The app requires camera permissions. Make sure to allow camera access when prompted.

## Features

- 📸 Retro 90s disposable camera UI with viewfinder overlay
- 🎨 Real-time photo processing (film grain, vignette, light leaks, date stamp)
- 🔄 3D flip animation for polaroid effect
- 🔥 "Burn" system for engaging with confessions
- 📱 Responsive design
- 🔊 Sound effects (shutter click, drop, burn)
- 💾 LocalStorage persistence for user's confessions
- 🎭 Mock data for initial feed experience

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── CameraView.tsx
│   ├── PolaroidFrame.tsx
│   ├── ConfessionCard.tsx
│   └── Feed.tsx
├── context/          # React context providers
│   └── ConfessionContext.tsx
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── imageProcessor.ts
│   └── sounds.ts
└── public/           # Static assets
```

## Future Enhancements

- Backend integration (Supabase) for true global feed
- Image upload option (not just webcam)
- More advanced photo filters
- User accounts (optional)
- Real-time updates
- Mobile app version
