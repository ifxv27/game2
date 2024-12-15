# Card Game

A modern card game built with React, TypeScript, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Update MongoDB URI and JWT secret

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
game-v2/
├── src/
│   ├── components/     # React components
│   ├── store/         # Zustand store files
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── api/           # API integration
│   ├── assets/        # Static assets
│   └── config/        # Configuration files
├── public/            # Public assets
└── vercel.json        # Vercel deployment config
```

## Features

- Player dashboard with card management
- Battle system
- Task and achievement tracking
- Inventory management
- Shop system

## Deployment

The project is configured for deployment on Vercel with MongoDB integration.
