# Simple Ink Studios - 72 Hour Build Journey

## 🎯 What We Built

A **full-stack tattoo shop CRM** with:
- 🎨 Landing page with waitlist for lead generation
- 🔐 Authentication system (login/signup)
- 📊 Dashboard with interactive trackers
- 📋 Pipeline management with drag & drop
- 📅 Calendar view
- 💬 Contact modal for business inquiries
- 🌐 Deployed to production on custom domain

---

## 📚 Part 1: Core Concepts You Need to Learn

### 1. **Next.js 15 - The Framework**

**What it is:** A React framework for building web applications

**Key Concepts:**
- **App Router**: File-system based routing (folders = routes)
  ```
  app/
    page.tsx          → Landing page (/)
    dashboard/
      page.tsx        → Dashboard (/dashboard)
    content/
      pipeline/
        page.tsx      → Pipeline (/content/pipeline)
  ```

- **Server vs Client Components**:
  - `.server.tsx` = Runs on server (faster, no JavaScript sent to browser)
  - `.client.tsx` = Runs in browser (interactive, uses useState, onClick, etc.)

**What to learn:**
- Next.js official docs: https://nextjs.org/docs
- Focus on: App Router, Server Components, Client Components, Data Fetching

---

### 2. **React - The UI Library**

**What it is:** JavaScript library for building user interfaces

**Key Concepts We Used:**

#### **useState** - Managing component state
```typescript
const [isOpen, setIsOpen] = useState(false); // Track if modal is open
setIsOpen(true); // Update state
```

#### **useEffect** - Side effects (running code when component loads)
```typescript
useEffect(() => {
  // Runs once when component mounts
  setMounted(true);
}, []);
```

#### **Props** - Passing data between components
```typescript
function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // isOpen and onClose are props passed from parent
}
```

**What to learn:**
- React docs: https://react.dev
- Focus on: Hooks (useState, useEffect, useContext), Props, Components

---

### 3. **TypeScript - Type Safety**

**What it is:** JavaScript with type checking

**Why we use it:**
- Catch errors before running code
- Better autocomplete in VS Code
- Self-documenting code

**Examples from our project:**
```typescript
// Define shape of data
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// TypeScript knows what properties are available
const handleClick = (user: User) => {
  console.log(user.email); // ✅ TypeScript knows email exists
  console.log(user.age);   // ❌ Error: age doesn't exist on User
}
```

**What to learn:**
- TypeScript handbook: https://www.typescriptlang.org/docs/
- Focus on: Interfaces, Types, Function signatures

---

### 4. **Supabase - Backend as a Service**

**What it is:** PostgreSQL database + Authentication + Realtime subscriptions

**What we use it for:**
1. **Authentication** - User login/signup
2. **Database** - Store data (waitlist entries, shop info, etc.)
3. **Row Level Security (RLS)** - Database-level permissions

**Key Concepts:**

#### **Creating a client**
```javascript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_KEY"
);
```

#### **Querying data**
```javascript
// SELECT all rows from waitlist table
const { data, error } = await supabase
  .from("waitlist")
  .select("*");

// INSERT new row
const { data, error } = await supabase
  .from("waitlist")
  .insert([{ name: "John", email: "john@example.com" }]);
```

#### **Authentication**
```javascript
// Sign up
await supabase.auth.signUp({ email, password });

// Login
await supabase.auth.signInWithPassword({ email, password });

// Logout
await supabase.auth.signOut();

// Check if logged in
const { data: { user } } = await supabase.auth.getUser();
```

**What to learn:**
- Supabase docs: https://supabase.com/docs
- Focus on: Authentication, Database queries, Row Level Security

---

### 5. **Tailwind CSS - Styling**

**What it is:** Utility-first CSS framework

**How it works:**
Instead of writing CSS files, you use class names:

```html
<!-- Old way (CSS file) -->
<div class="my-button">Click me</div>
/* CSS file */
.my-button {
  background-color: blue;
  padding: 1rem;
  border-radius: 0.5rem;
}

<!-- Tailwind way (inline classes) -->
<div class="bg-blue-500 p-4 rounded-lg">Click me</div>
```

**Common utilities:**
- `flex` - Display as flexbox
- `flex-col` - Flex direction column
- `gap-4` - Gap between flex items (1rem)
- `p-4` - Padding (1rem)
- `m-4` - Margin (1rem)
- `text-xl` - Extra large text
- `bg-blue-500` - Blue background
- `hover:bg-blue-600` - Darker blue on hover

