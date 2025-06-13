import { requireAuth } from '@clerk/express';

// Middleware to protect routes - only logged-in users allowed
export const clerkMiddleware = requireAuth();