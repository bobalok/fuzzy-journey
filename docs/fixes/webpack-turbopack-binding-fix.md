# Webpack/Turbopack Binding Conflicts Fix

## Issue Description

The Tiger.Chat application was encountering binding conflicts between Webpack and Turbopack when running on Next.js canary version (15.3.0-canary.31). This resulted in 500 Internal Server Errors with the following error message:

```
Error: Expected to use Webpack bindings (react-server-dom-webpack/server.edge) for React but the current process is referencing 'registerServerReference' from the Turbopack bindings (react-server-dom-turbopack/server.edge). This is likely a bug in our integration of the Next.js server runtime.
```

## Root Cause

Next.js canary versions can have inconsistencies between development and production builds regarding which bundler is used. The application was trying to use both Webpack and Turbopack bindings simultaneously, leading to conflicts in the React Server Components runtime.

## Solution

### 1. Update Next.js Configuration

Modified `next.config.ts` to explicitly configure Webpack for production builds and Turbopack for development:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    // Use webpack in production builds to avoid binding conflicts
    turbo: process.env.NODE_ENV === 'development' 
      ? { rules: { '*.ts': ['swc-loader'] } }
      : undefined,
  },
  // ...rest of configuration
};
```

### 2. Update Build Process

Updated `package.json` to clean the `.next` directory before building to ensure no stale files causing conflicts:

```json
"scripts": {
  "dev": "next dev --turbo -p 3002",
  "build": "rm -rf .next && tsx lib/db/migrate && next build",
  "start": "next start -H 0.0.0.0 -p 3002",
}
```

### 3. Environment Configuration

Set the `NODE_ENV` to `production` in the `.env.local` file to ensure consistent bundler usage:

```
NODE_ENV="production"
PORT=3002
```

### 4. Port Conflict Resolution

Changed the application to run on port 3002 instead of the default 3000 due to port conflicts, and updated all relevant configuration:

- Updated `AUTH_URL` in `.env.local`
- Updated port in npm scripts
- MinIO initialization shows the correct port

## Testing

After implementing these changes, the application builds and runs successfully on http://localhost:3002 with no more binding conflicts.

The redirect to `/api/auth/guest?redirectUrl=http%3A%2F%2F0.0.0.0%3A3002%2F` is expected behavior as part of the authentication flow.

## Lessons Learned

1. When using canary versions of Next.js, be explicit about bundler configuration for both development and production environments.
2. Clean build artifacts before rebuilding to avoid stale configurations.
3. Set the `NODE_ENV` explicitly to ensure consistent behavior.
4. For port conflicts, update all related configuration files and environment variables to use the same port.