**What to learn:**
- Tailwind docs: https://tailwindcss.com/docs
- Focus on: Flexbox, Spacing, Colors, Responsive design

---

### 6. **Git & GitHub - Version Control**

**What it is:** Track changes to your code over time

**Key Commands:**
```bash
git status                    # See what changed
git add .                     # Stage all changes
git commit -m "message"       # Save changes with message
git push origin main          # Upload to GitHub
git pull origin main          # Download from GitHub
```

**Why we use it:**
- Track history of changes
- Collaborate with others
- Deploy to production (Vercel watches GitHub)

**What to learn:**
- Git docs: https://git-scm.com/doc
- GitHub guides: https://guides.github.com
- Focus on: Basic commands, Branching, Pull requests

---

## 🏗️ Part 2: Architecture Breakdown

### File Structure
```
sis-website/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (waitlist)
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (logged in users)
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   └── sign-up/page.tsx      # Sign up page
│   ├── content/
│   │   ├── pipeline/page.tsx     # Sales pipeline
│   │   ├── calendar/page.tsx     # Calendar
│   │   ├── email/page.tsx        # Email page
│   │   └── phone/page.tsx        # SMS page
│   └── layout.tsx                # Root layout (navbar wrapper)
│
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx         # Login form
│   │   ├── SignUpForm.tsx        # Sign up form
│   │   └── LogoutButton.tsx      # Logout button
│   ├── contact/
│   │   └── ContactModal.client.tsx  # Contact modal
│   ├── layout/
│   │   ├── navbar/
│   │   │   ├── Navbar.client.tsx         # Navbar component
│   │   │   └── NavbarWrapper.client.tsx  # Navbar with active state
│   │   └── ConditionalNavbar.client.tsx  # Show/hide navbar
│   ├── studio/                   # Business logic components
│   │   ├── pipeline/
│   │   │   ├── PipelineBoard.client.tsx  # Drag & drop board
│   │   │   └── DraggableCard.client.tsx  # Draggable cards
│   │   └── CheckList.client.tsx          # Interactive checklists
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── waitlist/
│       └── WaitlistModal.client.tsx      # Waitlist form
│
├── lib/                          # Utility functions & config
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── shop-data.js          # Shop CRUD operations
│   │   └── waitlist-data.js      # Waitlist CRUD operations
│   ├── supabase.js               # Supabase singleton
│   ├── contexts/
│   │   └── navbar-context.tsx    # Navbar state management
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
│
├── middleware.ts                 # Auth protection (bouncer)
├── .env.local                    # Environment variables (secrets)
└── package.json                  # Dependencies & scripts
```

---

## 🔄 Part 3: Data Flow Examples

### Example 1: User Submits Waitlist Form

```
1. User fills out form on landing page (app/page.tsx)
   └─> WaitlistModal.client.tsx handles form state

2. User clicks "Join Waitlist"
   └─> handleSubmit() function runs

3. Function calls saveWaitlistSignup()
   └─> lib/supabase/waitlist-data.js

4. waitlist-data.js inserts into Supabase
   └─> INSERT INTO waitlist (name, email, phone...)

5. Success! Modal shows "Thank You!" message
   └─> User sees confirmation
```

### Example 2: User Logs In

```
1. User enters email/password on login page
   └─> components/auth/LoginForm.tsx

2. User clicks "Login"
   └─> handleLogin() calls supabase.auth.signInWithPassword()

3. Supabase validates credentials
   └─> Returns user session (JWT token)

4. Session saved in browser cookie
   └─> router.push("/dashboard") redirects to dashboard

5. Middleware checks cookie on every page
   └─> middleware.ts allows access to /dashboard

6. Dashboard renders with user data
   └─> app/dashboard/page.tsx
```

### Example 3: Navbar Highlighting Current Page

```
1. User visits /dashboard
   └─> Next.js router knows current path

2. NavbarWrapper.client.tsx uses usePathname()
   └─> pathname = "/dashboard"

3. Component maps over nav links
   └─> Compares each link.href to pathname

4. Dashboard link matches!
   └─> isActive = true for Dashboard

5. NavLinks.server.tsx applies "active" class
   └─> Link glows/highlights
```

---

## 🎓 Part 4: Key Concepts Explained

### 1. **Client vs Server Components**

