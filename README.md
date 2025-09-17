# Lead Hub

A modern real estate lead management system built with Next.js, TypeScript, and Supabase.

## 🚀 Features

- User authentication with Supabase Auth
- CRUD operations for buyer leads
- Filterable and sortable lead tables
- Form validation with Zod
- Responsive design with Tailwind CSS
- Real-time updates with Supabase

## 🛠️ Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/lead-hub.git
   cd lead-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

4. **Database Setup**
   Run migrations using the Supabase CLI:

   ```bash
   npx supabase migration up
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
app/
  buyers/           # Buyer-related pages
  components/       # Reusable UI components
  contexts/         # React context providers
  hooks/            # Custom React hooks
  lib/              # Utility functions and validations
  public/           # Static assets
  supabase/         # Database migrations and config
```

## 🎨 Design Notes

### Data Validation

- Client-side validation is handled using Zod schemas
- Server-side validation is enforced by Supabase Row Level Security (RLS)
- Form validations are co-located with their respective components

### Authentication & Authorization

- User authentication is handled by Supabase Auth
- RLS policies ensure users can only access their own data
- Protected routes using Next.js

### Form Handling

- React Hook Form for form state management
- Zod for schema validation
- Custom form components for consistent UI/UX

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Form Handling**: React Hook Form, Zod
- **UI Components**: Shadcn/ui
- **Deployment**: Vercel
