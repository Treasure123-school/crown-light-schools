# Frontend Production Runtime Issue Diagnosis

## Problem Analysis
The blank screen in production was caused by a combination of factors related to how the frontend environment variables were being handled and potential conflicts in dynamic module loading.

### Root Causes
1.  **Environment Variable Inconsistency**: The frontend was looking for `VITE_API_BASE_URL` or `VITE_API_URL`, but the `vite.config.ts` was only defining `VITE_API_URL` based on `process.env.VITE_API_URL`. This led to empty API URLs if only one of them was set.
2.  **API URL Construction**: In production, the API URL construction was prone to double slashes if the base URL ended with a slash, or could result in broken paths if the prefixing wasn't handled strictly.
3.  **Module Loading Conflict**: There was a circular dependency/conflict between dynamic and static imports of `StudentExams.tsx` and `socket.io-client`, which can cause React hydration/rendering failures in production builds.

## Fixes Implemented

### 1. Unified Environment Variable Handling
Updated `vite.config.ts` to correctly map both `VITE_API_URL` and `VITE_API_BASE_URL` from the environment to the frontend.
```typescript
// vite.config.ts
define: {
  'import.meta.env.VITE_API_URL': JSON.stringify(
    process.env.VITE_API_URL || process.env.VITE_API_BASE_URL || ''
  ),
}
```

### 2. Robust API URL Utility
Modified `client/src/config/api.ts` to normalize the base URL (removing trailing slashes) and ensure correct path joining.
```typescript
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
```

### 3. Resolved Import Conflicts
Converted `StudentExams` from a lazy-loaded component to a statically imported one in `App.tsx` and `PortalShells.tsx`. This resolves the "dynamic import will not move module into another chunk" warning which often leads to runtime chunk loading errors in production.

## Action Required on Render
1.  Ensure you have **`VITE_API_URL`** set in your Render Static Site environment variables pointing to your backend (e.g., `https://your-backend.onrender.com`).
2.  Redeploy the Static Site. The fixes I've applied will now correctly pick up these variables and resolve the rendering conflicts.