**Server Components** (default in Next.js 15):
- ✅ Faster (no JavaScript sent to browser)
- ✅ Can fetch data directly from database
- ✅ Better SEO
- ❌ No interactivity (no onClick, useState, etc.)

**Client Components** (add `"use client"` at top):
- ✅ Interactive (onClick, useState, forms)
- ✅ Browser APIs (localStorage, window, etc.)
- ❌ More JavaScript sent to browser
- ❌ Can't fetch data directly from database

**Example:**
```typescript
// Server Component (default)
export default function Page() {
  return <div>Static content</div>;
}

// Client Component (interactive)
"use client";
export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### 2. **Middleware - The Bouncer**

**What it does:** Runs BEFORE every page loads

**Our middleware:**
```typescript
export async function middleware(request: NextRequest) {
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Get path user is trying to visit
  const path = request.nextUrl.pathname;

  // RULE 1: Logged in user visits "/" (landing) → redirect to /dashboard
  if (user && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // RULE 2: NOT logged in visits /dashboard → redirect to /
  if (!user && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, let them through
  return NextResponse.next();
}
```

**Why we need it:**
- Protect pages that require login
- Redirect users to correct pages
- Check authentication before rendering

---

### 3. **Context API - Global State**

**Problem:** Passing state through many components

```typescript
// Bad: Prop drilling
<App isExpanded={true}>
  <Layout isExpanded={true}>
    <Navbar isExpanded={true}>
      <NavLink isExpanded={true} />
    </Navbar>
  </Layout>
</App>
```

**Solution:** Context API

```typescript
// Create context
const NavbarContext = createContext();

// Provide state at top level
<NavbarProvider>
  <App />
</NavbarProvider>

// Access anywhere with useContext
const { isExpanded, setIsExpanded } = useNavbar();
```

**What we use it for:**
- Navbar expand/collapse state
- Available to all components without prop drilling

---

### 4. **Environment Variables - Secrets**

**What they are:** Configuration values that change per environment

**File:** `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

**Rules:**
- `NEXT_PUBLIC_*` prefix = accessible in browser
- No prefix = only accessible on server
- Never commit `.env.local` to GitHub (use `.gitignore`)

**How to use:**
```javascript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

---

### 5. **API Routes - Backend Endpoints**

**What they are:** Server-side functions accessible via URL

**Example:** `app/api/debug/shops/route.ts`
```typescript
export async function GET() {
  const data = await getShopData();
  return Response.json(data);
}
```

**Access from browser:**
```typescript
const response = await fetch("/api/debug/shops");
const data = await response.json();
```

**Why we need them:**
- Separate backend logic from frontend
- Security (keep API keys/secrets on server)
- Can be called from any client component

---

## 🚀 Part 5: Deployment Process

### What is Vercel?

**Vercel** = Hosting platform made for Next.js

**Why we use it:**
- Auto-deploys from GitHub
- Edge network (fast globally)
- Free tier for personal projects
- Built-in SSL/HTTPS

### Deployment Steps:

1. **Connect GitHub repo**
   - Vercel watches for new commits
   - Auto-triggers builds

2. **Configure environment variables**
   - Add Supabase URL & key to Vercel dashboard
   - Same as `.env.local` but for production

3. **Build process**
   ```
   npm install        # Install dependencies
   npm run build      # Build Next.js app
   npm run start      # Start production server
   ```

4. **DNS configuration**
   - Point custom domain to Vercel
   - A record → 76.76.21.21
   - CNAME record → cname.vercel-dns.com

---

## 🐛 Part 6: Common Issues We Solved

### Issue 1: File Casing on Vercel

**Problem:** macOS is case-insensitive, Vercel (Linux) is case-sensitive

**Example:**
- File on disk: `button.tsx`
- Import: `@/components/ui/Button`
- Works on macOS ✅
- Fails on Vercel ❌

**Solution:** Standardize all file names to PascalCase for components
```bash
git mv button.tsx Button.tsx
```

---

### Issue 2: Environment Variables Not Loading

**Problem:** Middleware couldn't read environment variables

**Cause:** Variables not configured in Vercel dashboard

**Solution:** Add to Vercel → Settings → Environment Variables

---

### Issue 3: Authentication Not Persisting

**Problem:** User logs in but middleware doesn't detect them

**Cause:** Using wrong Supabase client (not SSR-aware)

**Solution:** Use `@supabase/ssr` package for proper cookie handling
```typescript
import { createBrowserClient } from '@supabase/ssr'
```

---

### Issue 4: Row Level Security Blocking Inserts

**Problem:** Waitlist form failing with RLS policy error

**Cause:** Anonymous users don't have permission to insert

**Temporary Solution:** Disabled RLS for MVP
```sql
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
```

**Proper Solution (later):** Create policy for anonymous inserts
```sql
CREATE POLICY "Anyone can sign up for waitlist"
ON waitlist FOR INSERT
TO anon WITH CHECK (true);
```

---

## 📖 Part 7: What to Study Next

### Beginner (Next 2 weeks):
1. **JavaScript fundamentals**
   - Arrays, Objects, Functions
   - Async/await, Promises
   - ES6+ features (arrow functions, destructuring)

2. **React basics**
   - Components
   - Props
   - useState hook
   - useEffect hook

3. **Tailwind CSS**
   - Flexbox utilities
   - Spacing system
   - Responsive design

### Intermediate (Next 1-2 months):
1. **TypeScript**
   - Interfaces and Types
   - Generics
   - Type inference

2. **Next.js deep dive**
   - App Router
   - Server vs Client Components
   - Data fetching patterns
   - API routes

3. **Supabase**
   - Complex queries (joins, filters)
   - Row Level Security
   - Realtime subscriptions
   - Storage (file uploads)

### Advanced (Next 3-6 months):
1. **State Management**
   - Zustand or Redux
   - Server state (React Query)

2. **Testing**
   - Unit tests (Vitest)
   - E2E tests (Playwright)

3. **Performance**
   - Code splitting
   - Image optimization
   - Caching strategies

4. **DevOps**
   - CI/CD pipelines
   - Database migrations
   - Monitoring & logging

---

## 🎯 Part 8: Your Current Stack Summary

| Technology | What It Does | Alternative Options |
|------------|--------------|---------------------|
| **Next.js** | Full-stack framework | Remix, Gatsby, Vite+React |
| **React** | UI library | Vue, Svelte, Angular |
| **TypeScript** | Type safety | Plain JavaScript |
| **Supabase** | Backend (DB + Auth) | Firebase, Appwrite, PocketBase |
| **Tailwind CSS** | Styling | Styled Components, CSS Modules, Sass |
| **Vercel** | Hosting | Netlify, AWS, Railway |
| **Git/GitHub** | Version control | GitLab, Bitbucket |

---

## 🏆 Part 9: What You Accomplished

### Day 1: Foundation
- ✅ Set up Next.js project
- ✅ Created Supabase database
- ✅ Built authentication system
- ✅ Designed dashboard layout with navbar

### Day 2: Features
- ✅ Landing page with waitlist form
- ✅ Waitlist data saving to Supabase
- ✅ Middleware authentication protection
- ✅ Pipeline with drag & drop
- ✅ Calendar view

### Day 3: Polish & Deploy
- ✅ Fixed file casing issues
- ✅ Styled navbar with icons
- ✅ Added contact modal
- ✅ Deployed to production
- ✅ Connected custom domain
- ✅ Fixed environment variables

---

## 📚 Recommended Learning Resources

### Free Resources:
1. **JavaScript**
   - javascript.info (comprehensive guide)
   - freeCodeCamp.org

2. **React**
   - react.dev (official docs)
   - React tutorial by Kent C. Dodds

3. **Next.js**
   - nextjs.org/learn
   - Next.js 14 course by Lee Robinson

4. **TypeScript**
   - typescriptlang.org/docs
   - TypeScript tutorial by Matt Pocock

5. **Tailwind CSS**
   - tailwindcss.com/docs
   - Tailwind Labs YouTube

### Paid Resources (optional):
1. **Frontend Masters**
   - Professional courses on React, Next.js, TypeScript

2. **Egghead.io**
   - Bite-sized video tutorials

3. **Total TypeScript**
   - Matt Pocock's TypeScript course

---

## 🎓 Final Thoughts

**You built a production-ready application in 72 hours!**

Here's what makes this impressive:
- Full authentication system
- Database integration
- Real-time form submissions
- Protected routes
- Production deployment
- Custom domain

**Next steps:**
1. Study the concepts above
2. Build small projects to practice
3. Join communities (React, Next.js Discord/Reddit)
4. Read other people's code on GitHub
5. Ask questions and help others

**Remember:** You don't need to understand everything perfectly right now. Learning is iterative - you'll understand more each time you revisit these concepts.

---

Made with 🤖 + 💪 by Claude Code & You
