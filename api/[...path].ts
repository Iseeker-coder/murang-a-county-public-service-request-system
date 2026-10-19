import type { Request, Response } from 'express';
import { createApp } from '../server';

let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(req: Request, res: Response) {
  try {
    appPromise = appPromise || createApp(false);
    const app = await appPromise;

    // Vercel normally preserves /api in req.url, but retain compatibility
    // with deployments that pass the catch-all path without that prefix.
    if (req.url && !req.url.startsWith('/api/')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }

    app(req, res);
  } catch (error) {
    console.error('API function failed:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
