# Deploy guide

## Architecture

- `backend`: Spring Boot API, connects directly to TiDB Cloud.
- `frontend`: Vite/React static app.
- `db`: already online on TiDB, so only frontend and backend need deploying.

## 1. Prepare backend env

Set these environment variables on your backend host:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://<tidb-host>:4000/<database>?useSSL=true&requireSSL=true&sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC&useUnicode=yes&characterEncoding=UTF-8&connectionCollation=utf8mb4_unicode_ci
SPRING_DATASOURCE_USERNAME=<tidb-username>
SPRING_DATASOURCE_PASSWORD=<tidb-password>
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
SERVER_PORT=8080
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
CLOUDINARY_FOLDER=ha-giang-local-experience
```

Notes:

- If you have multiple frontend domains, separate them with commas in `APP_CORS_ALLOWED_ORIGINS`.
- Uploaded images are now stored in Cloudinary, so Render no longer needs persistent disk storage for images.

## 2. Deploy backend on Render

Render settings:

- Service type: `Web Service`
- Runtime: `Docker`
- Root directory: `backend`
- Instance type: `Free` or higher
- Health check path: `/api/experiences`

You can let Render read settings from [render.yaml](/d:/Web%20DLDT/render.yaml:1), or create the service manually with the values above.

Set these environment variables in Render:

```env
SERVER_PORT=8080
APP_CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
SPRING_DATASOURCE_URL=jdbc:mysql://<tidb-host>:4000/<database>?useSSL=true&requireSSL=true&sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC&useUnicode=yes&characterEncoding=UTF-8&connectionCollation=utf8mb4_unicode_ci
SPRING_DATASOURCE_USERNAME=<tidb-username>
SPRING_DATASOURCE_PASSWORD=<tidb-password>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
CLOUDINARY_FOLDER=ha-giang-local-experience
```

Important note:

- Because image assets are stored in Cloudinary, they remain available after Render restarts or redeploys.

After deploy, Render will give you a backend URL like:

```env
https://hagiang-backend.onrender.com
```

## 3. Deploy frontend on Netlify

This repo already includes [frontend/netlify.toml](/d:/Web%20DLDT/frontend/netlify.toml:1) for SPA routing.

Netlify settings:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

Set these environment variables in Netlify before the first build:

```env
VITE_API_BASE_URL=https://hagiang-backend.onrender.com
VITE_ASSET_BASE_URL=https://hagiang-backend.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

`VITE_ASSET_BASE_URL` should match the Render backend domain because uploaded images are served from `/uploads/...`.

## 4. Connect both sides

After Netlify generates your site URL, update Render:

- `APP_CORS_ALLOWED_ORIGINS=https://your-site.netlify.app`

Then redeploy the Render service once so CORS matches the real Netlify domain.

If you later add a custom domain, update:

- Render `APP_CORS_ALLOWED_ORIGINS`
- Netlify `VITE_API_BASE_URL`
- Netlify `VITE_ASSET_BASE_URL`

## 5. Recommended order

1. Deploy backend to Render first.
2. Copy the Render backend URL.
3. Add that URL into Netlify env vars.
4. Deploy frontend to Netlify.
5. Copy the Netlify frontend URL back into Render `APP_CORS_ALLOWED_ORIGINS`.
6. Redeploy backend on Render.

## 6. Final checks

- Open frontend and confirm login/register works.
- Create one experience and verify uploads are saved.
- Confirm uploaded images load from `https://your-render-app.onrender.com/uploads/...`.
- Confirm TiDB connection succeeds in backend logs.
