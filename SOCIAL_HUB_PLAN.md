# VYNL.PRO Social Hub - Implementation Plan

## Objective
Transform `vynl.pro` into a social hub for musicians, combining features from Facebook (social networking, feeds) and SoundCloud (audio sharing, artist profiles).

## Phase 1: Authentication & User Profiles
- [ ] **Auth.js (NextAuth) Integration**: Support Email/Password and GitHub/Google logins.
- [ ] **User Model**: Store name, bio, profile picture, social links, and "Musician Type" (Guitarist, Producer, Vocalist, etc.).
- [ ] **Custom Profile Slugs**: `vynl.pro/[username]` (e.g., `vynl.pro/roblackey`).

## Phase 2: The Social Feed
- [ ] **Text Posts**: Basic status updates.
- [ ] **Media Integration**: Support for images and embedded players.
- [ ] **Interactions**: Likes (Vibes), Comments, and Reposts.

## Phase 3: Music & Audio Integration
- [ ] **Audio Uploads**: Powered by UploadThing or Cloudinary.
- [ ] **Global Player**: A sticky persistent player at the bottom of the site that keeps playing as you navigate.
- [ ] **Waveform Visualization**: Modern audio waveforms for uploaded tracks.

## Phase 4: Connections
- [ ] **Following System**: Follow other musicians.
- [ ] **Artist Verification**: Special badges for established acts.

## Tech Stack
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4.
- **Database**: PostgreSQL (via Supabase or Prisma).
- **ORM**: Prisma.
- **Auth**: Auth.js.
- **Storage**: UploadThing (Media/Audio).
