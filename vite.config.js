import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Vite plugin to execute Vercel serverless API handlers locally during dev
function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/request-load')) {
          try {
            const bodyBuffers = [];
            for await (const chunk of req) {
              bodyBuffers.push(chunk);
            }
            const rawBody = Buffer.concat(bodyBuffers).toString('utf-8');
            const parsedBody = rawBody ? JSON.parse(rawBody) : {};

            const apiHandler = (await import('./api/request-load.js')).default;

            const resWrapper = {
              status(code) {
                res.statusCode = code;
                return resWrapper;
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              }
            };

            await apiHandler({ method: req.method, body: parsedBody }, resWrapper);
          } catch (err) {
            console.error('Dev API execution error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), devApiPlugin()],
});
