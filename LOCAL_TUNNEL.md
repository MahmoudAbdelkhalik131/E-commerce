# Local development: expose your local backend to the internet

1. Ensure the backend is running locally (example port 3000):

   ```bash
   cd Backend
   npm install
   npm run dev   # or however you run the server; ensure process.env.PORT is set or defaults to 3000
   ```

2. Install and run an HTTPS tunnel (ngrok recommended):
   - Install ngrok: https://ngrok.com/download
   - Run it against your backend port (example 3000):

   ```bash
   ngrok http 3000
   ```

   - Copy the `https://...ngrok.io` URL provided by ngrok.

3. Configure CORS
   - The backend already allows the Netlify origin and common localhost origins.
   - The server is updated to accept ngrok and other dev-tunnel hostnames automatically.

4. Point the frontend to the tunnel URL
   - The frontend reads the API base from the `VITE_API_BASE` env variable. Update this variable locally or in Netlify.
     - Locally: create/update `frontend/.env` with:

       ```env
       VITE_API_BASE=https://your-ngrok-id.ngrok.io
       ```

     - On Netlify (for the deployed site): go to Site settings → Build & deploy → Environment → Environment variables, add `VITE_API_BASE` with the ngrok `https://...` value (for example `https://levers-urology-debug.ngrok-free.dev`), then trigger a redeploy.

   - If the frontend used a different env name previously, change it to `VITE_API_BASE`, or update the code to read `import.meta.env.VITE_API_BASE` and redeploy.

5. Test
   - Open the deployed Netlify site in your browser. If the Netlify site was rebuilt with `VITE_API_URL` set to your ngrok URL, network requests should go to your machine via the tunnel. CORS is allowed for the Netlify origin and ngrok domains.

Notes

- HTTPS is required when calling from an `https://` page (Netlify) — ngrok provides an `https://` endpoint which prevents mixed-content blocking.
- If you prefer alternatives, you can use Cloudflare Tunnel (`cloudflared`) or localtunnel; the CORS code also allows `*.trycloudflare.com`.

If you want, I can add/update a small environment helper in the frontend to make switching the API base easier.
