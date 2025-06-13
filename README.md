# Your Inner Library - Digital Journal

A thoughtfully designed digital journaling experience that provides a peaceful space for self-reflection and personal growth.

## Tech Stack

### Frontend
- **Framework**: Next.js (Latest version)
- **Authentication**: [Clerk](https://clerk.dev/) - For secure, feature-rich authentication
- **Styling**: Tailwind CSS with custom design system
- **Typography**:
  - Primary: EB Garamond - For elegant, readable body text
  - Secondary: Inter/Karla - For UI elements and supporting text

### Backend
- **Database & Storage**: [Supabase](https://supabase.com/)
  - PostgreSQL database for structured data
  - Storage for media files and attachments
  - Real-time capabilities when needed

### Deployment
- **Platform**: Vercel
  - Optimized for Next.js deployment
  - Automatic CI/CD pipeline
  - Edge network for optimal performance

## Design System

### Colors
- Primary background: Cream (#F5E6D3)
- Text and UI elements: Rich Brown (#2A2118)
- Accent elements: Soft, muted earth tones

### Visual Language
- **Aesthetic**: Warm, cozy, and inviting
- **Interface**: Minimalist and intentional
- **Interactions**: Smooth, gentle animations
- **Spacing**: Generous whitespace for readability
- **Shadows**: Soft, subtle depth

### Typography Scale
- Headings: EB Garamond
- Body: EB Garamond
- UI Elements: Inter/Karla
- Recommended font sizes and weights will be maintained for optimal readability

## Development Guidelines

1. All new features must maintain the established aesthetic
2. Performance is a key consideration - optimize assets and interactions
3. Accessibility must be considered in all design decisions
4. Mobile-first, responsive design approach

## Project Structure

```
journal-app/
├── app/                  # Next.js app directory
├── components/           # Reusable UI components
├── lib/                  # Utility functions and helpers
├── public/              # Static assets
└── styles/              # Global styles and design tokens
```

## Getting Started

[Development setup instructions will be added as the project progresses]

## Design Principles

1. **Intentional**: Every element serves a purpose
2. **Intuitive**: Clear user flows and natural interactions
3. **Minimal**: Remove unnecessary complexity
4. **Delightful**: Small details that enhance the experience

## Notes

- This document serves as the primary reference for project decisions
- Any deviations from these specifications require explicit approval
- The tech stack and core tools (Clerk, Supabase) are locked unless explicitly changed

## Required Assets

Please add the following assets to make the app work correctly:

1. `/public/assets/paper-texture.png` - A subtle paper texture for the journal background. This should be a seamless, repeating texture that gives a natural paper feel to the journal entries.

## Features

- 📝 Personal journal entries
- 🔐 Secure authentication with Clerk
- 🎨 Beautiful, responsive design
- 📚 Library-themed interface
- 🌟 Modern user experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/journal-app.git
cd journal-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Clerk credentials:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Clerk sign in/up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables in the Vercel dashboard:
   - Add all Clerk environment variables from your `.env.local` file
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 