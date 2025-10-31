# Creator Approval Portal

Next.js application for reviewing and approving creator profiles from ClickUp tasks. Provides a specialized interface for viewing creator profiles, assigning approval statuses, and managing comments while syncing all changes back to ClickUp.

<img width="2854" height="1852" alt="image" src="https://github.com/user-attachments/assets/cd270236-bd73-4896-b78c-802b6a5a90e2" />
<img width="2834" height="1852" alt="image" src="https://github.com/user-attachments/assets/9a2a6a90-dad3-4661-857e-084adfbc4d41" />

## Features

- Review creator profiles with social media handles, follower counts, and engagement rates
- Assign approval statuses that sync to ClickUp custom fields
- Filter creators by approval status
- Comment on tasks with user mentions
- Select and switch between ClickUp lists

## Prerequisites

- Node.js 18+ 
- pnpm
- ClickUp OAuth application credentials

## Installation

Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
JWT_SECRET=your-jwt-secret-key
CLICKUP_CLIENT_ID=your-clickup-client-id
CLICKUP_CLIENT_SECRET=your-clickup-client-secret
```

The `JWT_SECRET` is required for session management. Generate a secure random string.

The ClickUp OAuth credentials require a ClickUp application. In your ClickUp OAuth app settings, add your domain(s) to the redirect URL list:

- Development: `localhost:3000`
- Production: `your-domain.com` (e.g., `creators.inbeat.agency`)

The application automatically builds the full redirect URI as `{protocol}://{domain}/auth/clickup/callback` from the request origin, so ClickUp only needs the domain portion.

## Development

Start the development server:

```bash
pnpm dev
```

The application runs on `http://localhost:3000` with hot module replacement enabled via Turbopack.

Format code:

```bash
pnpm format
```

Lint code:

```bash
pnpm lint
```

## Testing

Run tests:

```bash
pnpm test
```

Run tests in UI mode:

```bash
pnpm test:ui
```

Run tests with coverage:

```bash
pnpm test:coverage
```

Run tests in CI mode:

```bash
pnpm test:ci
```

Run verification (tests + lint):

```bash
pnpm verify
```

## Production

Build for production:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

Production builds include Sentry error monitoring integration.

## Project Structure

```
src/
├── app/                   # Next.js App Router routes
│   ├── api/               # API route handlers
│   ├── auth/              # Authentication routes
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── comments/         # Comment components
│   ├── shared/           # Shared UI components
│   ├── tasks/            # Task components
│   └── ui/               # Shadcn UI primitives
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
│   ├── data/             # Data fetching hooks
│   └── ui/               # UI utility hooks
├── lib/                   # Core utilities
│   ├── auth.ts           # JWT authentication
│   └── clickup.ts        # ClickUp API client
├── services/             # Business logic
├── transformers/         # Data transformers
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## Architecture

The application uses Next.js App Router with React Server Components by default.

Authentication uses ClickUp OAuth flow, storing session data in JWT tokens within httpOnly cookies. Middleware protects dashboard routes by verifying tokens.

Data fetching uses React Query with server-side fetching in Server Components and client-side mutations in Client Components. The ClickUp API client centralizes all external API calls.

Status updates modify ClickUp custom fields directly through API calls with optimistic UI updates. Comments support rich text rendering using Quill Delta format with user mention parsing.

Error handling includes React error boundaries, Sentry integration for production errors, and toast notifications for user feedback.

## Troubleshooting

If authentication fails, verify that your ClickUp OAuth application has the correct domain added to the redirect URL list. The domain should match your deployment host (e.g., `creators.inbeat.agency` or `localhost:3000` for development). The application automatically appends `/auth/clickup/callback` to the domain.

If tasks don't load, check that the selected ClickUp list contains tasks with the expected custom fields for approval status. The application reads custom fields from ClickUp tasks to determine creator profiles and approval statuses.

For deployment issues, ensure all environment variables are set correctly in your deployment platform. The application will fail to start if `JWT_SECRET` is missing.

## Support

For issues or questions, contact the dev team at dev@inbeat.agency.
