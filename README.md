# Simple Ink Studios - Management Platform

A modern, full-stack management platform built for creative studios and client relationship management.

## 🎯 Features

- **Client Pipeline Management** - Drag & drop client tracking through sales stages
- **Calendar Integration** - Schedule management with FullCalendar
- **Authentication** - Secure login/signup with Supabase
- **Dashboard** - Overview of business metrics and quick actions
- **Responsive Design** - Mobile-friendly interface
- **Communication Tools** - Email and SMS capabilities (coming soon)

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Supabase Auth with SSR
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS v4, Custom CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Drag & Drop**: @dnd-kit
- **Calendar**: FullCalendar
- **Icons**: Flaticon UIcons

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── content/           # Main application features
│   │   ├── pipeline/      # Client pipeline management
│   │   ├── calendar/      # Calendar view
│   │   ├── data/          # Analytics and reports
│   │   └── ...
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard
├── components/
│   ├── auth/              # Authentication components
│   ├── studio/            # Business logic components
│   ├── layout/            # Navigation and layout
│   └── ui/                # Reusable UI components
├── lib/
│   ├── supabase/          # Supabase configuration
│   ├── contexts/          # React contexts
│   ├── types.ts           # TypeScript definitions
│   └── utils.ts           # Utility functions
└── middleware.ts          # Authentication middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd sis-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication Flow

1. Users must authenticate to access the platform
2. Unauthenticated users are redirected to `/auth/login`
3. After successful login, users are redirected to the dashboard (`/`)
4. All routes except `/auth/*` are protected by middleware

## 🎨 Component Architecture

### Authentication (`/components/auth/`)
- Login, signup, and password management forms
- Powered by Supabase Auth

### Studio Components (`/components/studio/`)
- **Pipeline**: Drag & drop client management
- **Calendar**: Schedule and appointment management
- **Dashboard**: Business metrics and analytics

### Layout Components (`/components/layout/`)
- **Navbar**: Expandable sidebar navigation
- **Containers**: Page layout wrappers

## 📊 Data Models

### Client
```typescript
type Client = {
  id: string;           // Unique identifier
  name: string;         // Client name
  contact: string;      // Primary contact
  artist?: string;      // Assigned artist
}
```

### Pipeline Column
```typescript
type Column = {
  id: string;           // Stage identifier
  title: string;        // Display name
  clients: Client[];    // Clients in this stage
}
```

## 🛠️ Development

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Organization

- **Server Components**: For data fetching and static content
- **Client Components**: For interactive features and state management
- **Context Providers**: For shared state (navbar, auth, etc.)
- **Type Safety**: TypeScript throughout the application

## 🚀 Deployment

This application is optimized for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **Any Node.js hosting platform**

### Environment Variables (Production)

Ensure all required environment variables are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Simple Ink Studios.

---

**Built with ❤️ for Simple Ink Studios**